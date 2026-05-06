"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Menu, ArrowUpRight, X } from 'lucide-react';

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { label: "홈", href: "/" },
        { label: "갤러리", href: "/gallery" },
        { label: "가이드", href: "/guide" },
    ];

    const ctaButton = {
        label: "시작하기",
        href: "/#upload",
    };

    return (
        <header className="absolute top-0 left-0 right-0 z-[100] transition-all duration-300">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between backdrop-blur-md bg-black/20 ring-1 ring-white/10 rounded-2xl px-4 py-2">
                    {/* Logo */}
                    <Link href="/" className="inline-flex items-center gap-2.5 group">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur group-hover:bg-white/20 transition-all">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-semibold text-white tracking-tight">
                            FlipBook <span className="text-white/60 font-normal">Maker</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-2 text-sm font-medium transition-all rounded-full hover:bg-white/5 ${
                                            isActive 
                                            ? 'text-white bg-white/10' 
                                            : 'text-white/70 hover:text-white'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </div>
                        <Link
                            href={ctaButton.href}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-neutral-900 hover:bg-white/90 transition-all hover:scale-105 active:scale-95"
                        >
                            {ctaButton.label}
                            <ArrowUpRight className="h-4 w-4" />
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/20 transition-all"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-5 w-5 text-white" />
                        ) : (
                            <Menu className="h-5 w-5 text-white" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Overlay */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-3 rounded-2xl bg-black/80 ring-1 ring-white/10 backdrop-blur-2xl p-4 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                                            isActive 
                                            ? 'text-white bg-white/10' 
                                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                                        }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                            <Link
                                href={ctaButton.href}
                                className="mt-2 inline-flex items-center justify-between rounded-xl bg-white px-5 py-4 text-sm font-bold text-neutral-900"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {ctaButton.label}
                                <ArrowUpRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
