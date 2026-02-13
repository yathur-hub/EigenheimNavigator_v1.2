
import React from 'react';

interface StickyMobileCTAProps {
  onStartCheck: () => void;
}

const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({ onStartCheck }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 z-50 md:hidden flex gap-3 shadow-[0_-8px_20px_rgba(0,0,0,0.06)]">
      <button 
        className="flex-[1.5] bg-[#2663EB] text-white py-4 rounded-[14px] font-extrabold text-sm shadow-lg active:scale-95 transition-all"
        data-event="check_start"
        onClick={onStartCheck}
      >
        Realitätscheck starten
      </button>
      <button 
        className="flex-1 bg-white text-[#F87101] border-2 border-[#F87101] py-4 rounded-[14px] font-extrabold text-sm active:scale-95 transition-all"
        data-event="cta_secondary_click"
        onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
      >
        Kurzberatung
      </button>
    </div>
  );
};

export default StickyMobileCTA;
