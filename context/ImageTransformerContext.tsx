import { createContext, useContext, useRef, useState } from "react";
import { GeneratedImage } from "./ImageGeneratrorContext";

interface ImageTransformerContextProps {
    uploadedImage: string | undefined;
    currentTransformationResult: GeneratedImage[];
    setUploadedImage: (newUploadedImage: string | undefined) => void;
    setCurrentTransformationResult: (newTransformationResult: GeneratedImage[]) => void;
    sourceImageInputRef: React.RefObject<HTMLInputElement | null>;
};

const ImageTransformerContext = createContext<ImageTransformerContextProps | undefined>(undefined);

export const ImageTransformerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [uploadedImage, setUploadedImage] = useState<string | undefined>(undefined);
    const [currentTransformationResult, setCurrentTransformationResult] = useState<GeneratedImage[]>([]);
    const sourceImageInputRef = useRef<HTMLInputElement>(null);

    return (
        <ImageTransformerContext.Provider value={{
            uploadedImage,
            currentTransformationResult,
            setUploadedImage,
            setCurrentTransformationResult,
            sourceImageInputRef
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