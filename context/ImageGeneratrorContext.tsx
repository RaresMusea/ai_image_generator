import { createContext, RefObject, useContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ImageGeneratorContextProps {
    prompt: string | undefined;
    imageTransformPrompt: string | undefined;
    size: string | undefined;
    generatedImage :string | undefined;
    imageDetails: File | undefined;
    setImageDetails: (newImageDetails: File | undefined) => void;
    generatedImages: GeneratedImage[];
    activeTab: string;
    isGenerating: boolean;
    imageCount: string;
    multipleGenerated: GeneratedImage[];
    setPrompt: (newPrompt: string | undefined) => void;
    setSize: (newSize: string | undefined) => void;
    setGeneratedImage: (newSize: string | undefined) => void;
    setGeneratedImages: (newGeneratedImages: GeneratedImage[]) => void;
    setIsGenerating: (newState: boolean) => void;
    setActiveTab: (newActiveTab: string) => void;
    setImageCount: (newImageCount: string) => void;
    setMultipleGenerated: (newArray: GeneratedImage[]) => void;
    handleImageDownload: (url: string) => void;
    setImageTransformPrompt: (newImageTransformPrompt: string | undefined) => void;
};

export type GeneratedImage = {
    id: string
    generationToken: string
    url: string
    prompt: string
    timestamp: Date
    size: string
    sourceImageUrl?: string
};

const ImageGeneratorContext = createContext<ImageGeneratorContextProps | undefined>(undefined);

export const ImageGeneratorProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
        const [prompt, setPrompt] = useState<string | undefined>('');
        const [size, setSize] = useState<string | undefined>("512x512");
        const [generatedImage, setGeneratedImage] = useState<string | undefined>(undefined);
        const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
        const [activeTab, setActiveTab] = useState<string>("generate");
        const [isGenerating, setIsGenerating] = useState<boolean>(false);
        const [imageCount, setImageCount] = useState<string>("1");
        const [multipleGenerated, setMultipleGenerated] = useState<GeneratedImage[]>([]);
        const [imageTransformPrompt, setImageTransformPrompt] = useState<string | undefined>('');
        const [imageDetails, setImageDetails] = useState<File | undefined>();


        useEffect(() => {
            if (imageCount !== "1" && generatedImage) {
                setGeneratedImage(undefined);
            } 
        }, [imageCount]);

        const handleImageDownload = (imageUrl: string) => {
            if (imageUrl) {
                const link = document.createElement("a");
                link.href = imageUrl;
                link.download = `generated-image-${Date.now()}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
    
                toast.success("Image downloaded");
            }
        };

    return (
        <ImageGeneratorContext.Provider value={{
            prompt,
            imageDetails,
            setImageDetails,
            imageTransformPrompt,
            size,
            generatedImage,
            generatedImages,
            activeTab,
            isGenerating,
            imageCount,
            multipleGenerated,
            setPrompt,
            setSize,
            setGeneratedImage,
            setGeneratedImages,
            setIsGenerating,
            setActiveTab,
            setImageCount,
            setMultipleGenerated,
            setImageTransformPrompt,
            handleImageDownload
        }}>
            {children}
        </ImageGeneratorContext.Provider>
    )
};

export const useImageGenerator= () => {
    const context = useContext(ImageGeneratorContext);

    if (!context) {
        throw new Error('useImageGenerator() must be used within a ImageGeneratorProvider');
    }

    return context;
};