import React from 'react';
import { View } from '../types';
import { ChatIcon, CodeIcon, ImageIcon, EditIcon, TrinetraIcon, UserIcon, LogoutIcon, XIcon } from './icons';

interface SidebarProps {
    currentView: View;
    setCurrentView: (view: View) => void;
    onLogout: () => void;
    isMenuOpen: boolean;
    setIsMenuOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, onLogout, isMenuOpen, setIsMenuOpen }) => {
    
    const navItems = [
        { view: View.CHAT, label: 'Chat', icon: ChatIcon },
        { view: View.VIBECODING, label: 'Vibecoding', icon: CodeIcon },
        { view: View.IMAGE_GEN, label: 'Image Generation', icon: ImageIcon },
        { view: View.IMAGE_EDIT, label: 'Image Edit', icon: EditIcon },
    ];

    const NavLink = ({ item }: { item: typeof navItems[0] }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setCurrentView(item.view);
                setIsMenuOpen(false);
            }}
            className={`flex items-center px-4 py-3 text-lg rounded-lg transition-all duration-200 group ${
                currentView === item.view
                    ? 'bg-[#FF7477]/20 text-[#FF7477] font-semibold'
                    : 'text-gray-300 hover:bg-[#E69597]/20 hover:text-white'
            }`}
        >
            <item.icon className="h-6 w-6 mr-4 transition-transform duration-200 group-hover:scale-110" />
            <span>{item.label}</span>
        </a>
    );

    return (
        <>
            {/* Overlay for mobile */}
            <div className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}></div>

            <nav className={`fixed md:relative inset-y-0 left-0 z-50 flex flex-col w-72 bg-slate-800/50 backdrop-blur-lg border-r border-[#B5D6D6]/20 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="flex items-center justify-between p-6 border-b border-[#B5D6D6]/20">
                    <div className="flex items-center">
                        <TrinetraIcon className="h-8 w-8 text-[#FF7477]" />
                        <span className="text-2xl font-bold ml-2">Trinetra <span className="text-[#FF7477]">Ai</span></span>
                    </div>
                    <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsMenuOpen(false)}>
                        <XIcon className="w-6 h-6"/>
                    </button>
                </div>

                <div className="flex-1 p-4 space-y-2">
                    {navItems.map(item => <NavLink key={item.view} item={item} />)}
                </div>

                <div className="p-4 border-t border-[#B5D6D6]/20">
                    <div className="flex items-center p-3 mb-4 rounded-lg bg-slate-700/50">
                        <UserIcon className="h-8 w-8 text-gray-400" />
                        <div className="ml-3">
                            <p className="font-semibold">User</p>
                            <p className="text-sm text-gray-400">Welcome back!</p>
                        </div>
                    </div>
                    <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); onLogout(); }}
                        className="flex items-center w-full px-4 py-3 text-lg text-gray-300 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
                    >
                        <LogoutIcon className="h-6 w-6 mr-4" />
                        <span>Logout</span>
                    </a>
                     <footer className="mt-4 text-center text-xs text-gray-500">
                        <p>Made with ❤️ by azad_18</p>
                    </footer>
                </div>
            </nav>
        </>
    );
};

export default Sidebar;