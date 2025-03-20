import {
    Theme,
    FontSize,
    Language,
    useSettings,
} from "../context/SettingsContext";
import { Sidebar } from "primereact/sidebar";
import { InputSwitch } from "primereact/inputswitch";
import { SelectButton } from "primereact/selectbutton";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "primereact/button";

export default function SidebarSettings({
    showSidebar,
    setShowSidebar,
}: {
    showSidebar: boolean;
    setShowSidebar: (showSidebar: boolean) => void;
}) {
    const { valuesState, setSettings, mode } = useSettings();

    const [switchInputBg, setSwitchInputBg] = useState(
        mode === "dark" ? "var(--color-main)" : ""
    );
    const { t } = useTranslation();

    return (
        <Sidebar
            visible={showSidebar}
            onHide={() => setShowSidebar(false)}
            maskClassName="backdrop-blur-xs"
            className="!bg-main-bg !text-main-text"
            closeIcon="pi pi-times text-main"
        >
            <h2 className="text-3xl font-bold mb-4">{t("Settings")}:</h2>

            <h3 className="text-2xl font-bold flex items-center gap-2">
                <i className="pi pi-palette text-main"></i>
                {t("Theme")}:
            </h3>
            <div className="flex gap-2 mt-2 ps-4 mb-8">
                {valuesState?.allColors &&
                    Object.entries(valuesState?.allColors).map((color) => (
                        <Button
                            key={color[0]}
                            className={`mr-2 w-10 h-10 ${
                                valuesState?.theme === color[1]
                                    ? "!border-2 !border-main-text"
                                    : "opacity-50"
                            }`}
                            rounded={false}
                            // size="small"
                            style={{ backgroundColor: color[1] }}
                            onClick={() => {
                                setSettings({ theme: color[0] as Theme });
                            }}
                        />
                    ))}
            </div>

            <h3 className="text-2xl font-bold flex items-center gap-2">
                {mode === "dark" ? (
                    <i className="pi pi-moon text-main"></i>
                ) : (
                    <i className="pi pi-sun text-main"></i>
                )}
                {t("Dark Mode")}:
            </h3>
            <div
                className={`flex items-center gap-2 mt-2 ps-2 mb-8 ${
                    valuesState?.dir === "rtl"
                        ? "flex-row-reverse justify-end"
                        : ""
                }`}
            >
                <span className="uppercase select-none text-sm">
                    {t("Light")}
                </span>
                <InputSwitch
                    checked={mode === "dark"}
                    onChange={(e) => {
                        if (e.value) {
                            setSwitchInputBg("var(--color-main)");
                        } else {
                            setSwitchInputBg("");
                        }

                        setSettings(
                            mode === "dark"
                                ? { mode: "light" }
                                : { mode: "dark" }
                        );
                    }}
                    pt={{
                        slider: {
                            style: {
                                backgroundColor: switchInputBg,
                            },
                        },
                    }}
                />
                <span className="uppercase select-none text-sm">
                    {t("Dark")}
                </span>
            </div>

            <h3 className="text-2xl font-bold flex items-center gap-2">
                <i className="pi pi-sort-alpha-up text-main"></i>
                {t("Font Size")}:
            </h3>
            <div className="flex gap-0 items-end mt-1 ps-4 mb-8">
                {valuesState?.allFontSizes &&
                    Object.entries(valuesState?.allFontSizes).map(
                        (fontSize) => {
                            return (
                                <Button
                                    key={fontSize[0]}
                                    className={`mr-2 !px-2 !py-0 ${
                                        valuesState?.fontSize === fontSize[1]
                                            ? "!text-main"
                                            : "opacity-40 !text-main-text"
                                    } !rounded-none !border-0 !outline-none`}
                                    text
                                    onClick={() => {
                                        setSettings({
                                            fontSize: fontSize[0] as FontSize,
                                        });
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: `${fontSize[1]}`,
                                        }}
                                    >
                                        <div>{t("Aa")}</div>
                                    </div>
                                </Button>
                            );
                        }
                    )}
            </div>

            <h3 className="text-2xl font-bold flex items-center gap-2">
                <i className="pi pi-language text-main"></i>
                {t("Language")}:
            </h3>
            <div className="flex items-center gap-2 mt-2 ps-2 mb-8">
                <SelectButton
                    value={valuesState?.language}
                    onChange={(e) =>
                        setSettings({
                            language: e.value as Language,
                        })
                    }
                    optionLabel="lang"
                    options={[
                        { lang: "العربية", value: "ar" },
                        { lang: "English", value: "en" },
                    ]}
                    style={{ direction: "ltr" }}
                    pt={{
                        button: (options) => ({
                            style: {
                                backgroundColor:
                                    options?.context.option.value ===
                                    valuesState?.language
                                        ? "var(--color-main)"
                                        : "",
                            },
                        }),
                    }}
                />
            </div>
        </Sidebar>
    );
}
