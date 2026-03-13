import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(req: NextRequest) {
  try {
    const { products, timeOfDay } = await req.json();
    
    if (!products || products.length < 2) {
      return NextResponse.json({ 
        status: 'ok', 
        message: 'Add at least 2 products to check compatibility.',
        conflicts: [] 
      });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ 
        status: 'unavailable',
        message: 'AI analysis requires setup. Check back soon!',
        conflicts: []
      });
    }

    const client = new Anthropic({ apiKey });

    const productList = products.map((p: { name: string; brand: string; keyIngredients?: string[] }) => 
      `- ${p.name} by ${p.brand}: Key ingredients: ${p.keyIngredients?.join(', ') || 'not specified'}`
    ).join('\n');

    const prompt = `You are a board-certified dermatologist and cosmetic chemist. A user has the following products in their ${timeOfDay === 'am' ? 'morning' : 'evening'} skincare routine:

${productList}

Analyze these products for:
1. Ingredient conflicts (e.g., retinol + AHA/BHA = over-exfoliation, vitamin C + niacinamide at high pH = reduced efficacy, benzoyl peroxide + retinol = degradation)
2. Redundant actives (e.g., two different AHAs)
3. Application order issues
4. Any serious incompatibilities that could harm the skin barrier

Respond in this exact JSON format:
{
  "status": "compatible" | "conflicts" | "warnings",
  "headline": "short friendly headline (max 8 words)",
  "summary": "1-2 sentence plain English summary",
  "conflicts": [
    {
      "severity": "high" | "medium" | "low",
      "products": ["Product Name 1", "Product Name 2"],
      "issue": "specific issue description (1 sentence)",
      "fix": "specific actionable recommendation (1 sentence)"
    }
  ],
  "positives": ["one thing that's working well", "another positive if applicable"],
  "applicationOrder": ["Product 1", "Product 2", "Product 3"]
}

Be specific, evidence-based, and reassuring in tone. If products are compatible, say so warmly. Don't be alarmist about minor issues.`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json(analysis);

  } catch (error) {
    console.error('Ingredient check error:', error);
    return NextResponse.json({ 
      status: 'error',
      headline: 'Analysis unavailable',
      message: 'Could not analyze ingredients right now. Try again in a moment.',
      conflicts: []
    }, { status: 500 });
  }
}
