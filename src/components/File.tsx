import { JSX, useRef, useState } from "react";
import { FileUpload, FileUploadSelectEvent } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";

interface FileProps {
    set: (file: File | null) => void;
}

export default function File({ set }: FileProps) {
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);
    const { showToast } = useToast();
    const { t } = useTranslation();

    const onTemplateSelect = (event: FileUploadSelectEvent) => {
        set(null);
        const file = event.files?.[0];
        if (file) {
            setTotalSize(file.size || 0);
            console.log(file);
            set(file);
            showToast("File Uploaded", {
                type: "info",
            });
        }
    };

    const onTemplateRemove = (event: React.SyntheticEvent) => {
        setTotalSize(0);
        if (event && typeof event.preventDefault === "function") {
            event.preventDefault();
        }
        set(null);
    };

    const onTemplateClear = () => {
        setTotalSize(0);
        set(null);
    };

    const headerTemplate = (options: {
        className: string;
        chooseButton: JSX.Element;
        cancelButton: JSX.Element;
    }) => {
        const { className, chooseButton, cancelButton } = options;
        const value = totalSize / 20000;
        const formatedValue =
            fileUploadRef && fileUploadRef.current
                ? fileUploadRef.current.formatSize(totalSize)
                : "0 B";

        return (
            <div
                className={
                    className + " !bg-main-bg !text-main-text !border-main"
                }
                style={{
                    backgroundColor: "transparent",
                    display: "flex",
                    alignItems: "center",
                    direction: "ltr",
                }}
            >
                {chooseButton}
                {cancelButton}
                <div className="flex text-main-text gap-3 items-center ml-auto">
                    <span>{formatedValue} / 1 MB</span>
                    <ProgressBar
                        value={value}
                        showValue={false}
                        style={{ width: "10rem", height: "12px" }}
                        color="var(--color-main)"
                    ></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        file: any,
        options: {
            formatSize: string;
            onRemove: (event: React.SyntheticEvent) => void;
        }
    ) => {
        // const { name } = file;
        return (
            <div className="flex flex-col items-center">
                <div className="flex w-full items-center">
                    <span className="flex flex-col text-left ml-3">
                        {file.name}
                        <small>{new Date().toDateString()}</small>
                    </span>
                </div>
                <div className="flex justify-center w-full gap-4 items-center mt-2">
                    <Tag
                        value={options.formatSize}
                        severity="warning"
                        className="px-3 py-2"
                    />
                    <Button
                        type="button"
                        onClick={(event) => {
                            options.onRemove(event);
                            onTemplateRemove(event);
                        }}
                        className="flex h-10 justify-center p-button-danger p-button-rounded w-10 items-center"
                    >
                        <i className="pi pi-times"></i>
                    </Button>
                </div>
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex flex-column gap-4 items-center">
                <i
                    className="p-5 mt-3 pi pi-file-pdf"
                    style={{
                        fontSize: "2em",
                        borderRadius: "50%",
                        backgroundColor: "var(--color-main)",
                        color: "var(--surface-d)",
                    }}
                ></i>
                <span
                    style={{
                        fontSize: "1.2em",
                        color: "var(--text-color-secondary)",
                    }}
                    className="my-5"
                >
                    {t("Drag and Drop PDF Here")}
                </span>
            </div>
        );
    };

    const chooseOptions = {
        icon: "pi pi-fw pi-file-pdf",
        iconOnly: true,
        className: "custom-choose-btn p-button-rounded p-button-outlined",
    };

    const cancelOptions = {
        icon: "pi pi-fw pi-times",
        iconOnly: true,
        className:
            "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
    };

    return (
        <div className="w-full">
            <Tooltip
                target=".custom-choose-btn"
                content={t("Choose")}
                position="bottom"
            />

            <Tooltip
                target=".custom-cancel-btn"
                content={t("Clear")}
                position="bottom"
            />

            <FileUpload
                pt={{
                    content: {
                        className: "!bg-main-bg !text-main-text !border-main",
                    },
                }}
                ref={fileUploadRef}
                name="demo[]"
                // url="/api/upload"
                accept=".pdf"
                maxFileSize={2000000}
                // maxFiles={1}
                onSelect={onTemplateSelect}
                onError={onTemplateClear}
                onClear={onTemplateClear}
                headerTemplate={headerTemplate}
                itemTemplate={itemTemplate}
                emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions}
                cancelOptions={cancelOptions}
            />
        </div>
    );
}
