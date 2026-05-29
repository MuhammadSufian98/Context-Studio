import { Groq } from 'groq-sdk';
import { SYSTEM_PROMPTS, REFINEMENT_PROMPT } from '../../../lib/prompts';
import { estimateTokens, calculateCost } from '../../../utils/tokenMetrics';

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

    const criteria = transformation || (followUp ? 'refinement' : 'summarize');
    const sourcePayload = followUp || text || '';
    console.log(`[API] Refinement cycle initialized for transformation rule: "${criteria}"`);
    console.log(`[API] Payload Preview: "${sourcePayload.substring(0, 50)}..." (${sourcePayload.length} chars)`);

    let messages = [];

    if (followUp) {
      messages = [
        { role: 'system', content: REFINEMENT_PROMPT },
        ...history,
        { role: 'user', content: followUp }
      ];
    } else {
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
      temperature,
    }, {
      signal: req.signal,
    });

    console.log('[API] Upstream (Groq) text stream connection established.');

    let fullContent = '';

    const responseStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              controller.enqueue(new TextEncoder().encode(content));
            }
          }
          
          console.log('[API] Network stream layer delivery complete.');
          
          const inputContent = messages.map(m => m.content).join(' ');
          const inputTokens = estimateTokens(inputContent);
          const outputTokens = estimateTokens(fullContent);
          const cost = calculateCost(inputTokens, outputTokens);
          
          console.log(`\n--- [Server Telemetry Summary] ---`);
          console.log(`Transformation Rule : ${criteria}`);
          console.log(`Estimated Tokens    : ${inputTokens + outputTokens}`);
          console.log(`Calculated Cost     : $${cost.toFixed(5)}`);
          console.log(`-----------------------------------\n`);

          controller.close();
        } catch (error) {
          if (error.name === 'AbortError' || error.message?.includes('aborted')) {
            console.warn(`[API] Connection cleanly terminated by client abort signal.`);
          } else {
            console.error(`[API Exception Thrown]:`, error.message);
          }
          controller.error(error);
        }
      },
      cancel() {
        console.warn(`[API] Connection cleanly terminated by client abort signal.`);
      }
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
    if (error.name === 'AbortError' || error.message?.includes('aborted')) {
      console.warn(`[API] Connection cleanly terminated by client abort signal.`);
    } else {
      console.error(`[API Exception Thrown]:`, error.message);
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
