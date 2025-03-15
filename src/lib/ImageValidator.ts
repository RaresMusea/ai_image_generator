export interface ImageValidationResult {
    isValid: boolean;
    message?: string;
}

export const isImageValid = (imageName?: string): ImageValidationResult => {
    const validExtensions: ReadonlyArray<string> = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];

    if (!imageName) {
        return {
            isValid: false,
            message: "Cannot upload an image without a name!"
        };
    }

    const extension = imageName.split('.').pop()?.toLowerCase();
    
    if (!extension || !validExtensions.includes(extension)) {
        return {
            isValid: false,
            message: "Unsupported file type!"
        };
    }

    return { isValid: true };
};