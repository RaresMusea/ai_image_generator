import type { Metadata } from "next";
import "./globals.css";

interface RootLayoutProps {
  children: React.ReactNode;
}
import { ThemeProvider } from "@/components/themes/theme-provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "AImagen",
  description: "AI Image Generator",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster/>
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}
