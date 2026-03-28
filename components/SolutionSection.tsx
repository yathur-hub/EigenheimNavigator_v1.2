
import React from 'react';

interface SolutionSectionProps {
  onStartCheck: () => void;
}

const SolutionSection: React.FC<SolutionSectionProps> = ({ onStartCheck }) => {
  const outcomes = [
    {
      title: "Realistische Finanzierungsanalyse",
      text: "Wir klären, was Banken Ihnen effektiv bewilligen. Inklusive Tragbarkeit, benötigtem Eigenkapital und Ihrem maximalen Kaufpreis-Spielraum."
    },
    {
      title: "Klare Kaufstrategie",
      text: "Wann ist der beste Kaufzeitpunkt für Sie? Wir definieren Prioritäten, optimieren Ihre Suchstrategie und bereiten Sie auf Verhandlungen vor."
    },
    {
      title: "Zugang zu Partnern",
      text: "Wenn es Sinn macht, bringen wir Sie direkt mit den richtigen Finanzierungspartnern zusammen – für konkrete Angebote statt vager Versprechen."
    }
  ];

  return (
    <section className="py-12 sm:py-20 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12 sm:mb-16">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Wir zeigen nicht nur Möglichkeiten – wir sagen Ihnen ehrlich, ob es funktioniert.
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Standardberatungen gibt es wie Sand am Meer. Wir konzentrieren uns auf das Wesentliche: Ihr Ergebnis. Nach unserem Austausch wissen Sie nicht nur theoretisch, wie Hypotheken funktionieren, sondern Sie haben einen Plan für Ihr eigenes Projekt in der Hand.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Klarheit ist unser höchstes Gut. Wenn eine Finanzierung aktuell nicht möglich ist, sagen wir Ihnen das direkt – und zeigen Ihnen den Weg auf, wie Sie in 12 oder 24 Monaten an den Punkt kommen, an dem es funktioniert. Keine falschen Versprechen, sondern echte Perspektiven.
            </p>

            <div className="hidden sm:flex flex-col sm:flex-row items-center gap-4 mt-10">
              <button 
                className="w-full sm:w-auto bg-[#2663EB] text-white px-8 py-4 rounded-[14px] font-bold text-lg hover:bg-blue-700 transition-all"
                data-event="cta_primary_click"
                onClick={onStartCheck}
              >
                Eigenheim-Check starten
              </button>
              <button 
                className="w-full sm:w-auto bg-white text-[#F87101] border-2 border-[#F87101] px-8 py-4 rounded-[14px] font-bold text-lg hover:bg-orange-50 transition-all"
                data-event="cta_secondary_click"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Kurzberatung vereinbaren
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {outcomes.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-[20px] shadow-sm flex gap-6 items-start">
                <div className="flex-shrink-0 w-14 h-14 bg-blue-50 text-[#2663EB] rounded-2xl flex items-center justify-center font-bold text-xl">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
