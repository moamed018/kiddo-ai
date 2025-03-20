// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { TabPanel, TabView } from "primereact/tabview";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSettings } from "../context/SettingsContext";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";

export default function HowItWork() {
    const { valuesState } = useSettings();
    const { t } = useTranslation();

    const [active, setActive] = useState(0);

    const ptStepperPanel = {
        number: (option: {
            context: { highlighted: boolean; active: boolean };
        }) => {
            return {
                style: {
                    backgroundColor:
                        option.context.highlighted || option.context.active
                            ? "var(--color-main)"
                            : "var(--color-main-bg)",
                    color:
                        option.context.highlighted || option.context.active
                            ? "var(--color-main-bg)"
                            : "var(--color-main)",
                    border: "2px solid var(--color-main)",
                },
            };
        },
        separator: (option: { context: { highlighted: boolean } }) => {
            return {
                style: {
                    backgroundColor: "var(--color-main)",

                    opacity: option.context.highlighted ? "1" : "0.3",
                },
            };
        },
        title: (option: {
            context: { highlighted: boolean; active: boolean };
        }) => {
            return {
                style: {
                    opacity:
                        option.context.highlighted || option.context.active
                            ? "1"
                            : "0.5",
                    color:
                        option.context.highlighted || option.context.active
                            ? "var(--color-main)"
                            : "var(--color-main-text)",
                },
                className: "px-2 sm:!block !hidden",
            };
        },
        action: {
            style: {
                backgroundColor: "transparent",
            },
        },
    };

    return (
        <section className="py-20">
            <h3 className="text-4xl text-center text-main font-bold mb-8 sm:text-5xl tracking-wider uppercase">
                {t("howItWorkHeading")}
            </h3>

            <TabView
                activeIndex={active}
                onTabChange={(e) => {
                    setActive(e.index);
                }}
                pt={{
                    nav: {
                        style: {
                            backgroundColor: "transparent",
                            borderBottomColor: "var(--color-main)",
                        },
                    },
                    panelContainer: {
                        className: "!bg-transparent !text-main-text",
                    },
                    inkbar: {
                        style: {
                            borderBottomColor: "var(--color-main)",
                        },
                    },
                }}
            >
                <TabPanel
                    header={t("lessonsHeading")}
                    pt={{
                        headerAction: {
                            style: {
                                backgroundColor:
                                    active === 0
                                        ? `${valuesState?.theme}20`
                                        : "transparent",
                                borderBottomColor: "var(--color-main)",
                            },
                        },
                        headerTitle: {
                            style: {
                                color:
                                    active === 0
                                        ? "var(--color-main)"
                                        : "var(--color-main-text)",
                            },
                            className: "uppercase",
                        },
                    }}
                >
                    <StepperCustom
                        ptStepperPanel={ptStepperPanel}
                        transStepper="lessonsSteppers"
                    />
                </TabPanel>
                <TabPanel
                    header={t("storiesHeading")}
                    pt={{
                        headerAction: {
                            style: {
                                backgroundColor:
                                    active === 1
                                        ? `${valuesState?.theme}20`
                                        : "transparent",
                                borderBottomColor: "var(--color-main)",
                            },
                        },
                        headerTitle: {
                            style: {
                                color:
                                    active === 1
                                        ? "var(--color-main)"
                                        : "var(--color-main-text)",
                            },
                            className: "uppercase",
                        },
                    }}
                >
                    <StepperCustom
                        ptStepperPanel={ptStepperPanel}
                        transStepper="storiesSteppers"
                    />
                </TabPanel>
            </TabView>
        </section>
    );
}

function StepperCustom({
    ptStepperPanel,
    transStepper,
}: {
    ptStepperPanel: {
        number: (option: {
            context: { highlighted: boolean; active: boolean };
        }) => {
            style: {
                backgroundColor: string;
                color: string;
                border: string;
            };
        };
        separator: (option: { context: { highlighted: boolean } }) => {
            style: {
                backgroundColor: string;
                opacity: string;
            };
        };
        title: (option: {
            context: { highlighted: boolean; active: boolean };
        }) => {
            style: {
                opacity: string;
                color: string;
            };
            className: string;
        };
        action: {
            style: {
                backgroundColor: string;
            };
        };
    };
    transStepper: string;
}) {
    const { valuesState } = useSettings();
    const { t } = useTranslation();
    const lessonsStepperRef = useRef<Stepper | null>(null);
    return (
        <Stepper
            ref={lessonsStepperRef}
            pt={{
                nav: {
                    className: "!mb-2",
                },
                panelContainer: {
                    style: {
                        backgroundColor: "transparent",
                        color: "var(--color-main-text)",
                        padding: "0 10px 20px",
                    },
                },
            }}
        >
            <StepperPanel
                header={t(`${transStepper}.step1.title`)}
                pt={ptStepperPanel}
            >
                <div>
                    <h3 className="text-main text-xl capitalize font-bold mb-2">
                        {t(`${transStepper}.step1.heading`)}
                    </h3>
                    <p>{t(`${transStepper}.step1.description`)}</p>
                </div>
                <div className="flex justify-end mt-4">
                    <Button
                        icon={`pi pi-arrow-${
                            valuesState?.dir === "rtl" ? "left" : "right"
                        }`}
                        iconPos="right"
                        onClick={() =>
                            lessonsStepperRef.current?.nextCallback()
                        }
                        size="small"
                        rounded
                        className="!bg-main !border-0 !text-main-text"
                    />
                </div>
            </StepperPanel>
            <StepperPanel
                header={t(`${transStepper}.step2.title`)}
                pt={ptStepperPanel}
            >
                <div>
                    <h3 className="text-main text-xl capitalize font-bold mb-2">
                        {t(`${transStepper}.step2.heading`)}
                    </h3>
                    <p>{t(`${transStepper}.step2.description`)}</p>
                </div>
                <div className="flex justify-between gap-2 mt-4">
                    <Button
                        icon={`pi pi-arrow-${
                            valuesState?.dir === "rtl" ? "right" : "left"
                        }`}
                        onClick={() =>
                            lessonsStepperRef.current?.prevCallback()
                        }
                        size="small"
                        rounded
                        className="!bg-main-text !border-0 !text-main-bg opacity-75"
                    />
                    <Button
                        icon={`pi pi-arrow-${
                            valuesState?.dir === "rtl" ? "left" : "right"
                        }`}
                        iconPos="right"
                        onClick={() =>
                            lessonsStepperRef.current?.nextCallback()
                        }
                        size="small"
                        rounded
                        className="!bg-main !border-0 !text-main-text"
                    />
                </div>
            </StepperPanel>
            <StepperPanel
                header={t(`${transStepper}.step3.title`)}
                pt={ptStepperPanel}
            >
                <div>
                    <h3 className="text-main text-xl capitalize font-bold mb-2">
                        {t(`${transStepper}.step3.heading`)}
                    </h3>
                    <p>{t(`${transStepper}.step3.description`)}</p>
                </div>
                <div className="flex mt-4">
                    <Button
                        icon={`pi pi-arrow-${
                            valuesState?.dir === "rtl" ? "right" : "left"
                        }`}
                        onClick={() =>
                            lessonsStepperRef.current?.prevCallback()
                        }
                        size="small"
                        rounded
                        className="!bg-main-text !border-0 !text-main-bg opacity-75"
                    />
                </div>
            </StepperPanel>
        </Stepper>
    );
}
