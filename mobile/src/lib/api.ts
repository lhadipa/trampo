import AsyncStorage from "@react-native-async-storage/async-storage";

import { API_URL } from "./config";

/**
 * Porte do shim de ../../src/integrations/supabase/client.ts para React Native.
 *
 * Mantem a mesma superficie de API (from().select().eq(), auth.signInWithPassword,
 * ...) para que as telas portadas da web funcionem sem alteracao. A unica diferenca
 * estrutural: localStorage (sincrono) virou AsyncStorage (assincrono), entao a
 * sessao e' mantida em memoria e espelhada no storage.
 */

type Listener = (event: string, session: any) => void;

const TOKEN_KEY = "trampo_local_token";
const SESSION_KEY = "trampo_local_session";

const listeners = new Set<Listener>();

let memoryToken: string | null = null;
let memorySession: any = null;

export const restoreSession = async () => {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    memorySession = raw ? JSON.parse(raw) : null;
    memoryToken = await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    memorySession = null;
    memoryToken = null;
  }
  return memorySession;
};

const headers = () => ({
  "Content-Type": "application/json",
  ...(memoryToken ? { Authorization: `Bearer ${memoryToken}` } : {}),
});

const saveSession = async (session: any) => {
  memorySession = session;
  memoryToken = session?.access_token ?? null;

  try {
    if (session) {
      await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
      if (session.access_token) await AsyncStorage.setItem(TOKEN_KEY, session.access_token);
    } else {
      await AsyncStorage.multiRemove([TOKEN_KEY, SESSION_KEY]);
    }
  } catch {
    // storage indisponivel: a sessao em memoria ainda funciona nesta execucao
  }

  listeners.forEach((fn) => fn(session ? "SIGNED_IN" : "SIGNED_OUT", session));
};

class QueryBuilder implements PromiseLike<any> {
  table: string;
  method = "GET";
  body: any;
  params = new URLSearchParams();

  constructor(table: string) {
    this.table = table;
  }

  select(value = "*") {
    this.params.set("select", value);
    return this;
  }

  eq(column: string, value: any) {
    this.params.set(`eq.${column}`, String(value));
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.params.set("order", `${column}.ascending=${options?.ascending !== false}`);
    return this;
  }

  insert(body: any) {
    this.method = "POST";
    this.body = body;
    return this;
  }

  update(body: any) {
    this.method = "PATCH";
    this.body = body;
    return this;
  }

  single() {
    return this.then((result: any) => ({
      ...result,
      data: Array.isArray(result.data) ? result.data[0] || null : result.data,
    }));
  }

  async execute() {
    const query = this.params.toString();
    try {
      const response = await fetch(
        `${API_URL}/api/data/${this.table}${query ? `?${query}` : ""}`,
        {
          method: this.method,
          headers: headers(),
          body: this.method === "GET" ? undefined : JSON.stringify(this.body),
        },
      );
      const result = await response
        .json()
        .catch(() => ({ data: null, error: { message: response.statusText } }));

      return {
        data: result.data ?? null,
        error: result.error
          ? new Error(result.error.message)
          : !response.ok
            ? new Error("Falha na API local")
            : null,
      };
    } catch (e: any) {
      return { data: null, error: new Error(e?.message ?? "Rede indisponivel") };
    }
  }

  then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

const authRequest = async (path: string, body: any) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });
  const result = await response.json().catch(() => ({ error: "Resposta invalida da API" }));
  if (!response.ok) return { data: null, error: new Error(result.error) };
  await saveSession(result.session);
  return { data: result, error: null };
};

export const api: any = {
  from: (table: string) => new QueryBuilder(table),

  auth: {
    signInWithPassword: ({ email, password }: any) =>
      authRequest("/api/auth/login", { email, password }),

    signUp: ({ email, password, options }: any) =>
      authRequest("/api/auth/signup", {
        email,
        password,
        name: options?.data?.name,
        user_type: options?.data?.user_type,
      }),

    async getSession() {
      if (memorySession === null) await restoreSession();
      return { data: { session: memorySession }, error: null };
    },

    onAuthStateChange(callback: Listener) {
      listeners.add(callback);
      return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
    },

    async signOut() {
      await saveSession(null);
      return { error: null };
    },
  },
};

/** Checa se a API local esta acessivel — usado pelo indicador de status na UI. */
export const pingApi = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);
    const response = await fetch(`${API_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!response.ok) return false;
    const body = await response.json();
    return body?.ok === true;
  } catch {
    return false;
  }
};
