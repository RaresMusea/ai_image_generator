import { ModeToggle } from "@/components/themes/ModeToggle";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface GeneratorLayoutProps {
    children: ReactNode;
}

export default function GeneratorLayout({ children }: GeneratorLayoutProps) {
    return (
        <div className="flex flex-col min-h-screen">
            <header className="border-b bg-background">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="text-sm font-medium">Back to Home</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-10">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-primary" />
                            <span className="text-lg font-semibold">AImagen</span>
                        </div>
                        <ModeToggle />
                    </div>
                </div>
            </header>
            {children}
            <footer className="border-t bg-background flex items-center justify-between">
                <div className="container flex flex-col gap-2 py-4 md:flex-row md:items-center md:justify-between px-4 md:px-6">
                    <div className="flex items-center gap-2 justify-between">
                        <div>
                            <Sparkles className="h-4 w-4 text-primary" />
                            <p className="text-xs text-muted-foreground">© 2025 AImagen. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}