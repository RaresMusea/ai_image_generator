"use client";

import { useState } from "react";
import axios from "axios";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "sonner"
import { ImageIcon, Loader2 } from "lucide-react";
import { GeneratedImage, useImageGenerator } from "../../../context/ImageGeneratrorContext";

export const ImageDescriptor = () => {
    const [seed, setSeed] = useState<number>(0);

    const {
        prompt,
        size,
        imageCount,
        isGenerating,
        generatedImages,
        setPrompt,
        setSize,
        setIsGenerating,
        setGeneratedImage,
        setImageCount,
        setGeneratedImages,
        setMultipleGenerated
    } = useImageGenerator();

    const handleGenerate = async () => {
        if (!prompt?.trim()) return

        setIsGenerating(true);
        setGeneratedImage(undefined);

        try {
            const { data } = await axios.post("/api/proxy/generate", { prompt, size, seed, imageCount });
            if (data.images.length === 1) {
                const newImage: GeneratedImage = {
                    id: data.images[0].id,
                    generationToken: data.generationToken,
                    url: data.images[0].url,
                    prompt,
                    timestamp: new Date(),
                    size: size || "512x512",
                };
                setGeneratedImage(newImage.url);
                setMultipleGenerated([newImage]);
                setGeneratedImages([newImage, ...generatedImages]);
                toast.success("Image generated successfully!")
            }
            else {
                const newImages: GeneratedImage[] = [];
                data.images.forEach((i: { id: string, url: string }) => {
                    newImages.push({
                        id: i.id,
                        generationToken: data.generationToken,
                        url: i.url,
                        prompt,
                        timestamp: new Date(),
                        size: size || '512x512'
                    })
                });

                setGeneratedImage(newImages[0].url);
                setMultipleGenerated(newImages);
                setGeneratedImages([...newImages, ...generatedImages]);
                toast.success(`${imageCount} images were successfully generated!`);
            }
        } catch (error) {
            console.error("Failed to generate image:", error);
            toast.error("Failed to generate image. Please try again later.");
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <Card className="h-fit">
            <CardHeader className="pb-2">
                <CardTitle>Image Prompt</CardTitle>
                <CardDescription>Describe the {imageCount === "1" ? 'image' : 'images'} you want to generate in detail</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="space-y-2">
                    <Label htmlFor="prompt">Prompt</Label>
                    <Textarea
                        id="prompt"
                        placeholder="A futuristic cityscape at sunset with flying cars and neon lights..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[120px] max-h-[200px]"
                    />
                </div>

                <div className="space-y-2 w-full">
                    <Label htmlFor="size">Image Size (WxH)</Label>
                    <Select value={size} onValueChange={setSize}>
                        <SelectTrigger id="size" className="w-full">
                            <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="512x512">512x512 (Square)</SelectItem>
                            <SelectItem value="512x768">512x768 (Portrait)</SelectItem>
                            <SelectItem value="768x768">768x768 (Square)</SelectItem>
                            <SelectItem value="1024x1024">1024x1024 (Square)</SelectItem>
                            <SelectItem value="1024x1792">1024x1792 (Portrait)</SelectItem>
                            <SelectItem value="1792x1024">1792x1024 (Landscape)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="count">Number of Images</Label>
                    <Select value={imageCount} onValueChange={setImageCount}>
                        <SelectTrigger id="count" className="w-full">
                            <SelectValue placeholder="Choose the number of images which will get generated" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="1">1 image</SelectItem>
                            <SelectItem value="2">2 images</SelectItem>
                            <SelectItem value="3">3 images</SelectItem>
                            <SelectItem value="4">4 images</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="seed">Random Seed</Label>
                        <span className="text-sm text-muted-foreground">{seed}</span>
                    </div>
                    <Slider
                        id="seed"
                        min={0}
                        max={1000000}
                        step={1}
                        value={[seed]}
                        onValueChange={(values) => setSeed(values[0])}
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleGenerate} disabled={isGenerating || !prompt?.trim()} className="w-full">
                    {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            {imageCount === "1" ? "Generate Image" : `Generate ${imageCount} Images`}
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}