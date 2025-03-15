import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Upload, ImageIcon, Palette, Zap } from "lucide-react"
import Image from "next/image"
import first from "../../public/1.jpg"
import second from "../../public/2.png"
import third from "../../public/3.jpg"
import fourth from "../../public/4.jpg"
import { ModeToggle } from "@/components/themes/ModeToggle"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-background">
        <div className="container flex h-15 items-center mx-auto justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AImagen</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/generator" className="text-sm font-medium hover:underline underline-offset-4">
              App
            </Link>
            <Button asChild>
              <Link href="/generator">Try It Now</Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_800px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2 text-center sm:text-left">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Transform Your Ideas Into Stunning Images
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Create beautiful, unique images in seconds with our AI-powered image generator. From concept to
                  creation in just a few clicks.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row text-center">
                <Button asChild size="lg" className="px-8">
                  <Link href="/generator">
                    Start Creating <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mx-auto flex items-center justify-center w-full max-w-3xl">
              <div className="grid grid-cols-2 gap-4 md:gap-8">
                <div className="grid gap-4">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={third}
                      alt="AI generated train image"
                      width="400"
                      height="600"
                      className="aspect-[2/3] object-cover w-full h-full bg-muted transition-all hover:scale-105"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={first}
                      alt="AI generated animal picture"
                      width="400"
                      height="400"
                      className="aspect-square object-cover w-full h-full bg-muted transition-all hover:scale-105"
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={second}
                      alt="AI generated landscape image"
                      width="400"
                      height="400"
                      className="aspect-square object-cover w-full h-full bg-muted transition-all hover:scale-105"
                    />
                  </div>
                  <div className="overflow-hidden rounded-lg">
                    <Image
                      src={fourth}
                      alt="AI generated portrait"
                      width="400"
                      objectFit="contain"
                      height="600"
                      className="aspect-[2/3] object-cover w-full h-full bg-muted transition-all hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Powerful Features</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI image generator combines cutting-edge technology with an intuitive interface to help you create
                amazing images.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <ImageIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Text-to-Image</h3>
                <p className="text-muted-foreground">
                  Transform your text descriptions into stunning visuals with our advanced AI model.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Image Analysis</h3>
                <p className="text-muted-foreground">
                  Upload existing images and let our AI analyze them to generate similar styles and variations.
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Palette className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">Customization</h3>
                <p className="text-muted-foreground">
                  Fine-tune your creations with adjustable parameters like size, style, and seed values.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Create?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start generating amazing images with our AI tool today. No sign-up required.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="px-8">
                <Link href="/generator">
                  Get Started <Zap className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-background">
        <div className="container mx-auto flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:py-12 px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <p className="text-sm text-muted-foreground">© 2025 AImagen. All rights reserved.</p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Developed with ❤️ by <Link className="ml-0 hover:underline" href="https://github.com/RaresMusea">Rares-Gabriel Musea</Link></span>
          </div>
        </div>
      </footer>
    </div>
  )
}

