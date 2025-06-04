import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { AppConfigurations } from "@/configurations/app.configurations";
import { App } from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppConfigurations>
      <App />
    </AppConfigurations>
  </StrictMode>
);
