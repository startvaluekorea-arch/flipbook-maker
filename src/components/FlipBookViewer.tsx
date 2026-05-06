'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import HTMLFlipBook from 'react-pageflip';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Layers, 
  Printer, 
  Search, 
  Maximize, 
  Minimize, 
  Download, 
  Share2, 
  Plus, 
  Minus,
  Settings,
  X
} from 'lucide-react';

interface LinkData {
  url?: string;
  destPage?: number;
  rect: { x: number; y: number; width: number; height: number };
}

interface PageData {
  pageNumber: number;
  imagePath: string;
  width: number;
  height: number;
  links: LinkData[];
}

interface FlipBookViewerProps {
  metadata: {
    bookId: string;
    originalFileName: string;
    totalPages: number;
    pageLabels?: string[];
    pages: PageData[];
  };
}

const Page = React.forwardRef((props: { page: PageData; onJump?: (pageIndex: number) => void }, ref: React.Ref<HTMLDivElement>) => {
  const { page, onJump } = props;
  return (
    <div className="demoPage bg-white shadow-2xl overflow-hidden relative" ref={ref}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={page.imagePath}
        alt={`Page ${page.pageNumber}`}
        className="w-full h-full object-contain pointer-events-none select-none"
        decoding="async"
      />
      {page.links.map((link, idx) => {
        const style = {
          left: `${link.rect.x}%`,
          top: `${link.rect.y}%`,
          width: `${link.rect.width}%`,
          height: `${link.rect.height}%`,
        };
        const className = "absolute z-10 hover:bg-blue-500/10 transition-colors rounded-sm border border-transparent hover:border-blue-500/30";

        const handleEvent = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
          e.stopPropagation();
          e.preventDefault();
        };

        if (link.destPage !== undefined && link.destPage !== null) {
          return (
            <div
              key={idx}
              className={`${className} cursor-pointer`}
              style={style}
              title={`Go to page ${link.destPage + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                const target = link.destPage!;
                if (onJump) setTimeout(() => onJump(target), 50);
              }}
              onPointerDown={handleEvent}
              onMouseDown={handleEvent}
              onTouchStart={handleEvent}
            />
          );
        } else if (link.url) {
          return (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
              style={style}
              title={link.url}
              onClick={handleEvent}
              onPointerDown={handleEvent}
              onMouseDown={handleEvent}
              onTouchStart={handleEvent}
            />
          );
        }
        return null;
      })}
    </div>
  );
});
Page.displayName = 'Page';

export default function FlipBookViewer({ metadata }: FlipBookViewerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('1');

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullScreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const [bookSize, setBookSize] = useState({ width: 600, height: 800 });

  // 화면 크기에 맞게 전자책 크기를 계산하는 함수
  const updateSize = useCallback(() => {
    if (!metadata.pages || metadata.pages.length === 0) return;

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 상단 툴바와 하단 컨트롤 패널이 차지하는 공간 예약 (여유 있게 220px 설정)
    const reservedHeight = 220; 
    const availableHeight = windowHeight - reservedHeight;
    const availableWidth = windowWidth - (windowWidth < 768 ? 40 : 120);

    // PDF 비율 유지
    const firstPage = metadata.pages[0];
    const pdfAspectRatio = firstPage.width / firstPage.height;
    const spreadAspectRatio = pdfAspectRatio * 2;

    let finalWidth, finalHeight;

    if (availableWidth / availableHeight > spreadAspectRatio) {
      finalHeight = availableHeight;
      finalWidth = finalHeight * spreadAspectRatio;
    } else {
      finalWidth = availableWidth;
      finalHeight = finalWidth / spreadAspectRatio;
    }

    setBookSize({
      width: Math.floor(finalWidth / 2),
      height: Math.floor(finalHeight)
    });
  }, [metadata.pages]);

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

  const onPageFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
    setPageInputValue((e.data + 1).toString());
  }, []);

  const jumpToPage = useCallback((pageIndex: number) => {
    if (bookRef.current) {
      bookRef.current.pageFlip().turnToPage(pageIndex);
    }
  }, []);

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInputValue);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= metadata.totalPages) {
      jumpToPage(pageNum - 1);
    } else {
      setPageInputValue((currentPage + 1).toString());
    }
  };

  const nextButtonClick = () => bookRef.current?.pageFlip().flipNext();
  const prevButtonClick = () => bookRef.current?.pageFlip().flipPrev();

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col w-screen h-screen overflow-hidden transition-all duration-500 ${isFullScreen ? 'bg-black p-0' : 'bg-zinc-950 p-0'}`}
    >
      {/* --- Top Utility Toolbar (Slim) --- */}
      <div className="flex-none w-full max-w-5xl mx-auto px-4 pt-3 pb-1 z-30">
        <div className="flex items-center justify-between px-5 py-1.5 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl text-white">
          <div className="flex items-center gap-2">
            <Link href="/gallery" className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-lg transition-all" title="Exit to Gallery">
              <X size={18} />
            </Link>
            <div className="w-px h-4 bg-white/10 mx-0.5" />
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all" title="Index"><Menu size={16} /></button>
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all" title="Thumbnails"><Layers size={16} /></button>
            <div className="w-px h-4 bg-white/10 mx-0.5" />
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all" title="Search"><Search size={16} /></button>
          </div>
          
          <div className="hidden md:flex items-center gap-2 text-[13px] font-medium tracking-tight opacity-40 truncate max-w-[200px]">
            {metadata.originalFileName}
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all" title="Print"><Printer size={16} /></button>
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all" title="Download"><Download size={16} /></button>
            <button className="p-1.5 hover:bg-white/10 rounded-lg transition-all" title="Share"><Share2 size={16} /></button>
            <div className="w-px h-4 bg-white/10 mx-0.5" />
            <button 
              onClick={toggleFullScreen} 
              className="p-1.5 hover:bg-white/10 rounded-lg transition-all text-blue-400"
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Viewer Section (Fully Responsive) --- */}
      <div className="flex-1 relative w-full flex justify-center items-center px-2 md:px-10 overflow-hidden">
        {/* Navigation Buttons (Floating) --- Now positioned slightly differently to avoid edge clipping */}
        <button
          onClick={prevButtonClick}
          className="absolute left-4 md:left-10 z-20 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl text-white hover:bg-white/20 disabled:opacity-5 transition-all hover:scale-110 active:scale-95"
          disabled={currentPage === 0}
        >
          <ChevronLeft size={32} />
        </button>
        
        <div className="w-full h-full max-w-full max-h-full flex justify-center items-center overflow-hidden">
          {/* @ts-expect-error - react-pageflip typings */}
          <HTMLFlipBook
            width={bookSize.width}
            height={bookSize.height}
            size="stretch"
            minWidth={200}
            maxWidth={1600}
            minHeight={300}
            maxHeight={2000}
            maxShadowOpacity={0.4}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPageFlip}
            className="flipbook-canvas"
            ref={bookRef}
            usePortrait={false}
            flippingTime={800}
            useMouseEvents={true}
            swipeDistance={40}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {metadata.pages.map((page) => (
              <Page key={page.pageNumber} page={page} onJump={jumpToPage} />
            ))}
          </HTMLFlipBook>
        </div>

        <button
          onClick={nextButtonClick}
          className="absolute right-4 md:right-10 z-20 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl text-white hover:bg-white/20 disabled:opacity-5 transition-all hover:scale-110 active:scale-95"
          disabled={currentPage >= metadata.totalPages - 1}
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* --- Bottom Navigation Control Panel (Fixed height) --- */}
      <div className="flex-none w-full max-w-4xl mx-auto px-4 py-6 z-30">
        <div className="flex flex-col gap-3 p-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl text-white">
          {/* Slider */}
          <div className="w-full px-2">
            <input 
              type="range" 
              min="0" 
              max={metadata.totalPages - 1} 
              value={currentPage}
              onChange={(e) => jumpToPage(parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-1">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><Plus size={16} /></button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><Minus size={16} /></button>
              <div className="w-px h-5 bg-white/10 mx-1" />
              <button className="px-3 py-1 hover:bg-white/10 rounded-lg transition-all text-[10px] font-bold tracking-widest uppercase opacity-50 hover:opacity-100">Auto Play</button>
            </div>

            <div className="flex items-center gap-4">
              <form onSubmit={handlePageInputSubmit} className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={pageInputValue}
                  onChange={(e) => setPageInputValue(e.target.value)}
                  className="w-10 h-8 bg-white/5 border border-white/10 rounded-lg text-center font-bold text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <span className="text-white/30 text-xs font-medium">/ {metadata.totalPages}</span>
              </form>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-all"><Settings size={16} /></button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .flipbook-canvas {
          margin: auto;
        }
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </div>
  );
}
