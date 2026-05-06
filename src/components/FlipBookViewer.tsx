'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
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
  Settings
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

  // Sync input value with current page
  useEffect(() => {
    setPageInputValue((currentPage + 1).toString());
  }, [currentPage]);

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

  const firstPage = metadata.pages[0];
  const baseWidth = firstPage ? firstPage.width : 800;
  const baseHeight = firstPage ? firstPage.height : 1131;

  const onPageFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
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
      className={`flex flex-col w-full h-full min-h-[80vh] items-center transition-all duration-500 ${isFullScreen ? 'bg-zinc-900 p-0' : 'bg-transparent'}`}
    >
      {/* --- Top Utility Toolbar --- */}
      <div className="w-full max-w-6xl px-4 mt-4 mb-6 z-30">
        <div className="flex items-center justify-between px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[1.5rem] shadow-2xl text-white">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-xl transition-all" title="Index"><Menu size={20} /></button>
            <button className="p-2 hover:bg-white/10 rounded-xl transition-all" title="Thumbnails"><Layers size={20} /></button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button className="p-2 hover:bg-white/10 rounded-xl transition-all" title="Search"><Search size={20} /></button>
          </div>
          
          <div className="hidden md:flex items-center gap-2 font-medium tracking-tight opacity-90">
            {metadata.originalFileName}
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-white/10 rounded-xl transition-all" title="Print"><Printer size={20} /></button>
            <button className="p-2 hover:bg-white/10 rounded-xl transition-all" title="Download"><Download size={20} /></button>
            <button className="p-2 hover:bg-white/10 rounded-xl transition-all" title="Share"><Share2 size={20} /></button>
            <div className="w-px h-6 bg-white/10 mx-1" />
            <button 
              onClick={toggleFullScreen} 
              className="p-2 hover:bg-white/10 rounded-xl transition-all text-blue-400"
              title={isFullScreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullScreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Viewer Section --- */}
      <div className="relative flex-1 w-full flex justify-center items-center px-4 md:px-16 overflow-hidden">
        {/* Navigation Buttons (Desktop) */}
        <button
          onClick={prevButtonClick}
          className="hidden md:flex absolute left-8 z-20 p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full shadow-2xl text-white hover:bg-white/20 disabled:opacity-5 transition-all hover:scale-110 active:scale-95"
          disabled={currentPage === 0}
        >
          <ChevronLeft size={32} />
        </button>
        
        <div className="w-full max-w-[95vw] h-full flex justify-center items-center perspective-1000">
          {/* @ts-expect-error - react-pageflip typings */}
          <HTMLFlipBook
            width={baseWidth}
            height={baseHeight}
            size="stretch"
            minWidth={315}
            maxWidth={2000}
            minHeight={400}
            maxHeight={3000}
            maxShadowOpacity={0.35}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPageFlip}
            className="flipbook-canvas shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
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
          className="hidden md:flex absolute right-8 z-20 p-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-full shadow-2xl text-white hover:bg-white/20 disabled:opacity-5 transition-all hover:scale-110 active:scale-95"
          disabled={currentPage >= metadata.totalPages - 1}
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* --- Bottom Navigation Control Panel --- */}
      <div className="w-full max-w-4xl px-4 mt-6 mb-10 z-30">
        <div className="flex flex-col gap-4 p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl text-white">
          {/* Slider */}
          <div className="w-full px-2">
            <input 
              type="range" 
              min="0" 
              max={metadata.totalPages - 1} 
              value={currentPage}
              onChange={(e) => jumpToPage(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
          </div>

          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-xl transition-all"><Plus size={18} /></button>
              <button className="p-2 hover:bg-white/10 rounded-xl transition-all"><Minus size={18} /></button>
              <div className="w-px h-6 bg-white/10 mx-1" />
              <button className="p-2 hover:bg-white/10 rounded-xl transition-all text-xs font-bold tracking-widest uppercase opacity-70 hover:opacity-100">Auto Play</button>
            </div>

            <div className="flex items-center gap-4">
              <form onSubmit={handlePageInputSubmit} className="flex items-center gap-3">
                <input 
                  type="text" 
                  value={pageInputValue}
                  onChange={(e) => setPageInputValue(e.target.value)}
                  className="w-12 h-9 bg-white/10 border border-white/20 rounded-lg text-center font-bold focus:outline-none focus:border-blue-500/50 transition-all"
                />
                <span className="text-white/50 font-medium">/ {metadata.totalPages}</span>
              </form>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-xl transition-all"><Settings size={18} /></button>
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
