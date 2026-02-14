
import React from 'react';

interface HeaderProps {
  onStartCheck: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartCheck }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm px-4 py-3 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <a href="#" className="flex items-center gap-2">
            <span className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Eigenheim <span className="text-[#F87101]">Navigator</span>
            </span>
          </a>
        </div>

        {/* Navigation removed as requested */}

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-6">
          <a 
            href="#contact" 
            className="text-[#F87101] font-bold text-sm hover:underline"
            data-event="cta_secondary_click"
          >
            Kurzberatung
          </a>
          <button 
            className="bg-[#2663EB] text-white px-6 py-2.5 rounded-[12px] font-bold text-sm shadow-md hover:bg-blue-700 transition-all active:scale-95"
            data-event="check_start"
            onClick={onStartCheck}
          >
            Realitätscheck starten
          </button>
        </div>

        {/* Mobile Menu Icon (Improved prominence) */}
        <div className="md:hidden">
           <button 
            onClick={onStartCheck}
            className="bg-[#2663EB] text-white px-5 py-2 rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all"
           >
             Check starten
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
