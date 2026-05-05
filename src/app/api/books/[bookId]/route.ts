import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    const { title } = await request.json();

    if (!bookId || !title) {
      return NextResponse.json({ error: 'Book ID and title are required' }, { status: 400 });
    }

    // 1. Fetch current metadata
    const { data, error: fetchError } = await supabase
      .from('books')
      .select('metadata')
      .eq('book_id', bookId)
      .single();

    if (fetchError || !data) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const metadata = data.metadata;
    metadata.originalFileName = title;

    // 2. Update metadata and name
    const { error: updateError } = await supabase
      .from('books')
      .update({ 
        name: title,
        metadata: metadata 
      })
      .eq('book_id', bookId);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, title });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    
    if (!bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    // 1. Delete from Storage (files under bookId/)
    // List files first
    const { data: files, error: listError } = await supabase.storage
      .from('flipbooks')
      .list(`${bookId}/images`);

    if (!listError && files) {
      const filesToDelete = files.map(f => `${bookId}/images/${f.name}`);
      if (filesToDelete.length > 0) {
        await supabase.storage
          .from('flipbooks')
          .remove(filesToDelete);
      }
    }

    // 2. Delete from Database
    const { error: deleteError } = await supabase
      .from('books')
      .delete()
      .eq('book_id', bookId);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
