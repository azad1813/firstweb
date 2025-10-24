import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageIcon } from './icons';
import Spinner from './Spinner';

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!prompt.trim() || isLoading) return;
        setIsLoading(true);
        setError(null);
        setImageUrl(null);
        try {
            const url = await generateImage(prompt);
            if(url) {
                setImageUrl(url);
            } else {
                setError('Failed to generate image. Please try a different prompt.');
            }
        } catch (err) {
            setError('An error occurred while generating the image.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fadeInUp">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold">Image Generation</h1>
                <p className="mt-2 text-lg text-gray-400">Bring your creative ideas to life with AI. Describe anything you can imagine.</p>
            </div>

            <div className="p-4 bg-slate-800/50 rounded-xl border border-[#B5D6D6]/20 mb-8 shadow-lg">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleGenerate()}
                        placeholder="e.g., A majestic lion with a crown of stars, digital art"
                        className="flex-grow bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#E69597] transition-all"
                    />
                    <button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="btn-primary text-white font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105">
                        {isLoading ? <Spinner /> : 'Generate'}
                    </button>
                </div>
            </div>
            
            {error && <p className="text-center text-red-400 mb-4">{error}</p>}

            <div className="w-full aspect-square bg-slate-800/50 rounded-xl border-2 border-dashed border-[#B5D6D6]/20 flex items-center justify-center relative overflow-hidden">
                {isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                        <Spinner />
                        <p className="mt-4 text-gray-300">Generating your vision...</p>
                    </div>
                )}
                {imageUrl && (
                    <img src={imageUrl} alt="Generated art" className="object-contain w-full h-full animate-fadeInUp" />
                )}
                {!isLoading && !imageUrl && (
                    <div className="text-center text-gray-500">
                        <ImageIcon className="mx-auto h-16 w-16" />
                        <p className="mt-4">Your generated image will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;