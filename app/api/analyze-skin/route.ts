import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json(
        { error: 'Missing imageBase64' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    // Strip data: prefix if present
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 2048,
        system: 'You are a professional dermatologist AI assistant. Analyze skin photos and return ONLY valid JSON with no markdown, no code blocks, no explanation.',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Data,
                },
              },
              {
                type: 'text',
                text: 'Analyze this face photo and return a JSON object with this exact structure: { "skinScore": number (1-10), "skinTone": string, "concerns": [{ "name": string, "severity": "mild"|"moderate"|"visible", "description": string }], "strengths": [string], "recommendations": [{ "category": string, "priority": "high"|"medium"|"low", "suggestion": string, "targetConcern": string }], "routineSuggestion": { "morning": [string], "evening": [string] } }. Be specific and helpful. Analyze for: acne/breakouts, dark spots/hyperpigmentation, redness, oiliness, dryness, fine lines, large pores, uneven texture, dullness.',
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error('Anthropic API error:', response.status, await response.text());
      return NextResponse.json(
        { error: 'Could not analyze image. Please upload a clear face photo in good lighting.' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const text = data.content?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { error: 'Could not analyze image. Please upload a clear face photo in good lighting.' },
        { status: 500 }
      );
    }

    // Try to parse JSON from the response, handling potential markdown wrapping
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error('Could not parse response');
      }
    }

    return NextResponse.json({ analysis: parsed });
  } catch (error) {
    console.error('Analyze skin API error:', error);
    return NextResponse.json(
      { error: 'Could not analyze image. Please upload a clear face photo in good lighting.' },
      { status: 500 }
    );
  }
}
