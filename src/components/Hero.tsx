import { useTranslation } from "react-i18next";
import { useSettings } from "../context/SettingsContext";
import { Tooltip } from "primereact/tooltip";
import { Link } from "react-router-dom";

export default function Hero() {
    const { valuesState } = useSettings();
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-between py-20 flex-col gap-10 lg:flex-row">
            <div className="w-full sm:w-[90%] m-auto lg:w-1/2 sm:pe-10">
                <h2 className="text-3xl sm:text-5xl text-main font-bold tracking-wider leading-normal sm:leading-16 uppercase mb-4 sm:mb-10">
                    {t("heroHeading")}
                </h2>
                <p className="text-base sm:text-xl opacity-90 mb-4 sm:mb-6">
                    {t("heroSubheading")}{" "}
                </p>
                <Link
                    to="/signup"
                    className="!bg-main !border-0 uppercase !font-bold !text-sm sm:!text-lg !px-10 hover:scale-95 !transition-all !duration-300 rounded-full py-4 block w-fit !text-white"
                >
                    {t("heroButton")}
                </Link>
            </div>
            <div className="w-full sm:w-[80%] lg:w-[49%]">
                <Tooltip
                    target="#hero-image"
                    mouseTrack
                    mouseTrackTop={10}
                    showDelay={300}
                    hideDelay={300}
                    position="bottom"
                    className="!text-xs"
                    pt={{
                        text: {
                            style: {
                                background: "var(--color-main)",
                                padding: "0.5rem 1rem",
                            },
                        },
                        arrow: { style: { display: "none" } },
                    }}
                />
                {valuesState?.themeName && (
                    <img
                        id="hero-image"
                        src={`/hero_${valuesState?.themeName}.svg`}
                        alt="Hero Image"
                        className="w-full"
                        loading="lazy"
                        data-pr-tooltip="From Story Set"
                    />
                )}
            </div>
        </div>
    );
}
