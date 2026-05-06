import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  try {
    const { bookId } = await params;
    
    const filePath = `${bookId}/original.pdf`;

    const { data } = supabase.storage
      .from('flipbooks')
      .getPublicUrl(filePath);

    if (!data || !data.publicUrl) {
      return new NextResponse('PDF not found', { status: 404 });
    }

    const response = await fetch(data.publicUrl);
    if (!response.ok) {
      return new NextResponse('Original PDF not found in storage. Only newer books support downloads.', { status: 404 });
    }

    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="original.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
