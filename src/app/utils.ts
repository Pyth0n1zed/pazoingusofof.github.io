import { DEFAULT_WISP, WISP_STORAGE_KEY, PROXY_STORAGE_KEY } from "./constants";
import { openDB } from "idb";

export const getWispServer = () =>
  localStorage.getItem(WISP_STORAGE_KEY) || DEFAULT_WISP;

export const setWispServer = (url: string) =>
  localStorage.setItem(WISP_STORAGE_KEY, url);

export const normalizeUrl = (u: string) => {
  try {
    return new URL(u).href;
  } catch {
    return u;
  }
};

export const proxyFind = async () => {
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
};
