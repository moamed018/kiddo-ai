import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./ToastContext";
import { useTranslation } from "react-i18next";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    currentUser: User | null;
    login: (email: string) => boolean;
    signup: (name: string, email: string) => boolean;
    logout: () => void;
    deleteUser: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const { showToast } = useToast();
    const { t } = useTranslation();

    useEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            localStorage.setItem("currentUser", JSON.stringify(currentUser));
        } else {
            localStorage.removeItem("currentUser");
        }
    }, [currentUser]);

    const login = (email: string): boolean => {
        const users = JSON.parse(
            localStorage.getItem("users") || "[]"
        ) as User[];
        const user = users.find((u) => u.email === email);
        if (user) {
            setCurrentUser(user);
            showToast(t("loginSuccess"), {
                type: "success",
            });
            return true;
        }
        showToast(t("emailNotFound"), {
            type: "error",
        });
        return false;
    };

    const signup = (name: string, email: string): boolean => {
        const users = JSON.parse(
            localStorage.getItem("users") || "[]"
        ) as User[];
        if (users.some((u) => u.email === email)) {
            showToast(t("accountAlready"), {
                type: "error",
            });
            return false;
        } else {
            const newUser: User = { id: crypto.randomUUID(), name, email };
            const updatedUsers = [...users, newUser];
            localStorage.setItem("users", JSON.stringify(updatedUsers));
            setCurrentUser(newUser);
            showToast(t("signUpSuccess"), {
                type: "success",
            });
            return true;
        }
    };

    const logout = () => {
        showToast(t("logoutSuccess"), {
            type: "success",
        });
        setCurrentUser(null);
    };

    const deleteUser = () => {
        if (!currentUser) return;
        const users = JSON.parse(
            localStorage.getItem("users") || "[]"
        ) as User[];
        const updatedUsers = users.filter((u) => u.email !== currentUser.email);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        logout();
    };

    return (
        <AuthContext.Provider
            value={{ currentUser, login, signup, logout, deleteUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
