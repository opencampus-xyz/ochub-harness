import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { OCConnect } from "@opencampus/ocid-connect-js";
import App from "./App";
import "./App.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <OCConnect
      opts={{
        redirectUri: `${window.location.protocol}//${window.location.host}/redirect`,
        tokenEndPoint: "https://api.login.staging.opencampus.xyz/auth/token",
        loginEndPoint: "https://api.login.sandbox.opencampus.xyz/auth/login",
        publicKey:
          "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEOxomYK47sSgtBHWluBqDwfBMouTSKmm0BriAXrmU75DjSkVcNbMW8zAGQrn5S9qaBBan9hk7BCwCopb5jxLAHQ",
        storageType: "localStorage" as const,
      }}
      sandboxMode={true}
    >
      <App />
    </OCConnect>
  </StrictMode>,
);
