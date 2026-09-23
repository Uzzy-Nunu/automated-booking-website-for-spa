-- Migration: create kb_chunks table
CREATE EXTENSION IF NOT EXISTS vector;  -- ensure pgvector is available

CREATE TABLE IF NOT EXISTS kb_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  embedding vector(768) NOT NULL,
  source_section text,
  updated_at timestamp NOT NULL DEFAULT now()
);

-- Create an index for efficient cosine similarity search.
-- Adjust the index type (ivfflat, hnsw) based on your pgvector version.
CREATE INDEX IF NOT EXISTS kb_chunks_embedding_idx ON kb_chunks USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
