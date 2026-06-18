import React from 'react';
import { Users, CheckCircle2, AlertCircle, MapPin, Briefcase, Coins, HelpCircle, Compass, Info } from 'lucide-react';

interface TargetGroupSectionProps {
  onStartCheck: () => void;
}

const TargetGroupSection: React.FC<TargetGroupSectionProps> = ({ onStartCheck }) => {
  const suitabilityPoints = [
    {
      id: "fit_ostschweiz",
      icon: <MapPin size={20} className="text-emerald-600" />,
      text: "in der Ostschweiz wohnst oder dort ein Eigenheim suchst"
    },
    {
      id: "fit_beruf",
      icon: <Briefcase size={20} className="text-emerald-600" />,
      text: "berufstätig bist und prüfen möchtest, was realistisch finanzierbar ist"
    },
    {
      id: "fit_lifephase",
      icon: <Users size={20} className="text-emerald-600" />,
      text: "als Einzelperson, Paar oder Familie über Eigentum nachdenkst"
    },
    {
      id: "fit_capital",
      icon: <Coins size={20} className="text-emerald-600" />,
      text: "noch nicht genau weisst, ob dein Eigenkapital reicht"
    },
    {
      id: "fit_timing",
      icon: <Compass size={20} className="text-emerald-600" />,
      text: "wissen möchtest, ob Kaufen jetzt, später oder noch nicht sinnvoll ist"
    },
    {
      id: "fit_pressure",
      icon: <HelpCircle size={20} className="text-emerald-600" />,
      text: "den Kaufprozess verstehen möchtest, bevor du unter Entscheidungsdruck gerätst"
    }
  ];

  return (
    <section id="zielgruppe" className="py-16 sm:py-24 px-4 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-850 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
            <Users size={12} className="text-blue-600" />
            <span>Deine Orientierung</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-black text-slate-900 mb-6 leading-tight select-none">
            Für wen ist der Eigenheim-Realitätscheck gedacht?
          </h2>
          <div className="h-1.5 bg-blue-600 w-20 mx-auto rounded-full mb-8"></div>
          <p className="text-slate-600 font-medium leading-relaxed text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Der Realitätscheck richtet sich an Menschen, die ihren Eigenheimwunsch ernsthaft prüfen möchten und verstehen wollen, ob Kaufen jetzt, später oder noch nicht sinnvoll ist.
          </p>
        </div>

        {/* Suitable For - 3x2 Grid */}
        <div className="max-w-5xl mx-auto mb-16">
          <h3 className="text-xl font-extrabold text-slate-950 mb-8 flex items-center justify-center gap-2">
            <CheckCircle2 size={22} className="text-emerald-500 flex-shrink-0" />
            <span>Geeignet für dich, wenn du:</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suitabilityPoints.map((point) => (
              <div 
                key={point.id}
                id={point.id}
                className="bg-white border border-slate-100 rounded-[22px] p-6 shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    {point.icon}
                  </div>
                  <p className="text-slate-700 font-bold text-sm sm:text-base leading-snug">
                    {point.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gentle Pre-Qualification / Not Suitable Info Box */}
        <div className="max-w-3xl mx-auto mb-16 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 border border-red-100/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info size={18} className="text-red-500" />
            </div>
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-black text-slate-900">
                Wann der Realitätscheck eher nicht passend ist
              </h4>
              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                Der Eigenheim-Realitätscheck ist nicht auf jede Situation ausgelegt. Damit keine falschen Erwartungen entstehen, ist das Angebot eher nicht passend, wenn du aktuell nur unverbindlich stöbern möchtest oder keinen konkreten Eigenheimwunsch zur Eigennutzung hast.
              </p>
              <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                Auch in folgenden Situationen ist der Realitätscheck möglicherweise nicht das richtige Angebot:
              </p>
              <ul className="space-y-2 pl-1">
                {[
                  "wenn du eine Renditeliegenschaft oder ein Anlageobjekt suchst",
                  "wenn du deutlich unter 22 oder über 45 Jahre alt bist",
                  "wenn eine Beratung auf Deutsch für dich aktuell nicht gut möglich ist",
                  "wenn du erst seit kurzer Zeit selbstständig bist und noch keine stabile Einkommenshistorie vorweisen kannst",
                  "wenn du beruflich selbst im Finanzierungs-, Versicherungs- oder Hypothekarbereich tätig bist",
                  "wenn deine aktuelle finanzielle Ausgangslage noch nicht auf regelmässigem Erwerbseinkommen basiert"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
                    <span className="text-slate-300 font-bold mt-1 select-none">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Call To Action Block with Trust Indicators */}
        <div className="text-center">
          <div className="flex flex-col items-center justify-center gap-4">
            <button 
              type="button"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 sm:py-4.5 rounded-2xl font-black text-center text-sm sm:text-base shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              onClick={onStartCheck}
            >
              Meine Ausgangslage prüfen
            </button>
            
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span>Vollständig kostenlos &unverbindlich</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TargetGroupSection;
