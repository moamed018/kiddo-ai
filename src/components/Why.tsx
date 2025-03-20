import { useTranslation } from "react-i18next";
import { useSettings } from "../context/SettingsContext";

export default function Why() {
    const { t } = useTranslation();

    return (
        <div className="py-20">
            <h3 className="text-4xl sm:text-5xl text-main font-bold tracking-wider uppercase mb-10 text-center">
                {t("whyHeading")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <WhyCard title={t("why1")} icon="💡" />
                <WhyCard title={t("why2")} icon="⏳" />
                <WhyCard title={t("why3")} icon="🎨" />
            </div>
        </div>
    );
}

const WhyCard = ({ title, icon }: { title: string; icon: string }) => {
    const { valuesState } = useSettings();
    return (
        <div
            className="flex flex-col items-center gap-2 py-4 px-6 rounded-lg hover:shadow-[6px_6px_2px_#000] hover:-translate-2 transition-all duration-300"
            style={{ backgroundColor: `${valuesState?.theme}40` }}
        >
            <div className="w-12 h-12 flex justify-center items-center rounded-full bg-main">
                {icon}
            </div>
            <h4 className="text-sm">{title}</h4>
        </div>
    );
};
