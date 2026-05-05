import UploadDropzone from '@/components/UploadDropzone';
import Footer from '@/components/Footer';
import ResponsiveHeroBanner from '@/components/ui/responsive-hero-banner';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <ResponsiveHeroBanner>
        <div className="max-w-2xl mx-auto px-6">
          <UploadDropzone />
        </div>
      </ResponsiveHeroBanner>
      <Footer />
    </main>
  );
}
