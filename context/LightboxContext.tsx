import { createContext, useContext, useState } from "react";

interface LightboxContextProps {
    lightboxOpen: boolean;
    lightboxImages: LightboxSourcesProps[];
    lightboxIndex: number;
    setLightboxOpen: (newState: boolean) => void;
    setLightboxImages: (lightBoxImages: LightboxSourcesProps[]) => void;
    setLightboxIndex: (newLightboxIndex: number) => void;
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


    return (
        <LightboxContext.Provider value={{
            lightboxOpen,
            lightboxImages,
            lightboxIndex,
            setLightboxIndex,
            setLightboxImages,
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