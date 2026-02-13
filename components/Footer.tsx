
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="text-2xl font-extrabold tracking-tight">
              Eigenheim <span className="text-[#F87101]">Navigator</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Wir begleiten Schweizer Familien und Einzelpersonen auf dem Weg in die eigenen vier Wände – mit Ehrlichkeit, Expertise und einem klaren Prozess.
            </p>
            <div className="flex space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-700 transition-colors">
                  <span className="text-[10px]">Icon</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Service</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Eigenheim-Check</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Mietkauf-Modelle</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Finanzierungsstrategie</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Suchbegleitung</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Unternehmen</h4>
            <ul className="space-y-4 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Über uns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Karriere</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Partnernetzwerk</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Kontakt</h4>
            <address className="not-italic text-slate-400 text-sm space-y-4">
              <p>Eigenheim Navigator AG<br />Musterstrasse 123<br />8000 Zürich</p>
              <p>info@eigenheim-navigator.ch</p>
              <p>+41 44 123 45 67</p>
            </address>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Eigenheim Navigator AG. Alle Rechte vorbehalten.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-white transition-colors">Impressum</a>
            <a href="#" className="hover:text-white transition-colors">Datenschutz</a>
            <a href="#" className="hover:text-white transition-colors">AGB</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
