import { OpenAI } from 'openai';


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStream(prompt: string) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    });

    return response;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}
