import { Message } from "primereact/message";
import CTA from "../components/CTA";
import FAQ from "../components/FAQ";
import FeaturesSection from "../components/FeaturesSection";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HowItWork from "../components/HowItWork";
import Navbar from "../components/Navbar";
import Why from "../components/Why";
import { useSettings } from "../context/SettingsContext";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

export default function Home() {
    const { valuesState } = useSettings();
    const { currentUser } = useAuth();
    const { t } = useTranslation();
    return (
        <>
            <Navbar
                to={currentUser ? "/app" : "/login"}
                link={
                    <>
                        <b className="pi pi-sign-in sm:!hidden"></b>
                        <span className="sm:block hidden">
                            {currentUser ? t("app") : t("login")}
                        </span>
                    </>
                }
            />
            <div className="px-4 sm:px-8 lg:px-16 container mx-auto">
                <Hero />
                <FeaturesSection />
                <HowItWork />
                <Why />
            </div>
            <CTA />
            <div className="px-4 sm:px-8 lg:px-16 container mx-auto">
                <FAQ />
                <Message
                    style={{
                        borderStyle: "solid ",
                        borderColor: valuesState?.theme,
                        borderWidth:
                            valuesState?.dir === "ltr"
                                ? "0 0 0 6px"
                                : "0 6px 0 0",
                        color: valuesState?.bgColor,
                        backgroundColor: valuesState?.textColor,
                    }}
                    className="border-primary !justify-content-start !gap-4"
                    severity="info"
                    text={t("infoMessage")}
                />
            </div>

            <Footer />
        </>
    );
}
