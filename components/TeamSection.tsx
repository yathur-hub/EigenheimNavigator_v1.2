
import React from 'react';

interface TeamSectionProps {
  onStartCheck: () => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ onStartCheck }) => {
  return (
    <section id="team" className="py-12 sm:py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left Column: Image */}
          <div className="w-full lg:w-3/5">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#F87101]/10 rounded-[32px] blur-2xl"></div>
              <img 
                src="https://raw.githubusercontent.com/yathur-hub/EHN-Brandassets/main/Unbenannt%20-%2001.%20April%202026%20um%2008.23.54.png" 
                alt="Eigenheim Navigator Team" 
                className="relative w-full h-auto rounded-[24px] shadow-2xl object-cover aspect-[4/3] lg:aspect-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column: Text */}
          <div className="w-full lg:w-2/5">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-8 leading-tight">
                Wer steckt hinter Eigenheimnavi?
              </h2>
              
              <div className="space-y-6 text-base sm:text-lg text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-900">
                  Hinter Eigenheimnavi steht ein Team, das Menschen in der Ostschweiz dabei unterstützt, den Weg zum Eigenheim realistischer, verständlicher und strukturierter anzugehen.
                </p>
                
                <p>
                  Unser Fokus liegt darauf, komplexe Fragen rund um Eigenkapital, Tragbarkeit, Finanzierung, Timing und Kaufprozess verständlich einzuordnen. Nicht mit Druck, sondern mit Klarheit.
                </p>
                
                <p className="font-bold text-[#F87101]">
                  Unsere Grundwerte für deine Orientierung:
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4 pt-2">
                  <p className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                    Regionaler Fokus (Ostschweiz)
                  </p>
                  <p className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                    Verständliche Beratung
                  </p>
                  <p className="flex items-center gap-2.5 text-sm font-bold text-slate-800">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full flex-shrink-0"></span>
                    Strukturierte Einschätzung
                  </p>
                  <p className="flex items-center gap-2.5 text-sm font-bold text-slate-850">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                    Keine Kaufgarantie / falsche Versprechen
                  </p>
                  <p className="flex items-center gap-2.5 text-sm font-bold text-slate-850">
                    <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0"></span>
                    Absolut keine Verpflichtung
                  </p>
                </div>
              </div>
              
              <div className="mt-10">
                <button 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 sm:py-4.5 rounded-2xl font-black text-center text-sm sm:text-base shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  data-event="cta_team_section_click"
                  onClick={onStartCheck}
                >
                  Jetzt Klarheit schaffen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
