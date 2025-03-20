import { useTranslation } from "react-i18next";
import { useSettings } from "../context/SettingsContext";

export default function FeaturesSection() {
    const { valuesState } = useSettings();
    const { t } = useTranslation();

    return (
        <section className="py-20">
            <h3 className="text-4xl sm:text-5xl text-main font-bold tracking-wider uppercase mb-2 text-center">
                {t("featuresHeading")}
            </h3>
            <p className="sm:w-[70%] text-sm m-auto text-center opacity-70">
                {t("featuresSubheading")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-16">
                <FeatureCard
                    title={t("feature1.title")}
                    description={t("feature1.description")}
                    image={
                        valuesState?.themeName
                            ? `/easy_learning_${valuesState?.themeName}.svg`
                            : ""
                    }
                />
                <FeatureCard
                    title={t("feature2.title")}
                    description={t("feature2.description")}
                    image={
                        valuesState?.themeName
                            ? `/stories_${valuesState?.themeName}.svg`
                            : ""
                    }
                />
                <FeatureCard
                    title={t("feature3.title")}
                    description={t("feature3.description")}
                    image={
                        valuesState?.themeName
                            ? `/ui_${valuesState?.themeName}.svg`
                            : ""
                    }
                />
            </div>
        </section>
    );
}

function FeatureCard({
    title,
    description,
    image,
}: {
    title: string;
    description: string;
    image: string;
}) {
    return (
        <div className="pb-10 sm:pb-0 flex flex-col items-center">
            <h3 className="text-2xl sm:text-xl text-main font-bold tracking-wider uppercase mb-8 text-center">
                {title}
            </h3>
            <div className="mb-2 w-[90%] sm:w-[200px] sm:h-[200px] grow">
                {image && (
                    <img
                        src={image}
                        alt="Feature Image"
                        className="w-full h-full m-auto"
                    />
                )}
            </div>
            <p className="w-[90%] text-sm m-auto text-center opacity-70">
                {description}
            </p>
        </div>
    );
}
