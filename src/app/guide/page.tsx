"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  BookOpen, 
  Upload, 
  Settings, 
  Eye, 
  Zap, 
  Share2, 
  BarChart3, 
  Sparkles, 
  Palette, 
  Smartphone,
  ChevronRight
} from "lucide-react";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-[#09090b] relative isolate selection:bg-white/10 selection:text-white">
      {/* Background Image & Overlays */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=3840&auto=format&fit=crop"
          alt="Background"
          fill
          priority
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 bg-black/85" />
        <div 
          className="absolute inset-0 opacity-[0.1]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-40 pb-20">
        {/* Hero Section */}
        <section className="text-center mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs font-medium mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Step into the future of digital books
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.1]">
            평범한 문서를 <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">살아있는 전자책</span>으로 만드세요
          </h2>
          <p className="text-white/40 text-lg max-w-2xl mx-auto leading-relaxed">
            FlipBook Maker는 복잡한 설정 없이 단 몇 초 만에 PDF를 인터랙티브한 디지털 경험으로 전환합니다. 
            단순히 보는 것을 넘어, 넘기고 느끼는 책의 감성을 디지털에서 재현하세요.
          </p>
        </section>

        {/* 1. How to Use */}
        <section className="mb-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <Settings className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">시작하는 방법</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/[0.15] hover:scale-[1.03] transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Upload className="h-6 w-6 text-white/80" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">01. PDF 업로드</h4>
              <p className="text-white/50 text-sm leading-relaxed">
                변환하고 싶은 PDF 파일을 드래그 앤 드롭하거나 선택하여 업로드하세요. 대용량 파일도 빠르게 처리됩니다.
              </p>
            </div>
            
            <div className="group p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/[0.15] hover:scale-[1.03] transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-6 w-6 text-white/80" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">02. 자동 최적화</h4>
              <p className="text-white/50 text-sm leading-relaxed">
                시스템이 자동으로 페이지를 고해상도 이미지로 렌더링하고, PDF 내의 링크와 목차 정보를 완벽하게 추출합니다.
              </p>
            </div>
            
            <div className="group p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/[0.15] hover:scale-[1.03] transition-all duration-300 shadow-xl hover:shadow-2xl">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="h-6 w-6 text-white/80" />
              </div>
              <h4 className="text-lg font-bold text-white mb-3">03. 결과 확인</h4>
              <p className="text-white/50 text-sm leading-relaxed">
                완성된 플립북을 확인하세요. 실제 종이 책을 넘기는 듯한 인터랙션과 함께 더욱 몰입감 있는 독서가 가능합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Applications */}
        <section className="mb-32">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <Palette className="h-5 w-5 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white">무한한 활용성</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="group flex gap-6 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/[0.15] hover:scale-[1.02] transition-all duration-300">
              <div className="shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                <Share2 className="h-4 w-4 text-white/60" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">디지털 브로셔 & 카탈로그</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  고객에게 딱딱한 문서 대신, 브랜드의 가치를 담은 세련된 디지털 카탈로그를 전달하세요. 홍보 효과가 극대화됩니다.
                </p>
              </div>
            </div>
            
            <div className="group flex gap-6 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/[0.15] hover:scale-[1.02] transition-all duration-300">
              <div className="shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                <BookOpen className="h-4 w-4 text-white/60" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">온라인 포트폴리오</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  작업물을 실제 작품집처럼 보여주세요. 넘겨보는 재미가 더해져 보는 이에게 더욱 강한 인상을 남깁니다.
                </p>
              </div>
            </div>
            
            <div className="group flex gap-6 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/[0.15] hover:scale-[1.02] transition-all duration-300">
              <div className="shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-4 w-4 text-white/60" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">연례 보고서 & 백서</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  방대한 양의 정보를 효율적으로 전달하세요. 내부 하이퍼링크와 목차 기능을 통해 필요한 정보를 즉시 찾을 수 있습니다.
                </p>
              </div>
            </div>
            
            <div className="group flex gap-6 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-white/30 hover:bg-white/[0.15] hover:scale-[1.02] transition-all duration-300">
              <div className="shrink-0 h-10 w-10 rounded-full bg-white/10 flex items-center justify-center mt-1 group-hover:scale-110 transition-transform">
                <Smartphone className="h-4 w-4 text-white/60" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-2">교육 자료 & 매뉴얼</h4>
                <p className="text-white/50 text-sm leading-relaxed">
                  학생이나 사용자가 학습에 더 집중할 수 있게 도와줍니다. 모바일에서도 PC와 동일한 고해상도 경험을 제공합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Expected Effects */}
        <section className="relative p-12 md:p-20 rounded-[3rem] bg-white/10 backdrop-blur-xl border border-white/20 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-12 text-white/5 select-none">
            <Sparkles size={200} strokeWidth={0.5} />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-white mb-12">기대 효과</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center mt-1 shrink-0 shadow-lg shadow-blue-500/20">
                  <ChevronRight className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">전달력과 몰입도의 비약적 향상</h4>
                  <p className="text-white/60 leading-relaxed font-medium">
                    단순 스크롤 방식의 문서보다 &apos;넘기는&apos; 행위가 포함된 플립북은 독자의 뇌를 더 자극하여 정보 전달력을 40% 이상 높여줍니다.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center mt-1 shrink-0 shadow-lg shadow-purple-500/20">
                  <ChevronRight className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">프리미엄 브랜드 이미지 구축</h4>
                  <p className="text-white/60 leading-relaxed font-medium">
                    잘 정돈된 디지털 라이브러리와 유려한 UI는 문서를 공유받는 이에게 준비된 전문가라는 신뢰감을 심어줍니다.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center mt-1 shrink-0 shadow-lg shadow-green-500/20">
                  <ChevronRight className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">스마트한 정보 구조화</h4>
                  <p className="text-white/60 leading-relaxed font-medium">
                    페이지 수가 많은 문서라도 지능형 목차 및 페이지 이동 기능을 통해 사용자가 원하는 정보를 단 한 번의 클릭으로 찾을 수 있게 합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mt-40 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">지금 바로 당신의 첫 번째 플립북을 만들어보세요.</h3>
          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all hover:scale-105"
          >
            시작하기
            <ChevronRight className="h-5 w-5" />
          </Link>
        </section>
      </div>

      {/* Footer Space */}
      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-white/20 text-sm">© 2026 FlipBook Maker. All rights reserved.</p>
      </footer>
    </main>
  );
}
