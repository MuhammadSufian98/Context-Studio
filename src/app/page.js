"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Editor from "../components/Editor/Editor";
import Controls from "../components/Controls/Controls";
import History from "../components/History/History";
import { useUIStore } from "../store/useUIStore";
import { History as HistoryIcon, FileText, Settings, User } from "lucide-react";

export default function Home() {
  const { status, error } = useUIStore();
  const [activeSection, setActiveSection] = useState("editor");

  const tabConfig = {
    editor: { label: "Canvas Editor", icon: FileText },
    history: { label: "Turns History", icon: HistoryIcon }
  };

  return (
    <div className="min-h-screen bg-[#f7f4f0] text-[#4a3e3d] font-sans selection:bg-amber-100 selection:text-amber-900 antialiased">
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#f7f4f0]/80 backdrop-blur-md border-b border-[#e9e1d6]/50">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto font-medium">
          <div className="font-serif text-xl italic tracking-tight">Manuscript</div>
          
          <div className="hidden md:flex gap-8 items-center text-[10px] font-bold uppercase tracking-[0.15em]">
            <a className="text-[#8c7a78] hover:text-[#4a3e3d] transition-colors" href="#">Drafts</a>
            <a className="text-[#4a3e3d] border-b-2 border-[#bfa38a] pb-1" href="#">Library</a>
            <a className="text-[#8c7a78] hover:text-[#4a3e3d] transition-colors" href="#">Archive</a>
          </div>

          <div className="flex items-center gap-5 text-[#8c7a78]">
            <Settings className="w-4.5 h-4.5 cursor-pointer hover:text-[#4a3e3d] transition-colors" />
            <User className="w-4.5 h-4.5 cursor-pointer hover:text-[#4a3e3d] transition-colors" />
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-32 px-6 max-w-4xl mx-auto min-h-screen">
        <header className="bg-[#fcfaf7] border border-[#e9e1d6] rounded-2xl p-8 mb-10 text-center shadow-2xs">
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#bfa38a] font-bold mb-3 block">WORKSPACE</span>
          <h1 className="font-serif text-3xl md:text-5xl font-medium leading-tight">Editorial Studio</h1>
          <p className="text-sm md:text-base text-[#8c7a78] mt-3 max-w-lg mx-auto leading-relaxed font-medium">
            Refine your thoughts with our premium manuscript editor, designed for clarity and deliberate focus.
          </p>
        </header>

        <div className="flex justify-center mb-8">
          <div className="relative bg-[#f6f1eb] border border-[#e9e1d6] rounded-xl p-1 flex w-full sm:w-80 shadow-3xs overflow-hidden">
            {Object.entries(tabConfig).map(([key, { label, icon: Icon }]) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`relative z-10 flex-1 py-2.5 text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors duration-300 select-none cursor-pointer outline-none ${
                  activeSection === key ? "text-[#4a3e3d]" : "text-[#8c7a78]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
            
            <motion.div
              layoutId="activeTabPill"
              className="absolute inset-y-1 bg-[#fcfaf7] border border-[#e4dacb] rounded-lg shadow-sm z-0"
              style={{
                width: "calc(50% - 4px)",
                left: activeSection === "editor" ? "4px" : "calc(50%)",
              }}
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          </div>
        </div>

        <section className="bg-[#fcfaf7] border border-[#e9e1d6] rounded-2xl shadow-sm min-h-[500px] overflow-hidden relative mb-10">
          <AnimatePresence mode="wait">
            {activeSection === "editor" ? (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 md:p-10 flex flex-col gap-8"
              >
                <div className="bg-[#f6f1eb]/30 border border-[#e9e1d6]/60 p-5 rounded-xl shadow-3xs">
                  <Controls />
                </div>
                
                <Editor />

                <div className="mt-8 opacity-70 mix-blend-multiply transition-opacity hover:opacity-100 duration-700">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKzRV2g-Z-fS-HAJBcqQPu6s7aPymLttui6Vh84jYTnOqKoNj611c_15w6J2MnNaKMDa0Cly8pr6ZJSORIucHf1i5CvSrHcq-Nk3NJIUuK9cUOHuFsgj0d7mRCa8HY_JHkqtxFUdsb_7aZqutmEdGf374GSfknXBHV1BxxVTB1km9_ElLTXHi4EG1Lx58hGRyh2lT9baoqR-H8KGw6fjW25v9mUq0u9YjfXfZdeXYq_rV_0hWkQ47YI8-RpUmZqwhNX9qudXvikvZf" 
                    alt="Editorial Desk"
                    className="w-full h-48 object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-1000"
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 md:p-10"
              >
                <History />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                className="absolute bottom-6 left-6 right-6 bg-red-50/95 backdrop-blur-sm border border-red-200/60 p-4 rounded-xl flex items-start gap-3.5 shadow-lg z-30"
              >
                <div className="bg-red-100 text-red-600 p-1.5 rounded-lg shrink-0">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-red-800 uppercase tracking-widest mb-0.5">System Exception</p>
                  <p className="text-sm text-red-700 font-medium leading-relaxed">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <footer className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t border-[#e9e1d6] pt-10">
          <div className="flex flex-col gap-5">
            <span className="text-[10px] tracking-[0.15em] text-[#8c7a78] font-bold uppercase">ANALYTICS DASHBOARD</span>
            <div className="flex gap-12">
              <div className="flex flex-col">
                <span className="text-[11px] font-sans text-[#8c7a78] font-bold uppercase tracking-[0.12em] mb-1">Daily Usage</span>
                <span className="text-2xl font-serif font-bold">$estimatedTokens?</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-sans text-[#8c7a78] font-bold uppercase tracking-[0.12em] mb-1">Compute Cost</span>
                <span className="text-2xl font-serif font-bold">$0.42</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#efe7dd] border border-[#e4dacb] rounded-full font-sans font-bold text-[10px] uppercase text-[#5c4d4c] shadow-3xs">
              <div className={`w-1.5 h-1.5 rounded-full ${status === 'idle' ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
              <span>Engine: {status === 'idle' ? 'Active' : 'Processing'}</span>
            </div>
            <p className="text-[10px] font-sans font-bold text-[#8c7a78]/60 uppercase tracking-widest">
              © 2024 Editorial Systems • Premium Manuscript Tier
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
