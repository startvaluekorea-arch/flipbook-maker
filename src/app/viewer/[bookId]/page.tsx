import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import FlipBookViewer from '@/components/FlipBookViewer';
import Image from 'next/image';

export default async function ViewerPage({ params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  
  // Read metadata from local storage
  const metadataPath = path.join(process.cwd(), 'data', 'books', bookId, 'metadata.json');
  
  if (!fs.existsSync(metadataPath)) {
    notFound();
  }

  const metadataContent = fs.readFileSync(metadataPath, 'utf8');
  const metadata = JSON.parse(metadataContent);

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
