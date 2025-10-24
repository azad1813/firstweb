import { GoogleGenAI, Chat, GenerateContentResponse, Modality } from "@google/genai";
import { FileData } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const chats: { [key: string]: Chat } = {};

export const startChat = (key: string, systemInstruction: string): Chat => {
    if (!chats[key]) {
        chats[key] = ai.chats.create({
            model: 'gemini-2.5-pro',
            config: {
                systemInstruction: systemInstruction,
            },
        });
    }
    return chats[key];
};

export const sendMessageToChat = async (chat: Chat, message: string, file?: FileData): Promise<string> => {
    try {
        let content;
        if (file) {
            content = {
                parts: [
                    { text: message },
                    { inlineData: { mimeType: file.mimeType, data: file.base64 } }
                ]
            };
        } else {
            content = { message };
        }
        
        const response: GenerateContentResponse = await chat.sendMessage(content);
        return response.text;
    } catch (error) {
        console.error("Error sending message:", error);
        return "An error occurred. Please check the console for details.";
    }
};

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
                aspectRatio: '1:1',
            },
        });
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/png;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error("Error generating image:", error);
        return "";
    }
};

export const editImage = async (prompt: string, file: FileData): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: file.base64, mimeType: file.mimeType } },
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        return "";
    } catch (error) {
        console.error("Error editing image:", error);
        return "";
    }
};

export const fileToGenerativePart = (file: File): Promise<FileData> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(',')[1];
            resolve({
                base64,
                mimeType: file.type,
                name: file.name
            });
        };
        reader.onerror = error => reject(error);
    });
};