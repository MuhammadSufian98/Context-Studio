"use client";

import { useState, useRef } from "react";
import { useHistoryStore } from "../../store/useHistoryStore";
import { useUIStore } from "../../store/useUIStore";
import { useTextStore } from "../../store/useTextStore";
import { refineText } from "../../utils/apiServices";
import { estimateTokens, calculateCost } from "../../utils/tokenMetrics";
import HistoryItem from "./HistoryItem";
import Button from "../UI/Button";
import { RotateCcw, ArrowRight, Layers, MessageSquareDashed, Target } from "lucide-react";

export default function History() {
  const { history, addTurn } = useHistoryStore();
  const { status, setStatus, setError, updateMetrics } = useUIStore();
  const { setRefinedText } = useTextStore();
  
  const [followUp, setFollowUp] = useState("");
  const [selectedParagraph, setSelectedParagraph] = useState(null);
  const abortControllerRef = useRef(null);

  const handleRefine = async (temp = 0.7) => {
    if (!followUp && temp === 0.7) return;

    setStatus("loading");
    setError(null);
    const currentFollowUp = followUp;
    if (temp === 0.7) setFollowUp("");

    abortControllerRef.current = new AbortController();

    try {
      const historyText = history.map((h) => h.content).join(" ");
      const context = selectedParagraph
        ? `[Targeting Specific Paragraph: "${selectedParagraph}"] ${currentFollowUp}`
        : currentFollowUp;

      const inputTokens = estimateTokens(historyText + " " + (context || ""));

      const response = await refineText(
        { history, followUp: context, temperature: temp },
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
      
      if (currentFollowUp) {
        addTurn("user", selectedParagraph ? `[Targeted] ${currentFollowUp}` : currentFollowUp);
        addTurn("assistant", finalText);
      } else {
        addTurn("assistant", `(Regenerated) ${finalText}`);
      }

      setSelectedParagraph(null);
      setStatus("idle");
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        setError(err.message);
      }
      setStatus("idle");
    }
  };

  return (
    <div className="mt-6 w-full flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-[#e9e1d6]/50 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#efe7dd] border border-[#e4dacb] flex items-center justify-center text-[#4a3e3d]">
            <Layers className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-serif font-bold tracking-wide">History</h3>
            <p className="text-[10px] font-sans text-[#8c7a78] font-medium">Review or target paragraphs for refinement.</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 bg-[#efe7dd] border border-[#e4dacb] px-2.5 py-1 rounded-lg text-[10px] font-sans font-bold uppercase tracking-wider text-[#5c4d4c] shadow-3xs">
          <span>{Math.floor(history.length / 2)}</span>
          <span className="text-[#8c7a78]/70 font-medium">Turns Logs</span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="w-full bg-[#fbf9f6]/40 border border-dashed border-[#e9e1d6] rounded-2xl py-12 px-4 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#efe7dd]/60 flex items-center justify-center text-[#8c7a78]">
            <MessageSquareDashed className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h4 className="text-xs font-serif font-bold tracking-wide">No History Available</h4>
            <p className="text-xs text-[#8c7a78] font-sans font-medium leading-relaxed">Run a transformation to initialize your timeline.</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#fbf9f6] border border-[#e9e1d6]/70 rounded-2xl p-4 md:p-6 shadow-2xs">
          <div className="space-y-5 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar scroll-smooth flex flex-col gap-1">
            {history.map((turn, i) => (
              <HistoryItem
                key={i}
                turn={turn}
                selectedParagraph={selectedParagraph}
                setSelectedParagraph={setSelectedParagraph}
              />
            ))}
          </div>
        </div>
      )}

      {selectedParagraph && (
        <div className="w-full bg-amber-50/60 border border-[#bfa38a]/40 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-[#5c4d4c] font-medium animate-in slide-in-from-top-2">
          <span className="flex items-center gap-2 truncate">
            <Target className="w-3.5 h-3.5 text-[#bfa38a] shrink-0" />
            <span className="italic truncate">Targeting segment: &quot;{selectedParagraph}&quot;</span>
          </span>
          <button
            onClick={() => setSelectedParagraph(null)}
            className="text-[10px] font-bold uppercase tracking-wider text-amber-800 underline ml-2 cursor-pointer bg-transparent border-none"
          >
            Deselect
          </button>
        </div>
      )}

      <div className="w-full bg-[#fcfaf7] border border-[#e9e1d6] p-5 rounded-2xl shadow-3xs flex flex-col gap-3 transition-all hover:border-[#dfd3c3]">
        <div className="flex items-center justify-between px-1 select-none text-[10px] font-bold uppercase tracking-wider">
          <label className="text-[#8c7a78]">Follow-up Instruction</label>
          <div className="flex items-center gap-1.5 text-[#bfa38a]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#bfa38a] animate-pulse" />
            Active Loop
          </div>
        </div>

        <div className="relative flex items-center w-full group">
          <input
            type="text"
            placeholder={history.length === 0 ? "Unlock follow-up layers via transformations..." : "Type instruction..."}
            className="w-full h-12 pl-4 pr-32 text-sm rounded-xl border border-[#e9e1d6] bg-[#fbf9f6] text-[#4a3e3d] placeholder-[#8c7a78]/40 shadow-3xs outline-hidden transition-all group-hover:border-[#bfa38a]/60 focus:border-[#bfa38a] focus:bg-white focus:ring-4 focus:ring-[#bfa38a]/5 disabled:bg-[#f6f1eb] disabled:cursor-not-allowed"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRefine()}
            disabled={status !== "idle" || history.length === 0}
          />

          <div className="absolute right-1.5 flex items-center gap-1.5">
            <Button
              variant="secondary"
              onClick={() => handleRefine(1.2)}
              disabled={status !== "idle" || history.length === 0}
              className="!p-0 w-9 h-9 bg-white"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>

            <Button
              onClick={() => handleRefine(0.7)}
              disabled={status !== "idle" || !followUp || history.length === 0}
              className="h-9 px-3.5 normal-case font-bold text-xs"
            >
              <span>Refine</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
