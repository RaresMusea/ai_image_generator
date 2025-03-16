import { capitalizeFirstLetter } from "@/lib/utils";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const PORT: string = '7861';
const URL: string = `http://localhost:${PORT}`;

export async function POST(request: NextRequest): Promise<NextResponse> {
    let { image, extension } = await request.json();
    const imageFormat = `data:image/${extension};base64,`;
    let imageUri = image;

    if (extension === 'jpg') {
        extension = 'jpeg';
    }

    if (!image.includes(imageFormat)) {
        imageUri = `data:image/${extension};base64,` + imageUri;
    }

    const response = await axios.post(`${URL}/sdapi/v1/interrogate`, {
        image: imageUri,
        model: 'clip'
    });


    if (response.status === 200) {
        const generatedPrompt: string = capitalizeFirstLetter(response.data.caption);
        return NextResponse.json({ generatedPrompt }, { status: 201 });
    }
    else {
        return new NextResponse("An error occurred while attempting to analyze your image", { status: 500 });
    }
}