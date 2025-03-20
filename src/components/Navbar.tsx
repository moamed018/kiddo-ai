import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import Logo from "./Logo";
import { useSettings } from "../context/SettingsContext";
import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import SidebarSettings from "./SidebarSettings";

export default function Navbar({ link, to }: { link: ReactNode; to: string }) {
    const { valuesState } = useSettings();
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
            <div className="shadow-lg !sticky top-0 w-full z-10 backdrop-blur-sm ">
                <Menubar
                    className={`container mx-auto !px-4 sm:!px-8 lg:!px-16 !rounded-none !border-0`}
                    style={{
                        backgroundColor: valuesState?.bgColor + "50",
                        direction: "ltr",
                    }}
                    start={
                        <Link
                            to="/"
                            className="cursor-pointer hover:scale-95 transition-all duration-300 block"
                        >
                            <Logo />
                        </Link>
                    }
                    end={
                        <div className="flex items-center gap-4">
                            <Button
                                icon="pi pi-cog"
                                rounded
                                text
                                raised
                                className="!text-main !border-0"
                                onClick={() => setShowSidebar((prev) => !prev)}
                                size="small"
                            />
                            <Link
                                className="!bg-main !border-0 capitalize sm:!px-8 !px-4 !py-2 hover:scale-95 !transition-transform !duration-300 rounded-lg  text-sm !text-white"
                                // size="small"
                                to={to}
                            >
                                {link}
                            </Link>
                        </div>
                    }
                    pt={{
                        button: { style: { display: "none" } },
                    }}
                />
            </div>
            <SidebarSettings
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
            />
        </>
    );
}
