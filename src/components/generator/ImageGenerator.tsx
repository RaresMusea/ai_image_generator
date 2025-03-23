"use client";

import { Download, ImageIcon, Loader2, Maximize2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { useImageGenerator } from "../../../context/ImageGeneratrorContext";

export const ImageGenerator = () => {
    const { prompt, isGenerating, imageCount, generatedImage, generatedImages, handleImageDownload } = useImageGenerator();

    return (
        <Card className="h-fit">
            <CardHeader className="pb-2">
                <CardTitle>Generated Image</CardTitle>
                <CardDescription>Your AI-generated image will appear here</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center pt-2">
                <div className="relative w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center lg:h-[320px] h-auto aspect-square lg:aspect-auto">
                    {isGenerating ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                            <p className="text-sm text-muted-foreground">Generating your {imageCount === '1' ? 'image' : 'images'}...
                            </p>
                        </div>
                    ) : generatedImage ? (
                        <>
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-background/80">
                                <Maximize2 className="h4 w-4" />
                                <span className="sr-only">View fullscreen</span>
                            </Button>

                            {
                                Number.parseInt(imageCount) > 1 ? (
                                    <Carousel className="w-full">
                                        <CarouselContent>
                                            {
                                                generatedImages.filter(im => im.prompt === prompt)
                                                    .slice(0, Number.parseInt(imageCount))
                                                    .map((im, idx) => (
                                                        <CarouselItem key={im.id}>
                                                            <div className="p-1 full flex flex-col items-center relative">
                                                                <img src={im.url || "/placeholder.svg"}
                                                                    alt={`Generated image ${idx + 1}`}
                                                                    className="w-full h-full object-contain cursor-pointer"
                                                                    onClick={() => { }}
                                                                />
                                                                <div className="absolute buttom-0 left-0 right-0 bg-background/80 p-2 flex flex-col items-center">
                                                                    <p className="text-xs text-center mb-1 text-foreground">
                                                                        Image {idx + 1} of {Number.parseInt(imageCount)}
                                                                    </p>
                                                                    <Button variant="secondary"
                                                                        size="sm"
                                                                        className="w-full"
                                                                        onClick={() => handleImageDownload(im.url)}>
                                                                        <Download className="h-3 w-3 mr-1">
                                                                            Download Image
                                                                        </Download>
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                        </CarouselContent>
                                        <CarouselPrevious className="left-2" />
                                        <CarouselNext className="right-2" />
                                    </Carousel>
                                ) : (
                                    <img
                                        src={generatedImage || "/placeholder.svg"}
                                        alt="Generated image"
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
            </CardContent>
            <CardFooter className="pt-2">
                <Button
                    variant="outline"
                    onClick={() => handleImageDownload(generatedImage!)}
                    disabled={!generatedImage}
                    className="w-full"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download Image
                </Button>
            </CardFooter>
        </Card>
    );
}