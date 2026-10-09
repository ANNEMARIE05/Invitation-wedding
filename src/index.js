import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import { applyDocumentLocale, readLocaleFromStorage } from "@/lib/locale";
import { wipeLocalWeddingData } from "@/lib/local-api";
import App from "@/App";

async function bootstrap() {
  if (process.env.REACT_APP_WIPE_LOCAL_STORAGE === "1") {
    await wipeLocalWeddingData();
  }
  document.documentElement.classList.remove("soir");
  applyDocumentLocale(readLocaleFromStorage());

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
