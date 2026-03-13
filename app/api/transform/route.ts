import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

// Results are AI-generated visualizations only, not medical predictions

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, timeframe } = await req.json();

    if (!imageBase64 || !timeframe) {
      return NextResponse.json(
        { error: 'Missing imageBase64 or timeframe' },
        { status: 400 }
      );
    }

    if (!['4weeks', '8weeks', '12weeks'].includes(timeframe)) {
      return NextResponse.json(
        { error: 'Invalid timeframe. Must be 4weeks, 8weeks, or 12weeks' },
        { status: 400 }
      );
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'Replicate API token not configured' },
        { status: 500 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const output = await replicate.run(
        'tencentarc/gfpgan:9283608cc6b7be6b65a8e44983db012355f25c7b24ef25702c2e52c7f24cf8e8',
        {
          input: {
            img: imageBase64,
            version: 'v1.4',
            scale: 2,
          },
        }
      );

      clearTimeout(timeout);

      return NextResponse.json({ outputUrl: output as unknown as string });
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        return NextResponse.json(
          { error: 'Request timed out after 30 seconds' },
          { status: 504 }
        );
      }
      throw err;
    }
  } catch (error) {
    console.error('Transform API error:', error);
    return NextResponse.json(
      { error: 'Failed to process image transformation' },
      { status: 500 }
    );
  }
}
