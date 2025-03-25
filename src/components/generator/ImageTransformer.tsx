"use client";

import { useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Label } from "../ui/label"
import { ArrowRightLeft, CircleHelp, Loader2, Upload } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { useImageGenerator } from "../../../context/ImageGeneratrorContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider } from "../ui/slider";
import { Tooltip, TooltipTrigger } from "@radix-ui/react-tooltip";
import { TooltipContent } from "../ui/tooltip";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";


export const ImageTransformer = () => {
    const sourceImageInputRef = useRef<HTMLInputElement>(null);
    const [denoisingStrength, setDenoisingStrength] = useState<number>(0);
    const { imageTransformPrompt, imageCount, size, isGenerating, setIsGenerating, setImageCount, setImageTransformPrompt, setSize } = useImageGenerator();
    const [resizeMode, setResizeMode] = useState<string>('1');
    const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);

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
                        <input type="file" id="source-image-uploader" className="hidden" ref={sourceImageInputRef} />
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
                      onClick={() => {}}
                      disabled={isGenerating || !imageTransformPrompt?.trim || !uploadedImage?.trim()}
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
                      onClick={() => {}}
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