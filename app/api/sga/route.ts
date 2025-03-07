import type { NextApiRequest, NextApiResponse } from 'next';
import {CohereClient} from 'cohere-ai';

const cohere = new CohereClient({
    token:process.env.COHERE_API_KEY
})
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { questions, answers, topic } = req.body;

  if (
    !questions ||
    !Array.isArray(questions) ||
    questions.length !== 10 ||
    !answers ||
    !Array.isArray(answers) ||
    answers.length !== 10 ||
    !topic
  ) {
    return res.status(400).json({ error: '10 questions, 10 answers, and a topic are required' });
  }

  try {
    // Construct the prompt for Cohere
    const prompt = `
You are an expert in skill gap analysis. Based on the following 10 questions and their answers, evaluate the user's proficiency in the topic: "${topic}". Compute a score out of 100 for their proficiency and provide a summary of their strengths, weaknesses, and areas for improvement.

Questions and Answers:
1. Question: ${questions[0]}
   Answer: ${answers[0]}
2. Question: ${questions[1]}
   Answer: ${answers[1]}
3. Question: ${questions[2]}
   Answer: ${answers[2]}
4. Question: ${questions[3]}
   Answer: ${answers[3]}
5. Question: ${questions[4]}
   Answer: ${answers[4]}
6. Question: ${questions[5]}
   Answer: ${answers[5]}
7. Question: ${questions[6]}
   Answer: ${answers[6]}
8. Question: ${questions[7]}
   Answer: ${answers[7]}
9. Question: ${questions[8]}
   Answer: ${answers[8]}
10. Question: ${questions[9]}
    Answer: ${answers[9]}

Provide the response in this format:
Score: [Score out of 100]
Summary:
[Strengths, weaknesses, and areas for improvement]
`;

    // Call Cohere's Generate API
    const response = await cohere.generate({
      model: 'command-medium',
      prompt: prompt,
      maxTokens: 300,
      temperature: 0.7,
    });

    // Extract the generated text
    const generatedText = response.generations[0].text;

    // Parse the result
    const [scoreLine, summary] = generatedText.split('Summary:');
    const score = scoreLine.replace('Score:', '').trim();
    const cleanedSummary = summary.trim();

    res.status(200).json({
      score,
      summary: cleanedSummary,
    });
  } catch (error) {
    console.error('Error generating SGA analysis:', error);
    res.status(500).json({ error: 'Failed to generate SGA analysis' });
  }
}
