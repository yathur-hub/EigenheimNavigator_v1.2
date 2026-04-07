
import React from 'react';

interface PartnerSectionProps {
  onStartCheck: () => void;
}

const clientImages = [
  "https://eigenheimnavigator.ch/images/client4.png",
  "https://eigenheimnavigator.ch/images/client5.png",
  "https://eigenheimnavigator.ch/images/client6.png",
  "https://eigenheimnavigator.ch/images/client7.png",
  "https://eigenheimnavigator.ch/images/client1.png",
  "https://eigenheimnavigator.ch/images/client2.png",
  "https://eigenheimnavigator.ch/images/client3.png"
];

const PartnerSection: React.FC<PartnerSectionProps> = ({ onStartCheck }) => {
  return (
    <section id="gallery" className="py-12 sm:py-24 px-4 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
            Klarheit statt Hoffnung: Unsere Kunden auf dem Weg ins Eigenheim.
          </h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            Hinter jeder erfolgreichen Finanzierung steht eine individuelle Geschichte. Wir haben über 5’000 Paare dabei geholfen, die Blackbox «Bankenfinanzierung» zu verstehen und den Traum vom Eigenheim auf ein solides Fundament zu stellen.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Vom ersten Realitätscheck bis zur Schlüsselübergabe – wir begleiten Menschen, keine Dossiers. Echte Ergebnisse, echte Emotionen, keine leeren Versprechen.
          </p>
        </div>

        {/* Dynamic Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-16">
          {clientImages.map((src, i) => (
            <div key={i} className="group relative aspect-square bg-slate-50 border border-slate-100 rounded-2xl overflow-hidden flex items-center justify-center transition-all hover:border-[#F87101] hover:shadow-xl">
              <img 
                src={src} 
                alt={`Glückliche Kunden ${i + 1}`} 
                className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-2 left-2 right-2 flex justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <span className="bg-[#F87101] text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest shadow-lg">
                  Finanziert
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">Echte Menschen, echte Situationen – keine Show.</p>
          <button 
            className="bg-[#2663EB] text-white px-10 py-5 rounded-[16px] font-bold text-xl shadow-xl hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
            data-event="cta_primary_gallery_click"
            onClick={onStartCheck}
          >
            Erstgespräch buchen
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
