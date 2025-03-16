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