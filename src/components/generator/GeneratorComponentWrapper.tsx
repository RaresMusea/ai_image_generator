"use client";

import { ImageGeneratorProvider } from "../../../context/ImageGeneratrorContext";
import { ImageTransformerProvider } from "../../../context/ImageTransformerContext";
import { TooltipProvider } from "../ui/tooltip";
import { GeneratorComponent } from "./GeneratorComponent";

export const GeneratorComponentWrapper = () => {

    return (
        <ImageGeneratorProvider>
            <TooltipProvider>
                <ImageTransformerProvider>
            <GeneratorComponent />
            </ImageTransformerProvider>
            </TooltipProvider>
        </ImageGeneratorProvider>
    )
}