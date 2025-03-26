import { createContext, useContext, useRef, useState } from "react";
import { GeneratedImage } from "./ImageGeneratrorContext";
import { toast } from "sonner";

interface ImageTransformerContextProps {
    uploadedImage: string | undefined;
    currentTransformationResult: GeneratedImage[];
    comparisonImage: string | undefined;
    showComparison: boolean;
    setUploadedImage: (newUploadedImage: string | undefined) => void;
    setCurrentTransformationResult: (newTransformationResult: GeneratedImage[]) => void;
    setComparisonImage: (newComparisonImage: string | undefined) => void;
    setShowComparison: (state: boolean) => void;
    sourceImageInputRef: React.RefObject<HTMLInputElement | null>;
    handleTransformedImageDownload: (imageUrl: string) => void;
};

const ImageTransformerContext = createContext<ImageTransformerContextProps | undefined>(undefined);

export const ImageTransformerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);
    const [currentTransformationResult, setCurrentTransformationResult] = useState<GeneratedImage[]>([]);
    const [comparisonImage, setComparisonImage] = useState<string | undefined>(undefined);
    const sourceImageInputRef = useRef<HTMLInputElement>(null);
    const [showComparison, setShowComparison] = useState(false);

    const handleTransformedImageDownload = (imageUrl: string) => {
        if (comparisonImage) {
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = `generated-image-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Image downloaded");
        }
    }

    return (
        <ImageTransformerContext.Provider value={{
            uploadedImage,
            currentTransformationResult,
            showComparison,
            comparisonImage,
            setUploadedImage,
            setCurrentTransformationResult,
            setShowComparison,
            setComparisonImage,
            sourceImageInputRef,
            handleTransformedImageDownload
        }}>
            {children}
        </ImageTransformerContext.Provider>
    )
};

export const useImageTransformer = () => {
    const context = useContext(ImageTransformerContext);

    if (!context) {
        throw new Error('useImageTransformer() must be used within a ImageTransformerProvider!');
    }

    return context;
}