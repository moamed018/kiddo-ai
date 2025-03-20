import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

async function generateImage(description?: string) {
    if (!description) return;

    const contents = "A 3D cartoon rendered image of a " + description;

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
            responseModalities: ["Text", "Image"],
        },
    });

    try {
        const response = await model.generateContent(contents);
        if (
            response?.response?.candidates &&
            response.response.candidates[0]?.content.parts[0].inlineData?.data
        ) {
            return response.response.candidates[0]?.content.parts[0].inlineData;
        }
    } catch (error) {
        console.error("Error generating content:", error);
    }
}

export default generateImage;

/*

// for (const part of response?.response?.candidates[0].content.parts) {
        //     // Based on the part type, either show the text or save the image
        //     if (part.text) {
        //         console.log(part.text);
        //     } else if (part.inlineData) {
        //         const imageData = part.inlineData.data;
        //         const buffer = Buffer.from(imageData, "base64");
        //         fs.writeFileSync("gemini-native-image.png", buffer);
        //         console.log("Image saved as gemini-native-image.png");
        //     }
        // }

*/

/*

// import { GoogleGenerativeAI } from "@google/generative-ai";

// // const { GoogleAIFileManager } = require("@google/generative-ai/server");

// const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);
// // const fileManager = new GoogleAIFileManager(apiKey);

// /**
//  * Uploads the given file to Gemini.
//  *
//  * See https://ai.google.dev/gemini-api/docs/prompting_with_media
//  /
// // async function uploadToGemini(path, mimeType) {
// //     const uploadResult = await fileManager.uploadFile(path, {
// //         mimeType,
// //         displayName: path,
// //     });
// //     const file = uploadResult.file;
// //     console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
// //     return file;
// // }

// const model = genAI.getGenerativeModel({
//     model: "gemini-2.0-flash-exp-image-generation",
//     systemInstruction: "A 3D cartoon rendered image of a user input",
// });

// const generationConfig = {
//     temperature: 1,
//     topP: 0.95,
//     topK: 40,
//     maxOutputTokens: 8192,
//     responseMimeType: "text/plain",
// };

// async function run() {
//     const chatSession = model.startChat({
//         generationConfig,
//     });

//     const result = await chatSession.sendMessage(
//         "A wide, bright 3D cartoon landscape of Greenland. Rolling white hills covered in snow glitter under a bright blue sky. In the foreground, a small, colorful village sits nestled by a fjord. Igloos with brightly colored doors are dotted around. A small wooden sign says 'Welcome to Iglouville!'"
//     );
//     console.log(result.response.text());
// }

// export default run;

*/
