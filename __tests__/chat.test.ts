import { retrieveRelevantChunks, POST } from '@/app/api/chat/route';

// Mock dependencies
jest.mock('@/lib/supabaseClient', () => ({
  supabase: {
    rpc: jest.fn().mockResolvedValue({
      data: [{ content: 'Mock spa treatment details' }],
      error: null,
    }),
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockResolvedValue({ data: null, error: null }),
    }),
  },
}));

jest.mock('@/lib/geminiClient', () => ({
  getGenAI: jest.fn().mockReturnValue({
    getGenerativeModel: jest.fn().mockReturnValue({
      embedContent: jest.fn().mockResolvedValue({
        embedding: { values: [0.1, 0.2, 0.3] },
      }),
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => 'Welcome to Reaus Spa! How can I assist you today?' },
      }),
    }),
  }),
}));

describe('Chat API & Retrieval Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('retrieveRelevantChunks', () => {
    it('should embed query and return content chunks from Supabase RPC', async () => {
      const chunks = await retrieveRelevantChunks('What are your prices?');
      expect(Array.isArray(chunks)).toBe(true);
      expect(chunks.length).toBeGreaterThan(0);
      expect(chunks[0]).toBe('Mock spa treatment details');
    });
  });

  describe('POST /api/chat', () => {
    it('should return 400 if session_id or message is missing', async () => {
      const req = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: 'Hello' }),
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });

    it('should respond successfully with answer for valid request', async () => {
      const req = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ session_id: 'test-session-123', message: 'Hello spa' }),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.session_id).toBe('test-session-123');
      expect(json.answer).toContain('Welcome to Reaus Spa');
    });

    it('should trigger rate limit when exceeding limit', async () => {
      const sessionId = 'rate-limit-session';
      for (let i = 0; i < 10; i++) {
        const req = new Request('http://localhost/api/chat', {
          method: 'POST',
          body: JSON.stringify({ session_id: sessionId, message: `Msg ${i}` }),
        });
        await POST(req);
      }

      // 11th request should be rate limited
      const reqExceeded = new Request('http://localhost/api/chat', {
        method: 'POST',
        body: JSON.stringify({ session_id: sessionId, message: 'Excess message' }),
      });
      const resExceeded = await POST(reqExceeded);
      expect(resExceeded.status).toBe(429);
    });
  });
});
