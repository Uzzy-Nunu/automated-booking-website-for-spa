'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Message {
  sender: 'bot' | 'user';
  text: string;
}

export default function ChatWidget() {
  const [sessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      let sid = localStorage.getItem('reaus_chat_sid');
      if (!sid) {
        sid = 'sid_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('reaus_chat_sid', sid);
      }
      return sid;
    }
    return 'sid_default';
  });
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Welcome to the best spa in Lagos! How may I help you today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fallback, setFallback] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, message: userText }),
      });

      if (res.status === 429) {
        setMessages(prev => [
          ...prev,
          { sender: 'bot', text: 'You are sending messages too quickly. Please wait a minute before trying again.' },
        ]);
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('API error');
      }

      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'bot', text: data.answer }]);
    } catch {
      setFallback(true);
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Our concierge is briefly unavailable — reach us on WhatsApp at +234 800 REAUS-SPA for instant assistance.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestHandoff = async () => {
    setLoading(true);
    try {
      await fetch('/api/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          complaint_details: 'User requested human team member assistance via chat widget.',
        }),
      });
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          text: 'Your request has been routed to our team. A staff member will follow up with you shortly.',
        },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: 'Please contact us directly on WhatsApp at +234 800 REAUS-SPA.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-800 text-white p-4 rounded-full shadow-lg hover:bg-amber-900 transition flex items-center gap-2"
          aria-label="Open Chat Concierge"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="hidden sm:inline font-medium text-sm">Concierge</span>
        </button>
      ) : (
        <div className="bg-amber-50/95 backdrop-blur border border-amber-900/20 rounded-2xl shadow-2xl w-[90vw] max-w-sm h-[500px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-stone-900 text-amber-50 p-4 flex justify-between items-center">
            <div>
              <h2 className="font-serif font-bold text-lg">Reaus Spa Concierge</h2>
              <p className="text-xs text-amber-200/80">Always at your service</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-amber-200 hover:text-white p-1"
              aria-label="Close Chat"
            >
              ✕
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    m.sender === 'user'
                      ? 'bg-amber-800 text-white rounded-br-none'
                      : 'bg-white text-stone-800 border border-amber-200 shadow-sm rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-xl text-xs text-stone-500 border border-amber-200">
                  Concierge is typing...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Action Footer */}
          {fallback && (
            <div className="px-4 py-2 bg-amber-100 text-xs text-amber-900 text-center">
              WhatsApp: <a href="https://wa.me/2348007328777" className="underline font-bold">+234 800 REAUS-SPA</a>
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 border-t border-amber-200/60 bg-white flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask a question or request booking..."
              className="flex-1 text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-700"
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-amber-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-amber-900 disabled:opacity-50"
            >
              Send
            </button>
          </div>

          <div className="px-3 pb-2 bg-white flex justify-between items-center text-[10px] text-stone-400">
            <span>Powered by Gemini AI</span>
            <button onClick={handleRequestHandoff} className="hover:underline text-amber-800">
              Speak to Human
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
