"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Copy, Download, ImageIcon, Trash2 } from "lucide-react";
import { ImageDescriptor } from "./ImageDescriptor";
import { ImageGenerator } from "./ImageGenerator";
import { ImageAnalyzer } from "./ImageAnalyzer";

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

    const handleDelete = (id: string) => {
        setGeneratedImages((prev) => prev.filter((img) => img.id !== id))
        toast("Image deleted", {
            description: "The image has been removed from your gallery",
        })
    }

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
    }

    const handleCopyPrompt = (promptText: string) => {
        setPrompt(promptText)
        setActiveTab("create")
        toast("Prompt copied", {
            description: "The prompt has been added to the generator",
        })
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    return (
        <main className="container mx-auto py-10 px-4 md:px-6 flex-1">
            <h1 className="text-3xl font-bold text-center mb-8">Create Your Image</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="generate" className={activeTab === 'generate' ? "font-bold" : ''}>Create Image</TabsTrigger>
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
                    <Card>
                        <CardHeader>
                            <CardTitle>Generated Images Gallery</CardTitle>
                            <CardDescription>View and manage your previously generated images</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {generatedImages.length === 0 ? (
                                <div className="text-center py-12">
                                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <h3 className="mt-4 text-lg font-medium">No images yet</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">Generate your first image to see it here</p>
                                    <Button variant="outline" className="mt-4" onClick={() => setActiveTab("create")}>
                                        Create an image
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {generatedImages.map((image) => (
                                        <div key={image.id} className="border rounded-lg overflow-hidden bg-card">
                                            <div className="aspect-square relative">
                                                <img
                                                    src={image.url || "/placeholder.svg"}
                                                    alt={image.prompt}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-3">
                                                <p className="text-xs text-muted-foreground mb-1">
                                                    {formatDate(image.timestamp)} • {image.size}
                                                </p>
                                                <p className="text-sm line-clamp-2 mb-3">{image.prompt}</p>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="flex-1"
                                                        onClick={() => handleImageDownload(image.url)}
                                                    >
                                                        <Download className="h-3 w-3 mr-1" />
                                                        Download
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleCopyPrompt(image.prompt)}>
                                                        <Copy className="h-3 w-3" />
                                                        <span className="sr-only">Copy prompt</span>
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDelete(image.id)}>
                                                        <Trash2 className="h-3 w-3" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </main>
    )
}