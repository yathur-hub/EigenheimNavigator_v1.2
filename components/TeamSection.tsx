
import React from 'react';

interface TeamSectionProps {
  onStartCheck: () => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({ onStartCheck }) => {
  return (
    <section id="team" className="py-12 sm:py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Column: Image */}
          <div className="w-full lg:w-1/2">
            <div className="relative">
              <div className="absolute -inset-4 bg-[#F87101]/10 rounded-[32px] blur-2xl"></div>
              <img 
                src="https://raw.githubusercontent.com/yathur-hub/EHN-Brandassets/main/EigenheimNavi%20Team%20Foto.jpeg" 
                alt="Eigenheim Navigator Team" 
                className="relative w-full h-auto rounded-[24px] shadow-2xl object-cover aspect-[4/3] lg:aspect-auto"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column: Text */}
          <div className="w-full lg:w-1/2">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-8 leading-tight">
                Wir sind Eigenheim Navigator.
              </h2>
              
              <div className="space-y-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                <p className="font-bold text-slate-900">
                  Wir bringen Klarheit in eine der grössten finanziellen Entscheidungen eures Lebens.
                </p>
                
                <p>
                  Der Weg ins Eigenheim ist selten an fehlendem Willen gescheitert sondern an Unsicherheit, Halbwissen und widersprüchlichen Aussagen.
                </p>
                
                <p className="font-bold text-[#F87101]">
                  Genau hier setzen wir an.
                </p>
                
                <p>
                  Mit über 18 Jahren Erfahrung begleiten wir euch strukturiert durch den gesamten Prozess: von der ersten Einschätzung bis zur konkreten Umsetzung.
                </p>
                
                <div className="space-y-2 pt-4">
                  <p className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#F87101] rounded-full"></span>
                    Keine Produktverkäufe.
                  </p>
                  <p className="flex items-center gap-3">
                    <span className="w-2 h-2 bg-[#F87101] rounded-full"></span>
                    Keine versteckten Interessen.
                  </p>
                  <p className="flex items-center gap-3 font-bold text-slate-900">
                    Sondern klare Entscheidungen auf Basis eurer Situation.
                  </p>
                </div>
              </div>
              
              <div className="mt-12">
                <button 
                  className="bg-[#2663EB] text-white px-8 py-4 rounded-[16px] font-bold text-lg shadow-xl hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
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
