"use client";

import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { ImageDescriptor } from "./ImageDescriptor";
import { ImageGenerator } from "./ImageGenerator";
import { ImageAnalyzer } from "./ImageAnalyzer";
import { ImageGallery } from "./ImageGallery";
import { useImageGenerator } from "../../../context/ImageGeneratrorContext";
import { LightboxProvider } from "../../../context/LightboxContext";

export const GeneratorComponent = () => {
    const { activeTab, setActiveTab, generatedImages, imageCount } = useImageGenerator();

    return (
        <LightboxProvider>
            <main className="container mx-auto py-10 px-4 md:px-6 flex-1">
                <h1 className="text-3xl font-bold text-center mb-8">Create Your Images</h1>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-8">
                        <TabsTrigger value="generate" className={activeTab === 'generate' ? "font-bold" : ''}>Generate {imageCount === '1' ? 'Image' : 'Images'}</TabsTrigger>
                        <TabsTrigger value="transform" className={activeTab === 'transform' ? "font-bold" : ''}>Image Transformer</TabsTrigger>
                        <TabsTrigger value="upload" className={activeTab === 'upload' ? "font-bold" : ''}>Upload & Analyze</TabsTrigger>
                        <TabsTrigger value="gallery" className={activeTab === 'gallery' ? "font-bold" : ''}>My Gallery ({generatedImages.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="generate" className="mt-0">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <ImageDescriptor />
                            <ImageGenerator />
                        </div>
                    </TabsContent>
                    <TabsContent value="transform" className="mt-0">
                    </TabsContent>
                    <TabsContent value="upload" className="mt-0">
                        <ImageAnalyzer />
                    </TabsContent>
                    <TabsContent value="gallery" className="mt-0">
                        <ImageGallery />
                    </TabsContent>
                </Tabs>
            </main>
        </LightboxProvider>
    )
};