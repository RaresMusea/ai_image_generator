import { getImageResolution, ImageResolution } from "@/lib/ImageUtils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const PORT: string = '7861';
const URL: string = `http://localhost:${PORT}`

export async function POST(request: NextRequest) {
    const { prompt, size, seed, imageCount } = await request.json();

    const imageResolution = getImageResolution(size);

    if (!imageResolution) {
        return new NextResponse('Invalid image size', { status: 400 });
    }

    const samples: number = Number.parseInt(imageCount);
    const response = await axios.post(`${URL}/sdapi/v1/txt2img`, {
        prompt,
        width: imageResolution.width,
        height: imageResolution.height,
        batch_size: samples,
        seed: seed,
        num_inference_steps: 50,
        cfg_scale: 7
    });

    if (!response.data.images || response.data.length === 0) {
        return new NextResponse("Unable to perform image generation.", { status: 500 });
    }

    console.log(response.data);
    const imagesBase64: string[] = response.data.images;
    const imagesDataUri = imagesBase64.map((i64: string) => `data:image/png;base64,${i64}`);

    return NextResponse.json({ images: imagesDataUri }, { status: 201 });
}