"use client";

import { Download, ImageIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";

type ImageGeneratorProps = {
    isGenerating: boolean;
    generatedImage: string | undefined;
    handleImageDownload: (imageUrl: string) => void;
}

export const ImageGenerator = ({ isGenerating, generatedImage, handleImageDownload }: ImageGeneratorProps) => {
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
                            <p className="text-sm text-muted-foreground">Generating your image...</p>
                        </div>
                    ) : generatedImage ? (
                        <img
                            src={generatedImage || "/placeholder.svg"}
                            alt="Generated image"
                            className="w-full h-full object-contain"
                        />
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