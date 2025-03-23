"use client";

import { ImageGeneratorProvider } from "../../../context/ImageGeneratrorContext";
import { GeneratorComponent } from "./GeneratorComponent";

export const GeneratorComponentWrapper = () => {

    return (
        <ImageGeneratorProvider>
            <GeneratorComponent />
        </ImageGeneratorProvider>
    )
}