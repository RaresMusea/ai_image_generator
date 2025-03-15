import { GeneratorComponent } from "@/components/generator/GeneratorComponent"

export type GeneratedImage = {
  id: string
  url: string
  prompt: string
  timestamp: Date
  size: string
}

export default function ImageGeneratorPage() {
  // const [prompt, setPrompt] = useState<string | undefined>("");
  // const [size, setSize] = useState<string | undefined>("1024x1024");
  // const [generatedImage, setGeneratedImage] = useState<string | undefined>(undefined);
  // const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])
  // const [activeTab, setActiveTab] = useState("create")

  // // New state for image upload and analysis
  // const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  // const [isAnalyzing, setIsAnalyzing] = useState(false)
  // const fileInputRef = useRef<HTMLInputElement>(null)

  // const handleGenerate = async () => {
    
  // }

  // const handleDownload = (imageUrl: string) => {
  //   if (!imageUrl) return

  //   // In a real application, this would download the actual generated image
  //   const link = document.createElement("a")
  //   link.href = imageUrl
  //   link.download = `generated-image-${Date.now()}.png`
  //   document.body.appendChild(link)
  //   link.click()
  //   document.body.removeChild(link)

  //   toast.success("Image downloaded")
  // }

  // const handleDelete = (id: string) => {
  //   setGeneratedImages((prev) => prev.filter((img) => img.id !== id))
  //   toast("Image deleted", {
  //     description: "The image has been removed from your gallery",
  //   })
  // }

  // const handleCopyPrompt = (promptText: string) => {
  //   setPrompt(promptText)
  //   setActiveTab("create")
  //   toast("Prompt copied", {
  //     description: "The prompt has been added to the generator",
  //   })
  // }

  // const formatDate = (date: Date) => {
  //   return new Intl.DateTimeFormat("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   }).format(date)
  // }

  // // New functions for image upload and analysis
  // const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return

  //   // Check file size (limit to 5MB)
  //   if (file.size > 5 * 1024 * 1024) {
  //     toast.error("File too large", {
  //       description: "Please upload an image smaller than 5MB",
  //     })
  //     return
  //   }

  //   // Check file type
  //   if (!file.type.startsWith("image/")) {
  //     toast.error("Invalid file type", {
  //       description: "Please upload an image file",
  //     })
  //     return
  //   }

  //   const reader = new FileReader()
  //   reader.onload = (event) => {
  //     setUploadedImage(event.target?.result as string)
  //     toast("Image uploaded", {
  //       description: "Your image is ready to be analyzed",
  //     })
  //   }
  //   reader.readAsDataURL(file)
  // }

  // const handleAnalyzeImage = async () => {
  //   if (!uploadedImage) return

  //   setIsAnalyzing(true)

  //   try {
  //     // Get the file from the input
  //     const file = fileInputRef.current?.files?.[0]
  //     if (!file) return

  //     // Create form data
  //     const formData = new FormData()
  //     formData.append("image", file)

  //     // In a real application, this would call your API endpoint
  //     // For demo purposes, we'll simulate the API call
  //     const simulateApiCall = async () => {
  //       await new Promise((resolve) => setTimeout(resolve, 2000))
  //       return {
  //         description:
  //           "A stunning digital artwork featuring a futuristic cityscape at sunset with flying cars and neon lights. The composition showcases towering skyscrapers with glowing windows against a gradient sky of orange, pink, and purple hues. Holographic advertisements float between buildings, while sleek vehicles with light trails navigate through the air. The scene has a cyberpunk aesthetic with rich contrast between shadows and vibrant colors, creating a moody yet energetic atmosphere that evokes a sense of wonder about the future.",
  //       }
  //     }

  //     // In production, use this instead:
  //     // const response = await fetch('/api/analyze-image', {
  //     //   method: 'POST',
  //     //   body: formData,
  //     // })
  //     // const data = await response.json()

  //     const data = await simulateApiCall()

  //     if (data.description) {
  //       setPrompt(data.description)
  //       setActiveTab("create")
  //       toast.success("Image analyzed", {
  //         description: "The description has been added to your prompt",
  //       })
  //     }
  //   } catch (error) {
  //     console.error("Failed to analyze image:", error)
  //     toast.error("Failed to analyze image", {
  //       description: "Please try again with a different image",
  //     })
  //   } finally {
  //     setIsAnalyzing(false)
  //   }
  // }

  // const handleResetUpload = () => {
  //   setUploadedImage(null)
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ""
  //   }
  //   toast("Upload reset", {
  //     description: "You can now upload a different image",
  //   })
  // }

  // return (
  //     <main className="container mx-auto py-10 px-4 md:px-6 flex-1">
  //       <h1 className="text-3xl font-bold text-center mb-8">Create Your Image</h1>
  //       <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
  //         <TabsList className="grid w-full grid-cols-3 mb-8">
  //           <TabsTrigger value="create">Create Image</TabsTrigger>
  //           <TabsTrigger value="upload">Upload & Analyze</TabsTrigger>
  //           <TabsTrigger value="gallery">My Gallery ({generatedImages.length})</TabsTrigger>
  //         </TabsList>

  //         <TabsContent value="create" className="mt-0">
  //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  //             <ImageDescriptor prompt={prompt} 
  //                              setPrompt={setPrompt}
  //                              size={size} setSize={setSize}
  //                              generatedImage={generatedImage}
  //                              setGeneratedImage={setGeneratedImage}
  //                             generatedImages={generatedImages}
  //                             setGeneratedImages={setIsGenerating} />
  //             <Card className="h-fit">
  //               <CardHeader className="pb-2">
  //                 <CardTitle>Generated Image</CardTitle>
  //                 <CardDescription>Your AI-generated image will appear here</CardDescription>
  //               </CardHeader>
  //               <CardContent className="flex justify-center items-center pt-2">
  //                 <div className="relative w-full bg-muted rounded-lg overflow-hidden flex items-center justify-center lg:h-[320px] h-auto aspect-square lg:aspect-auto">
  //                   {isGenerating ? (
  //                     <div className="flex flex-col items-center justify-center space-y-2">
  //                       <Loader2 className="h-10 w-10 animate-spin text-primary" />
  //                       <p className="text-sm text-muted-foreground">Generating your image...</p>
  //                     </div>
  //                   ) : generatedImage ? (
  //                     <img
  //                       src={generatedImage || "/placeholder.svg"}
  //                       alt="Generated image"
  //                       className="w-full h-full object-contain"
  //                     />
  //                   ) : (
  //                     <div className="flex flex-col items-center justify-center space-y-2 py-8">
  //                       <ImageIcon className="h-10 w-10 text-muted-foreground" />
  //                       <p className="text-sm text-muted-foreground">Enter a prompt and click generate</p>
  //                     </div>
  //                   )}
  //                 </div>
  //               </CardContent>
  //               <CardFooter className="pt-2">
  //                 <Button
  //                   variant="outline"
  //                   onClick={() => generatedImage && handleDownload(generatedImage)}
  //                   disabled={!generatedImage}
  //                   className="w-full"
  //                 >
  //                   <Download className="mr-2 h-4 w-4" />
  //                   Download Image
  //                 </Button>
  //               </CardFooter>
  //             </Card>
  //           </div>
  //         </TabsContent>

  //         {/* Upload & Analyze Tab */}
  //         <TabsContent value="upload" className="mt-0">
  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Upload & Analyze Image</CardTitle>
  //               <CardDescription>
  //                 Upload an image to analyze and generate a description for use as a prompt
  //               </CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  //                 <div className="space-y-4">
  //                   <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
  //                     <input
  //                       type="file"
  //                       id="image-upload"
  //                       className="hidden"
  //                       accept="image/*"
  //                       onChange={handleImageUpload}
  //                       ref={fileInputRef}
  //                     />
  //                     <Label
  //                       htmlFor="image-upload"
  //                       className="flex flex-col items-center justify-center cursor-pointer"
  //                     >
  //                       <Upload className="h-10 w-10 text-muted-foreground mb-2" />
  //                       <span className="text-sm font-medium">Click to upload an image</span>
  //                       <span className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF up to 5MB</span>
  //                     </Label>
  //                   </div>

  //                   <div className="flex flex-col space-y-2">
  //                     <Button onClick={handleAnalyzeImage} disabled={!uploadedImage || isAnalyzing} className="w-full">
  //                       {isAnalyzing ? (
  //                         <>
  //                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  //                           Analyzing...
  //                         </>
  //                       ) : (
  //                         <>
  //                           <RefreshCw className="mr-2 h-4 w-4" />
  //                           Analyze Image
  //                         </>
  //                       )}
  //                     </Button>

  //                     <Button
  //                       variant="outline"
  //                       onClick={handleResetUpload}
  //                       disabled={!uploadedImage}
  //                       className="w-full"
  //                     >
  //                       Reset
  //                     </Button>
  //                   </div>

  //                   <div className="text-sm text-muted-foreground">
  //                     <p>
  //                       Upload an image to analyze it with AI. The system will generate a detailed description that you
  //                       can use as a prompt for creating similar or derivative images.
  //                     </p>
  //                   </div>
  //                 </div>

  //                 <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center lg:h-[320px] h-auto aspect-square lg:aspect-auto">
  //                   {uploadedImage ? (
  //                     <img
  //                       src={uploadedImage || "/placeholder.svg"}
  //                       alt="Uploaded image"
  //                       className="w-full h-full object-contain"
  //                     />
  //                   ) : (
  //                     <div className="flex flex-col items-center justify-center space-y-2 p-8 text-center">
  //                       <ImageIcon className="h-10 w-10 text-muted-foreground" />
  //                       <p className="text-sm text-muted-foreground">Upload an image to see it here</p>
  //                     </div>
  //                   )}
  //                 </div>
  //               </div>
  //             </CardContent>
  //           </Card>
  //         </TabsContent>

  //         <TabsContent value="gallery" className="mt-0">
  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Generated Images Gallery</CardTitle>
  //               <CardDescription>View and manage your previously generated images</CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               {generatedImages.length === 0 ? (
  //                 <div className="text-center py-12">
  //                   <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
  //                   <h3 className="mt-4 text-lg font-medium">No images yet</h3>
  //                   <p className="mt-2 text-sm text-muted-foreground">Generate your first image to see it here</p>
  //                   <Button variant="outline" className="mt-4" onClick={() => setActiveTab("create")}>
  //                     Create an image
  //                   </Button>
  //                 </div>
  //               ) : (
  //                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //                   {generatedImages.map((image) => (
  //                     <div key={image.id} className="border rounded-lg overflow-hidden bg-card">
  //                       <div className="aspect-square relative">
  //                         <img
  //                           src={image.url || "/placeholder.svg"}
  //                           alt={image.prompt}
  //                           className="w-full h-full object-cover"
  //                         />
  //                       </div>
  //                       <div className="p-3">
  //                         <p className="text-xs text-muted-foreground mb-1">
  //                           {formatDate(image.timestamp)} • {image.size}
  //                         </p>
  //                         <p className="text-sm line-clamp-2 mb-3">{image.prompt}</p>
  //                         <div className="flex space-x-2">
  //                           <Button
  //                             variant="outline"
  //                             size="sm"
  //                             className="flex-1"
  //                             onClick={() => handleDownload(image.url)}
  //                           >
  //                             <Download className="h-3 w-3 mr-1" />
  //                             Download
  //                           </Button>
  //                           <Button variant="outline" size="sm" onClick={() => handleCopyPrompt(image.prompt)}>
  //                             <Copy className="h-3 w-3" />
  //                             <span className="sr-only">Copy prompt</span>
  //                           </Button>
  //                           <Button variant="outline" size="sm" onClick={() => handleDelete(image.id)}>
  //                             <Trash2 className="h-3 w-3" />
  //                             <span className="sr-only">Delete</span>
  //                           </Button>
  //                         </div>
  //                       </div>
  //                     </div>
  //                   ))}
  //                 </div>
  //               )}
  //             </CardContent>
  //           </Card>
  //         </TabsContent>
  //       </Tabs>
  //     </main>
  // )
  return (
    <GeneratorComponent />
  )
}