import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();
    return (
        <div className="text-center bg-main text-sm opacity-90 mt-6 border-t border-gray-500 py-4">
            &copy; {new Date().getFullYear()} {t("footer")}
        </div>
    );
}
