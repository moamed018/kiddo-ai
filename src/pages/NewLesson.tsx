import { InputText } from "primereact/inputtext";
import getLessonGemini from "../api/getLessonGemini";
import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { BlockUI } from "primereact/blockui";
import { Panel } from "primereact/panel";
import { useSettings } from "../context/SettingsContext";
import { useTranslation } from "react-i18next";
import { TabPanel, TabView } from "primereact/tabview";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { RadioButton } from "primereact/radiobutton";
import { useToast } from "../context/ToastContext";
import { ProgressBar } from "primereact/progressbar";
import { ProgressSpinner } from "primereact/progressspinner";
import { Fieldset } from "primereact/fieldset";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import File from "../components/File";

export default function NewLesson() {
    const storyWithInputRef = useRef(null);
    const storyWithoutInputRef = useRef(null);
    const [textInput, setTextInput] = useState("");
    const { valuesState } = useSettings();
    const { showToast } = useToast();
    const [textOptions, setTextOptions] = useState<string[]>([]);
    const [statusText, setStatusText] = useState<{
        text: string;
        color: string;
    } | null>(null);
    const [loading, setLoading] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [loadingValue, setLoadingValue] = useState(0);

    const [textLang, setTextLang] = useState<"ar" | "en">(
        (valuesState?.language as "en" | "ar") || "en"
    );
    const [textSize, setTextSize] = useState<"small" | "medium" | "large">(
        "small"
    );
    const [NewStory, setNewStory] = useState<
        | {
              lesson_title?: string;
              dir: "rtl" | "ltr";
              texts?: {
                  text?: string;
                  number: number;
              }[];
          }
        | null
        | undefined
    >();

    const { t } = useTranslation();
    const [active, setActive] = useState(0);
    const [file, setFile] = useState<File | null>(null);

    const onOptionsChange = (e: CheckboxChangeEvent) => {
        const _textOptions = [...textOptions];

        if (e.checked) _textOptions.push(e.value);
        else _textOptions.splice(_textOptions.indexOf(e.value), 1);

        setTextOptions(_textOptions);
    };

    const createLessonFromUserInput = async () => {
        setTextInput("");
        setTextOptions([]);
        setStatusText(null);
        setLoadingValue(0);
        setTextLang((valuesState?.language as "en" | "ar") || "en");
        setTextSize("small");
        setNewStory(null);

        if (!textInput) {
            showToast(t("Please enter a title for the lesson"), {
                type: "warning",
            });
            return;
        }

        try {
            setBlocked(true);
            setStatusText({
                text: t("Creating lesson..."),
                color: valuesState?.textColor || "",
            });
            setLoading(true);
            setLoadingValue(0);
            const story = JSON.parse(
                (await getLessonGemini({
                    input: textInput,
                    lang: textLang,
                    size: textSize,
                    withPDF: false,
                })) || ""
            );
            if (story) {
                setNewStory(story);
                setStatusText({
                    text: t("lesson created successfully"),
                    color: "#0f0",
                });
                setLoadingValue(100);
            }
        } catch (error) {
            setStatusText({
                text: t("Failed to create lesson"),
                color: "#f00",
            });
            console.error(error);
            setBlocked(false);
        } finally {
            setLoading(false);
            // setLoadingValue(100);
        }
    };

    const createStoryFromAI = async () => {
        setTextInput("");
        setTextOptions([]);
        setStatusText(null);
        setLoadingValue(0);
        setTextLang((valuesState?.language as "en" | "ar") || "en");
        setTextSize("small");
        console.log(file);

        setNewStory(null);
        if (!file) {
            showToast(t("Please upload a PDF file"), {
                type: "warning",
            });
            return;
        }
        try {
            setBlocked(true);
            setStatusText({
                text: t("Creating lesson..."),
                color: valuesState?.textColor || "",
            });
            setLoading(true);
            setLoadingValue(0);
            const story = JSON.parse(
                (await getLessonGemini({
                    lang: textLang,
                    size: textSize,
                    withPDF: true,
                    file: file || null,
                })) || ""
            );
            if (story) {
                setNewStory(story);
                setStatusText({
                    text: t("lesson created successfully"),
                    color: "#0f0",
                });
                setLoadingValue(100);
            }
        } catch (error) {
            setStatusText({
                text: t("Failed to create lesson"),
                color: "#f00",
            });
            console.error(error);
            setBlocked(false);
        } finally {
            setLoading(false);

            // setLoadingValue(100);
        }
    };

    return (
        <>
            <Panel
                header={t("createNewLesson")}
                style={{
                    direction: (valuesState?.dir || "ltr") as "ltr" | "rtl",
                }}
                pt={{
                    content: {
                        className: "!bg-main-bg !text-main-text !px-2",
                        style: {
                            borderColor: `${valuesState?.textColor}20`,
                        },
                    },
                    header: {
                        className: "!bg-main-bg !text-main-text !text-3xl",
                        style: {
                            borderColor: `${valuesState?.textColor}20`,
                        },
                    },
                }}
            >
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
                            className:
                                "!bg-transparent !text-main-text !pt-1 !px-1",
                        },
                        inkbar: {
                            style: {
                                borderBottomColor: "var(--color-main)",
                            },
                        },
                    }}
                >
                    <TabPanel
                        header={t("inputTitle")}
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
                                className: "uppercase text-sm",
                            },
                        }}
                    >
                        {/* <Button onClick={generateImage}>Get Image</Button> */}
                        <BlockUI
                            blocked={blocked}
                            className="!z-10"
                            template={
                                !loading && (
                                    <button
                                        className="bg-main text-3xl text-white block cursor-pointer px-4 py-2"
                                        onClick={() => setBlocked(false)}
                                    >
                                        <i className="!text-3xl pi pi-unlock" />{" "}
                                        {t("Unlock")}
                                    </button>
                                )
                            }
                        >
                            <div className="flex flex-col card justify-start p-2 gap-2 items-start sm:flex-row sm:gap-4">
                                <div className="w-full grow sm:w-[80%]">
                                    <InputText
                                        placeholder={t("inputLessonTitle")}
                                        className="w-full !px-4 !py-2 !text-md"
                                        value={textInput}
                                        onChange={(e) => {
                                            if (e.target.value.length <= 75) {
                                                setTextInput(e.target.value);
                                            } else {
                                                setTextInput(
                                                    e.target.value.slice(0, 75)
                                                );
                                            }
                                        }}
                                    />
                                    <div
                                        className={`uppercase pt-1.5 ps-1 text-xs ${
                                            textInput.length === 75
                                                ? "text-red-500 animate-wiggle"
                                                : "text-gray-400"
                                        }`}
                                    >
                                        <span>{t("limitLetter")}: </span>
                                        <span
                                            className={` ${
                                                textInput.length === 75
                                                    ? "text-red-500"
                                                    : "text-main"
                                            }`}
                                        >
                                            {textInput.length}
                                        </span>
                                        <span> / 75</span>
                                    </div>
                                </div>
                                <Button
                                    size="small"
                                    className="w-fit !border-0 !duration-300 !font-bold !mx-auto !text-white !transition-all focus:!outline-none focus:!ring-0 hover:!opacity-70 hover:!scale-95 inline-block whitespace-nowrap"
                                    style={{
                                        backgroundColor:
                                            valuesState?.theme + "cc",
                                    }}
                                    onClick={createLessonFromUserInput}
                                >
                                    {t("createNewLesson")}
                                </Button>
                            </div>
                            <Panel
                                header={`${t("preferences")}:`}
                                toggleable
                                collapsed
                                style={{
                                    direction: (valuesState?.dir || "ltr") as
                                        | "ltr"
                                        | "rtl",
                                }}
                                pt={{
                                    content: {
                                        className:
                                            "!bg-main-bg !text-main-text !p-2",
                                        style: {
                                            borderColor: `${valuesState?.textColor}20`,
                                        },
                                    },
                                    header: {
                                        className:
                                            "!bg-main-bg !text-main-text text-lg font-bold",
                                        style: {
                                            borderColor: `${valuesState?.textColor}20`,
                                        },
                                    },
                                    togglerIcon: {
                                        className: "!text-main",
                                    },
                                    toggler: {
                                        className:
                                            "hover:!bg-main-bg hover:scale-95",
                                    },
                                }}
                            >
                                <div className="flex flex-row flex-wrap justify-between gap-2 sm:gap-4">
                                    <BlockUI
                                        blocked={true}
                                        template={
                                            <h3 className="bg-main-bg text-center text-main w-full block px-4 py-2">
                                                SOON
                                            </h3>
                                        }
                                    >
                                        <div className="min-w-[140px]">
                                            <h5>{t("includes")}:</h5>

                                            <div className="flex flex-col text-sm gap-1 ps-6">
                                                <label className="flex !cursor-not-allowed gap-1 items-center line-through pt-1">
                                                    <Checkbox
                                                        onChange={() => {
                                                            setTextOptions(
                                                                textOptions.length ===
                                                                    2
                                                                    ? []
                                                                    : [
                                                                          "images",
                                                                          "audio",
                                                                      ]
                                                            );
                                                        }}
                                                        name="textOptions"
                                                        value="all"
                                                        checked={
                                                            textOptions.length ===
                                                            2
                                                        }
                                                        pt={{
                                                            box: (option) => {
                                                                return {
                                                                    className: `${
                                                                        option
                                                                            ?.context
                                                                            .checked
                                                                            ? "!bg-main"
                                                                            : ""
                                                                    } !border-main !w-5 !h-5`,
                                                                };
                                                            },
                                                        }}
                                                        disabled
                                                    ></Checkbox>
                                                    {textOptions.length === 2
                                                        ? t("unSelectAll")
                                                        : t("selectAll")}
                                                </label>

                                                <label className="flex !cursor-not-allowed gap-1 items-center line-through">
                                                    <Checkbox
                                                        onChange={
                                                            onOptionsChange
                                                        }
                                                        name="textOptions"
                                                        value="audio"
                                                        checked={textOptions.includes(
                                                            "audio"
                                                        )}
                                                        pt={{
                                                            box: (option) => {
                                                                return {
                                                                    className: `${
                                                                        option
                                                                            ?.context
                                                                            .checked
                                                                            ? "!bg-main"
                                                                            : ""
                                                                    } !border-main !w-5 !h-5`,
                                                                };
                                                            },
                                                        }}
                                                        disabled
                                                    ></Checkbox>
                                                    {t("audio")}{" "}
                                                    <span className="text-xs">
                                                        soon
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </BlockUI>

                                    <div className="min-w-[140px]">
                                        <h5>{t("language")}:</h5>

                                        <div className="flex flex-col text-sm gap-1 ps-6 pt-1">
                                            <label className="flex cursor-pointer gap-1 items-center">
                                                <RadioButton
                                                    onChange={() =>
                                                        setTextLang("ar")
                                                    }
                                                    name="textLang"
                                                    value="ar"
                                                    checked={textLang === "ar"}
                                                    pt={{
                                                        box: (option) => {
                                                            return {
                                                                className: `${
                                                                    option
                                                                        ?.props
                                                                        .checked
                                                                        ? "!bg-main"
                                                                        : ""
                                                                } !border-main !w-5 !h-5`,
                                                            };
                                                        },
                                                    }}
                                                ></RadioButton>
                                                {t("arabic")}
                                            </label>
                                            <label className="flex cursor-pointer gap-1 items-center">
                                                <RadioButton
                                                    onChange={() =>
                                                        setTextLang("en")
                                                    }
                                                    name="textLang"
                                                    value="en"
                                                    checked={textLang === "en"}
                                                    pt={{
                                                        box: (option) => {
                                                            return {
                                                                className: `${
                                                                    option
                                                                        ?.props
                                                                        .checked
                                                                        ? "!bg-main"
                                                                        : ""
                                                                } !border-main !w-5 !h-5`,
                                                            };
                                                        },
                                                    }}
                                                ></RadioButton>
                                                {t("english")}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="min-w-[140px]">
                                        <h5>{t("textSize")}:</h5>

                                        <div className="flex flex-col text-sm gap-1 ps-6 pt-1">
                                            <label className="flex cursor-pointer gap-1 items-center">
                                                <RadioButton
                                                    onChange={() =>
                                                        setTextSize("small")
                                                    }
                                                    name="textSize"
                                                    value="small"
                                                    checked={
                                                        textSize === "small"
                                                    }
                                                    pt={{
                                                        box: (option) => {
                                                            return {
                                                                className: `${
                                                                    option
                                                                        ?.props
                                                                        .checked
                                                                        ? "!bg-main"
                                                                        : ""
                                                                } !border-main !w-5 !h-5`,
                                                            };
                                                        },
                                                    }}
                                                ></RadioButton>
                                                {t("small")}
                                            </label>
                                            <label className="flex cursor-pointer gap-1 items-center">
                                                <RadioButton
                                                    onChange={() =>
                                                        setTextSize("medium")
                                                    }
                                                    name="textSize"
                                                    value="medium"
                                                    checked={
                                                        textSize === "medium"
                                                    }
                                                    pt={{
                                                        box: (option) => {
                                                            return {
                                                                className: `${
                                                                    option
                                                                        ?.props
                                                                        .checked
                                                                        ? "!bg-main"
                                                                        : ""
                                                                } !border-main !w-5 !h-5`,
                                                            };
                                                        },
                                                    }}
                                                ></RadioButton>
                                                {t("medium")}
                                            </label>
                                            <label className="flex cursor-pointer gap-1 items-center">
                                                <RadioButton
                                                    onChange={() =>
                                                        setTextSize("large")
                                                    }
                                                    name="textSize"
                                                    value="large"
                                                    checked={
                                                        textSize === "large"
                                                    }
                                                    pt={{
                                                        box: (option) => {
                                                            return {
                                                                className: `${
                                                                    option
                                                                        ?.props
                                                                        .checked
                                                                        ? "!bg-main"
                                                                        : ""
                                                                } !border-main !w-5 !h-5`,
                                                            };
                                                        },
                                                    }}
                                                ></RadioButton>
                                                {t("large")}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </BlockUI>

                        {statusText && (
                            <div className="w-full my-8">
                                <ProgressBar
                                    showValue
                                    value={loadingValue}
                                    className="w-full !h-[10px] !rounded-none !text-xs"
                                    pt={{
                                        value: {
                                            className: "!bg-main",
                                        },
                                        container: {
                                            className: "!bg-main-text",
                                        },
                                    }}
                                ></ProgressBar>
                                <div className="pt-4">
                                    <h3 className="text-2xl text-main font-bold">
                                        {t("status")}:
                                    </h3>
                                    <div
                                        className="text-sm ml-4"
                                        style={{
                                            color: statusText.color,
                                        }}
                                    >
                                        {statusText.text}
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <>
                                <ProgressBar
                                    mode="indeterminate"
                                    style={{ height: "6px" }}
                                    className="w-full !mt-4 !rounded-none"
                                    pt={{
                                        value: {
                                            className: `!bg-main`,
                                        },
                                        container: {
                                            className: "!bg-main-text",
                                        },
                                    }}
                                ></ProgressBar>
                                <div className="flex justify-center items-center min-h-[50vh]">
                                    <ProgressSpinner />
                                </div>
                            </>
                        )}
                        {!loading && NewStory && (
                            <>
                                <button
                                    className="bg-main text-lg text-main-text !duration-300 !transition-all cursor-pointer hover:!opacity-70 px-4 py-2"
                                    onClick={() => {
                                        if (storyWithInputRef.current) {
                                            html2canvas(
                                                storyWithInputRef.current
                                            ).then((canvas) => {
                                                const imgData =
                                                    canvas.toDataURL(
                                                        "image/png"
                                                    );

                                                const imgWidth = 210;
                                                const imgHeight =
                                                    (canvas.height * imgWidth) /
                                                    canvas.width;

                                                const pdf = new jsPDF({
                                                    orientation: "portrait",
                                                    unit: "mm",
                                                    format: [
                                                        imgWidth,
                                                        imgHeight,
                                                    ],
                                                });

                                                pdf.addImage(
                                                    imgData,
                                                    "JPEG",
                                                    0,
                                                    0,
                                                    imgWidth,
                                                    imgHeight
                                                );
                                                pdf.save(
                                                    `${NewStory?.lesson_title}.pdf`
                                                );
                                                showToast(t("PDF Downloaded"), {
                                                    type: "success",
                                                });
                                            });
                                        }
                                    }}
                                >
                                    <i className="pi pi-download" />
                                </button>
                                <div ref={storyWithInputRef}>
                                    <Fieldset
                                        legend={NewStory?.lesson_title}
                                        className="!bg-main-bg !mt-8 !p-0 !text-main-text"
                                        style={{
                                            borderColor: `${valuesState?.textColor}20`,
                                            direction: NewStory.dir,
                                        }}
                                        pt={{
                                            content: {
                                                className:
                                                    "!bg-main-bg !text-main-text !p-2",
                                                style: {
                                                    borderColor: `${valuesState?.textColor}20`,
                                                },
                                            },
                                            legend: {
                                                className:
                                                    "!bg-main-bg !text-3xl !text-main !font-bold !ms-4",
                                                style: {
                                                    borderColor: `${valuesState?.textColor}20`,
                                                },
                                            },
                                        }}
                                    >
                                        <div className="md:px-12 mt-4 px-0 sm:px-4">
                                            {NewStory?.texts?.map(
                                                (text, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex items-start mt-10 mb-2 sm:flex-row flex-col`}
                                                    >
                                                        <span className="flex bg-main h-[40px] justify-center p-4 text-2xl text-white w-[40px] font-bold items-center">
                                                            {text.number}
                                                        </span>
                                                        <p className="p-4 shadow-lg text-lg">
                                                            {text.text}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </Fieldset>
                                </div>
                            </>
                        )}
                    </TabPanel>
                    <TabPanel
                        header={t("pdfUpload")}
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
                                className: "uppercase text-sm",
                            },
                        }}
                    >
                        <BlockUI
                            blocked={blocked}
                            className="!z-10"
                            template={
                                !loading && (
                                    <button
                                        className="bg-main text-3xl text-white block cursor-pointer px-4 py-2"
                                        onClick={() => setBlocked(false)}
                                    >
                                        <i className="!text-3xl pi pi-unlock" />{" "}
                                        {t("Unlock")}
                                    </button>
                                )
                            }
                        >
                            <div className="flex flex-col justify-start p-2 gap-2 items-start sm:gap-4">
                                <File set={setFile} />
                                <Button
                                    size="small"
                                    className="w-fit !border-0 !duration-300 !font-bold !mx-auto !text-white !transition-all focus:!outline-none focus:!ring-0 hover:!opacity-70 hover:!scale-95 inline-block whitespace-nowrap"
                                    style={{
                                        backgroundColor:
                                            valuesState?.theme + "cc",
                                    }}
                                    onClick={createStoryFromAI}
                                >
                                    {t("createNewLesson")}
                                </Button>
                            </div>
                            <Panel
                                header={`${t("preferences")}:`}
                                toggleable
                                collapsed
                                style={{
                                    direction: (valuesState?.dir || "ltr") as
                                        | "ltr"
                                        | "rtl",
                                }}
                                pt={{
                                    content: {
                                        className:
                                            "!bg-main-bg !text-main-text !p-2",
                                        style: {
                                            borderColor: `${valuesState?.textColor}20`,
                                        },
                                    },
                                    header: {
                                        className:
                                            "!bg-main-bg !text-main-text text-lg font-bold",
                                        style: {
                                            borderColor: `${valuesState?.textColor}20`,
                                        },
                                    },
                                    togglerIcon: {
                                        className: "!text-main",
                                    },
                                    toggler: {
                                        className:
                                            "hover:!bg-main-bg hover:scale-95",
                                    },
                                }}
                            >
                                <div className="flex flex-row flex-wrap justify-between gap-2 sm:gap-4">
                                    <BlockUI
                                        blocked={true}
                                        template={
                                            <h3 className="bg-main-bg text-center text-main w-full block px-4 py-2">
                                                SOON
                                            </h3>
                                        }
                                    >
                                        <div className="min-w-[140px]">
                                            <h5>{t("includes")}:</h5>

                                            <div className="flex flex-col text-sm gap-1 ps-6">
                                                <label className="flex !cursor-not-allowed gap-1 items-center line-through pt-1">
                                                    <Checkbox
                                                        onChange={() => {
                                                            setTextOptions(
                                                                textOptions.length ===
                                                                    2
                                                                    ? []
                                                                    : [
                                                                          "images",
                                                                          "audio",
                                                                      ]
                                                            );
                                                        }}
                                                        name="textOptions"
                                                        value="all"
                                                        checked={
                                                            textOptions.length ===
                                                            2
                                                        }
                                                        pt={{
                                                            box: (option) => {
                                                                return {
                                                                    className: `${
                                                                        option
                                                                            ?.context
                                                                            .checked
                                                                            ? "!bg-main"
                                                                            : ""
                                                                    } !border-main !w-5 !h-5`,
                                                                };
                                                            },
                                                        }}
                                                        disabled
                                                    ></Checkbox>
                                                    {textOptions.length === 2
                                                        ? t("unSelectAll")
                                                        : t("selectAll")}
                                                </label>

                                                <label className="flex !cursor-not-allowed gap-1 items-center line-through">
                                                    <Checkbox
                                                        onChange={
                                                            onOptionsChange
                                                        }
                                                        name="textOptions"
                                                        value="audio"
                                                        checked={textOptions.includes(
                                                            "audio"
                                                        )}
                                                        pt={{
                                                            box: (option) => {
                                                                return {
                                                                    className: `${
                                                                        option
                                                                            ?.context
                                                                            .checked
                                                                            ? "!bg-main"
                                                                            : ""
                                                                    } !border-main !w-5 !h-5`,
                                                                };
                                                            },
                                                        }}
                                                        disabled
                                                    ></Checkbox>
                                                    {t("audio")}{" "}
                                                    <span className="text-xs">
                                                        soon
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </BlockUI>

                                    <div className="min-w-[140px]">
                                        <h5>{t("language")}:</h5>

                                        <div className="flex flex-col text-sm gap-1 ps-6 pt-1">
                                            <label className="flex cursor-pointer gap-1 items-center">
                                                <RadioButton
                                                    onChange={() =>
                                                        setTextLang("ar")
                                                    }
                                                    name="textLang"
                                                    value="ar"
                                                    checked={textLang === "ar"}
                                                    pt={{
                                                        box: (option) => {
                                                            return {
                                                                className: `${
                                                                    option
                                                                        ?.props
                                                                        .checked
                                                                        ? "!bg-main"
                                                                        : ""
                                                                } !border-main !w-5 !h-5`,
                                                            };
                                                        },
                                                    }}
                                                ></RadioButton>
                                                {t("arabic")}
                                            </label>
                                            <label className="flex cursor-pointer gap-1 items-center">
                                                <RadioButton
                                                    onChange={() =>
                                                        setTextLang("en")
                                                    }
                                                    name="textLang"
                                                    value="en"
                                                    checked={textLang === "en"}
                                                    pt={{
                                                        box: (option) => {
                                                            return {
                                                                className: `${
                                                                    option
                                                                        ?.props
                                                                        .checked
                                                                        ? "!bg-main"
                                                                        : ""
                                                                } !border-main !w-5 !h-5`,
                                                            };
                                                        },
                                                    }}
                                                ></RadioButton>
                                                {t("english")}
                                            </label>
                                        </div>
                                    </div>

                                    <div className="min-w-[140px]">
                                        <h5>{t("textSize")}:</h5>

                                        <div className="flex flex-col text-sm gap-1 ps-6 pt-1">
                                            <label className="flex cursor-pointer gap-1 items-center">
                                                <RadioButton
                                                    onChange={() =>
                                                        setTextSize("small")
                                                    }
                                                    name="textSize"
                                                    value="small"
                                                    checked={
                                                        textSize === "small"
                                                    }
                                                    pt={{
                                                        box: (option) => {
                                                            return {
                                                                className: `${
                                                                    option
                                                                        ?.props
                                                                        .checked
                                                                        ? "!bg-main"
                                                                        : ""
                                                                } !border-main !w-5 !h-5`,
                                                            };
                                                        },
                                                    }}
                                                ></RadioButton>
                                                {t("small")}
                                            </label>
                                            <label className="flex cursor-pointer gap-1 items-center">
                                                <RadioButton
                                                    onChange={() =>
                                                        setTextSize("medium")
                                                    }
                                                    name="textSize"
                                                    value="medium"
                                                    checked={
                                                        textSize === "medium"
                                                    }
                                                    pt={{
                                                        box: (option) => {
                                                            return {
                                                                className: `${
                                                                    option
                                                                        ?.props
                                                                        .checked
                                                                        ? "!bg-main"
                                                                        : ""
                                                                } !border-main !w-5 !h-5`,
                                                            };
                                                        },
                                                    }}
                                                ></RadioButton>
                                                {t("medium")}
                                            </label>
                                            <label className="flex cursor-pointer gap-1 items-center">
                                                <RadioButton
                                                    onChange={() =>
                                                        setTextSize("large")
                                                    }
                                                    name="textSize"
                                                    value="large"
                                                    checked={
                                                        textSize === "large"
                                                    }
                                                    pt={{
                                                        box: (option) => {
                                                            return {
                                                                className: `${
                                                                    option
                                                                        ?.props
                                                                        .checked
                                                                        ? "!bg-main"
                                                                        : ""
                                                                } !border-main !w-5 !h-5`,
                                                            };
                                                        },
                                                    }}
                                                ></RadioButton>
                                                {t("large")}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </Panel>
                        </BlockUI>

                        {statusText && (
                            <div className="w-full my-8">
                                <ProgressBar
                                    showValue
                                    value={loadingValue}
                                    className="w-full !h-[10px] !rounded-none !text-xs"
                                    pt={{
                                        value: {
                                            className: "!bg-main",
                                        },
                                        container: {
                                            className: "!bg-main-text",
                                        },
                                    }}
                                ></ProgressBar>
                                <div className="pt-4">
                                    <h3 className="text-2xl text-main font-bold">
                                        {t("status")}:
                                    </h3>
                                    <div
                                        className="text-sm ml-4"
                                        style={{
                                            color: statusText.color,
                                        }}
                                    >
                                        {statusText.text}
                                    </div>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <>
                                <ProgressBar
                                    mode="indeterminate"
                                    style={{ height: "6px" }}
                                    className="w-full !mt-4 !rounded-none"
                                    pt={{
                                        value: {
                                            className: `!bg-main`,
                                        },
                                        container: {
                                            className: "!bg-main-text",
                                        },
                                    }}
                                ></ProgressBar>
                                <div className="flex justify-center items-center min-h-[50vh]">
                                    <ProgressSpinner />
                                </div>
                            </>
                        )}
                        {!loading && NewStory && (
                            <>
                                <button
                                    className="bg-main text-lg text-main-text !duration-300 !transition-all cursor-pointer hover:!opacity-70 px-4 py-2"
                                    onClick={() => {
                                        if (storyWithoutInputRef.current) {
                                            html2canvas(
                                                storyWithoutInputRef.current
                                            ).then((canvas) => {
                                                const imgData =
                                                    canvas.toDataURL(
                                                        "image/png"
                                                    );
                                                const imgWidth = 210;
                                                const imgHeight =
                                                    (canvas.height * imgWidth) /
                                                    canvas.width;

                                                const pdf = new jsPDF({
                                                    orientation: "portrait",
                                                    unit: "mm",
                                                    format: [
                                                        imgWidth,
                                                        imgHeight,
                                                    ],
                                                });

                                                pdf.addImage(
                                                    imgData,
                                                    "JPEG",
                                                    0,
                                                    0,
                                                    imgWidth,
                                                    imgHeight
                                                );
                                                pdf.save(
                                                    `${NewStory?.lesson_title}.pdf`
                                                );
                                                showToast(t("PDF Downloaded"), {
                                                    type: "success",
                                                });
                                            });
                                        }
                                    }}
                                >
                                    <i className="pi pi-download" />
                                </button>
                                <div ref={storyWithoutInputRef}>
                                    <Fieldset
                                        legend={NewStory?.lesson_title}
                                        className="!bg-main-bg !mt-8 !p-0 !text-main-text"
                                        style={{
                                            borderColor: `${valuesState?.textColor}20`,
                                            direction: NewStory.dir,
                                        }}
                                        pt={{
                                            content: {
                                                className:
                                                    "!bg-main-bg !text-main-text !p-2",
                                                style: {
                                                    borderColor: `${valuesState?.textColor}20`,
                                                },
                                            },
                                            legend: {
                                                className:
                                                    "!bg-main-bg !text-3xl !text-main !font-bold !ms-4",
                                                style: {
                                                    borderColor: `${valuesState?.textColor}20`,
                                                },
                                            },
                                        }}
                                    >
                                        <div className="md:px-12 mt-4 px-0 sm:px-4">
                                            {NewStory?.texts?.map(
                                                (text, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex items-start mt-10 mb-2 sm:flex-row flex-col`}
                                                    >
                                                        <span className="flex bg-main h-[40px] justify-center p-4 text-2xl text-white w-[40px] font-bold items-center">
                                                            {text.number}
                                                        </span>
                                                        <p className="p-4 shadow-lg text-lg">
                                                            {text.text}
                                                        </p>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </Fieldset>
                                </div>
                            </>
                        )}
                    </TabPanel>
                </TabView>
            </Panel>
        </>
    );
}
