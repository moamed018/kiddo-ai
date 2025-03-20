import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Signup() {
    const { t } = useTranslation();
    const { valuesState } = useSettings();
    const { currentUser, signup } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [valueFullName, setValueFullName] = useState("");
    const [valueEmail, setValueEmail] = useState("");

    useEffect(() => {
        if (currentUser) {
            showToast(t("pleaseLogoutFirstToSignup"), {
                type: "error",
            });
            navigate("/app");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submitHandler = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (!valueFullName) {
            showToast(t("enterFullName"), {
                type: "error",
            });
        }
        if (!valueEmail) {
            showToast(t("enterEmail"), {
                type: "error",
            });
        }
        if (valueFullName && valueEmail) {
            const signUpSuccess = signup(valueFullName, valueEmail);
            if (signUpSuccess) navigate("/app");
        }
    };

    return (
        <>
            <Navbar
                to="/"
                link={
                    <>
                        <b className="pi pi-arrow-left sm:!hidden"></b>
                        <span className="sm:block hidden">
                            {t("bakeToHome")}
                        </span>
                    </>
                }
            />
            <div className="flex flex-col items-center justify-center h-[80vh] min-w-[80vw]">
                <h1 className="text-4xl font-bold text-center uppercase text-main mb-10">
                    {t("signUp")}
                </h1>
                <form
                    className="flex flex-col mt-4 w-[80%]"
                    onSubmit={submitHandler}
                >
                    <FloatLabel className="mb-12">
                        <InputText
                            id="username"
                            value={valueFullName}
                            onChange={(e) => setValueFullName(e.target.value)}
                            className={`w-full !bg-main-bg !text-main-text !rounded-none !border-0 !outline-none focus:!shadow-none !border-b-2 !border-main `}
                            type="text"
                        />
                        <label
                            htmlFor="username"
                            className={`!text-main-text !block ${
                                valuesState?.dir === "rtl"
                                    ? "!right-0 !left-auto"
                                    : "!left-0 !right-auto"
                            }`}
                        >
                            {t("fullName")}
                        </label>
                    </FloatLabel>
                    <FloatLabel className="mb-12">
                        <InputText
                            id="email"
                            value={valueEmail}
                            onChange={(e) => setValueEmail(e.target.value)}
                            className={`w-full !bg-main-bg !text-main-text !rounded-none !border-0 !outline-none focus:!shadow-none !border-b-2 !border-main `}
                            type="email"
                        />
                        <label
                            htmlFor="email"
                            className={`!text-main-text !block ${
                                valuesState?.dir === "rtl"
                                    ? "!right-0 !left-auto"
                                    : "!left-0 !right-auto"
                            }`}
                        >
                            {t("email")}
                        </label>
                    </FloatLabel>

                    <button
                        type="submit"
                        className="w-fit !bg-main !text-white !rounded-lg !border-0 !px-8 py-2 hover:scale-95 !transition-transform !duration-300 text-lg mb-6 cursor-pointer"
                    >
                        {t("signUp")}
                    </button>
                    <h3 className="text-sm">
                        {t("signUpMessage")}{" "}
                        <Link to="/login" className="text-main hover:underline">
                            {t("signUpLink")}
                        </Link>
                    </h3>
                </form>
            </div>
        </>
    );
}
