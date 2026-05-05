"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Play } from 'lucide-react';
import VideoModal from '../VideoModal';

interface Partner {
    name: string;
    href: string;
}

interface ResponsiveHeroBannerProps {
    backgroundImageUrl?: string;
    badgeText?: string;
    badgeLabel?: string;
    title?: string;
    titleLine2?: string;
    description?: string;
    primaryButtonText?: string;
    primaryButtonHref?: string;
    secondaryButtonText?: string;
    partnersTitle?: string;
    partners?: Partner[];
    children?: React.ReactNode;
}

const ResponsiveHeroBanner: React.FC<ResponsiveHeroBannerProps> = ({
    backgroundImageUrl = "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=3840&auto=format&fit=crop",
    badgeLabel = "New",
    badgeText = "PDF를 인터랙티브 전자책으로 변환",
    title = "당신의 문서를",
    titleLine2 = "살아있는 책으로",
    description = "PDF를 업로드하면 실제 책처럼 넘겨볼 수 있는 인터랙티브 전자책으로 자동 변환됩니다. 하이퍼링크, 목차 네비게이션까지 완벽하게 유지됩니다.",
    primaryButtonText = "PDF 업로드하기",
    primaryButtonHref = "#upload",
    secondaryButtonText = "데모 보기",
    partnersTitle = "다양한 형식의 문서를 지원합니다",
    partners = [
        { name: "보고서", href: "#" },
        { name: "브로셔", href: "#" },
        { name: "매뉴얼", href: "#" },
        { name: "포트폴리오", href: "#" },
        { name: "카탈로그", href: "#" },
    ],
    children,
}) => {
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

    return (
        <section className="w-full isolate min-h-screen overflow-hidden relative">
            {/* Background Image */}
            <Image
                src={backgroundImageUrl}
                alt="Hero Background"
                fill
                priority
                className="object-cover"
                unoptimized
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-black/30" />

            {/* Hero Content */}
            <div className="z-10 relative">
                <div className="sm:pt-28 md:pt-32 lg:pt-40 max-w-7xl mx-auto pt-28 px-6 pb-16">
                    <div className="mx-auto max-w-3xl text-center">
                        {/* Badge */}
                        <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-2.5 py-2 ring-1 ring-white/15 backdrop-blur animate-fade-slide-in-1">
                            <span className="inline-flex items-center text-xs font-medium text-neutral-900 bg-white/90 rounded-full py-0.5 px-2 font-sans">
                                {badgeLabel}
                            </span>
                            <span className="text-sm font-medium text-white/90 font-sans">
                                {badgeText}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-4xl text-white tracking-tight font-instrument-serif font-normal animate-fade-slide-in-2">
                            {title}
                            <br className="hidden sm:block" />
                            {titleLine2}
                        </h1>

                        {/* Description */}
                        <p className="sm:text-lg animate-fade-slide-in-3 text-base text-white/80 max-w-2xl mt-6 mx-auto font-sans">
                            {description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row sm:gap-4 mt-10 gap-3 items-center justify-center animate-fade-slide-in-4">
                            <a
                                href={primaryButtonHref}
                                className="inline-flex items-center gap-2 hover:bg-white/15 text-sm font-medium text-white bg-white/10 ring-white/15 ring-1 rounded-full py-3 px-5 font-sans transition-colors"
                            >
                                {primaryButtonText}
                                <ArrowRight className="h-4 w-4" />
                            </a>
                            <button
                                onClick={() => setIsVideoModalOpen(true)}
                                className="inline-flex items-center gap-2 rounded-full bg-transparent px-5 py-3 text-sm font-medium text-white/90 hover:text-white font-sans transition-colors group"
                            >
                                {secondaryButtonText}
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                                    <Play className="w-4 h-4 fill-current" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Partners / Features Tags */}
                    <div className="mx-auto mt-20 max-w-5xl">
                        <p className="animate-fade-slide-in-1 text-sm text-white/70 text-center font-sans">
                            {partnersTitle}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 animate-fade-slide-in-2 mt-6 items-center justify-items-center gap-4">
                            {partners.map((partner, index) => (
                                <a
                                    key={index}
                                    href={partner.href}
                                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white/5 ring-1 ring-white/10 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-all font-sans backdrop-blur"
                                >
                                    {partner.name}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Children slot (for upload dropzone etc.) */}
            {children && (
                <div id="upload" className="z-10 relative pb-16">
                    {children}
                </div>
            )}
            {/* Video Modal */}
            <VideoModal 
                isOpen={isVideoModalOpen} 
                onClose={() => setIsVideoModalOpen(false)} 
            />
        </section>
    );
};

export default ResponsiveHeroBanner;
