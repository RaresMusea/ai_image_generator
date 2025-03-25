"use client";

import { ImageGeneratorProvider } from "../../../context/ImageGeneratrorContext";
import { TooltipProvider } from "../ui/tooltip";
import { GeneratorComponent } from "./GeneratorComponent";

export const GeneratorComponentWrapper = () => {

    return (
        <ImageGeneratorProvider>
            <TooltipProvider>
            <GeneratorComponent />
            </TooltipProvider>
        </ImageGeneratorProvider>
    )
}