"use client";

export default function Input({
  label,
  value,
  onChange,
  placeholder,
  disabled,
  error,
  className = "",
}) {
  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {label && (
        <label className="text-sm font-serif font-bold text-[#5c4d4c] mb-1.5 ml-1 flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-[#bfa38a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {label}
        </label>
      )}

      <div className="flex-1 relative flex flex-col min-h-0">
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full flex-1 p-4 rounded-xl text-[#4a3e3d] bg-[#fcfaf7] border transition-all duration-200 overflow-y-auto custom-scrollbar resize-none text-sm leading-relaxed outline-hidden
            ${error ? "border-red-400 ring-2 ring-red-50 focus:border-red-500" : "border-[#e9e1d6] focus:border-[#bfa38a] focus:ring-4 focus:ring-[#bfa38a]/10 shadow-2xs"}
            disabled:bg-[#f6f1eb] disabled:text-[#8c7a78]/60 placeholder-[#8c7a78]/50
          `}
        />
      </div>

      {error && (
        <span className="text-xs text-red-500 mt-1 ml-1 font-medium">{error}</span>
      )}
    </div>
  );
}
