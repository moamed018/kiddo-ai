import React, { createContext, useContext, useEffect, useState } from "react";
import i18n from "../i18n";

export type Theme = "blue" | "orange" | "green";
type Mode = "light" | "dark";
export type FontSize = "sm" | "md" | "lg";
export type Language = "ar" | "en";

interface Settings {
    theme: Theme;
    mode: Mode;
    fontSize: FontSize;
    language: Language;
}

interface IValues {
    theme: string;
    bgColor: string;
    textColor: string;
    fontSize: string;
    language: string;
    allColors: Record<string, string>;
    allFontSizes: Record<string, string>;
    dir: string;
    themeName?: string;
    mode?: string;
}

interface SettingsContextType extends Settings {
    setSettings: (newSettings: Partial<Settings>) => void;
    valuesState?: IValues;
}

const SettingsContext = createContext<SettingsContextType | undefined>(
    undefined
);

const DEFAULT_SETTINGS: Settings = {
    theme: "blue",
    mode: "light",
    fontSize: "md",
    language: "en",
};

const values: IValues = {
    theme: "",
    textColor: "",
    bgColor: "",
    fontSize: "",
    language: "",
    allColors: {},
    allFontSizes: {},
    dir: "",
};

const saveToLocalStorage = (settings: Settings) => {
    localStorage.setItem("settings", JSON.stringify(settings));
};

const loadFromLocalStorage = (): Settings => {
    const storedSettings = localStorage.getItem("settings");
    return storedSettings ? JSON.parse(storedSettings) : DEFAULT_SETTINGS;
};

const updateTailwindTheme = (settings: Settings) => {
    const root = document.documentElement;

    const bgColor = settings.mode === "dark" ? "#4A4A4A" : "#F0F0F0";
    const textColor = settings.mode === "dark" ? "#F0F0F0" : "#4A4A4A";
    const themeColor = getThemeColor(settings.theme);
    const fontSize = getFontSize(settings.fontSize);
    const dir = settings.language === "ar" ? "rtl" : "ltr";
    const language = settings.language;

    root.style.setProperty("--main-bg", bgColor);
    root.style.setProperty("--main-text", textColor);
    root.style.setProperty("--main-color", themeColor);
    root.style.setProperty("--font-size", fontSize);
    root.style.setProperty("--dir", dir);

    i18n.changeLanguage(language);

    values.bgColor = bgColor;
    values.textColor = textColor;
    values.theme = themeColor;
    values.themeName = settings.theme;
    values.fontSize = fontSize;
    values.dir = dir;
    values.language = language;
    values.mode = settings.mode;
};

const getThemeColor = (theme: Theme) => {
    const colors = {
        blue: "#00BFFF",
        orange: "#FFA500",
        green: "#50C878",
    };
    values.allColors = colors;
    return colors[theme] || colors.blue;
};

const getFontSize = (size: FontSize) => {
    const sizes = {
        sm: "12px",
        md: "16px",
        lg: "20px",
    };
    values.allFontSizes = sizes;
    return sizes[size] || sizes.md;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [settings, setSettingsState] = useState<Settings>(
        loadFromLocalStorage()
    );

    const [valuesState, setValuesState] = useState<IValues>();

    const setSettings = (newSettings: Partial<Settings>) => {
        const updatedSettings = { ...settings, ...newSettings };
        setSettingsState(updatedSettings);
        saveToLocalStorage(updatedSettings);
        updateTailwindTheme(updatedSettings);
    };

    useEffect(() => {
        updateTailwindTheme(settings);
        setValuesState(values);
    }, [settings]);

    return (
        <SettingsContext.Provider
            value={{ ...settings, setSettings, valuesState }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
};
