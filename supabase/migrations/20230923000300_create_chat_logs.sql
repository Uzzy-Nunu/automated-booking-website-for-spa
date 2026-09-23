-- Migration: create chat_logs table
CREATE EXTENSION IF NOT EXISTS vector;  -- ensure pgvector is available (not needed for this table but kept for consistency)

CREATE TABLE IF NOT EXISTS chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  role text NOT NULL,          -- 'user' or 'assistant'
  message text NOT NULL,
  flagged_complaint boolean DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now()
);

-- Index on session_id for fast lookup of conversation history
CREATE INDEX IF NOT EXISTS chat_logs_session_idx ON chat_logs (session_id);
