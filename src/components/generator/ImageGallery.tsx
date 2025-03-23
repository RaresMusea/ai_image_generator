"use client";

import { Copy, Download, ImageIcon, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { GeneratedImage, useImageGenerator } from "../../../context/ImageGeneratrorContext";

export const ImageGallery = () => {
    const {generatedImages, setActiveTab, setPrompt, setGeneratedImage, setGeneratedImages, handleImageDownload} = useImageGenerator();

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    const handleCopyPrompt = (promptText: string) => {
        setActiveTab("generate");
        setPrompt(promptText);
        setGeneratedImage(undefined);

        toast("Prompt copied", {
            description: "The prompt has been added to the generator",
        });
    };

    const handleDelete = (id: string) => {
        setGeneratedImages(generatedImages.filter((img: GeneratedImage) => img.id !== id));

        toast("Image deleted", {
            description: "The image has been removed from your gallery.",
        })
    };

    return (
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
                        <Button variant="outline" className="mt-4" onClick={() => setActiveTab("generate")}>
                            Generate an image
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
    );
};