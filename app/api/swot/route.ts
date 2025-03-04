import  { CohereClient } from 'cohere-ai';
import { NextResponse } from 'next/server';

const cohere = new CohereClient({
    token:process.env.COHERE_API_KEY
})

export async function POST(req:Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' });
  }

  const { strengths, weaknesses, opportunities, threats } = await req.json();

  if (!strengths || !weaknesses || !opportunities || !threats) {
    return NextResponse.json({ error: 'All SWOT fields are required' });
  }

  try {
    // Construct the prompt
    const prompt = `
  Based on the following SWOT analysis, suggest a suitable role for the user:
  Strengths: ${strengths}
  Weaknesses: ${weaknesses}
  Opportunities: ${opportunities}
  Threats: ${threats}

  Analyze the input carefully and provide:
  1. A brief explanation of how the user's strengths and opportunities align with a specific role.
  2. Suggestions for overcoming weaknesses and threats.
  3. The most suitable role for the user.

  Format the response as:
   Explanation:
    [Your explanation here]

    Suggested Role:
     [Your role only suggestion here do not mention other then that]
`;

    // Call Cohere's Generate API
    const response = await cohere.generate({
      model: 'command-r-plus-08-2024', 
      prompt: prompt,
      maxTokens: 300,
      temperature: 0.7,
    });

    // Extract the generated text
    const generatedText = response.generations[0].text;
    const [explanation, suggestedRole] = generatedText.split('Suggested Role:');

    const Explanation = explanation.replace('Explanation:', '').trim();
    const SuggestedRole = suggestedRole.trim();
    return NextResponse.json( {Explanation,SuggestedRole });
  } catch (error) {
    console.error('Error generating SWOT analysis:', error);
    return NextResponse.json({ error: 'Failed to generate SWOT analysis' });
  }
}
