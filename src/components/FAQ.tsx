import { Accordion, AccordionTab } from "primereact/accordion";
import { useTranslation } from "react-i18next";
import { useSettings } from "../context/SettingsContext";

export default function FAQ() {
    const { t } = useTranslation();
    const { valuesState } = useSettings();
    return (
        <div className="py-20">
            <h3 className="text-4xl sm:text-5xl text-main font-bold tracking-wider uppercase mb-10 text-center">
                {t("faq.heading")}
            </h3>
            <Accordion
                expandIcon={`pi pi-chevron-${
                    valuesState?.dir === "rtl" ? "left" : "right"
                } !me-2`}
                collapseIcon="pi pi-chevron-down !me-2"
            >
                {Array.from({ length: 6 }).map((_, i) => (
                    <AccordionTab
                        key={i}
                        header={t(`faq.q${i + 1}.title`)}
                        pt={{
                            headerAction: (option) => {
                                return {
                                    className: `!bg-main-bg !border-0 ${
                                        option?.parent.state.activeIndex === i
                                            ? "!text-main"
                                            : "!text-main-text"
                                    }`,
                                };
                            },
                            content: {
                                className:
                                    "!bg-main-bg !border-0 !text-main-text !pt-0 !ps-10",
                            },
                        }}
                    >
                        <p className="m-0 opacity-80">
                            {t(`faq.q${i + 1}.answer`)}
                        </p>
                    </AccordionTab>
                ))}
            </Accordion>
        </div>
    );
}
