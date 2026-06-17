import { openDB } from "idb";

export const BASE = new URL("./", location.href).pathname;
export const DEFAULT_WISP = "wss://anura.pro/";
export const WISP_STORAGE_KEY = "deployable.wispServer";
export const PROXY_STORAGE_KEY = "deployable.proxy";

async function readProxyMode(): Promise<string | undefined> {
  try {
    const db = await openDB("SettingsDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings");
        }
      },
    });

    return (await db.get("settings", PROXY_STORAGE_KEY)) as string | undefined;
  } catch {
    return undefined;
  }
}

export const CURRENT_PROXY = await readProxyMode();

export const PREFIX =
  CURRENT_PROXY === "choice-scram" ? BASE + "scramjet/" : BASE + "uv/service/";
