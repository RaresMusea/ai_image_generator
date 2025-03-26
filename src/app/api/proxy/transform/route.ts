import { getImageResolution, ImageResolution } from "@/lib/ImageUtils";
import axios from "axios";
import cuid from "cuid";
import { NextRequest, NextResponse } from "next/server";

const PORT: string = '7861';
const url = `http://localhost:${PORT}`

export async function POST(request: NextRequest) {
    const { image, extension, imageTransformationPrompt, size, denoisingStrength, imageCount, resizeMode } = await request.json();

    let imageUri = image;

    if (extension === 'jpg' || extension === 'jpeg') {
        return new NextResponse('The JPG/JPEG format is not accepted!', { status: 400 });
    }

    const resolution: ImageResolution | undefined = getImageResolution(size);

    if (!resolution) {
        return new NextResponse('Invalid image resolution!', { status: 400 });
    }

    const imageFormat: string = `data:image/${extension};base64,`;

    if (!image.includes(imageFormat)) {
        imageUri = `data:image/${extension};base64,` + imageUri;
    }

    const samples: number = Number.parseInt(imageCount);
    try {
        const response = await axios.post(`${url}/sdapi/v1/img2img`, {
            prompt: imageTransformationPrompt,
            init_images: [image],
            width: resolution.width,
            height: resolution.height,
            batch_size: samples,
            num_inference_steps: 50,
            cfg_scale: 9,
            resize_mode: Number.parseInt(resizeMode),
            denoising_strength: denoisingStrength,
        });

        if (!response.data.images || response.data.length === 0) {
            return new NextResponse("Unable to perform image generation.", { status: 500 });
        }

        const imagesBase64: string[] = response.data.images;
        const imagesDataUri = imagesBase64.map((i64: string) => `data:image/png;base64,${i64}`);
        const generationToken: string = cuid();

        const imagesDataResponse = imagesDataUri.map(i => ({
            id: cuid(),
            url: i
        }))

        return NextResponse.json({ images: imagesDataUri, generationToken }, { status: 201 });
    }
    catch (err) {
        console.error(err);
    }

}