import { createContext, useContext } from "react";

export const PhotosContext = createContext({});

export const fileUrl = (path) => {
  if (!path) return "";
  if (/^(data:|blob:|https?:)/i.test(path)) return path;
  return path;
};

export const usePhoto = (slot, fallback) => {
  const map = useContext(PhotosContext);
  const custom = map && typeof map === "object" ? map[slot] : undefined;
  return custom ? fileUrl(custom) : fallback;
};
