import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface BookSummary {
  bookId: string;
  originalFileName: string;
  totalPages: number;
  createdAt: string;
  coverImage: string;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const books: BookSummary[] = (data || []).map((book: { book_id: string; name: string; total_pages: number; created_at: string }) => ({
      bookId: book.book_id,
      originalFileName: book.name,
      totalPages: book.total_pages,
      createdAt: book.created_at,
      coverImage: `/api/images/${book.book_id}/page_1.webp`,
    }));

    return NextResponse.json(books);
  } catch (error) {
    console.error('Error listing books:', error);
    return NextResponse.json({ error: 'Failed to list books' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const metadataString = formData.get('metadata') as string;
    
    if (!metadataString) {
      return NextResponse.json({ error: 'No metadata provided' }, { status: 400 });
    }

    const metadata = JSON.parse(metadataString);
    const bookId = metadata.bookId;

    // 1. Prepare upload tasks
    const uploadTasks: Promise<void>[] = [];
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
      if (key.startsWith('page_') && value instanceof Blob) {
        const uploadTask = (async () => {
          const buffer = await value.arrayBuffer();
          const filePath = `${bookId}/images/${key}.webp`;
          
          const { error: uploadError } = await supabase.storage
            .from('flipbooks')
            .upload(filePath, buffer, {
              contentType: 'image/webp',
              upsert: true
            });

          if (uploadError) {
            throw new Error(`Error uploading ${key}: ${uploadError.message}`);
          }

          // Update metadata with the API path
          const pageIndex = parseInt(key.split('_')[1]) - 1;
          if (metadata.pages[pageIndex]) {
            metadata.pages[pageIndex].imagePath = `/api/images/${bookId}/${key}.webp`;
          }
        })();
        uploadTasks.push(uploadTask);
      }
    }

    // 2. Execute all uploads in parallel
    await Promise.all(uploadTasks);

    // 3. Save metadata to Supabase Database
    const { error: dbError } = await supabase
      .from('books')
      .insert({
        book_id: bookId,
        name: metadata.originalFileName || bookId,
        total_pages: metadata.totalPages || 0,
        metadata: metadata
      });

    if (dbError) {
      console.error('Database insert error:', dbError);
      throw new Error(`Database error: ${dbError.message}`);
    }

    return NextResponse.json({ success: true, bookId });
  } catch (error: unknown) {
    console.error('Error saving book:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to save book';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
