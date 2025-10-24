import React from 'react';
import { TrinetraIcon, GoogleIcon } from './icons';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-gray-100 p-4">
            <div className="w-full max-w-md mx-auto text-center p-8 md:p-12 bg-slate-800/50 backdrop-blur-lg rounded-2xl border border-[#B5D6D6]/20 shadow-2xl shadow-black/20 animate-fadeInUp">
                <TrinetraIcon style={{ animationDelay: '100ms' }} className="h-20 w-20 mx-auto mb-4 text-[#FF7477] animate-fadeInUp" />
                <h1 style={{ animationDelay: '200ms' }} className="text-4xl md:text-5xl font-bold animate-fadeInUp">Trinetra <span className="text-[#FF7477]">Ai</span></h1>
                <p style={{ animationDelay: '300ms' }} className="mt-4 text-lg text-gray-400 animate-fadeInUp">Your All-in-One Creative Assistant</p>
                
                <button 
                    style={{ animationDelay: '400ms' }}
                    onClick={onLoginSuccess}
                    className="mt-8 w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-200 text-slate-800 font-semibold rounded-lg hover:bg-white transition-transform transform hover:scale-105 animate-fadeInUp"
                >
                    <GoogleIcon className="h-6 w-6" />
                    <span>Sign in with Google</span>
                </button>
            </div>
             <footer className="absolute bottom-6 text-center text-sm text-gray-500">
                <p>Made with ❤️ by azad_18</p>
            </footer>
        </div>
    );
};

export default Login;