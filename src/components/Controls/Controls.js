"use client";

import { useTextStore } from "../../store/useTextStore";
import { useUIStore } from "../../store/useUIStore";
import { useHistoryStore } from "../../store/useHistoryStore";
import { refineText } from "../../utils/apiServices";
import { estimateTokens, calculateCost } from "../../utils/tokenMetrics";
import { useRef, useState } from "react";
import Button from "../UI/Button";
import { Sparkles, Shield, MessageSquare, Flame, FilePlus2, XCircle, HelpCircle } from "lucide-react";

const TRANSFORMATIONS = [
  { id: "summarize", label: "Polish", icon: Sparkles, tooltip: "Condenses and strips clutter, leaving a high-signal Extraction." },
  { id: "formal", label: "Formal", icon: Shield, tooltip: "Elevates style and syntax into premium corporate-grade language." },
  { id: "casual", label: "Casual", icon: MessageSquare, tooltip: "Softens expressions into approachable, conversational English." },
  { id: "simplify", label: "Simplify", icon: Flame, tooltip: "Strips complex vocabulary down to direct, plain terms." },
  { id: "expand", label: "Enrich", icon: FilePlus2, tooltip: "Injects analytical depth and sensory contextual detail." },
];

export default function Controls() {
  const { sourceText, setRefinedText, setActiveTransformation } = useTextStore();
  const { status, setStatus, setError, updateMetrics } = useUIStore();
  const { addTurn } = useHistoryStore();

  const [currentAction, setCurrentAction] = useState(null);
  const abortControllerRef = useRef(null);

  const handleTransform = async (type) => {
    if (!sourceText) return;

    setStatus("loading");
    setError(null);
    setRefinedText("");
    setActiveTransformation(type);
    setCurrentAction(type);

    abortControllerRef.current = new AbortController();

    try {
      const inputTokens = estimateTokens(sourceText);

      const response = await refineText(
        { text: sourceText, transformation: type },
        (progressEvent) => {
          setStatus("streaming");
          setRefinedText(progressEvent.event.target.responseText);
        },
        abortControllerRef.current.signal
      );

      const finalText = response.data;
      const outputTokens = estimateTokens(finalText);
      const cost = calculateCost(inputTokens, outputTokens);

      updateMetrics(inputTokens + outputTokens, cost);
      setRefinedText(finalText);
      
      addTurn("user", `Transform to ${type}: ${sourceText}`);
      addTurn("assistant", finalText);
      
      setStatus("idle");
      setCurrentAction(null);
    } catch (err) {
      setCurrentAction(null);
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        setError(err.message);
      }
      setStatus("idle");
    }
  };

  const handleCancel = () => abortControllerRef.current?.abort();

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full">
        {TRANSFORMATIONS.map((t) => {
          const Icon = t.icon;
          const isActive = currentAction === t.id;

          return (
            <div key={t.id} className="w-full relative group">
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-30 w-56 bg-[#4a3e3d] border border-[#5c4d4c] rounded-xl p-3.5 shadow-md opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 transform scale-95 group-hover:translate-y-0 group-hover:scale-100 flex flex-col gap-1 text-center">
                <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#bfa38a]">{t.label} Context</p>
                <p className="text-xs font-sans font-medium text-[#fcfaf7] leading-relaxed">{t.tooltip}</p>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-6 border-transparent border-t-[#4a3e3d]" />
              </div>

              <Button
                variant={isActive ? "primary" : "secondary"}
                onClick={() => handleTransform(t.id)}
                disabled={status !== "idle" || !sourceText}
                isLoading={status === "loading" && isActive}
                isStreaming={status === "streaming" && isActive}
                className="w-full h-12"
              >
                <div className="flex items-center gap-2 max-w-full truncate">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-amber-400" : "text-[#bfa38a]"}`} />
                  <span className="truncate">{t.label}</span>
                  <HelpCircle className="w-3 h-3 shrink-0 text-[#8c7a78]/40 group-hover:text-[#bfa38a] transition-colors" />
                </div>
              </Button>
            </div>
          );
        })}
      </div>

      {status !== "idle" && (
        <Button
          variant="danger"
          onClick={handleCancel}
          className="w-full h-11 tracking-widest bg-red-50 text-red-700 border border-red-200"
        >
          <XCircle className="w-4 h-4 animate-pulse text-red-600" />
          <span>Halt Generation</span>
        </Button>
      )}
    </div>
  );
}
