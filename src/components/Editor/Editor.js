"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTextStore } from "../../store/useTextStore";
import Input from "../UI/Input";
import { FileEdit, Sparkles } from "lucide-react";

export default function Editor() {
  const { sourceText, refinedText, setSourceText } = useTextStore();

  return (
    <div className="flex flex-col gap-6 w-full items-stretch animate-in fade-in duration-300">
      {/* 1. Input Section Stack */}
      <div className="flex flex-col h-[280px] relative">
        <Input
          label={
            <span className="flex items-center gap-2">
              <FileEdit className="w-3.5 h-3.5 text-[#bfa38a]" />
              Original Narrative Source
            </span>
          }
          placeholder="Paste or type your draft text here to prepare for editorial enhancement..."
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          className="h-full"
        />

        {/* Live Source Character Counter */}
        <div className="absolute bottom-3 right-3 text-[10px] font-sans font-bold uppercase tracking-wider text-[#8c7a78]/60 select-none pointer-events-none">
          {sourceText?.length || 0} Chars
        </div>
      </div>

      {/* 2. Enhanced Output Section Stack */}
      <div className="flex flex-col h-[280px] relative">
        <label className="text-sm font-serif font-bold text-[#5c4d4c] mb-2 ml-1 flex items-center gap-2 select-none">
          <Sparkles className="w-3.5 h-3.5 text-[#bfa38a]" />
          Enhanced Refined Output
        </label>

        {/* Text Container Card */}
        <div className="flex-1 rounded-xl border border-[#e9e1d6] bg-[#fcfaf7] shadow-3xs overflow-hidden flex flex-col transition-all duration-300 focus-within:border-[#bfa38a] focus-within:ring-4 focus-within:ring-[#bfa38a]/5 pb-7">
          <div className="flex-1 p-5 overflow-y-auto overflow-x-hidden break-words whitespace-pre-wrap prose prose-stone prose-sm max-w-none text-[#4a3e3d] custom-scrollbar scroll-smooth font-sans text-sm leading-relaxed">
            {refinedText ? (
              <div className="markdown-editorial-view">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {refinedText}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center h-full justify-center">
                <span className="text-[#8c7a78]/50 italic text-sm text-center font-serif">
                  Your transformed text layer will stream downward here in
                  real-time...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Live Output Character Counter */}
        <div className="absolute bottom-3 right-3 text-[10px] font-sans font-bold uppercase tracking-wider text-[#8c7a78]/60 select-none pointer-events-none">
          {refinedText?.length || 0} Chars
        </div>
      </div>
    </div>
  );
}
