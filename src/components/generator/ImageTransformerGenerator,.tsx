"use client";

import { useImageTransformer } from "../../../context/ImageTransformerContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Download, ImageIcon, Loader2, Maximize2, RefreshCw, SplitSquareVertical } from "lucide-react";
import { useLightbox } from "../../../context/LightboxContext";
import { useImageGenerator } from "../../../context/ImageGeneratrorContext";
import { Button } from "../ui/button";
import Image from "next/image";
import { getImageResolution } from "@/lib/ImageUtils";
import { Lightbox } from "../ui/lightbox";

export const ImageTransformerGenerator = () => {
    const { uploadedImage,
        setUploadedImage,
        showComparison,
        currentTransformationResult,
        sourceImageInputRef,
        comparisonImage,
        setComparisonImage,
        setShowComparison,
        handleTransformedImageDownload
    } = useImageTransformer();
    const { lightboxImages, lightboxIndex, lightboxOpen, setLightboxOpen, setLightboxIndex, openGeneratedImagesLightbox } = useLightbox();
    const { imageCount, isGenerating, generatedImages, imageTransformPromptRef } = useImageGenerator();

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Image Transformation Result</CardTitle>
                <CardDescription>See how AI transforms your image</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
                {
                    uploadedImage ? (
                        showComparison && comparisonImage ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <SplitSquareVertical className="h-5 w-5 text-primary" />
                                    <span className="text-sm font-medium">Before & After</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="bg-muted rounded-lg overflow-hidden w-full h-[200px] flex items-center justify-center">
                                            <img
                                                src={uploadedImage || "/placeholder.svg"}
                                                alt="Source image"
                                                className="object-contain max-w-full max-h-full"
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1">Original</span>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="bg-muted rounded-lg overflow-hidden w-full h-[200px] flex items-center justify-center">
                                            <img
                                                src={comparisonImage || "/placeholder.svg"}
                                                alt="Transformed image"
                                                className="object-contain max-w-full max-h-full cursor-pointer"
                                                onClick={() => {
                                                    const foundImage = generatedImages.find(i => i.url === comparisonImage);
                                                    if (foundImage) {
                                                        openGeneratedImagesLightbox(generatedImages.indexOf(foundImage), generatedImages);
                                                    }
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground mt-1">Transformed</span>
                                    </div>
                                </div>

                                {Number.parseInt(imageCount) > 1 && (
                                    <div className="mt-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium">All Variations</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => openGeneratedImagesLightbox(0, currentTransformationResult)}
                                                className="h-8 px-2"
                                            >
                                                <Maximize2 className="h-4 w-4 mr-1" />
                                                <span className="text-xs">View All</span>
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2">
                                            {currentTransformationResult.map((img, index) => (
                                                <div
                                                    key={img.id}
                                                    className="bg-muted rounded-lg overflow-hidden aspect-square cursor-pointer"
                                                    onClick={() => setComparisonImage(img.url)}
                                                >
                                                    <Image
                                                        width={getImageResolution(img.size)?.width || 512}
                                                        height={getImageResolution(img.size)?.height || 512}
                                                        src={img.url || "/placeholder.svg"}
                                                        alt={`Variation ${index + 1}`}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex space-x-2 mt-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => handleTransformedImageDownload(comparisonImage)}
                                    >
                                        <Download className="h-3 w-3 mr-1" />
                                        Download Transformed
                                    </Button>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="flex-1"
                                        onClick={() => {
                                            imageTransformPromptRef.current = '';
                                            setUploadedImage(undefined);
                                            setShowComparison(false);
                                            setComparisonImage(undefined);
                                            if (sourceImageInputRef.current) {
                                                sourceImageInputRef.current.value = ""
                                            }
                                        }}
                                    >
                                        <RefreshCw className="h-3 w-3 mr-1" />
                                        New Image Transformation
                                    </Button>
                                </div>
                            </div>
                        ) : (

                            <div className="bg-muted rounded-lg overflow-hidden w-full h-[300px] flex items-center justify-center">
                                {isGenerating ? (
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                                        <p className="text-sm text-muted-foreground">Transforming your image...</p>
                                    </div>
                                ) : (
                                    <Image
                                        width={getImageResolution(uploadedImage)?.width || 512}
                                        height={getImageResolution(uploadedImage)?.height || 512}
                                        src={uploadedImage || "/placeholder.svg"}
                                        alt="Source image"
                                        className="object-contain max-w-full max-h-full"
                                    />
                                )}
                            </div>
                        )
                    ) : (
                        <div className="bg-muted rounded-lg overflow-hidden w-full h-[300px] flex items-center justify-center">
                            <div className="flex flex-col items-center justify-center space-y-2 p-8 text-center">
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">Upload a source image to transform</p>
                            </div>
                        </div>
                    )}
            </CardContent>
            <Lightbox
                images={lightboxImages}
                open={lightboxOpen}
                onClose={() => { setLightboxOpen(false); setLightboxIndex(0) }}
                initialIndex={lightboxIndex}
                onDownload={handleTransformedImageDownload}
            />
        </Card>
    );
}