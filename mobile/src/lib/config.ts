import Constants from "expo-constants";

/**
 * Resolve a URL da API local.
 *
 * No Expo Go o celular e' um dispositivo separado: "localhost" apontaria para o
 * proprio telefone, nao para o PC que roda a API. Entao derivamos o IP da LAN do
 * host do Metro (o mesmo IP que o Expo ja usa para servir o bundle), o que evita
 * ter que editar IP na mao a cada apresentacao ou troca de rede.
 *
 * Ordem de precedencia:
 *   1. EXPO_PUBLIC_API_URL (override manual, se necessario)
 *   2. IP do host do Metro + porta da API
 *   3. localhost (emulador / web)
 */
const API_PORT = 3001;

const hostFromMetro = (): string | null => {
  // manifest2/manifest sao campos legados, ausentes nos tipos publicos do
  // expo-constants, mas presentes em builds standalone e dev-client.
  const legacy = Constants as unknown as Record<string, any>;
  const hostUri =
    Constants.expoConfig?.hostUri ??
    legacy.manifest2?.extra?.expoGo?.debuggerHost ??
    legacy.manifest?.debuggerHost;

  if (typeof hostUri !== "string") return null;
  const host = hostUri.split(":")[0];
  return host && host !== "localhost" ? host : null;
};

const resolveApiUrl = (): string => {
  const override = process.env.EXPO_PUBLIC_API_URL;
  if (override) return override.replace(/\/$/, "");

  const host = hostFromMetro();
  if (host) return `http://${host}:${API_PORT}`;

  return `http://localhost:${API_PORT}`;
};

export const API_URL = resolveApiUrl();
