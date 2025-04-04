"use client";

import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useEffect, useRef, useState } from "react";
import { ImageValidationResult, isImageValid } from "@/lib/ImageValidator";
import { Label } from "../ui/label";
import { ArrowRightLeft, ImageIcon, Loader2, RefreshCw, Upload } from "lucide-react";
import { Button } from "../ui/button";
import axios, { AxiosError, AxiosResponse } from "axios";
import { getImageExtension, getImageResolution } from "@/lib/ImageUtils";
import { useImageGenerator } from "../../../context/ImageGeneratrorContext";
import Image from "next/image";
import { useImageTransformer } from "../../../context/ImageTransformerContext";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const MAXIMUM_FILE_UPLOAD = 13 * 1024 * 1024;

export const ImageAnalyzer = () => {
    const { setGeneratedImage, setPrompt, setActiveTab, setImageTransformPrompt, imageDetails, setImageDetails } = useImageGenerator();
    const { setUploadedTransformationImage } = useImageTransformer();

    const [uploadedImage, setUploadedImage] = useState<string | undefined>('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

    const [selectedAnalyzerFollowUp, setSelectedAnalyzerFollowUp] = useState<string>('0');

    useEffect(() => {
        setImageDetails(undefined);
    }, [])

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
                performFollowUpAction(response);
                toast.success("Image analysis complete", { description: 'A description to your image was successfully generated' });
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

    const performFollowUpAction = (response: AxiosResponse) => {
        if (selectedAnalyzerFollowUp === '0') {
            goToGenerator(response)
        }
        else {
            goToTransofrmation(response);
        }
    }

    const goToGenerator = (response: AxiosResponse) => {
        setActiveTab('generate');
        setPrompt(response.data.generatedPrompt);
    }

    const goToTransofrmation = (response: AxiosResponse) => {
        setActiveTab('transform');
        setImageTransformPrompt(response.data.generatedPrompt);
        setUploadedTransformationImage(uploadedImage);
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

                        { uploadedImage &&
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor="analyzer-follow-up" className="flex items-center justify-between">
                                Follow-up Action
                                <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
                            </Label>
                        <RadioGroup value={selectedAnalyzerFollowUp} onValueChange={setSelectedAnalyzerFollowUp} className="flex flex-col gap-2">
                        {[
                            { id: "r1", value: "0", label: "Generate Image", description: "Opens the image generator using the obtained description as input for the model." },
                            { id: "r2", value: "1", label: "Use uploaded image and generated caption for further transformations", description: "Opens the image transformer using the uploaded image and the generated description as input for the model." },
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
                    }

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
                            <Image
                                width={(getImageResolution(uploadedImage)?.width || 512)}
                                height={(getImageResolution(uploadedImage)?.height || 512)}
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