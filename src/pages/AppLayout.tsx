import { Splitter, SplitterPanel } from "primereact/splitter";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import Logo from "../components/Logo";
import SidebarSettings from "../components/SidebarSettings";
import { Sidebar } from "primereact/sidebar";

export default function AppLayout() {
    const [showSplitterPanelSidebar, setShowSplitterPanelSidebar] =
        useState(true);
    const menuUserRef = useRef<Menu>(null);
    const { t } = useTranslation();
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const { valuesState } = useSettings();
    const [showSidebar, setShowSidebar] = useState(false);
    const [showAppSidebar, setShowAppSidebar] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            showToast(t("pleaseLogin"), {
                type: "error",
            });
            navigate("/login");
        }
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    const items = [
        {
            items: [
                {
                    label: t("theme&language"),
                    command: () => {
                        setShowSidebar(true);
                    },
                },
                {
                    label: t("logout"),
                    command: () => {
                        setTimeout(() => {
                            logout();
                        }, 100);
                        navigate("/");
                    },
                },
            ],
        },
    ];

    return (
        <>
            <Splitter
                className="!bg-main-bg !border-none !rounded-none !text-main-text min-h-screen"
                style={{
                    // direction: valuesState?.dir === "rtl" ? "ltr" : "rtl",
                    direction: "ltr",
                }}
                gutterSize={6}
                pt={{
                    gutterHandler: {
                        className: "!bg-main !h-10 !hidden rounded-full",
                    },
                    gutter: {
                        className: `${
                            !showSplitterPanelSidebar
                                ? "!hidden"
                                : "lg:!flex !hidden"
                        }`,
                    },
                }}
            >
                <SplitterPanel
                    className={`flex-col ${
                        showSplitterPanelSidebar ? "lg:flex hidden" : "hidden"
                    }`}
                    minSize={20}
                    size={20}
                >
                    <div
                        className="border-b shadow pb-3 pt-2 px-4"
                        style={{
                            borderBottomColor: `${valuesState?.textColor}60`,
                        }}
                    >
                        <Link
                            to="/"
                            className="block cursor-pointer duration-300 hover:scale-95 transition-all"
                        >
                            <Logo />
                        </Link>
                    </div>
                    <div className="lg:px-4 px-8 py-8">{<MenuLinks />}</div>
                </SplitterPanel>

                <SplitterPanel
                    size={showSplitterPanelSidebar ? 100 : 80}
                    minSize={40}
                    className="flex flex-col"
                >
                    <div
                        className="flex border-b justify-between shadow lg:px-4 px-8 py-2"
                        style={{
                            borderBottomColor: `${valuesState?.textColor}60`,
                        }}
                    >
                        <button
                            className="cursor-pointer hidden lg:block"
                            onClick={() =>
                                setShowSplitterPanelSidebar(
                                    !showSplitterPanelSidebar
                                )
                            }
                        >
                            {!showSplitterPanelSidebar ? (
                                <i
                                    className="text-main pi pi-align-justify"
                                    style={{ fontSize: "1.5rem" }}
                                ></i>
                            ) : (
                                <i
                                    className="text-main pi pi-align-left"
                                    style={{ fontSize: "1.5rem" }}
                                ></i>
                            )}
                        </button>
                        <button
                            className="block cursor-pointer lg:hidden"
                            onClick={() => setShowAppSidebar(true)}
                        >
                            <i
                                className="text-main pi pi-bars"
                                style={{ fontSize: "1.5rem" }}
                            ></i>
                        </button>
                        <Button
                            className={`!border-none focus:!shadow-none hover:scale-95 focus:scale-95 !transition-all !duration-300 capitalize flex ${
                                valuesState?.dir === "rtl" && "flex-row-reverse"
                            } items-center !text-main-text`}
                            onClick={(event) => {
                                menuUserRef?.current?.toggle(event);
                            }}
                            aria-controls="popup_menu_right"
                            aria-haspopup
                            size="small"
                            style={{
                                backgroundColor: `${valuesState?.theme}30`,
                            }}
                        >
                            <span>{t("hi")}</span>
                            <span
                                className={`${
                                    valuesState?.dir === "rtl" ? "ps-1" : "pe-1"
                                }`}
                            >
                                ,{" "}
                            </span>
                            {`${currentUser?.name.split(" ")[0]}`}
                        </Button>

                        <Menu
                            model={items}
                            popup
                            ref={menuUserRef}
                            id="popup_menu_right"
                            popupAlignment="right"
                            className="!bg-main-bg !border"
                            style={{
                                borderColor: `${valuesState?.textColor}60`,
                            }}
                            pt={{
                                submenuHeader: { className: "!hidden" },
                                label: {
                                    className: "!text-inherit",
                                },
                                action: {
                                    className:
                                        "hover:!bg-main-bg !bg-main-bg !text-main-text hover:!text-main",
                                },
                                // menuitem: {
                                //     className: "hover:",
                                // },
                            }}
                        />
                    </div>
                    <div className="px-4 py-4">
                        <Outlet />
                    </div>
                </SplitterPanel>
            </Splitter>

            <Sidebar
                visible={showAppSidebar}
                className="block lg:!hidden"
                maskClassName="lg:!hidden block backdrop-blur-xs"
                onHide={() => setShowAppSidebar(false)}
                content={({ closeIconRef, hide }) => (
                    <div className="flex flex-col bg-main-bg text-main-text lg:static min-h-screen relative surface-ground">
                        <div
                            className="flex border-b justify-between shadow pb-4 pt-2 px-4"
                            style={{
                                borderBottomColor: `${valuesState?.textColor}60`,
                            }}
                        >
                            <Link
                                to="/"
                                className="block cursor-pointer duration-300 hover:scale-95 transition-all"
                            >
                                <Logo />
                            </Link>
                            <button
                                className="block cursor-pointer hover:opacity-70 lg:hidden"
                                ref={
                                    closeIconRef as React.Ref<HTMLButtonElement>
                                }
                                onClick={(e) => hide(e)}
                            >
                                <i
                                    className="text-main pi pi-times"
                                    style={{ fontSize: "1rem" }}
                                ></i>
                            </button>
                        </div>
                        <div
                            className="lg:px-4 px-8 py-8"
                            onClick={(e) => {
                                if ((e.target as HTMLElement).tagName === "A") {
                                    hide(e);
                                }
                            }}
                        >
                            {<MenuLinks />}
                        </div>
                    </div>
                )}
            ></Sidebar>
            <SidebarSettings
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
            />
        </>
    );
}

const MenuLinks = () => {
    const { t } = useTranslation();
    const { valuesState } = useSettings();

    return (
        <div
            className={`flex flex-col gap-4`}
            style={{
                direction: valuesState?.dir === "rtl" ? "rtl" : "ltr",
            }}
        >
            <Link
                to={"/"}
                className="bg-main rounded text-white w-full duration-300 hover:scale-95 mx-auto px-8 py-2 transform-all"
            >
                {t("Home")}
            </Link>
            <Link
                to={"/app"}
                className="bg-main rounded text-white w-full duration-300 hover:scale-95 mx-auto px-8 py-2 transform-all"
            >
                {t("App Home")}
            </Link>
            <Link
                to={"new-story"}
                className="bg-main rounded text-white w-full duration-300 hover:scale-95 mx-auto px-8 py-2 transform-all"
            >
                {t("New Story")}
            </Link>
            <Link
                to={"new-lesson"}
                className="bg-main rounded text-white w-full duration-300 hover:scale-95 mx-auto px-8 py-2 transform-all"
            >
                {t("New lesson")}
            </Link>
        </div>
    );
};
