import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  try {
    const { skinType, concerns, experience, currentProducts, level } = await req.json();
    
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ status: 'unavailable', recommendations: [] });
    }

    const client = new Anthropic({ apiKey });

    const prompt = `You are a skincare expert recommending next steps for a user.

User profile:
- Skin type: ${skinType}
- Concerns: ${concerns?.join(', ') || 'none specified'}
- Experience level: ${experience || 'beginner'} (app level ${level}/4)
- Current routine products: ${currentProducts?.join(', ') || 'none yet'}

Recommend exactly 3 specific products they should add next. For each product, provide a real product that's:
- Available on Amazon
- Appropriate for their skin type and experience level
- Not already in their routine
- Dermatologist-recommended

Respond in this exact JSON format:
{
  "recommendations": [
    {
      "name": "Exact product name",
      "brand": "Brand name",
      "step": "What step this fills (e.g., Serum, Toner, Eye Cream)",
      "reason": "Why this specifically for their profile (1-2 sentences)",
      "searchQuery": "Amazon search query to find this product",
      "keyIngredient": "The hero ingredient and why it helps their concern"
    }
  ]
}`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid format');
    
    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error('Routine recommend error:', error);
    return NextResponse.json({ status: 'error', recommendations: [] }, { status: 500 });
  }
}
