import { toast } from "sonner";

export interface ImageResolution {
    width: number;
    height: number;
};

export const getImageResolution = (size: string) => {
    if (!size) {
        toast("Error", {
            description: "Invalid image resolution!"
        });
        return;
    }

    const [width, height] = size.split('x');

    return {
        width: parseInt(width),
        height: parseInt(height)
    };
}

export const getImageExtension = (imageFile: File): string | undefined  => {
    if (!imageFile) {
        return undefined;
    }

    const parts = imageFile.name.split('.');
    
    if (parts.length > 1) {
        return parts.pop()?.toLowerCase() || undefined;
    }

    return undefined;
}