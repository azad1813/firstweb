import React, { useState, useEffect } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ImageGenerator from './components/ImageGenerator';
import ImageEditor from './components/ImageEditor';
import Login from './components/Login';
import { MenuIcon } from './components/icons';

const App: React.FC = () => {
    const [currentView, setCurrentView] = useState<View>(View.CHAT);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setCurrentView(View.CHAT);
    };

    if (!isAuthenticated) {
        return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    const renderView = () => {
        switch (currentView) {
            case View.CHAT:
                return <ChatWindow 
                            chatKey="chat"
                            welcomeMessage="हर हर महादेव! I am Trinetra, your AI assistant. How may I help you today?"
                            systemInstruction="You are a helpful and friendly AI assistant named Trinetra. Your tone should be respectful and wise."
                            placeholder="Ask Trinetra anything..."
                        />;
            case View.VIBECODING:
                return <ChatWindow 
                            chatKey="vibecoding"
                            welcomeMessage="Welcome to Vibecoding. I am your specialized coding assistant. Let's build something amazing."
                            systemInstruction="You are an expert programmer named Vibecoder. Provide clean, efficient, and well-explained code. Always format code in markdown blocks."
                            placeholder="Describe the code you need..."
                        />;
            case View.IMAGE_GEN:
                return <ImageGenerator />;
            case View.IMAGE_EDIT:
                return <ImageEditor />;
            default:
                return <ChatWindow chatKey="chat" welcomeMessage="Har Har Mahadev!" systemInstruction="You are a helpful AI assistant." placeholder="Ask anything..."/>;
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-gray-100 font-sans">
            <Sidebar
                currentView={currentView}
                setCurrentView={setCurrentView}
                onLogout={handleLogout}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
            />
            <main className="flex-1 flex flex-col overflow-hidden">
                 <div className="md:hidden flex items-center p-4 border-b border-[#B5D6D6]/20">
                    <button onClick={() => setIsMenuOpen(true)} className="text-gray-300 hover:text-[#FF7477] transition-colors">
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <h1 className="text-xl font-bold ml-4">Trinetra Ai</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {renderView()}
                </div>
            </main>
        </div>
    );
};

export default App;