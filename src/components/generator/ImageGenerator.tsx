"use client";

import { Download, ImageIcon, ListRestart, Loader2, Maximize2, RotateCcw, Trash, Trash2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { useImageGenerator } from "../../../context/ImageGeneratrorContext";
import { useLightbox } from "../../../context/LightboxContext";
import { useEffect, useState } from "react";
import { Lightbox } from "../ui/lightbox";
import { getImageResolution } from "@/lib/ImageUtils";
import Image from "next/image";
import React from "react";

export const ImageGenerator = () => {
    const { prompt, isGenerating, imageCount, generatedImage, generatedImages, setGeneratedImage, handleImageDownload, multipleGenerated, setMultipleGenerated, setPrompt } = useImageGenerator();
    const { lightboxOpen, lightboxImages, lightboxIndex, setLightboxOpen, openGeneratedImagesLightbox, setLightboxIndex } = useLightbox();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

    useEffect(() => {
        if (!carouselApi) return;

        const handleSelect = () => {
            setIsTransitioning(true);

            if (carouselApi.selectedScrollSnap) {
                setCurrentIndex(carouselApi.selectedScrollSnap());
            }
            setTimeout(() => {
                setIsTransitioning(false)
            }, 400);
        }

        carouselApi.on('select', handleSelect);

        if (carouselApi.selectedScrollSnap) {
            setCurrentIndex(carouselApi.selectedScrollSnap());
        }

        return () => {
            carouselApi.off("select", handleSelect)
        }

    }, [carouselApi]);


    return (
        <Card className="h-fit">
            <CardHeader className="pb-2">
                <CardTitle>Generated {imageCount === '1' ? 'image' : 'images'}</CardTitle>
                <CardDescription>Your AI-generated {imageCount === '1' ? 'image' : 'images'} will appear here</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center pt-2">
                <div className={`relative w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center lg:h-[330px] h-auto aspect-square lg:aspect-auto`}>
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Generating your {imageCount === '1' ? 'image' : 'images'}...
                            </p>
                        </div>
                    ) : generatedImage ? (
                        <>

                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-background/80" onClick={() => { imageCount === '1' ? openGeneratedImagesLightbox(0, multipleGenerated) : openGeneratedImagesLightbox(currentIndex, multipleGenerated) }}>
                                <Maximize2 className="h4 w-4" />
                                <span className="sr-only">View fullscreen</span>
                            </Button>

                            <Button variant="ghost" size="icon" className="absolute top-12 right-2 z-10 bg-background/50 hover:bg-background/80" onClick={() => { setGeneratedImage(undefined); setPrompt(undefined); setMultipleGenerated([]);}}>
                                <X className="h4 w-4" />
                                <span className="sr-only">Revert</span>
                            </Button>
                            {
                                Number.parseInt(imageCount) > 1 ? (
                                    <Carousel className="w-full" opts={{ loop: false, skipSnaps: false, dragFree: false, duration: 20, align: "start" }} setApi={setCarouselApi}>
                                        <CarouselContent>
                                            {
                                                multipleGenerated.map((im, idx) => (
                                                        <CarouselItem key={im.id} className="relative">
                                                            <div className="p-1 full flex flex-col items-center relative">
                                                                <Image src={im.url || "/placeholder.svg"}
                                                                    width={getImageResolution(im.size)?.width || 512}
                                                                    height={getImageResolution(im.size)?.height || 512}
                                                                    alt={`Generated image ${idx + 1}`}
                                                                    className="w-full h-full object-contain cursor-pointer"
                                                                    onClick={() => openGeneratedImagesLightbox(idx, multipleGenerated)}
                                                                />
                                                                <div className="absolute bottom-0 left-0 right-0 bg-background/80 p-2 flex flex-col items-center z-50">
                                                                    <p id='currentIndex' className="text-xs text-center mb-1 text-foreground">
                                                                        Image {idx + 1} of {Number.parseInt(imageCount)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </CarouselItem>
                                                ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="left-2" />
                                        <CarouselNext className="right-2" />
                                    </Carousel>
                                ) : (
                                    <Image
                                        width={getImageResolution(generatedImage)?.width || 512}
                                        height={getImageResolution(generatedImage)?.height || 512}
                                        src={generatedImage || "/placeholder.svg"}
                                        alt="Generated image"
                                        onClick={() => openGeneratedImagesLightbox(0, multipleGenerated)}
                                        className="w-full h-full object-contain"
                                    />
                                )}
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center space-y-2 py-8">
                            <ImageIcon className="h-10 w-10 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Enter a prompt and click generate</p>
                        </div>
                    )}
                </div>
            </CardContent >
            <CardFooter className="pt-2">
                <Button
                    variant="outline"
                    onClick={() => {
                        if (Number.parseInt(imageCount) === 1) {
                            handleImageDownload(generatedImage!);
                            return;
                        }

                        handleImageDownload(multipleGenerated[currentIndex].url);
                    }}
                    disabled={!generatedImage}
                    className="w-full"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download {imageCount === '1' ? 'Image' : 'Current Image'}
                </Button>
            </CardFooter>
            <Lightbox
                images={lightboxImages}
                open={lightboxOpen}
                onClose={() => { setLightboxOpen(false); setLightboxIndex(0); }}
                initialIndex={lightboxIndex}
                onDownload={handleImageDownload}
            />
        </Card >
    );
}