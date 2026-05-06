import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookId: string; fileName: string }> }
) {
  try {
    const { bookId, fileName } = await params;
    
    // Construct the path in Supabase Storage
    const filePath = `${bookId}/images/${fileName}`;

    // Get the public URL for the file
    const { data } = supabase.storage
      .from('flipbooks')
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      return new NextResponse('Not Found', { status: 404 });
    }

    // Proxy the image content instead of redirecting
    const response = await fetch(data.publicUrl);
    if (!response.ok) {
      return new NextResponse('Image not found in storage', { status: 404 });
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/webp',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
