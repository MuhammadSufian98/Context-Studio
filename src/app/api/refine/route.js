import { Groq } from 'groq-sdk';
import { SYSTEM_PROMPTS, REFINEMENT_PROMPT } from '../../../lib/prompts';

export const dynamic = 'force-dynamic';

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.warn('Warning: GROQ_API_KEY is missing.');
    return null;
  }
  return new Groq({ apiKey });
};

export async function POST(req) {
  try {
    const groq = getGroqClient();
    if (!groq) {
      return new Response(JSON.stringify({ error: 'Server configuration error: API key missing' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { text, transformation, history, followUp, temperature = 0.7 } = await req.json();

    if (!text && !followUp) {
      return new Response('Missing text or follow-up', { status: 400 });
    }

    let messages = [];

    if (followUp) {
      // Refinement mode: Use history and the latest user request
      messages = [
        { role: 'system', content: REFINEMENT_PROMPT },
        ...history,
        { role: 'user', content: followUp }
      ];
    } else {
      // Initial transformation mode
      const systemPrompt = SYSTEM_PROMPTS[transformation] || SYSTEM_PROMPTS.summarize;
      messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ];
    }

    const stream = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      stream: true,
      temperature, // Apply temperature
    }, {
      signal: req.signal, // Pass the request signal to Groq
    });

    // Create a ReadableStream to pipe the tokens to the client
    const responseStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(responseStream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Content-Type-Options': 'nosniff',
      },
    });

  } catch (error) {
    console.error('Groq API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
