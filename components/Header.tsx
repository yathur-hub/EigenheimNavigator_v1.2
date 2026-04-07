
import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onStartCheck: () => void;
}

const Header: React.FC<HeaderProps> = ({ onStartCheck }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm px-4 py-3 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <img 
              src="https://raw.githubusercontent.com/yathur-hub/EHN-Brandassets/main/EHN-Original.png" 
              alt="Eigenheim Navigator Logo" 
              className="h-12 md:h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center space-x-8">
          <button 
            className="bg-blue-600 text-white px-7 py-3 rounded-[16px] font-black text-sm shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            onClick={onStartCheck}
          >
            Erstgespräch buchen
          </button>
        </div>

        {/* Mobile Button */}
        <div className="md:hidden">
           <button 
            onClick={onStartCheck}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-[14px] text-xs font-black shadow-md active:scale-95 transition-all"
           >
             Buchen
           </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
