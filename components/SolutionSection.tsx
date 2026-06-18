
import React from 'react';

interface SolutionSectionProps {
  onStartCheck: () => void;
}

const SolutionSection: React.FC<SolutionSectionProps> = ({ onStartCheck }) => {
  const outcomes = [
    {
      title: "Klarheit über eure echte Ausgangslage",
      text: "Ihr wisst genau, was drinliegt, wo eure Grenzen sind und was ihr verbessern könnt. Das gibt euch Sicherheit, bevor ihr euch in ein Objekt verliebt oder unnötig Zeit mit falschen Immobilien verliert."
    },
    {
      title: "Sicher begleitet durch den Kaufprozess",
      text: "Ihr habt jemanden an eurer Seite, der den Weg kennt. Von der Besichtigung bis zum Kaufvertrag erkennt ihr Stolperfallen früher, verhandelt besser vorbereitet und trefft Entscheidungen mit deutlich mehr Ruhe."
    },
    {
      title: "Ein Plan, der auch nach dem Kauf hält",
      text: "Euer Eigenheim soll nicht nur gekauft, sondern auch sorgenfrei getragen werden können. Deshalb planen wir mit euch auch die Zeit nach dem Einzug: Budget, Unterhalt, Renovationen, Absicherung, Vorsorge und Steuern."
    }
  ];

  return (
    <section className="py-12 sm:py-20 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-12 sm:mb-16">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Wir zeigen nicht nur Möglichkeiten – wir sagen dir ehrlich, wie es funktioniert.
            </h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Standardberatungen gibt es wie Sand am Meer. Wir konzentrieren uns auf das Wesentliche: dein Ergebnis. Nach unserem Austausch weisst du nicht nur theoretisch, wie Hypotheken funktionieren, sondern du hast einen Plan für dein eigenes Projekt in der Hand.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Klarheit ist unser höchstes Gut. Wenn eine Finanzierung aktuell nicht möglich ist, sagen wir dir das direkt – und zeigen dir den Weg auf, wie du in 12 oder 24 Monaten an den Punkt kommst, an dem es funktioniert. Keine falschen Versprechen, sondern echte Perspektiven.
            </p>

            <div className="hidden sm:flex flex-col items-start gap-4 mt-10">
              <button 
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 sm:py-4.5 rounded-2xl font-black text-center text-sm sm:text-base shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                data-event="cta_primary_click"
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
