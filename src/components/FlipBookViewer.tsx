'use client';

import React, { useRef, useState, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="demoPage bg-white shadow-lg overflow-hidden relative" ref={ref}>
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
        const className = "absolute z-10 hover:bg-blue-500/20 transition-colors";

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
                console.log(`[LINK CLICK] destPage=${target}, navigating to physical page ${target}`);
                // setTimeout으로 react-pageflip의 클릭 이벤트 처리가 끝난 후 이동
                if (onJump) setTimeout(() => onJump(target), 50);
              }}
              onPointerDown={handleEvent}
              onMouseDown={handleEvent}
              onTouchStart={handleEvent}
              onPointerUp={handleEvent}
              onMouseUp={handleEvent}
              onTouchEnd={handleEvent}
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
  const [currentPage, setCurrentPage] = useState(0);

  // Dynamic dimensions based on first page
  const firstPage = metadata.pages[0];
  const baseWidth = firstPage ? firstPage.width : 800;
  const baseHeight = firstPage ? firstPage.height : 1131;

  const onPageFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const nextButtonClick = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const prevButtonClick = () => {
    if (bookRef.current) {
      bookRef.current.pageFlip().flipPrev();
    }
  };

  const jumpToPage = useCallback((pageIndex: number) => {
    if (bookRef.current) {
      const pageFlip = bookRef.current.pageFlip();
      console.log(`[JUMP] turnToPage(${pageIndex}) called. Current page before: ${pageFlip.getCurrentPageIndex()}`);
      pageFlip.turnToPage(pageIndex);
      setTimeout(() => {
        console.log(`[JUMP] After turnToPage(${pageIndex}), current page is now: ${pageFlip.getCurrentPageIndex()}`);
      }, 500);
    }
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-6xl mx-auto px-4">
      <div className="relative w-full flex justify-center items-center bg-white/5 backdrop-blur-sm p-4 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl">
        {/* Navigation Buttons */}
        <button
          onClick={prevButtonClick}
          className="absolute left-4 md:left-8 z-20 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-xl text-white hover:bg-white/20 disabled:opacity-20 transition-all hover:scale-110"
          disabled={currentPage === 0}
        >
          <ChevronLeft size={28} />
        </button>
        
        {/* HTMLFlipBook */}
        <div className="w-full max-w-[90vw] overflow-hidden flex justify-center">
          {/* @ts-expect-error - react-pageflip typings issues with React 18 */}
          <HTMLFlipBook
            width={baseWidth}
            height={baseHeight}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
            maxShadowOpacity={0.3}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onPageFlip}
            className="flipbook-demo"
            ref={bookRef}
            usePortrait={false}
            flippingTime={600}
            useMouseEvents={true}
            swipeDistance={30}
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
          className="absolute right-4 md:right-8 z-20 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-xl text-white hover:bg-white/20 disabled:opacity-20 transition-all hover:scale-110"
          disabled={currentPage >= metadata.totalPages - 1}
        >
          <ChevronRight size={28} />
        </button>
      </div>

      <div className="mt-8 px-6 py-2 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-white/70 text-sm font-medium">
        Page {metadata.pageLabels && metadata.pageLabels[currentPage] ? metadata.pageLabels[currentPage] : currentPage + 1} of {metadata.totalPages}
      </div>
    </div>
  );
}
