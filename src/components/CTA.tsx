import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function CTA() {
    const { t } = useTranslation();
    return (
        <div>
            <div className="bg-main text-main-text text-center py-20 ">
                <h2 className="text-4xl sm:text-5xl font-bold">
                    {t("CTAHeading")}
                </h2>
                <p className="text-lg sm:text-xl mt-4">{t("CTAText")}</p>

                <Link
                    to="/signup"
                    className="bg-main-bg text-main-text px-8 py-2 mt-8 rounded-full cursor-pointer hover:scale-95 transition-transform duration-300 block w-fit mx-auto"
                >
                    {t("CTAButton")}
                </Link>
            </div>
        </div>
    );
}
