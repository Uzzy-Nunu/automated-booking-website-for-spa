import { NextResponse } from 'next/server';
import type { ChatPayload, ChatResponse } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { getGenAI } from '@/lib/geminiClient';
import { checkRateLimit } from '@/lib/rateLimit';
import { calculateTotal, createBooking, checkAvailability } from '@/lib/chatbotTools';

export const availableTools = {
  calculateTotal,
  createBooking,
  checkAvailability,
};

/**
 * Retrieve top matching chunks from Supabase pgvector table kb_chunks
 */
export async function retrieveRelevantChunks(query: string): Promise<string[]> {
  try {
    const genAI = getGenAI();
    const embedModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const { embedding } = await embedModel.embedContent(query);

    const { data, error } = await supabase.rpc('match_kb_chunks', {
      query_embedding: embedding.values,
      match_count: 3,
    });

    if (error) {
      console.error('Supabase vector search RPC error:', error);
      return [];
    }

    return (data as { content: string }[]).map(row => row.content);
  } catch (err) {
    console.error('Failed to retrieve chunks:', err);
    return [];
  }
}

/**
 * Log message to chat_logs table in Supabase
 */
async function logChatMessage(sessionId: string, role: string, message: string, flagged: boolean = false) {
  try {
    await supabase.from('chat_logs').insert({
      session_id: sessionId,
      role,
      message,
      flagged_complaint: flagged,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to log chat message:', err);
  }
}

export async function POST(request: Request) {
  try {
    const payload: ChatPayload = await request.json();
    const { session_id, message } = payload;

    if (!session_id || !message) {
      return NextResponse.json({ error: 'Missing session_id or message' }, { status: 400 });
    }

    // Rate Limiting (10 requests / min per session_id)
    const rateLimit = checkRateLimit(session_id, 10, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a minute before sending more messages.' },
        { status: 429 }
      );
    }

    // Log user message
    const isComplaint = /complaint|angry|dissatisfied|refund|bad service/i.test(message);
    await logChatMessage(session_id, 'user', message, isComplaint);

    // RAG Retrieval
    const chunks = await retrieveRelevantChunks(message);

    const systemPrompt = `You are a warm, calm, professional AI concierge for Reaus Spa (Lagos).
Answer the user's questions accurately using the provided context chunks.
Available tools:
- calculate_total: calculate combined total price for spa treatments.
- create_booking: book an appointment.
- check_availability: verify open time slots.

Context:
${chunks.join('\n---\n')}
`;

    const genAI = getGenAI();
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    // Execute Generation
    const result = await model.generateContent(message);

    const responseText = result.response?.text() ?? 'I am here to assist you with Reaus Spa bookings and services.';

    // Log assistant message
    await logChatMessage(session_id, 'assistant', responseText, false);

    const response: ChatResponse = { session_id, answer: responseText };
    return NextResponse.json(response);
  } catch (err) {
    console.error('Chat API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
