import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

interface IMain {
    input?: string;
    lang?: string;
    size?: "small" | "medium" | "large";
    withImages?: boolean;
}

const main = async (
    obj?: Partial<IMain>
): Promise<string | null | undefined> => {
    if (!obj?.input) return;
    if (!obj?.lang) {
        obj.lang = "en";
    }
    if (!obj?.size) {
        obj.size = "small";
    }

    const language = obj.lang === "ar" ? "Arabic" : "English";
    const numOfScenes =
        obj.size === "large" ? 10 : obj.size === "medium" ? 5 : 3;

    // Generate one cartoon image for each scene based on the scene.

    const sys = obj.withImages
        ? ` 
        You are a smart assistant for children.
        Your task is to create a story based on the child\\'s input.
        Your response **must** be a **valid** JSON object with the following structure:
        {
            "scenes": [
                {
                    "scene_number": number,
                    "scene_text": string (at least 7 meaningful sentences),
                    "scene_description": string for image
                }
            ],
            "can_generate_images": boolean (if scene_text is enough to generate image),
            "lang": "ar",
            "dir": "rtl",
            "story_title": string
        }
        **Rules for generation:**
        1. The story must be written in **pure ${language}** (avoid mixed languages or symbols).
        2. The "scene_text" field must contain at least **7 meaningful and connected sentences**.
        3. Avoid special characters like (\\\\, \\\\n, \\\\, “, ”).
        4. **Do not use escape characters.** Ensure the response is a valid JSON object.
        5. Generate exactly **${numOfScenes} scenes**.`
        : ` 
        You are a smart assistant for children.
        Your task is to create a story based on the child\\'s input.
        Your response **must** be a **valid** JSON object with the following structure:
        {
            "scenes": [
                {
                    "scene_number": number,
                    "scene_text": string (at least 7 meaningful sentences),
                }
            ],
            "lang": "ar",
            "dir": "rtl",
            "story_title": string
        }
        **Rules for generation:**
        1. The story must be written in **pure ${language}** (avoid mixed languages or symbols).
        2. The "scene_text" field must contain at least **7 meaningful and connected sentences**.
        3. Avoid special characters like (\\\\, \\\\n, \\\\, “, ”).
        4. **Do not use escape characters.** Ensure the response is a valid JSON object.
        5. Generate exactly **${numOfScenes} scenes**.`;

    if (obj.withImages) {
        const result = await getWithImages(sys, obj.input);
        console.log(result);
        return result.response.text();
    } else {
        const result = await getWithoutImages(sys, obj.input);
        console.log(result);
        return result.response.text();
    }
};

export const withoutInput = async (
    obj?: Partial<IMain>
): Promise<string | null | undefined> => {
    const language = obj?.lang === "ar" ? "Arabic" : "English";
    const numOfScenes =
        obj?.size === "large" ? 10 : obj?.size === "medium" ? 5 : 3;

    // Generate one cartoon image for each scene based on the scene.

    const sys = obj?.withImages
        ? ` 
        You are a smart assistant for children.
        Your task is to create a story based on Your Suggestion in ${language} language except scene_description.
        Your response **must** be a **valid** JSON object with the following structure:
        {
            "scenes": [
                {
                    "scene_number": number,
                    "scene_text": string (at least 7 meaningful sentences),
                    "scene_description": string for image (Always make the scene_description in English)
                }
            ],
            "can_generate_images": boolean (if scene_text is enough to generate image),
            "lang": "${language} code like ar or en",
            "dir": "${language} dir code like rtl or ltr",
            "story_title": string
        }
        **Rules for generation:**
        1. The story must be written in **pure ${language}** except scene_description (avoid mixed languages or symbols).
        2. The "scene_text" field must contain at least **7 meaningful and connected sentences**.
        3. Avoid special characters like (\\\\, \\\\n, \\\\, “, ”).
        4. **Do not use escape characters.** Ensure the response is a valid JSON object.
        5. Generate exactly **${numOfScenes} scenes**.`
        : ` 
        You are a smart assistant for children.
        Your task is to create a story based on Your Suggestion in ${language} language.
        Your response **must** be a **valid** JSON object with the following structure:
        {
            "scenes": [
                {
                    "scene_number": number,
                    "scene_text": string (at least 7 meaningful sentences),
                }
            ],
            "lang": "${language} code like ar or en",
            "dir": "${language} dir code like rtl or ltr",
            "story_title": string
        }
        **Rules for generation:**
        1. The story must be written in **pure ${language}** (avoid mixed languages or symbols).
        2. The "scene_text" field must contain at least **7 meaningful and connected sentences**.
        3. Avoid special characters like (\\\\, \\\\n, \\\\, “, ”).
        4. **Do not use escape characters.** Ensure the response is a valid JSON object.
        5. Generate exactly **${numOfScenes} scenes**.`;

    if (obj?.withImages) {
        const result = await getWithImages(sys, "");
        console.log(result);
        return result.response.text();
    } else {
        const result = await getWithoutImages(sys, "");
        console.log(result);
        return result.response.text();
    }
};

const getWithImages = (sys: string, input: string) => {
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
                    scenes: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                scene_number: {
                                    type: SchemaType.NUMBER,
                                },
                                scene_text: {
                                    type: SchemaType.STRING,
                                },
                                scene_description: {
                                    type: SchemaType.STRING,
                                },
                            },
                            required: [
                                "scene_number",
                                "scene_text",
                                "scene_description",
                            ],
                        },
                    },
                    can_generate_images: {
                        type: SchemaType.BOOLEAN,
                    },
                    dir: {
                        type: SchemaType.STRING,
                    },
                    lang: {
                        type: SchemaType.STRING,
                    },
                    story_title: {
                        type: SchemaType.STRING,
                    },
                },
                required: [
                    "scenes",
                    "can_generate_images",
                    "dir",
                    "lang",
                    "story_title",
                ],
            },
        },
    });
};

const getWithoutImages = (sys: string, input: string) => {
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
                    scenes: {
                        type: SchemaType.ARRAY,
                        items: {
                            type: SchemaType.OBJECT,
                            properties: {
                                scene_number: {
                                    type: SchemaType.NUMBER,
                                },
                                scene_text: {
                                    type: SchemaType.STRING,
                                },
                            },
                            required: ["scene_number", "scene_text"],
                        },
                    },

                    dir: {
                        type: SchemaType.STRING,
                    },
                    lang: {
                        type: SchemaType.STRING,
                    },
                    story_title: {
                        type: SchemaType.STRING,
                    },
                },
                required: ["scenes", "dir", "lang", "story_title"],
            },
        },
    });
};

export default main;

/*
// const generationConfig = {
    //     temperature: 1,
    //     topP: 0.95,
    //     topK: 40,
    //     maxOutputTokens: 8192,
    //     responseMimeType: "application/json",
    //     responseSchema: {
    //         type: "object",
    //         properties: {
    //             scenes: {
    //                 type: "array",
    //                 items: {
    //                     type: "object",
    //                     properties: {
    //                         scene_number: {
    //                             type: "number",
    //                         },
    //                         scene_text: {
    //                             type: "string",
    //                         },
    //                         scene_description: {
    //                             type: "string",
    //                         },
    //                     },
    //                     required: [
    //                         "scene_number",
    //                         "scene_text",
    //                         "scene_description",
    //                     ],
    //                 },
    //             },
    //             can_generate_images: {
    //                 type: "boolean",
    //             },
    //             dir: {
    //                 type: "string",
    //             },
    //             lang: {
    //                 type: "string",
    //             },
    //             story_title: {
    //                 type: "string",
    //             },
    //         },
    //         required: ["can_generate_images", "dir", "lang", "story_title"],
    //     },
    // };

 // async function run() {
    //     const chatSession = model.startChat({
    //         generationConfig,
    //         history: [],
    //     });

    //     const result = await chatSession.sendMessage("cats");
    //     console.log(result.response.text());
    // }
    // run();
*/
