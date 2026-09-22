import { createContext, useContext } from "react";

export const PhotosContext = createContext({});

export const fileUrl = (path) => {
  if (!path) return "";
  if (/^(data:|blob:|https?:)/i.test(path)) return path;
  return path;
};

export const usePhoto = (slot, fallback) => {
  const map = useContext(PhotosContext);
  return map[slot] ? fileUrl(map[slot]) : fallback;
};
