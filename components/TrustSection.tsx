import React from 'react';
import { ShieldCheck, MapPin, CheckCircle, Info, Landmark, HelpCircle, HeartHandshake } from 'lucide-react';

interface TrustSectionProps {
  onStartCheck: () => void;
}

const TrustSection: React.FC<TrustSectionProps> = ({ onStartCheck }) => {
  const trustPoints = [
    {
      id: "trust_ostschweiz",
      icon: <MapPin className="text-[#F87101]" size={24} />,
      title: "Fokus auf die Ostschweiz",
      description: "Massgeschneiderte Expertise für den regionalen Markt in der Ostschweiz."
    },
    {
      id: "trust_free",
      icon: <ShieldCheck className="text-blue-600" size={24} />,
      title: "Kostenloses Erstgespräch",
      description: "Unser erster Realitätscheck ist zu 100% kostenlos und komplett unverbindlich."
    },
    {
      id: "trust_realistic",
      icon: <Landmark className="text-[#F87101]" size={24} />,
      title: "Keine unrealistischen Versprechen",
      description: "Wir geben dir eine ehrliche Einschätzung statt künstlicher Finanzierungszusagen."
    },
    {
      id: "trust_obligation",
      icon: <CheckCircle className="text-blue-600" size={24} />,
      title: "Keine Verpflichtung",
      description: "Du entscheidest selbst, ob und wie du nach dem Gespräch weitermachen möchtest."
    },
    {
      id: "trust_transparency",
      icon: <Info className="text-[#F87101]" size={24} />,
      title: "Verständliche Einordnung",
      description: "Klare Antworten zu Eigenkapital, Tragbarkeit, Timing und nächsten Schritten."
    },
    {
      id: "trust_privacy",
      icon: <ShieldCheck className="text-blue-600" size={24} />,
      title: "Sicherer Datenschutz",
      description: "Deine Angaben werden streng vertraulich und datenschutzkonform verarbeitet."
    }
  ];

  return (
    <section id="trust" className="py-16 sm:py-24 px-4 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Intro */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
            <HeartHandshake size={12} className="text-blue-600" />
            <span>Sicherheit & Vertrauen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-black text-slate-900 mb-6 leading-tight select-none">
            Ehrliche Orientierung statt unrealistische Versprechen
          </h2>
          <div className="h-1.5 bg-[#F87101] w-20 mx-auto rounded-full mb-8"></div>
          <p className="text-slate-650 font-medium leading-relaxed text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Ein Eigenheim ist eine der grössten finanziellen Entscheidungen im Leben. Genau deshalb braucht es keine leeren Versprechen, sondern eine realistische Einordnung. Der Eigenheim-Realitätscheck hilft dir, deine aktuelle Situation besser zu verstehen und den nächsten Schritt bewusst zu planen.
          </p>
        </div>

        {/* trust grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12">
          {trustPoints.map((point) => (
            <div 
              key={point.id}
              id={point.id}
              className="bg-slate-50 border border-slate-100 rounded-[24px] p-6 transition-all duration-300 hover:border-blue-100 hover:bg-white hover:shadow-lg flex gap-4"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                {point.icon}
              </div>
              <div className="space-y-1.5">
                <h4 className="text-sm sm:text-base font-extrabold text-slate-950">
                  {point.title}
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer Callout */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mt-0.5">
              <Info size={14} />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              <span className="font-bold text-slate-800">Wichtiger Hinweis:</span> Der Realitätscheck soll dir helfen, deine Situation besser einzuschätzen. Er ersetzt keine verbindliche Finanzierungszusage und keine individuelle Hypothekarentscheidung durch eine Bank.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TrustSection;
