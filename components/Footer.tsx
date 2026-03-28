
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-10 sm:gap-12 mb-12 sm:mb-16">
          <div className="space-y-6 max-w-md">
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

          <div className="sm:text-right">
            <h4 className="font-bold mb-6">Kontakt</h4>
            <address className="not-italic text-slate-400 text-sm space-y-4">
              <p>
                Mission13 GmbH<br />
                Eigenheim Navigator<br />
                Moswis 1<br />
                9245 Oberbüren
              </p>
              <p>Telefon: +41 71 952 13 13</p>
              <p>E-Mail: ehn@mission13.ch</p>
            </address>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Mission13 GmbH. Alle Rechte vorbehalten.</p>
          <div className="flex space-x-6">
            <a href="https://mission13.ch/impressum" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Impressum</a>
            <a href="https://mission13.ch/datenschutz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Datenschutz</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
