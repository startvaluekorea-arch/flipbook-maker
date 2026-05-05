import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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

    const metadataPath = path.join(process.cwd(), 'data', 'books', bookId, 'metadata.json');

    if (!fs.existsSync(metadataPath)) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf-8'));
    metadata.originalFileName = title; // Update the title

    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

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

    const bookDir = path.join(process.cwd(), 'data', 'books', bookId);

    if (!fs.existsSync(bookDir)) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    // Delete the entire book directory recursively
    fs.rmSync(bookDir, { recursive: true, force: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}
