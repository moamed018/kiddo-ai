import { createContext, useCallback, useContext } from "react";
import { toast, ToastContainer, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSettings } from "./SettingsContext";

const ToastContext = createContext<{
    showToast: (message: string, options?: ToastOptions) => void;
} | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const { valuesState } = useSettings();

    const showToast = useCallback((message: string, options?: ToastOptions) => {
        toast(message, options);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            <ToastContainer
                position={
                    valuesState?.dir === "rtl" ? "bottom-left" : "bottom-right"
                }
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                theme={valuesState?.mode}
                rtl={valuesState?.dir === "rtl"}
            />
            {children}
        </ToastContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

/*
import { createContext, useCallback, useContext, useRef } from "react";
import { Toast, ToastMessage } from "primereact/toast";
import { useSettings } from "./SettingsContext";

const ToastContext = createContext<{
    showToast: (message: ToastMessage) => void;
} | null>(null);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const toast = useRef<Toast>(null);
    const { valuesState } = useSettings();

    const showToast = useCallback((message: ToastMessage) => {
        toast.current?.show(message);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            <Toast
                ref={toast}
                position={`${
                    valuesState?.dir === "rtl" ? "bottom-left" : "bottom-right"
                }`}
            />
            {children}
        </ToastContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

*/
