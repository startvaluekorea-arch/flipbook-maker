import { notFound } from 'next/navigation';
import FlipBookViewer from '@/components/FlipBookViewer';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

export default async function ViewerPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  
  // 1. Fetch metadata from Supabase Database
  const { data, error } = await supabase
    .from('books')
    .select('metadata')
    .eq('book_id', bookId)
    .single();
  
  if (error || !data) {
    notFound();
  }

  const metadata = data.metadata;

  return (
    <main className="h-screen w-screen bg-black overflow-hidden flex flex-col">
      <FlipBookViewer metadata={metadata} />
    </main>
  );
}
