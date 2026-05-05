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

    // Redirect to the actual Supabase Storage URL
    return NextResponse.redirect(data.publicUrl);
  } catch (error) {
    console.error('Error serving image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
