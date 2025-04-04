"use client"

import * as React from "react"
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

const globalStyles = `
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes zoomIn {
  from { 
    opacity: 0; 
    transform: scale(0.95);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoomOut {
  from { 
    opacity: 1;
    transform: scale(1);
  }
  to { 
    opacity: 0;
    transform: scale(0.95);
  }
}
`

interface LightboxProps {
    images: Array<{
        id: string
        url: string
        prompt?: string
    }>
    open: boolean
    onClose: () => void
    initialIndex?: number
    onDownload?: (url: string) => void
}

export function Lightbox({ images, open, onClose, initialIndex = 0, onDownload }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
    const currentImage = images[currentIndex] || images[0];
    const [isClosing, setIsClosing] = React.useState(false)

    const handleClose = React.useCallback(() => {
        setIsClosing(true)
        setTimeout(() => {
            setIsClosing(false)
            onClose()
        }, 200)
    }, [onClose]);

    const navigateNext = React.useCallback(() => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }, [currentIndex, images.length]);

    const navigatePrev = React.useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }, [currentIndex]);

    React.useEffect(() => {
        const styleElement = document.createElement("style")
        styleElement.innerHTML = globalStyles
        document.head.appendChild(styleElement)

        return () => {
            document.head.removeChild(styleElement)
        }
    }, [handleClose]);

    React.useEffect(() => {
        if (!open) return

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case "ArrowLeft":
                    navigatePrev()
                    break
                case "ArrowRight":
                    navigateNext()
                    break
                case "Escape":
                    handleClose()
                    break
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [open, currentIndex, images.length, handleClose, navigateNext, navigatePrev]);

    React.useEffect(() => {
        if (open) {
            setCurrentIndex(initialIndex)
        }
    }, [open, initialIndex])


    if (!open && !isClosing) return null

    return (
        <div
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center"
            style={{
                animation: isClosing ? "fadeOut 0.2s ease-in forwards" : "fadeIn 0.3s ease-out forwards",
            }}
        >
            <div
                className="relative w-full h-full max-w-7xl max-h-[90vh] mx-auto flex flex-col"
                style={{
                    animation: isClosing ? "zoomOut 0.2s ease-in forwards" : "zoomIn 0.3s ease-out forwards",
                }}
            >
                <div className="flex items-center justify-between p-4">
                    <div className="text-sm text-muted-foreground">
                        {currentIndex + 1} / {images.length}
                    </div>
                    <div className="flex items-center gap-2">
                        {onDownload && (
                            <Button variant="outline" size="icon" onClick={() => onDownload(currentImage.url)}>
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Download</span>
                            </Button>
                        )}
                        <Button variant="outline" size="icon" onClick={handleClose}>
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            fill
                            src={currentImage.url || "/placeholder.svg"}
                            alt={currentImage.prompt || "Image"}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>

                    {images.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80",
                                    currentIndex === 0 && "opacity-50 cursor-not-allowed",
                                )}
                                onClick={navigatePrev}
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft className="h-6 w-6" />
                                <span className="sr-only">Previous</span>
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                    "absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/50 hover:bg-background/80",
                                    currentIndex === images.length - 1 && "opacity-50 cursor-not-allowed",
                                )}
                                onClick={navigateNext}
                                disabled={currentIndex === images.length - 1}
                            >
                                <ChevronRight className="h-6 w-6" />
                                <span className="sr-only">Next</span>
                            </Button>
                        </>
                    )}
                </div>

                {currentImage.prompt && (
                    <div className="p-4 text-center">
                        <p className="text-sm">{currentImage.prompt}</p>
                    </div>
                )}
            </div>
        </div>
    )
}