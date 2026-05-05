"use client";

import React from "react";
import { X, Play } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ 
  isOpen, 
  onClose, 
  videoUrl = "/HowToUse.mp4" 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all backdrop-blur-xl border border-white/10 shadow-lg"
          title="닫기"
        >
          <X size={24} />
        </button>

        <div className="w-full h-full flex items-center justify-center">
          <video
            className="w-full h-full object-contain"
            controls
            autoPlay
            muted
            playsInline
            src={videoUrl}
          >
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Info Overlay */}
        <div className="absolute bottom-0 inset-x-0 p-8 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <Play size={20} className="text-white fill-current" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">FlipBook Maker Demo</h3>
              <p className="text-white/40 text-sm">제품 시연 영상 (샘플)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
