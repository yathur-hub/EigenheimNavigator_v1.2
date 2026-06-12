
import React from 'react';
import { Instagram, Youtube, Music } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-12 mb-12 sm:mb-16">
          <div className="space-y-6 max-w-md">
            <Link to="/" className="inline-block">
              <img 
                src="https://raw.githubusercontent.com/yathur-hub/EHN-Brandassets/main/EHN-Original.png" 
                alt="Eigenheim Navigator Logo" 
                className="h-16 md:h-20 w-auto object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              Wir begleiten Schweizer Familien und Einzelpersonen auf dem Weg in die eigenen vier Wände – mit Ehrlichkeit, Expertise und einem klaren Prozess.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/eigenheimnavigator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://www.tiktok.com/@simonkarrica" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                title="TikTok"
              >
                <Music size={18} />
              </a>
              <a 
                href="https://www.youtube.com/@eigenheimnavigator" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all"
                title="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div className="sm:text-right">
            <h4 className="font-bold mb-6">Kontakt</h4>
            <address className="not-italic text-slate-400 text-sm space-y-4">
              <p>
                Mission13 GmbH<br />
                Eigenheim Navigator<br />
                Im Lerchenfeld 2<br />
                9535 Wilen
              </p>
              <p>Telefon: +41 71 952 13 13</p>
              <p>E-Mail: ehn@mission13.ch</p>
            </address>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Mission13 GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-end">
            <Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="hover:text-white transition-colors">Datenschutz</Link>
            <button 
              onClick={() => window.dispatchEvent(new Event('open-cookie-banner'))}
              className="hover:text-white transition-colors cursor-pointer bg-transparent border-0 p-0 text-slate-500 font-normal outline-none text-xs"
            >
              Cookie-Einstellungen
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
