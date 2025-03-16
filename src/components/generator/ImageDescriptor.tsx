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
import { GeneratedImage } from "./GeneratorComponent";

type ImageDescriptorProps = {
    prompt: string | undefined;
    setPrompt: (prompt: string | undefined) => void;
    size: string | undefined;
    setSize: (newSize: string | undefined) => void;
    generatedImage: string | undefined;
    setGeneratedImage: (newImage: string | undefined) => void;
    generatedImages: GeneratedImage[];
    setGeneratedImages: (newGeneratedImages: GeneratedImage[]) => void;
    isGenerating: boolean;
    setIsGenerating: (state: boolean) => void;
}

export const ImageDescriptor = ({ prompt, size, generatedImage, generatedImages, isGenerating, setIsGenerating, setPrompt, setSize, setGeneratedImage, setGeneratedImages }: ImageDescriptorProps) => {
    const [seed, setSeed] = useState<number>(0);

    const handleGenerate = async () => {
        if (!prompt?.trim()) return

        setIsGenerating(true);
        setGeneratedImage(undefined);

        try {
            const { data } = await axios.post("/api/proxy/generate", { prompt, size, seed });
            const newImage: GeneratedImage = {
                id: Date.now().toString(),
                url: data.image,
                prompt,
                timestamp: new Date(),
                size: size || "1024x1024",
            };
            setGeneratedImage(newImage.url);
            setGeneratedImages([newImage, ...generatedImages]);
            toast.success("Image generated successfully!")
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
                <CardDescription>Describe the image you want to generate in detail</CardDescription>
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

                <div className="space-y-2">
                    <Label htmlFor="size">Image Size (WxH)</Label>
                    <Select value={size} onValueChange={setSize}>
                        <SelectTrigger id="size">
                            <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
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
                            Generate Image
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    )
}