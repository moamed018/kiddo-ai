import { Link } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { useTranslation } from "react-i18next";

export default function AppHome() {
    const { valuesState } = useSettings();
    const { t } = useTranslation();
    return (
        <>
            {valuesState?.themeName && (
                <div className="max-w-md mt-4 mx-auto">
                    <img
                        id="hero-image"
                        src={`/hero_${valuesState?.themeName}.svg`}
                        alt="Hero Image"
                        className="w-full"
                        loading="lazy"
                        data-pr-tooltip="From Story Set"
                    />
                </div>
            )}
            <div className="flex flex-col gap-4">
                <Link
                    to={"new-story"}
                    className="bg-main rounded text-white w-fit duration-300 hover:scale-95 mx-auto px-8 py-2 transform-all"
                >
                    {t("New Story")}
                </Link>
                <Link
                    to={"new-lesson"}
                    className="bg-main rounded text-white w-fit duration-300 hover:scale-95 mx-auto px-8 py-2 transform-all"
                >
                    {t("New lesson")}
                </Link>
            </div>
        </>
    );
}
