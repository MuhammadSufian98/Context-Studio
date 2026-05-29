"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Terminal, RefreshCw, Target } from "lucide-react";

export default function HistoryItem({
  turn,
  selectedParagraph,
  setSelectedParagraph,
}) {
  const isUser = turn.role === "user";
  
  // Assistant text is split into actionable chunks by double line breaks
  const paragraphs = !isUser
    ? turn.content.split("\n\n").filter((p) => p.trim())
    : [turn.content];

  const containerClasses = [
    "w-full max-w-[92%] sm:max-w-[85%] p-4 rounded-xl border transition-all duration-300",
    isUser 
      ? "bg-[#f6f1eb]/60 text-[#4a3e3d] border-[#e9e1d6] border-l-4 border-l-[#bfa38a] rounded-tr-none shadow-3xs"
      : "bg-[#fcfaf7] text-[#4a3e3d] border-[#e9e1d6] rounded-tl-none shadow-2xs max-w-none"
  ].join(" ");

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-1`}>
      <div className={containerClasses}>
        <div className={`flex items-center gap-2 mb-2.5 text-[9px] font-bold uppercase tracking-wider select-none ${isUser ? "text-[#bfa38a]" : "text-[#8c7a78]"}`}>
          {isUser ? (
            <>
              <span className="w-1 h-1 rounded-full bg-[#bfa38a]" />
              <span>User Request</span>
            </>
          ) : (
            <>
              <Terminal className="w-3 h-3 text-[#bfa38a]" />
              <span>Response</span>
            </>
          )}
          {!isUser && (
            <span className="text-[8px] tracking-normal normal-case opacity-60 ml-auto font-medium hidden sm:inline">
              Tap any paragraph below to target it for refinement
            </span>
          )}
        </div>

        <div className="overflow-hidden break-words whitespace-pre-wrap text-sm leading-relaxed">
          {isUser ? (
            <p className="font-serif italic text-[#5c4d4c] font-medium">
              &quot;{turn.content}&quot;
            </p>
          ) : (
            <div className="flex flex-col gap-3 font-sans">
              {paragraphs.map((para, idx) => {
                const isRegenerated = para.startsWith("(Regenerated)");
                const cleanText = isRegenerated ? para.replace("(Regenerated)", "").trim() : para;
                const isTargeted = selectedParagraph === cleanText;

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedParagraph(isTargeted ? null : cleanText)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group/para flex flex-col gap-2
                      ${isTargeted 
                        ? "bg-amber-50/80 border-[#bfa38a] border-l-4 shadow-3xs text-stone-900" 
                        : isRegenerated 
                          ? "bg-gradient-to-br from-amber-50/20 via-[#fcfaf7] to-[#fbf9f6] border-[#bfa38a]/40 border-l-2" 
                          : "bg-[#fcfaf7] border-[#e9e1d6]/50 hover:bg-[#efe7dd]/20"
                      }`}
                  >
                    {isRegenerated && !isTargeted && (
                      <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-amber-700/80 select-none mb-0.5">
                        <RefreshCw className="w-3 h-3" />
                        <span>Alternative Variance Stream</span>
                      </div>
                    )}

                    <div className="absolute top-2 right-2 opacity-0 group-hover/para:opacity-100 transition-opacity text-[#bfa38a] flex items-center gap-1 bg-[#fcfaf7] border border-[#e4dacb] px-1.5 py-0.5 rounded-md shadow-3xs">
                      <span className="text-[8px] font-bold uppercase tracking-wider text-[#8c7a78]">Target</span>
                      <Target className="w-3 h-3" />
                    </div>

                    <div className="markdown-editorial-view font-sans">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {cleanText}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
