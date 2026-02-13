
import React from 'react';

interface SocialProofSectionProps {
  onStartCheck: () => void;
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({ onStartCheck }) => {
  const testimonials = [
    { name: "Anna & Marc", text: "Wir dachten, unser Eigenkapital reicht nie aus. Durch die neue Strategie wissen wir jetzt genau, worauf wir sparen müssen." },
    { name: "Sandro K.", text: "Endlich mal eine Beratung ohne Verkaufsabsicht. Die Analyse hat mir die Augen geöffnet, was meine Bank mir verschwiegen hat." },
    { name: "Familie Müller", text: "Der Realitätscheck war hart, aber notwendig. Heute wohnen wir in unserem Haus, weil wir den Fokus korrigiert haben." }
  ];

  return (
    <section id="customers" className="py-20 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Diese Kunden standen genau dort, wo Sie heute stehen.
          </h2>
          <p className="text-xl text-slate-500 italic">“Vom Zweifel zur Finanzierung – mit Klarheit statt Hoffnung.”</p>
        </div>

        {/* Desktop Grid / Mobile Slider (CSS scroll snap) */}
        <div className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto snap-x pb-8 md:pb-0 no-scrollbar">
          {testimonials.map((t, idx) => (
            <div key={idx} className="min-w-[85vw] md:min-w-0 snap-center bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm">
              <div className="aspect-video bg-slate-100 rounded-[16px] mb-6 flex flex-col items-center justify-center cursor-pointer group hover:bg-slate-200 transition-colors" data-event="video_placeholder_click">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-[#2663EB] ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6 4l10 6-10 6V4z"></path></svg>
                </div>
                <span className="mt-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Kundenstory Video</span>
              </div>
              <p className="text-slate-700 italic mb-4 leading-relaxed">“{t.text}”</p>
              <h4 className="font-bold text-slate-900">– {t.name}</h4>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
           <button 
            className="bg-[#2663EB] text-white px-10 py-4 rounded-[14px] font-bold text-lg shadow-lg hover:bg-blue-700 transition-all"
            data-event="cta_primary_proof_click"
            onClick={onStartCheck}
          >
            Meine Chancen prüfen
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
