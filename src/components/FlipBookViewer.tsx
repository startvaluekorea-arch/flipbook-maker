'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
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
  X,
  ZoomIn
} from 'lucide-react';
import { TransformWrapper, TransformComponent, useTransformContext } from 'react-zoom-pan-pinch';

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

// --- Navigator (Minimap) Component ---
const Navigator = ({ imagePath, imageSize }: { imagePath: string[]; imageSize: { width: number; height: number } }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context = useTransformContext() as any;
  const { state, setTransform } = context;
  const { scale, positionX, positionY } = state;
  const navRef = useRef<HTMLDivElement>(null);
  
  // 내비게이터 고정 너비 (펼침면이므로 더 넓게 280px)
  const navWidth = 280; 
  const ratio = imageSize.height / imageSize.width;
  const navHeight = navWidth * ratio;

  // 화면 크기 대비 가시 영역(빨간 상자) 크기 계산
  const viewWidth = (window.innerWidth / (imageSize.width * scale)) * navWidth;
  const viewHeight = (window.innerHeight / (imageSize.height * scale)) * navHeight;
  
  // 패닝 위치에 따른 상자 위치 계산
  const x = (-positionX / (imageSize.width * scale)) * navWidth;
  const y = (-positionY / (imageSize.height * scale)) * navHeight;

  // 내비게이터 클릭/드래그 시 메인 화면 이동 로직
  const handleInteraction = (e: React.MouseEvent) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // 클릭한 지점이 빨간 상자의 중심이 되도록 타겟 위치 계산
    const targetX = -((mouseX - viewWidth / 2) / navWidth) * (imageSize.width * scale);
    const targetY = -((mouseY - viewHeight / 2) / navHeight) * (imageSize.height * scale);

    setTransform(targetX, targetY, scale, 0);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    handleInteraction(e);
    const moveHandler = (moveEvent: MouseEvent) => {
      handleInteraction(moveEvent as unknown as React.MouseEvent);
    };
    const upHandler = () => {
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseup', upHandler);
    };
    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('mouseup', upHandler);
  };

  return (
    <div 
      ref={navRef}
      className="absolute top-24 left-6 z-[100] border-2 border-white/30 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] bg-zinc-900/80 backdrop-blur-xl animate-in fade-in slide-in-from-left-4 duration-500 cursor-crosshair" 
      style={{ width: navWidth, height: navHeight }}
      onMouseDown={onMouseDown}
    >
      <div className="absolute top-0 left-0 w-full px-3 py-1.5 bg-black/40 border-b border-white/10 z-10 flex items-center justify-between pointer-events-none">
        <span className="text-[10px] font-bold text-white/50 tracking-widest uppercase">Navigator</span>
        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      </div>
      <div className="w-full h-full flex pointer-events-none">
        {imagePath.map((path, idx) => (
          <img key={idx} src={path} className="h-full object-cover opacity-60 flex-1" alt="Minimap" />
        ))}
      </div>
      <div 
        className="absolute border-2 border-red-500 bg-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-75 pointer-events-none"
        style={{
          width: Math.min(viewWidth, navWidth),
          height: Math.min(viewHeight, navHeight),
          left: Math.max(0, Math.min(x, navWidth - viewWidth)),
          top: Math.max(0, Math.min(y, navHeight - viewHeight)),
        }}
      />
    </div>
  );
};

export default function FlipBookViewer({ metadata }: FlipBookViewerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [pageInputValue, setPageInputValue] = useState('1');
  
  // 확대 관련 상태
  const [isZoomMode, setIsZoomMode] = useState(false);
  const [zoomedSpread, setZoomedSpread] = useState<PageData[] | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState(0);

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomedSpread) setZoomedSpread(null);
        else if (isZoomMode) setIsZoomMode(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [zoomedSpread, isZoomMode]);

  // 화면 크기에 맞게 전자책 크기를 계산하는 함수
  const calculateSize = useCallback(() => {
    if (typeof window === 'undefined' || !metadata.pages || metadata.pages.length === 0) {
      return { width: 400, height: 550 };
    }

    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 툴바와 조작바 공간을 예약 (모바일/데스크톱 분기)
    const reservedHeight = windowWidth < 768 ? 160 : 220; 
    const availableHeight = Math.max(windowHeight - reservedHeight, 300);
    // 좌우 여백 최적화 (모바일 30px, 데스크톱 120px)
    const availableWidth = windowWidth - (windowWidth < 768 ? 30 : 120);

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

    // 화면 가용 공간의 95%를 활용하여 최대한 크게 표시
    const scaleFactor = 0.95;
    return {
      width: Math.floor((finalWidth / 2) * scaleFactor),
      height: Math.floor(finalHeight * scaleFactor)
    };
  }, [metadata.pages]);

  // 상태 초기화 시점에 즉시 계산하여 useEffect 내 setState 호출 방지
  const [bookSize, setBookSize] = useState(calculateSize);

  useEffect(() => {
    const handleResize = () => setBookSize(calculateSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateSize]);

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

  const handlePageClick = (page: PageData) => {
    if (!isZoomMode) return;

    const pageIdx = page.pageNumber - 1;
    const total = metadata.totalPages;

    // 첫 페이지(표지)와 마지막 페이지는 확대 제외
    if (pageIdx === 0 || pageIdx === total - 1) return;

    // 펼침면(Spread) 감지
    let leftPage, rightPage;
    if (pageIdx % 2 !== 0) {
      // 홀수 인덱스(왼쪽 페이지)
      leftPage = metadata.pages[pageIdx];
      rightPage = metadata.pages[pageIdx + 1];
    } else {
      // 짝수 인덱스(오른쪽 페이지)
      leftPage = metadata.pages[pageIdx - 1];
      rightPage = metadata.pages[pageIdx];
    }

    if (leftPage && rightPage) {
      setZoomedSpread([leftPage, rightPage]);
    }
  };

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
            <button 
              onClick={() => setIsZoomMode(!isZoomMode)}
              className={`p-1.5 rounded-lg transition-all flex items-center gap-1.5 ${isZoomMode ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'hover:bg-white/10 text-white/70'}`} 
              title="Enlarge Mode"
            >
              <ZoomIn size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider hidden lg:inline">Enlarge</span>
            </button>
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
        
        <div className={clsx(
          "w-full h-full max-w-full max-h-full flex justify-center items-center overflow-hidden transition-all duration-500",
          zoomedSpread && "opacity-0 pointer-events-none scale-95" // 확대 중에는 배경을 안 보이게 하거나 클릭 방지
        )}>
          {/* @ts-expect-error - react-pageflip typings */}
          <HTMLFlipBook
            key={`flipbook-${bookSize.width}-${bookSize.height}-${metadata.pages.length}`}
            width={bookSize.width}
            height={bookSize.height}
            size="fixed"
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
            useMouseEvents={!zoomedSpread} // 확대 중에는 마우스 이벤트 차단
            swipeDistance={40}
            showPageCorners={true}
            disableFlipByClick={zoomedSpread !== null} // 확대 중에는 클릭에 의한 넘김 방지
          >
            {metadata.pages.map((page, idx) => {
              const isCover = idx === 0 || idx === metadata.totalPages - 1;
              return (
                <div 
                  key={page.pageNumber} 
                  onClick={() => handlePageClick(page)} 
                  className={`cursor-pointer ${(isZoomMode && !isCover) ? 'cursor-zoom-plus' : ''}`}
                >
                  <Page page={page} onJump={jumpToPage} />
                </div>
              );
            })}
          </HTMLFlipBook>
        </div>

        {/* --- Zoom Overlay & Navigator --- */}
        {zoomedSpread && (
          <div 
            className={clsx(
              "fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300",
              isDragging ? "cursor-grabbing" : "cursor-zoom-minus"
            )}
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).closest('.navigator-container')) return;
              setMouseDownTime(Date.now());
            }}
            onMouseUp={(e) => {
              if ((e.target as HTMLElement).closest('.navigator-container')) return;
              const duration = Date.now() - mouseDownTime;
              // 1초 이내의 클릭이고 드래그 중이 아니면 즉시 종료
              if (duration < 1000 && !isDragging) {
                setTimeout(() => setZoomedSpread(null), 10);
              }
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDoubleClick={(e) => e.stopPropagation()}
          >
            <TransformWrapper
              initialScale={1.5}
              minScale={1}
              maxScale={6}
              centerOnInit={true}
              wheel={{ step: 0.2 }}
              doubleClick={{ disabled: true }} // 더블 클릭 방지하여 싱글 클릭 반응성 향상
              limitToBounds={false}
              onPanningStart={() => setIsDragging(true)}
              onPanningStop={() => setTimeout(() => setIsDragging(false), 100)}
            >
              <TransformComponent 
                wrapperClass="!w-screen !h-screen !bg-transparent" 
                contentClass="!w-screen !h-screen flex items-center justify-center !bg-transparent"
              >
                <div 
                  className="flex max-w-none shadow-2xl pointer-events-auto"
                  style={{ 
                    width: zoomedSpread[0].width * 4, 
                    height: zoomedSpread[0].height * 2 
                  }}
                >
                  <img src={zoomedSpread[0].imagePath} className="h-full object-contain pointer-events-none" alt="Left" />
                  <img src={zoomedSpread[1].imagePath} className="h-full object-contain pointer-events-none" alt="Right" />
                </div>
              </TransformComponent>
              <div className="navigator-container">
                <Navigator 
                  imagePath={[zoomedSpread[0].imagePath, zoomedSpread[1].imagePath]} 
                  imageSize={{ width: zoomedSpread[0].width * 4, height: zoomedSpread[0].height * 2 }} 
                />
              </div>
            </TransformWrapper>

            {/* Zoom Controls Overlay */}
            <div className="absolute top-6 right-6 z-[110] flex items-center gap-3 pointer-events-none">
              <div className="px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center gap-4 text-white/50 text-xs font-bold tracking-widest uppercase">
                <span>Spread {zoomedSpread[0].pageNumber}-{zoomedSpread[1].pageNumber}</span>
                <div className="w-px h-3 bg-white/10" />
                <span>Click to Exit / Drag to Pan</span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={nextButtonClick}
          className="absolute right-4 md:right-10 z-20 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl text-white hover:bg-white/20 disabled:opacity-5 transition-all hover:scale-110 active:scale-95"
          disabled={currentPage >= metadata.totalPages - 1}
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* --- Bottom Navigation Control Panel (Fixed height) --- */}
      <div className="flex-none w-full max-w-3xl mx-auto px-4 py-2 z-30">
        <div className="flex flex-col gap-2 p-4 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl text-white">
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
        
        /* Custom Cursors */
        .cursor-zoom-plus {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='white' stroke='black' stroke-width='2' opacity='0.9'/%3E%3Cline x1='16' y1='10' x2='16' y2='22' stroke='black' stroke-width='2'/%3E%3Cline x1='10' y1='16' x2='22' y2='16' stroke='black' stroke-width='2'/%3E%3C/svg%3E") 16 16, zoom-in;
        }
        
        .cursor-zoom-minus {
          cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='white' stroke='black' stroke-width='2' opacity='0.9'/%3E%3Cline x1='10' y1='16' x2='22' y2='16' stroke='black' stroke-width='2'/%3E%3C/svg%3E") 16 16, zoom-out;
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
