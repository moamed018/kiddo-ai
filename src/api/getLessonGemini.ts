import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

interface IMain {
    input?: string;
    file?: File | null;
    lang?: string;
    size?: "small" | "medium" | "large";
    withPDF?: boolean;
}

const main = async (
    obj?: Partial<IMain>
): Promise<string | null | undefined> => {
    if (obj?.withPDF === false && !obj?.input) return;
    if (obj?.withPDF === true && !obj?.file) return;

    const language = obj?.lang === "ar" ? "Arabic" : "English";
    const numOfScenes =
        obj?.size === "large" ? 10 : obj?.size === "medium" ? 5 : 3;

    const sys = obj?.withPDF
        ? ` 
        You are a smart assistant for children.
        Your task is to create an explain lesson based on pdf file.
        split the lesson into ${numOfScenes} object.
        Your response **must** be a **valid** JSON object with the following structure:
        {
            "texts": [
                {
                    "number": number,
                    "text": string (at least 7 meaningful sentences),
                }
            ],
            "lang": "${language} code like ar or en",
            "dir": "${language} dir code like rtl or ltr",
            "lesson_title": string
        }
        **Rules for generation:**
        1. The story must be written in **pure ${language}** (avoid mixed languages or symbols).
        2. The "text" field must contain at least **7 meaningful and connected sentences**.
        3. Avoid special characters like (\\\\, \\\\n, \\\\, “, ”).
        4. **Do not use escape characters.** Ensure the response is a valid JSON object.
        5. Generate exactly **${numOfScenes} object**.`
        : ` 
        You are a smart assistant for children.
        Your task is to create an explain lesson based on the child\\'s input.
        split the lesson into ${numOfScenes} scenes.
        Your response **must** be a **valid** JSON object with the following structure:
        {
            "texts": [
                {
                    "number": number,
                    "text": string (at least 7 meaningful sentences),
                }
            ],
            "lang": "${language} code like ar or en",
            "dir": "${language} dir code like rtl or ltr",
            "lesson_title": string
        }
        **Rules for generation:**
        1. The story must be written in **pure ${language}** (avoid mixed languages or symbols).
        2. The "scene_text" field must contain at least **7 meaningful and connected sentences**.
        3. Avoid special characters like (\\\\, \\\\n, \\\\, “, ”).
        4. **Do not use escape characters.** Ensure the response is a valid JSON object.
        5. Generate exactly **${numOfScenes} scenes**.`;

    if (obj?.withPDF && obj?.file) {
        const result = await getFromPDF(sys, obj?.file);
        console.log(result);
        return result;
    } else {
        const result = await getWithoutImages(sys, obj?.input || "");
        console.log(result);
        return result?.response.text();
    }
};

const getWithoutImages = (sys: string, input: string) => {
    if (!input) return;
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: sys,
    });
    return model.generateContent({
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: input,
                    },
                ],
            },
        ],
        generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    texts: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                number: {
                                    type: SchemaType.NUMBER,
                                },
                                text: {
                                    type: SchemaType.STRING,
                                },
                            },
                            required: ["number", "text"],
                        },
                    },

                    dir: {
                        type: SchemaType.STRING,
                    },
                    lang: {
                        type: SchemaType.STRING,
                    },
                    lesson_title: {
                        type: SchemaType.STRING,
                    },
                },
                required: ["texts", "dir", "lang", "lesson_title"],
            },
        },
    });
};

const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64String = (reader.result as string).split(",")[1];
            resolve(base64String);
        };
        reader.onerror = reject;
    });
};

const getFromPDF = async (sys: string, file: File) => {
    if (!file) return;

    const model = genAI.getGenerativeModel({
        model: "models/gemini-1.5-flash",
        systemInstruction: sys,
    });

    const base64String = await readFileAsBase64(file);

    const result = await model.generateContent({
        contents: [
            {
                role: "user",
                parts: [
                    {
                        inlineData: {
                            data: base64String,
                            mimeType: "application/pdf",
                        },
                    },
                    { text: "explain lesson based on this document" },
                ],
            },
        ],
        generationConfig: {
            temperature: 1,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.OBJECT,
                properties: {
                    texts: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                number: {
                                    type: SchemaType.NUMBER,
                                },
                                text: {
                                    type: SchemaType.STRING,
                                },
                            },
                            required: ["number", "text"],
                        },
                    },

                    dir: {
                        type: SchemaType.STRING,
                    },
                    lang: {
                        type: SchemaType.STRING,
                    },
                    lesson_title: {
                        type: SchemaType.STRING,
                    },
                },
                required: ["texts", "dir", "lang", "lesson_title"],
            },
        },
    });
    return result.response.text();
};

export default main;

/*
[
            {
                inlineData: {
                    data: base64String,
                    mimeType: "application/pdf",
                },
            },
            "explain lesson based on this document",
        ],
*/
