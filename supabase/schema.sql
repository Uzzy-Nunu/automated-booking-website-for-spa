-- Complete Supabase schema for the Reaus Spa project
-- This file can be copied‑pasted into the Supabase SQL editor to create the necessary tables and indexes.

-- Enable pgvector extension (required for embeddings)
CREATE EXTENSION IF NOT EXISTS vector;

-- ------------------------------------------------------------
-- Table: kb_chunks
-- Stores knowledge‑base chunks with their embeddings for RAG.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS kb_chunks (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  content       text        NOT NULL,
  embedding     vector(768) NOT NULL,               -- matches Gemini embedding size
  source_section text,
  updated_at    timestamp   NOT NULL DEFAULT now()
);

-- Index for efficient cosine‑similarity search (adjust type if needed)
CREATE INDEX IF NOT EXISTS kb_chunks_embedding_idx
  ON kb_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ------------------------------------------------------------
-- Table: chat_logs
-- Stores each message exchanged with the chatbot for audit/complaint handling.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_logs (
  id                uuid      PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id        text      NOT NULL,
  role              text      NOT NULL,               -- 'user' or 'assistant'
  message           text      NOT NULL,
  flagged_complaint boolean   DEFAULT false,
  created_at        timestamp NOT NULL DEFAULT now()
);

-- Index to quickly fetch a conversation's history
CREATE INDEX IF NOT EXISTS chat_logs_session_idx ON chat_logs (session_id);

-- ------------------------------------------------------------
-- Helper function for vector similarity (pgvector extension provides <=> operator)
-- Returns the top N most similar kb_chunks for a given embedding.
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION match_kb_chunks(query_embedding vector, match_count int)
RETURNS SETOF kb_chunks AS $$
  SELECT * FROM kb_chunks
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$ LANGUAGE sql STABLE;
