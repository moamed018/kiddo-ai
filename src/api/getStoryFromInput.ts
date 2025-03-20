import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: import.meta.env.VITE_GROQ_API_KEY,
    dangerouslyAllowBrowser: true,
});

interface IMain {
    input?: string;
    lang?: string;
    size?: "small" | "medium" | "large";
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

    const chatCompletion = await groq.chat.completions.create({
        messages: [
            // Your answer should be structured as follows json_object:
            {
                role: "system",
                content: `
                You are a smart assistant for children.
                Your task is to create a story based on the child's input.
            
                Your response **must** be a **valid** JSON object with the following structure:
            
                {
                    "scenes": [ 
                        {
                            "scene_number": number,
                            "scene_text": string (at least 5 meaningful sentences),
                        }
                    ],
                    "can_generate_images": boolean (if scene_text is enough to generate image),
                    "lang": "ar",
                    "dir": "rtl",
                    "story_title": string
                }
            
                **Rules for generation:**
                1. The story must be written in **pure ${language}** (avoid mixed languages or symbols).
                2. The "scene_text" field must contain at least **5 meaningful and connected sentences**.
                3. Avoid special characters like (\\, \\n, \\, “, ”).
                4. **Do not use escape characters.** Ensure the response is a valid JSON object.
                5. Generate exactly **${numOfScenes} scenes**.
                `,
            },
            {
                role: "user",
                content: obj?.input,
            },
        ],
        model: import.meta.env.VITE_GROQ_API_MODEL,
        temperature: 1,
        max_completion_tokens: 2000,
        top_p: 1,
        stream: false,
        response_format: {
            type: "json_object",
        },
        stop: null,
    });

    return chatCompletion.choices[0].message.content;
};

export default main;

/*

 `
                You are a smart assistant for children.
                Your task is to create a story based on the child's input, 
                Ensure the response is a well-formatted, valid JSON object with proper syntax.
                Do not include escape characters like \\n, \\t.
                Make sure boolean values are not enclosed in quotes.
                    {
                        "scenes": [
                            {
                                "scene_number": 1,
                                "scene": "sentence1 sentence2 sentence3 sentence4 sentence5",
                                "scene_description": "description"
                            }
                        ],
                        "can_images": true,
                        "lang": "ar",
                        "dir": "rtl",
                        "story_title": "Title For The Story"
                    }
                    
                    Make your response (scenes array) has 10 object.
                    Make Your response in Arabic language.
                    Make Sure scene is a string with more than 5 sentences.
                    Make Sure scene_description is a string describing the scene.
                    Don't Add any escape characters in the response.
                    Make Sure Your response is a valid json object.
                    `,

*/

/*
{
                role: "system",
                content:
                    'You are a smart assistant for children. Detect the language of the prompt and respond in the same language then Your task is to create a story based on the child\'s input, ensuring that the response language matches the child\'s input language. Your answer should be structured as follows json:\n{\n    "scenes": [\n        {\n            "scene_number": number,\n            "scene": "A string with more than 5 sentences",\n            "scene_description": "A string describing the scene"\n        },\n        ...\n    ],\n    "can_images": Boolean,\n    "lang": string,\n    "dir": string,\n}\n\nMake your response detailed and comprehensive and has 10 object.\n\n\n\n\n\n\n\n',
            },
*/

/*
                content: `
                You are a smart assistant for children.
                Your task is to create a story based on the child's input.
            
                Your response **must** be a **valid** JSON object with the following structure:
            
                {
                    "scenes": [ 
                        {
                            "scene_number": number,
                            "scene": string (at least 5 meaningful sentences),
                            "scene_description": string (a simple descriptive sentence for generate image)
                        }
                    ],
                    "can_generate_images": boolean,
                    "lang": "ar",
                    "dir": "rtl",
                    "story_title": string
                }
            
                **Rules for generation:**
                1. The story must be written in **pure Arabic** (avoid mixed languages or symbols).
                2. The "scene" field must contain at least **5 meaningful and connected sentences**.
                3. Avoid special characters like (\\, \\n, \\, “, ”).
                4. **Do not use escape characters.** Ensure the response is a valid JSON object.
                5. Generate exactly **10 scenes**.
                6. Keep the "scene_description" short and relevant.
                `,
            },
*/
