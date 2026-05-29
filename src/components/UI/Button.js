"use client";

export default function Button({
  children,
  onClick,
  disabled,
  variant = "primary",
  isLoading = false,
  isStreaming = false,
  className = "",
  title = "",
}) {
  const isExecuting = isLoading || isStreaming;
  
  const base = "px-5 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 disabled:cursor-not-allowed cursor-pointer outline-hidden select-none active:scale-[0.98]";

  const styles = {
    primary: "bg-[#4a3e3d] text-[#fcfaf7] hover:bg-[#3d3231] shadow-2xs disabled:bg-[#efe7dd] disabled:text-[#8c7a78]/50",
    secondary: "bg-[#efe7dd] text-[#5c4d4c] border border-[#e4dacb] hover:bg-[#e6dbcd] shadow-3xs disabled:bg-[#f6f1eb] disabled:text-[#8c7a78]/30",
    ghost: "bg-transparent text-[#8c7a78] hover:bg-[#f6f1eb] hover:text-[#4a3e3d] disabled:text-[#8c7a78]/30",
    danger: "bg-red-50/60 text-red-700 border border-red-200 hover:bg-red-100/80 disabled:bg-[#fcfaf7] disabled:text-red-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isExecuting}
      title={title}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {isExecuting && (
        <svg className="animate-spin h-3.5 w-3.5 shrink-0 text-current" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      <span className="truncate">{children}</span>
    </button>
  );
}
