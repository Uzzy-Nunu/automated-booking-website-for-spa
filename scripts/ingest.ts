import { supabase } from '@/lib/supabaseClient';
import { readFileSync } from 'fs';
import { getGenAI } from '@/lib/geminiClient';
import path from 'path';

interface ChunkItem {
  section: string;
  content: string;
}

// Chunker: split markdown by headings (## / ###) while tracking section titles
function chunkMarkdown(text: string): ChunkItem[] {
  const lines = text.split('\n');
  const chunks: ChunkItem[] = [];
  let currentSection = 'General Information';
  let currentBuffer: string[] = [];

  for (const line of lines) {
    if (line.startsWith('#')) {
      if (currentBuffer.length > 0) {
        chunks.push({
          section: currentSection,
          content: currentBuffer.join('\n').trim(),
        });
        currentBuffer = [];
      }
      currentSection = line.replace(/^#+\s*/, '').trim();
    } else {
      currentBuffer.push(line);
    }
  }

  if (currentBuffer.length > 0) {
    chunks.push({
      section: currentSection,
      content: currentBuffer.join('\n').trim(),
    });
  }

  return chunks.filter(c => c.content.length > 10);
}

async function embedChunk(chunkText: string): Promise<number[]> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const embedResponse = await model.embedContent(chunkText);
  return embedResponse.embedding.values;
}

export async function ingest() {
  const sourcePath = path.resolve('reausspa-source-of-truth.md');
  const raw = readFileSync(sourcePath, 'utf-8');
  const chunks = chunkMarkdown(raw);
  console.log(`Generated ${chunks.length} chunks from source-of-truth document`);

  for (const item of chunks) {
    try {
      const embedding = await embedChunk(item.content);
      const { error } = await supabase.from('kb_chunks').insert({
        content: item.content,
        embedding: embedding,
        source_section: item.section,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        console.error(`Supabase insert error for section "${item.section}":`, error);
      } else {
        console.log(`Ingested section: "${item.section}"`);
      }
    } catch (err) {
      console.error(`Failed embedding section "${item.section}":`, err);
    }
  }
  console.log('Ingestion process finished.');
}

if (require.main === module) {
  ingest().catch(console.error);
}
