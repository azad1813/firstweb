import React, { useState, useRef } from 'react';
import { editImage, fileToGenerativePart } from '../services/geminiService';
import { FileData } from '../types';
import { EditIcon, UploadIcon } from './icons';
import Spinner from './Spinner';

const ImageEditor: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [originalImage, setOriginalImage] = useState<FileData | null>(null);
    const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileData = await fileToGenerativePart(file);
            setOriginalImage(fileData);
            setOriginalImageUrl(URL.createObjectURL(file));
            setEditedImageUrl(null);
            setError(null);
        }
    };

    const handleEdit = async () => {
        if (!originalImage) {
            setError('Please upload an image first.');
            return;
        }
        if (!prompt.trim()) {
            setError('Please provide an editing instruction.');
            return;
        }
        setIsLoading(true);
        setError(null);
        
        try {
            const url = await editImage(prompt, originalImage);
            if(url) {
                setEditedImageUrl(url);
            } else {
                setError('Failed to edit image. Please try a different prompt.');
            }
        } catch (err) {
             setError('An error occurred while editing the image.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="max-w-6xl mx-auto animate-fadeInUp">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">Image Editor</h1>
                <p className="mt-2 text-lg text-gray-400">Modify your images with descriptive prompts. Upload a picture and start creating.</p>
            </div>
            
            <div className="p-4 bg-slate-800/50 rounded-xl border border-[#B5D6D6]/20 mb-8 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 bg-[#9CF6F6] text-slate-900 font-semibold px-6 py-3 rounded-lg transition-transform transform hover:scale-105">
                        <UploadIcon className="h-5 w-5" />
                        <span>{originalImage ? 'Change Image' : 'Upload Image'}</span>
                    </button>
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEdit()}
                        placeholder="e.g., Make it look like a watercolor painting"
                        className="md:col-span-2 flex-grow bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E69597] transition-all"
                    />
                </div>
                 <div className="mt-4">
                     <button onClick={handleEdit} disabled={isLoading || !originalImage || !prompt.trim()} className="btn-primary w-full text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105">
                       {isLoading ? <Spinner /> : 'Edit Image'}
                    </button>
                 </div>
            </div>
            
            {error && <p className="text-center text-red-400 mb-4">{error}</p>}

            <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">Original</h3>
                    <div className="w-full aspect-square bg-slate-800/50 rounded-xl border-2 border-dashed border-[#B5D6D6]/20 flex items-center justify-center relative overflow-hidden cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {originalImageUrl ? (
                            <img src={originalImageUrl} alt="Original" className="object-contain w-full h-full" />
                        ) : (
                            <div className="text-center text-gray-500">
                                <UploadIcon className="mx-auto h-16 w-16" />
                                <p className="mt-4">Click to upload an image</p>
                            </div>
                        )}
                    </div>
                </div>
                 <div className="text-center">
                    <h3 className="text-xl font-semibold mb-4">Edited</h3>
                    <div className="w-full aspect-square bg-slate-800/50 rounded-xl border-2 border-dashed border-[#B5D6D6]/20 flex items-center justify-center relative overflow-hidden">
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                <Spinner />
                                <p className="mt-4 text-gray-300">Applying your edits...</p>
                            </div>
                        )}
                        {editedImageUrl && !isLoading && (
                            <img src={editedImageUrl} alt="Edited" className="object-contain w-full h-full animate-fadeInUp" />
                        )}
                         {!editedImageUrl && !isLoading && (
                            <div className="text-center text-gray-500">
                                <EditIcon className="mx-auto h-16 w-16" />
                                <p className="mt-4">Your edited image will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageEditor;