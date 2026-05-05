"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  FileText,
  Clock,
  Search,
  Loader2,
  Trash2,
  Edit2,
  Check,
  X,
} from "lucide-react";

interface BookSummary {
  bookId: string;
  originalFileName: string;
  totalPages: number;
  createdAt: string;
  coverImage: string;
}

export default function GalleryPage() {
  const [books, setBooks] = useState<BookSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/books")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setBooks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("정말로 이 전자책을 삭제하시겠습니까?")) return;

    setDeletingId(bookId);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setBooks((prev) => prev.filter((b) => b.bookId !== bookId));
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("오류가 발생했습니다.");
    } finally {
      setDeletingId(null);
    }
  };

  const startEditing = (e: React.MouseEvent, bookId: string, currentTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(bookId);
    setEditingTitle(currentTitle.replace(/\.pdf$/i, ""));
  };

  const cancelEditing = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingId(null);
    setEditingTitle("");
  };

  const handleSaveTitle = async (e: React.MouseEvent, bookId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!editingTitle.trim()) return;
    
    setIsSaving(true);
    try {
      const res = await fetch(`/api/books/${bookId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editingTitle + ".pdf" }),
      });

      if (res.ok) {
        setBooks((prev) =>
          prev.map((b) =>
            b.bookId === bookId ? { ...b, originalFileName: editingTitle + ".pdf" } : b
          )
        );
        setEditingId(null);
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredBooks = books.filter((b) =>
    b.originalFileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleImageError = (bookId: string) => {
    setImageErrors((prev) => ({ ...prev, [bookId]: true }));
  };

  return (
    <main className="min-h-screen bg-[#09090b] relative isolate">
      {/* Background Image & Overlays */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=3840&auto=format&fit=crop"
          alt="Library"
          fill
          priority
          className="object-cover"
          unoptimized
        />
        {/* Dark Overlay - set to 85% opacity as requested */}
        <div className="absolute inset-0 bg-black/85" />
        
        {/* Subtle Grid Pattern Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.1]" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
          }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        {/* Gallery Title & Search */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">내 서재</h1>
            <p className="text-white/40 text-sm">변환된 전자책들을 관리하고 감상하세요.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="text"
              placeholder="책 제목 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-8 w-8 text-white/40 animate-spin" />
            <p className="text-white/40 text-sm">불러오는 중...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="p-5 rounded-2xl bg-white/5">
              <BookOpen className="h-10 w-10 text-white/20" />
            </div>
            <div className="text-center">
              <p className="text-white/50 text-base font-medium">
                {searchQuery
                  ? "검색 결과가 없습니다"
                  : "아직 업로드된 전자책이 없습니다"}
              </p>
              <p className="text-white/30 text-sm mt-1">
                {searchQuery ? (
                  "다른 키워드로 검색해 보세요"
                ) : (
                  <Link href="/" className="text-blue-400 hover:text-blue-300">
                    PDF를 업로드하여 전자책을 만들어 보세요 →
                  </Link>
                )}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-sm text-white/40">
                총{" "}
                <span className="text-white/70 font-medium">
                  {filteredBooks.length}
                </span>
                권
              </span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredBooks.map((book, index) => (
                <div
                  key={book.bookId}
                  className="group relative rounded-2xl bg-[#27272a] border border-white/10 hover:border-white/20 hover:bg-[#323235] transition-all duration-300 overflow-hidden shadow-2xl"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  <Link href={`/viewer/${book.bookId}`}>
                    {/* Cover Image */}
                    <div className="aspect-[3/4] relative overflow-hidden bg-white/5">
                      {!imageErrors[book.bookId] ? (
                        <Image
                          src={book.coverImage}
                          alt={book.originalFileName}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={() => handleImageError(book.bookId)}
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                          <FileText className="h-12 w-12 text-white/10" />
                          <span className="text-xs text-white/20">
                            미리보기 없음
                          </span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-sm text-black font-semibold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <BookOpen className="h-4 w-4" />
                          전자책 읽기
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="pt-3 pb-5 px-4 pr-12">
                      {editingId === book.bookId ? (
                        <div className="flex items-center gap-1 mb-2" onClick={(e) => e.stopPropagation()}>
                          <input
                            autoFocus
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="flex-1 bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-blue-500"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <button
                            onClick={(e) => handleSaveTitle(e, book.bookId)}
                            disabled={isSaving}
                            className="p-1 text-green-400 hover:bg-white/10 rounded"
                          >
                            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="p-1 text-red-400 hover:bg-white/10 rounded"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="text-sm font-medium text-white/90 truncate group-hover:text-white transition-colors mb-1">
                          {book.originalFileName.replace(/\.pdf$/i, "")}
                        </h3>
                      )}
                      
                      <div className="flex items-center gap-3 text-[11px] text-white/40">
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          {book.totalPages}p
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(book.createdAt)}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Actions (Floating) */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-0.5">
                    {editingId !== book.bookId && (
                      <button
                        onClick={(e) => startEditing(e, book.bookId, book.originalFileName)}
                        className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/5 transition-all duration-200"
                        title="제목 수정"
                      >
                        <Edit2 className="h-5 w-5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDelete(e, book.bookId)}
                      disabled={deletingId === book.bookId}
                      className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
                      title="삭제"
                    >
                      {deletingId === book.bookId ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
