
export enum View {
    CHAT = 'CHAT',
    VIBECODING = 'VIBECODING',
    IMAGE_GEN = 'IMAGE_GEN',
    IMAGE_EDIT = 'IMAGE_EDIT',
}

export interface ChatMessage {
    sender: 'user' | 'model';
    text: string;
    image?: string;
}

export interface FileData {
    base64: string;
    mimeType: string;
    name: string;
}
