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
    <main className="min-h-screen flex flex-col relative isolate">
      {/* Background Image & Overlay */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=3840&auto=format&fit=crop"
          alt="Wood Background"
          fill
          priority
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="flex-1 flex flex-col justify-center py-12">
        <FlipBookViewer metadata={metadata} />
      </div>
    </main>
  );
}
