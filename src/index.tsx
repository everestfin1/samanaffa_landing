import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MaintenancePage } from "./screens/MaintenancePage";
//import { LandingPage } from "./screens/LandingPage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <MaintenancePage />
    {/*<LandingPage />*/}
  </StrictMode>,
);