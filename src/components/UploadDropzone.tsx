'use client';

import React, { useState, useCallback } from 'react';
import { UploadCloud, File, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

interface LinkData {
  url?: string;
  destPage?: number;
  rect: { x: number; y: number; width: number; height: number };
}

interface PageData {
  pageNumber: number;
  width: number;
  height: number;
  links: LinkData[];
  imagePath: string;
}

export default function UploadDropzone() {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processPDF = useCallback(async (file: File) => {
    setIsUploading(true);
    setStatus('PDF 파싱 준비 중...');
    setProgress(0);

    try {
      const pdfjs = await import('pdfjs-dist');
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ 
        data: arrayBuffer,
        cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
      }).promise;
      const totalPages = pdf.numPages;
      const pagesData: PageData[] = [];
      const bookId = `book_${Date.now()}`;
      
      let pageLabels: string[] | null = null;
      try {
        pageLabels = await pdf.getPageLabels();
      } catch {
        console.warn('Failed to get page labels');
      }

      for (let i = 1; i <= totalPages; i++) {
        setStatus(`페이지 변환 중... (${i}/${totalPages})`);
        setProgress(Math.round((i / totalPages) * 50)); // 50% for parsing

        const page = await pdf.getPage(i);
        const scale = 2.0; // Optimized for stability and good quality
        const viewport = page.getViewport({ scale });

        // Extract Links
        const annotations = await page.getAnnotations({ intent: 'display' });
        const links: LinkData[] = [];
        
        for (const a of annotations) {
          if (a.subtype === 'Link' && (a.url || a.dest)) {
            // Convert PDF coordinates to viewport coordinates
            const [x1, y1, x2, y2] = a.rect;
            const rect = viewport.convertToViewportRectangle([x1, y1, x2, y2]);
            // Convert to percentage relative to viewport
            const x = (Math.min(rect[0], rect[2]) / viewport.width) * 100;
            const y = (Math.min(rect[1], rect[3]) / viewport.height) * 100;
            const width = (Math.abs(rect[2] - rect[0]) / viewport.width) * 100;
            const height = (Math.abs(rect[3] - rect[1]) / viewport.height) * 100;

            let destPage: number | undefined = undefined;
            if (a.dest) {
              try {
                let explicitDest = a.dest;
                if (typeof explicitDest === 'string') {
                  explicitDest = await pdf.getDestination(explicitDest);
                }
                if (explicitDest && explicitDest[0]) {
                  const pageIndex = await pdf.getPageIndex(explicitDest[0]);
                  destPage = pageIndex; // 0-based physical page index
                }
              } catch {
                console.warn('Failed to resolve internal destination', a.dest);
              }
            }

            links.push({ url: a.url || '', destPage, rect: { x, y, width, height } });
          }
        }

        // Render to Canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d')!; // Revert to default for better compatibility
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // Ensure canvas background is white
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          background: 'white',
          canvas: canvas,
        };

        await page.render(renderContext).promise;

        // Convert to WebP
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/webp', 0.95);
        });

        // Upload directly to Supabase from client to avoid server payload limits
        const filePath = `${bookId}/images/page_${i}.webp`;
        
        const { error: uploadError } = await supabase.storage
          .from('flipbooks')
          .upload(filePath, blob, {
            contentType: 'image/webp',
            upsert: true
          });

        if (uploadError) {
          throw new Error(`페이지 ${i} 업로드 실패: ${uploadError.message}`);
        }

        pagesData.push({
          pageNumber: i,
          width: viewport.width,
          height: viewport.height,
          links,
          imagePath: `/api/images/${bookId}/page_${i}.webp`
        });
      }

      setStatus('서버에 정보 저장 중...');
      setProgress(90);

      const metadata = {
        bookId,
        originalFileName: file.name,
        createdAt: new Date().toISOString(),
        totalPages,
        status: 'COMPLETED',
        pageLabels,
        pages: pagesData,
      };

      const formData = new FormData();
      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch('/api/books', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      setProgress(100);
      setStatus('완료!');

      setTimeout(() => {
        router.push(`/viewer/${bookId}`);
      }, 1000);

    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      setStatus(`오류: ${errorMessage}`);
      setIsUploading(false);
    }
  }, [router]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      processPDF(file);
    } else {
      alert('PDF 파일만 업로드 가능합니다.');
    }
  }, [processPDF]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processPDF(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-10">
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all backdrop-blur-xl ${
          isDragging ? 'border-blue-400 bg-blue-500/10' : 'border-white/20 hover:border-white/40 bg-white/5 ring-1 ring-white/10'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isUploading}
        />
        
        {!isUploading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white/10 rounded-full text-white/80">
              <UploadCloud size={40} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">PDF 파일을 드래그 앤 드롭 하세요</h3>
              <p className="text-white/60 mt-2">또는 클릭하여 파일을 선택하세요</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-16 h-16">
              {progress === 100 ? (
                <CheckCircle size={64} className="text-green-400" />
              ) : (
                <Loader2 size={64} className="text-blue-400 animate-spin" />
              )}
            </div>
            <div className="w-full max-w-md">
              <div className="flex justify-between text-sm mb-2 font-medium text-white/80">
                <span>{status}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
