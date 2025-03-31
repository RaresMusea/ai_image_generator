"use client";

import { Copy, Download, ImageIcon, Maximize2, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { GeneratedImage, useImageGenerator } from "../../../context/ImageGeneratrorContext";
import { useLightbox } from "../../../context/LightboxContext";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../ui/carousel";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Lightbox } from "../ui/lightbox";
import Image from "next/image";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export const ImageGallery = () => {
    const { generatedImages, setActiveTab, setPrompt, setGeneratedImage, setGeneratedImages, setImageCount, setSize, handleImageDownload, setMultipleGenerated } = useImageGenerator();
    const { openGalleryLightbox, lightboxImages, lightboxOpen, lightboxIndex, setLightboxOpen, setLightboxIndex } = useLightbox();

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

    const handleDelete = (token: string) => {
        const prevLen: number = generatedImages.length;
        const newLen: number = generatedImages.filter((img: GeneratedImage) => img.generationToken !== token).length;

        setGeneratedImages(generatedImages.filter((img: GeneratedImage) => img.generationToken !== token));
        setMultipleGenerated([]);
        setGeneratedImage(undefined);
        setPrompt('');
        setImageCount('1');
        setSize('512x512');

        toast.success(`${prevLen - newLen !== 1 ? 'Images' : 'Image'} deleted`, {
            description: `${prevLen - newLen !== 1 ? prevLen - newLen + ' images were successfully removed' : 'The image has been removed'} from your gallery`,
        })
    };

    const groupedImages = generatedImages.reduce((acc, image) => {
        if (!acc[image.generationToken]) {
            acc[image.generationToken] = [];
        }
        acc[image.generationToken].push(image);
        return acc;
    }, {} as Record<string, GeneratedImage[]>);

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
                            Create an image
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {Object.entries(groupedImages).map(([generationToken, batch]) => {
                            const firstImage = batch[0]
                            const isBatch = batch.length > 1

                            return (
                                <div key={generationToken} className="border rounded-lg overflow-hidden bg-card">
                                    <div className="aspect-square relative">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 z-10 bg-background/50 hover:bg-background/80"
                                            onClick={() => openGalleryLightbox(generatedImages, generationToken, 0)}
                                        >
                                            <Maximize2 className="h-4 w-4" />
                                            <span className="sr-only">View fullscreen</span>
                                        </Button>

                                        {isBatch ? (
                                            <Carousel
                                                className="w-full h-full"
                                                opts={{
                                                    align: "start",
                                                    loop: false,
                                                    skipSnaps: false,
                                                    duration: 20,
                                                    dragFree: false,
                                                }}
                                            >
                                                <CarouselContent className="object-cover">
                                                    {batch.map((image, index) => (
                                                        <CarouselItem key={image.id} className="h-full aspect-square">
                                                            <div className="h-full relative">
                                                                <Image
                                                                    fill
                                                                    src={image.url || "/placeholder.svg"}
                                                                    alt={image.prompt}
                                                                    className="w-full h-full object-cover cursor-pointer"
                                                                    onClick={() => openGalleryLightbox(generatedImages, generationToken, index)}
                                                                />
                                                                <div className="absolute bottom-2 right-2 bg-background/80 text-foreground px-2 py-1 rounded-md text-xs">
                                                                    {index + 1}/{batch.length}
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
                                                src={firstImage.url || "/placeholder.svg"}
                                                width={512}
                                                height={512}
                                                alt={firstImage.prompt}
                                                className="w-full h-full object-cover cursor-pointer"
                                                onClick={() => openGalleryLightbox(batch, generationToken, 0)}
                                            />
                                        )}
                                        {isBatch && (
                                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs">
                                                {batch.length} images
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 mt-4">
                                        <p className="text-xs text-muted-foreground mb-1">
                                            {formatDate(firstImage.timestamp)} • {firstImage.size}
                                        </p>
                                        <p className="text-sm line-clamp-2 mb-3">{firstImage.prompt}</p>
                                        <div className="flex space-x-2">
                                            {isBatch ? (
                                                <div className="flex-1 w-100">
                                                    <Select onValueChange={(value) => {
                                                        if (value === 'all') {
                                                            batch.forEach(im => handleImageDownload(im.url));
                                                            return
                                                        }
                                                        handleImageDownload(value)
                                                    }
                                                    }>
                                                        <SelectTrigger className="h-8 w-40 text-xs">
                                                            <Download className="h-3 w-3 mr-1" />
                                                            Download
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {batch.map((image, index) => (
                                                                <SelectItem
                                                                    key={image.id}
                                                                    value={image.url}
                                                                >
                                                                    Image {index + 1}
                                                                </SelectItem>
                                                            ))}
                                                            <SelectItem
                                                                value="all"
                                                            >
                                                                All Images
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="flex-1"
                                                    onClick={() => handleImageDownload(firstImage.url)}
                                                >
                                                    <Download className="h-3 w-3 mr-1" />
                                                    Download
                                                </Button>
                                            )}
                                            <Button variant="outline" size="sm" onClick={() => handleCopyPrompt(firstImage.prompt)}>
                                                <Copy className="h-3 w-3" />
                                                <span className="sr-only">Copy prompt</span>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        <Trash2 className="h-3 w-3" />
                                                        <span className="sr-only">Delete</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete {batch.length === 1 ? 'this image?' : `these ${batch.length} images?`} This action cannot be undone.
                                                    </AlertDialogDescription>
                                                    <div className="flex justify-end space-x-2 mt-4">
                                                        <AlertDialogCancel asChild>
                                                            <Button variant="outline" className="font-bold">Cancel</Button>
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction asChild>
                                                            <Button
                                                                className="bg-red-600 hover:bg-red-800 text-white font-bold"
                                                                onClick={() => handleDelete(firstImage.generationToken)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </AlertDialogAction>
                                                    </div>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>
            <Lightbox
                images={lightboxImages}
                open={lightboxOpen}
                onClose={() => { setLightboxOpen(false); setLightboxIndex(0)}}
                initialIndex={lightboxIndex}
                onDownload={handleImageDownload}
            />
        </Card >
    );
};