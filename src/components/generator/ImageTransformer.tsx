"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { ArrowRightLeft, CircleHelp, Loader2, Upload } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { GeneratedImage, useImageGenerator } from "../../../context/ImageGeneratrorContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent } from "../ui/tooltip";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { useImageTransformer } from "../../../context/ImageTransformerContext";
import axios from "axios";
import { MAXIMUM_FILE_UPLOAD } from "./ImageAnalyzer";
import { ImageValidationResult, isImageValid } from "@/lib/ImageValidator";
import { toast } from "sonner";
import { getImageExtension } from "@/lib/ImageUtils";


export const ImageTransformer = () => {
    const [denoisingStrength, setDenoisingStrength] = useState<number>(0);
    const { imageTransformPrompt, imageCount, generatedImages, size, isGenerating, setIsGenerating, setImageCount, setImageTransformPrompt, setSize, setGeneratedImages } = useImageGenerator();
    const { uploadedImage, setUploadedImage, sourceImageInputRef, setComparisonImage, setCurrentTransformationResult, setShowComparison } = useImageTransformer();
    const [resizeMode, setResizeMode] = useState<string>('1');
    const [imageDetails, setImageDetails] = useState<File | undefined>();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file: File | undefined = e.target.files?.[0];
        setImageDetails(file);

        if (!file) return;

        if (file.size > MAXIMUM_FILE_UPLOAD) {
            toast.error("File too large", {
                description: "Please upload an image smaller than 10MB!",
            })
            return;
        }

        const validationResult: ImageValidationResult = isImageValid(file.name);

        if (!validationResult.isValid) {
            toast.error("Invalid image", {
                description: validationResult.message
            });
            return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
            const base64Result: string = event.target?.result as string;
            const cleanBase64 = base64Result;

            setUploadedImage(cleanBase64);
            toast.success("Image uploaded successfully!", {
                description: "Your image is ready to be analyzed.",
            })
        }
        reader.readAsDataURL(file);

    }

    const handleImageTransform = async () => {

        if (!imageDetails || !uploadedImage) {
            toast.error('Error', { description: 'Invalid image!' });
        }

        setIsGenerating(true);
        setComparisonImage(undefined);

        try {
            const { data } = await axios.post("/api/proxy/transform", { image: uploadedImage, extension: getImageExtension(imageDetails!), imageTransformPrompt, size, denoisingStrength, imageCount, resizeMode });
            if (data.images.length === 1) {
                const newImage: GeneratedImage = {
                    id: Date.now().toString(),
                    generationToken: data.generationToken,
                    url: data.images[0],
                    prompt: imageTransformPrompt!,
                    timestamp: new Date(),
                    size: size || "512x512",
                    sourceImageUrl: uploadedImage
                };

                setComparisonImage(newImage.url);
                setCurrentTransformationResult([newImage]);
                setGeneratedImages([newImage, ...generatedImages]);
                setShowComparison(true);
                toast.success("Image generated successfully!")
            }
            else {
                const newImages: GeneratedImage[] = [];
                data.images.forEach((i: { id: string, url: string }) => {
                    newImages.push({
                        id: i.id,
                        generationToken: data.generationToken,
                        url: i.url,
                        prompt: imageTransformPrompt || '',
                        timestamp: new Date(),
                        size: size || '512x512',
                        sourceImageUrl: uploadedImage
                    })
                });

                setComparisonImage(newImages[0].url);
                setCurrentTransformationResult(newImages);
                setGeneratedImages([...newImages, ...generatedImages]);
                toast.success(`${imageCount} images were successfully generated!`);
                setShowComparison(true);
            }
        }
        catch (error) {
            console.error("Failed to generate image:", error);
            toast.error("Failed to generate image. Please try again later.");
        }
        finally {
            setIsGenerating(false);
        }
    }

    return (
        <Card className="h-fit">
            <CardHeader className="pb-2">
                <CardTitle>Image Transform</CardTitle>
                <CardDescription>Use AI to transform an existing image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
                <div className="space-y-3">
                    <Label htmlFor="source-image-uploader">Source Image</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <input type="file" id="source-image-uploader" className="hidden" onChange={handleImageUpload} ref={sourceImageInputRef} />
                        <Label htmlFor="source-image-uploader" className="flex flex-col items-center justify-center cursor-pointer">
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <span className="text-sm font-medium"> Click to upload an image</span>
                            <span className="text-xs text-muted-foreground mt-1">PNG, GIF, or WEBP, up to 10MB</span>
                        </Label>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="transformation-prompt">Image Transformation Prompt</Label>
                    <Textarea id="transformation-prompt"
                        placeholder="Specify the transformations to which the previously provided image should be subjected."
                        value={imageTransformPrompt}
                        onChange={(e) => setImageTransformPrompt(e.target.value)}
                        className="min-h-[80px]"
                    >
                    </Textarea>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <Label htmlFor="seed">Denoising Strength</Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <span><CircleHelp className="ml-2 w-5 h-5 bg-accent rounded-full text-white" /></span>
                                </TooltipTrigger>
                                <TooltipContent><p className="text-xs">Controls how much the image is altered. Lower values keep more details, higher values generate more changes.</p></TooltipContent>
                            </Tooltip>
                        </div>
                        <span className="text-sm text-muted-foreground cursor-pointer">{denoisingStrength}</span>
                    </div>
                    <Slider
                        id="seed"
                        min={0.001}
                        max={1}
                        step={0.001}
                        value={[denoisingStrength]}
                        onValueChange={(values) => setDenoisingStrength(values[0])}
                    />
                </div>

                <div className="space-y-3 w-full">
                    <Label htmlFor="size">Result Size (WxH)</Label>
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

                <div className="space-y-4 w-full">
                    <Label htmlFor="resize-mode">Resize Mode</Label>
                    <RadioGroup value={resizeMode} onValueChange={setResizeMode} className="flex flex-col gap-2">
                        {[
                            { id: "r1", value: "0", label: "Just Resize", description: "Resizes the input image to fit the desired dimensions without maintaining proportions." },
                            { id: "r2", value: "1", label: "Crop & Resize", description: "Crops the image to fit the desired dimensions while maintaining the original proportions." },
                            { id: "r3", value: "2", label: "Resize & Fill", description: "Resizes the image to fit within the desired dimensions, filling the edges with a color or noise." },
                        ].map(({ id, value, label, description }) => (
                            <div key={id} className="flex items-center justify-between">
                                <Tooltip>
                                    <TooltipTrigger className="flex items-center space-x-2">
                                        <RadioGroupItem value={value} id={id} />
                                        <Label htmlFor={id}>{label}</Label>
                                    </TooltipTrigger>
                                    <TooltipContent>{description}</TooltipContent>
                                </Tooltip>
                            </div>
                        ))}
                    </RadioGroup>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="imageToImageCount">Number of Variations</Label>
                    <Select value={imageCount} onValueChange={setImageCount}>
                        <SelectTrigger id="imageToImageCount" className="w-full">
                            <SelectValue placeholder="Select count" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1 image</SelectItem>
                            <SelectItem value="2">2 images</SelectItem>
                            <SelectItem value="3">3 images</SelectItem>
                            <SelectItem value="4">4 images</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-col space-y-2">
                    <Button
                        onClick={handleImageTransform}
                        disabled={isGenerating || !uploadedImage?.trim()}
                        className="w-full"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Transforming...
                            </>
                        ) : (
                            <>
                                <ArrowRightLeft className="mr-2 h-4 w-4" />
                                Transform Image
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => { }}
                        disabled={!uploadedImage}
                        className="w-full"
                    >
                        Reset
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}