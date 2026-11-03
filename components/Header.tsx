
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onStartCheck: (ctaLocation?: string, ctaText?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onStartCheck }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm px-4 py-3 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <img 
              src="/img/logo-ehn.webp" width={480} height={270} fetchPriority="high" 
              alt="EigenheimNavi Logo" 
              className="h-12 md:h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </Link>
        </div>

        {/* CTA (mobile + desktop) */}
        <div className="flex items-center">
          <button 
            className="bg-blue-600 text-white px-4 py-2.5 md:px-7 md:py-3 rounded-xl md:rounded-[16px] font-black text-xs md:text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 whitespace-nowrap"
            onClick={() => onStartCheck('header', 'Realitätscheck starten')}
          >
            Realitätscheck starten
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
