import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { AppConfigurations } from "@/configurations/app.configurations";
import { App } from "./App.tsx";
import "./index.css";



createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppConfigurations>
      <App />
    </AppConfigurations>
  </StrictMode>
);
