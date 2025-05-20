import { NextRequest, NextResponse } from 'next/server';
import { generateStream } from '@/app/actions/openai';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const stream = await generateStream(prompt);

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(encoder.encode(`data: ${text}\n\n`));
          }
        }
        controller.close();
      },
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
