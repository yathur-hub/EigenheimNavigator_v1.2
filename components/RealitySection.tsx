
import React from 'react';

interface RealitySectionProps {
  onStartCheck: () => void;
}

const RealitySection: React.FC<RealitySectionProps> = ({ onStartCheck }) => {
  return (
    <section id="how-it-works" className="py-12 sm:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            Die meisten scheitern nicht am Traum – sondern an falschen Annahmen.
          </h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            In der Schweiz ist der Markt für Eigenheime gnadenlos. Bankenlogik, steigende Zinsen und komplexe Tragbarkeitsrechnungen führen dazu, dass viele Interessenten jahrelang "blind" suchen und bei jedem Objekt eine Absage kassieren. Das ist frustrierend und kostet wertvolle Lebenszeit.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Unsere Aufgabe ist es, diese Blackbox zu öffnen. Wir geben dir die nackte Wahrheit über deine Situation, damit du nicht auf Hoffnungen baust, sondern auf Fakten. Nur wer seine Zahlen wirklich kennt, kann am Markt als seriöser Käufer auftreten.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="aspect-video rounded-[24px] overflow-hidden shadow-2xl border border-slate-100 bg-slate-50">
            <iframe 
              className="w-full h-full"
              src="https://www.youtube.com/embed/ELibSv3mUSo?start=1" 
              title="Eigenheim Navigator Video" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <button 
            className="bg-[#2663EB] text-white px-10 py-4 rounded-[14px] font-bold text-lg shadow-lg hover:bg-blue-700 transition-all"
            data-event="cta_primary_mid_click"
            onClick={onStartCheck}
          >
            Erstgespräch buchen
          </button>
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm">
            <svg className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>Nur selbstbewohnte Wohnobjekte, keine Renditeobjekte</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealitySection;
