"use client";

import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useRef, useState } from "react";
import { ImageValidationResult, isImageValid } from "@/lib/ImageValidator";
import { Label } from "../ui/label";
import { CircleX, ImageIcon, Loader2, RefreshCw, SkipBackIcon, Upload } from "lucide-react";
import { Button } from "../ui/button";

const MAXIMUM_FILE_UPLOAD = 10 * 1024 * 1024;

type ImageAnalyzerProps = {
    prompt: string | undefined;
    setPrompt: (newPrompt: string | undefined) => void;
    setActiveTab: (currentActiveTab: string) => void;
};

export const ImageAnalyzer = ({prompt, setPrompt, setActiveTab}: ImageAnalyzerProps) => {
    const [uploadedImage, setUploadedImage] = useState<string | undefined>('');
    const fileInputRef = useRef<HTMLInputElement>(null); 
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

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
            setUploadedImage(event.target?.result as string)
            toast("Image uploaded", {
                description: "Your image is ready to be analyzed",
            })
        }
        reader.readAsDataURL(file);
    }

    const analyzeImage = async () => {
        if (!uploadedImage) return;

        setIsAnalyzing(true);

        try {
            // Get the file from the input
            const file = fileInputRef.current?.files?.[0];
            if (!file) return;

            // Create form data
            const formData = new FormData()
            formData.append("image", file)

            // In a real application, this would call your API endpoint
            // For demo purposes, we'll simulate the API call
            const simulateApiCall = async () => {
                await new Promise((resolve) => setTimeout(resolve, 2000))
                return {
                    description:
                        "A stunning digital artwork featuring a futuristic cityscape at sunset with flying cars and neon lights. The composition showcases towering skyscrapers with glowing windows against a gradient sky of orange, pink, and purple hues. Holographic advertisements float between buildings, while sleek vehicles with light trails navigate through the air. The scene has a cyberpunk aesthetic with rich contrast between shadows and vibrant colors, creating a moody yet energetic atmosphere that evokes a sense of wonder about the future.",
                }
            }

            // In production, use this instead:
            // const response = await fetch('/api/analyze-image', {
            //   method: 'POST',
            //   body: formData,
            // })
            // const data = await response.json()

            const data = await simulateApiCall()

            if (data.description) {
                setPrompt(data.description);
                setActiveTab("generate");
                toast.success("Image analyzed", {
                    description: "The description has been added to your prompt",
                })
            }
        } catch (error) {
            toast.error("Failed to analyze image", {
                description: "Please try again with a different image",
            })
        } finally {
            setIsAnalyzing(false);
        }
    }

        const handleResetUpload = () => {
        setUploadedImage(undefined);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        toast("Upload reset", {
            description: "You can now upload a different image",
        });
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Upload & Analyze Image</CardTitle>
                <CardDescription>
                    Upload an image to analyze and generate a description for use as a prompt
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                            <input
                                type="file"
                                id="image-upload"
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                            />
                            <Label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center cursor-pointer"
                            >
                                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                                <span className="text-sm font-medium">Click to upload an image</span>
                                <span className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF up to 5MB</span>
                            </Label>
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Button onClick={analyzeImage} disabled={!uploadedImage || isAnalyzing} className="w-full">
                                {isAnalyzing ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                        Analyze Image
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleResetUpload}
                                disabled={!uploadedImage}
                                className="w-full"
                            >
                                Reset
                            </Button>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            <p>
                                Upload an image to analyze it with AI. The system will generate a detailed description that you
                                can use as a prompt for creating similar or derivative images.
                            </p>
                        </div>
                    </div>

                    <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center lg:h-[320px] h-auto aspect-square lg:aspect-auto">
                        {uploadedImage ? (
                            <img
                                src={uploadedImage || "/placeholder.svg"}
                                alt="Uploaded image"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-2 p-8 text-center">
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Upload an image to see it here</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}