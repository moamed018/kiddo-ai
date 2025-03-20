import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

import { SettingsProvider } from "./context/SettingsContext.tsx";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import { ToastProvider } from "./context/ToastContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider>
            <SettingsProvider>
                <ToastProvider>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </ToastProvider>
            </SettingsProvider>
        </PrimeReactProvider>
    </StrictMode>
);
