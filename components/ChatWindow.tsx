import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, FileData } from '../types';
import { startChat, sendMessageToChat, fileToGenerativePart } from '../services/geminiService';
import { SendIcon, PaperclipIcon, XIcon, TrinetraIcon } from './icons';
import Spinner from './Spinner';


interface ChatWindowProps {
    welcomeMessage: string;
    systemInstruction: string;
    placeholder: string;
    chatKey: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ welcomeMessage, systemInstruction, placeholder, chatKey }) => {
    const [chat, setChat] = useState(() => startChat(chatKey, systemInstruction));
    const [messages, setMessages] = useState<ChatMessage[]>([{ sender: 'model', text: welcomeMessage }]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attachedFile, setAttachedFile] = useState<FileData | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);
    
    useEffect(() => {
      setChat(startChat(chatKey, systemInstruction));
      setMessages([{ sender: 'model', text: welcomeMessage }]);
    }, [chatKey, systemInstruction, welcomeMessage]);
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [input]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileData = await fileToGenerativePart(file);
            setAttachedFile(fileData);
            if(file.type.startsWith('image/')) {
                setFilePreview(URL.createObjectURL(file));
            } else {
                setFilePreview(null);
            }
        }
    };

    const handleSend = async () => {
        if ((!input.trim() && !attachedFile) || isLoading) return;
        
        const userMessageText = input;
        const userAttachedFile = attachedFile;

        const userMessage: ChatMessage = { sender: 'user', text: userMessageText };
        if (filePreview) {
            userMessage.image = filePreview;
        }
        setMessages(prev => [...prev, userMessage]);

        setInput('');
        setAttachedFile(null);
        setFilePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        setIsLoading(true);

        try {
            const responseText = await sendMessageToChat(chat, userMessageText, userAttachedFile);
            setMessages(prev => [...prev, { sender: 'model', text: responseText }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { sender: 'model', text: 'Sorry, I encountered an error.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto animate-fadeInUp">
            <div className="flex-1 overflow-y-auto pr-4 space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.sender === 'user' ? 'justify-end' : ''} animate-fadeInUp`}>
                        {msg.sender === 'model' && (
                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                                <TrinetraIcon className="w-6 h-6 text-[#9CF6F6]" />
                            </div>
                        )}
                        <div className={`max-w-lg p-4 rounded-2xl ${msg.sender === 'user' ? 'chat-bubble-user text-white rounded-br-none' : 'bg-slate-700 rounded-bl-none'}`}>
                            {msg.image && <img src={msg.image} alt="attachment" className="mb-2 rounded-lg max-h-60" />}
                            <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4 animate-fadeInUp">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                           <TrinetraIcon className="w-6 h-6 text-[#9CF6F6]" />
                        </div>
                        <div className="max-w-lg p-4 rounded-2xl bg-slate-700 rounded-bl-none">
                            <Spinner />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="mt-auto pt-4">
                 {attachedFile && (
                    <div className="p-2 mb-2 bg-slate-700 rounded-lg flex items-center justify-between animate-fadeInUp">
                        <div className="flex items-center gap-2">
                             {filePreview && <img src={filePreview} alt="preview" className="w-10 h-10 object-cover rounded" />}
                             <span className="text-sm text-gray-300">{attachedFile.name}</span>
                        </div>
                        <button onClick={() => { setAttachedFile(null); setFilePreview(null); }} className="p-1 rounded-full hover:bg-slate-600">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
                <div className="flex items-center p-2 bg-slate-800 rounded-xl border border-[#B5D6D6]/20 focus-within:border-[#FF7477] focus-within:ring-2 focus-within:ring-[#FF7477]/30 transition-all duration-300">
                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-[#9CF6F6]">
                        <PaperclipIcon className="w-6 h-6" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={placeholder}
                        rows={1}
                        className="flex-1 bg-transparent px-4 resize-none focus:outline-none text-gray-100 placeholder-gray-500"
                    />
                    <button onClick={handleSend} disabled={isLoading || (!input.trim() && !attachedFile)} className="p-2 text-gray-400 hover:text-[#FF7477] disabled:text-gray-600 disabled:cursor-not-allowed">
                        <SendIcon className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;