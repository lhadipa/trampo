const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

type Listener = (event: string, session: any) => void;
const listeners = new Set<Listener>();
const getToken = () => localStorage.getItem("trampo_local_token");
const headers = () => ({ "Content-Type": "application/json", ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}) });
const saveSession = (session: any) => {
  if (session?.access_token) localStorage.setItem("trampo_local_token", session.access_token);
  if (session) localStorage.setItem("trampo_local_session", JSON.stringify(session));
  else { localStorage.removeItem("trampo_local_token"); localStorage.removeItem("trampo_local_session"); }
  listeners.forEach((fn) => fn(session ? "SIGNED_IN" : "SIGNED_OUT", session));
};

class QueryBuilder implements PromiseLike<any> {
  table: string; method = "GET"; body: any; params = new URLSearchParams();
  constructor(table: string) { this.table = table; }
  select(value = "*") { this.params.set("select", value); return this; }
  eq(column: string, value: any) { this.params.set(`eq.${column}`, String(value)); return this; }
  order(column: string, options?: { ascending?: boolean }) { this.params.set("order", `${column}.ascending=${options?.ascending !== false}`); return this; }
  insert(body: any) { this.method = "POST"; this.body = body; return this; }
  update(body: any) { this.method = "PATCH"; this.body = body; return this; }
  single() { return this.then((result) => ({ ...result, data: Array.isArray(result.data) ? result.data[0] || null : result.data })); }
  async execute() {
    const response = await fetch(`${API_URL}/api/data/${this.table}${this.params.size ? `?${this.params}` : ""}`, { method: this.method, headers: headers(), body: this.method === "GET" ? undefined : JSON.stringify(this.body) });
    const result = await response.json().catch(() => ({ data: null, error: { message: response.statusText } }));
    return { data: result.data ?? null, error: result.error ? new Error(result.error.message) : (!response.ok ? new Error("Falha na API local") : null) };
  }
  then<TResult1 = any, TResult2 = never>(onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null) { return this.execute().then(onfulfilled, onrejected); }
}

/**
 * Chamadas aos endpoints de pagamento simulado (/api/mock/*). Ficam fora do
 * shim do supabase porque nao sao CRUD de tabela: o saldo so pode ser movido
 * pelo servidor.
 */
export const mockPayments = {
  async topup(amount: number) {
    const response = await fetch(`${API_URL}/api/mock/wallet/topup`, { method: "POST", headers: headers(), body: JSON.stringify({ amount }) });
    const result = await response.json().catch(() => ({}));
    return response.ok ? { data: result, error: null } : { data: null, error: new Error(result.error || "Falha ao adicionar saldo") };
  },
  async unlockChat(conversationId: string) {
    const response = await fetch(`${API_URL}/api/mock/chat-unlock`, { method: "POST", headers: headers(), body: JSON.stringify({ conversation_id: conversationId }) });
    const result = await response.json().catch(() => ({}));
    return response.ok ? { data: result, error: null } : { data: null, error: new Error(result.error || "Falha ao desbloquear") };
  },
};

export const isSupabaseConfigured = true;
export const supabase: any = {
  from: (table: string) => new QueryBuilder(table),
  channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
  removeChannel: () => {},
  auth: {
    async signInWithPassword({ email, password }: any) {
      const response = await fetch(`${API_URL}/api/auth/login`, { method: "POST", headers: headers(), body: JSON.stringify({ email, password }) });
      const result = await response.json(); if (!response.ok) return { data: null, error: new Error(result.error) }; saveSession(result.session); return { data: result, error: null };
    },
    async signUp({ email, password, options }: any) {
      const response = await fetch(`${API_URL}/api/auth/signup`, { method: "POST", headers: headers(), body: JSON.stringify({ email, password, name: options?.data?.name, user_type: options?.data?.user_type }) });
      const result = await response.json(); if (!response.ok) return { data: null, error: new Error(result.error) }; saveSession(result.session); return { data: result, error: null };
    },
    async getSession() { const session = JSON.parse(localStorage.getItem("trampo_local_session") || "null"); return { data: { session }, error: null }; },
    onAuthStateChange(callback: Listener) { listeners.add(callback); return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } }; },
    async signOut() { saveSession(null); return { error: null }; },
  },
};
