"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { ImageDescriptor } from "./ImageDescriptor";
import { ImageGenerator } from "./ImageGenerator";
import { ImageAnalyzer } from "./ImageAnalyzer";
import { ImageGallery } from "./ImageGallery";

export type GeneratedImage = {
    id: string
    url: string
    prompt: string
    timestamp: Date
    size: string
}

export const GeneratorComponent = () => {
    const [prompt, setPrompt] = useState<string | undefined>('');
    const [size, setSize] = useState<string | undefined>("1024x1024");
    const [generatedImage, setGeneratedImage] = useState<string | undefined>(undefined);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
    const [activeTab, setActiveTab] = useState("generate")
    const [isGenerating, setIsGenerating] = useState<boolean>(false);

    const handleImageDownload = (imageUrl: string) => {
        if (generatedImage) {
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = `generated-image-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Image downloaded");
        }
    };

    return (
        <main className="container mx-auto py-10 px-4 md:px-6 flex-1">
            <h1 className="text-3xl font-bold text-center mb-8">Create Your Images</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="generate" className={activeTab === 'generate' ? "font-bold" : ''}>Generate Image</TabsTrigger>
                    <TabsTrigger value="upload" className={activeTab === 'upload' ? "font-bold" : ''}>Upload & Analyze</TabsTrigger>
                    <TabsTrigger value="gallery" className={activeTab === 'gallery' ? "font-bold" : ''}>My Gallery ({generatedImages.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="generate" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <ImageDescriptor prompt={prompt}
                            setPrompt={setPrompt}
                            size={size} setSize={setSize}
                            generatedImage={generatedImage}
                            setGeneratedImage={setGeneratedImage}
                            generatedImages={generatedImages}
                            setGeneratedImages={setGeneratedImages}
                            isGenerating={isGenerating}
                            setIsGenerating={setIsGenerating}
                        />
                        <ImageGenerator isGenerating={false}
                            generatedImage={generatedImage}
                            handleImageDownload={handleImageDownload} />
                    </div>
                </TabsContent>
                <TabsContent value="upload" className="mt-0">
                    <ImageAnalyzer prompt={prompt}
                        setPrompt={setPrompt}
                        setActiveTab={setActiveTab} />
                </TabsContent>
                <TabsContent value="gallery" className="mt-0">
                    <ImageGallery generatedImages={generatedImages}
                        setGeneratedImages={setGeneratedImages}
                        setActiveTab={setActiveTab}
                        handleImageDownload={handleImageDownload}
                        setPrompt={setPrompt} />
                </TabsContent>
            </Tabs>
        </main>
    )
};