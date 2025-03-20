import "@google/generative-ai";

declare module "@google/generative-ai" {
    interface GenerationConfig {
        responseModalities?: Array<"Text" | "Image">;
    }
}
