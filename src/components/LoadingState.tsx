import React from 'react';

export function LoadingState() {
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
        <span className="text-slate-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] animate-pulse">Clear View Loading...</span>
      </div>
    </div>
  );
}
