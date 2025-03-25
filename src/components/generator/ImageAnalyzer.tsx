"use client";

import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useRef, useState } from "react";
import { ImageValidationResult, isImageValid } from "@/lib/ImageValidator";
import { Label } from "../ui/label";
import { ImageIcon, Loader2, RefreshCw, Upload } from "lucide-react";
import { Button } from "../ui/button";
import axios, { AxiosError } from "axios";
import { getImageExtension } from "@/lib/ImageUtils";
import { useImageGenerator } from "../../../context/ImageGeneratrorContext";

const MAXIMUM_FILE_UPLOAD = 10 * 1024 * 1024;

export const ImageAnalyzer = () => {
    const { setGeneratedImage, setPrompt, setActiveTab } = useImageGenerator();

    const [uploadedImage, setUploadedImage] = useState<string | undefined>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
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

    const analyzeImage = async () => {
        setIsAnalyzing(true);

        if (!imageDetails || !uploadedImage) {
            toast.error('Error', { description: 'Invalid image!' });
        }

        try {
            const response = await axios.post("/api/proxy/analyze", { image: uploadedImage, extension: getImageExtension(imageDetails!) });

            if (response.status === 201) {
                setGeneratedImage(undefined);
                setPrompt(response.data.generatedPrompt);
                setActiveTab('generate');
                toast.success("Image analysis complete", { description: 'The description has been added to your prompt.' });
            }
        }
        catch (error) {
            toast.error("Error", {
                description: ((error as AxiosError).response?.data as string) || "An unknown error occurred."
            });

        } finally {
            setIsAnalyzing(false);
        }
    }

    const handleResetUpload = () => {
        setUploadedImage(undefined);
        setImageDetails(undefined);

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
                            {!imageDetails ?
                                <>
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
                                        <span className="text-xs text-muted-foreground mt-1">PNG, GIF or WEBP, up to 10MB</span>
                                    </Label>
                                </>
                                :
                                <Label htmlFor="iamge-upload"
                                    className="flex flex-col items-center justify-center cursor-pointer">
                                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                                    <span className="text-sm font-medium">Uploaded image: <b>{imageDetails?.name}</b></span>
                                </Label>

                            }
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