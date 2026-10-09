import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import { applyDocumentLocale } from "@/lib/locale";
import App from "@/App";

document.documentElement.classList.remove("soir");
applyDocumentLocale("fr");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
