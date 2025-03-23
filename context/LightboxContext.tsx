import { createContext, useContext, useState } from "react";
import { GeneratedImage } from "./ImageGeneratrorContext";

interface LightboxContextProps {
    lightboxOpen: boolean;
    lightboxImages: LightboxSourcesProps[];
    lightboxIndex: number;
    setLightboxOpen: (newState: boolean) => void;
    setLightboxImages: (lightBoxImages: LightboxSourcesProps[]) => void;
    setLightboxIndex: (newLightboxIndex: number) => void;
    openGeneratedImagesLightbox: (index:number, generatedImages: GeneratedImage[]) => void;
};

type LightboxSourcesProps = {
    id: string;
    url: string;
    prompt?: string;
}

const LightboxContext = createContext<LightboxContextProps | undefined>(undefined);

export const LightboxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lightboxOpen, setLightboxOpen] = useState<boolean>(false)
    const [lightboxImages, setLightboxImages] = useState<LightboxSourcesProps[]>([])
    const [lightboxIndex, setLightboxIndex] = useState<number>(0);

    const openGeneratedImagesLightbox = (index:number = 0, generatedImages: GeneratedImage[]) => {
        console.log(generatedImages);
        if (generatedImages.length === 0) return;

        setLightboxImages(
          generatedImages.map((img) => ({
            id: img.id,
            url: img.url,
            prompt: img.prompt,
          })),
        )
        setLightboxIndex(index)
        setLightboxOpen(true);
    }

    return (
        <LightboxContext.Provider value={{
            lightboxOpen,
            lightboxImages,
            lightboxIndex,
            setLightboxIndex,
            setLightboxImages,
            openGeneratedImagesLightbox,
            setLightboxOpen
        }}>
            {children}
        </LightboxContext.Provider>
    )
};

export const useLightbox = () => {
    const context = useContext(LightboxContext);

    if (!context) {
        throw new Error('useLightbox() must be used within a LightboxProvider!');
    }

    return context;
}