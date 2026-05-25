import { DEFAULT_WISP, WISP_STORAGE_KEY } from "./constants";

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
