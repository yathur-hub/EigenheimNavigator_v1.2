
import React, { useState } from 'react';

interface FAQSectionProps {
  onStartCheck: () => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ onStartCheck }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Was kostet uns die Beratung?",
      a: "Das Erstgespräch und die erste Analyse sind für dich kostenlos und absolut unverbindlich. Sollten weiterführende, kostenpflichtige Dienstleistungen sinnvoll sein, kommunizieren wir dies transparent im Voraus.",
      cta: "Kostenlose Beratung anfordern"
    },
    {
      q: "Was genau bekommen wir nach der Beratung?",
      a: "Du erhältst eine klare schriftliche Auswertung deiner Situation. Darin enthalten sind dein maximaler Kaufpreis, die Tragbarkeitsrechnung nach Bankenstandard und konkrete nächste Schritte für deine Suche.",
      cta: "Jetzt Analyse anfordern"
    },
    {
      q: "Wie lange dauert das Ganze?",
      a: "Die Buchung für das Erstgespräch dauert ca. 60 Sekunden. Das erste Analysegespräch dauert in der Regel 30-45 Minuten und findet meist digital oder telefonisch statt – ganz wie es für dich passt.",
      cta: "In 60 Sekunden starten"
    },
    {
      q: "Lohnt sich das, wenn wir erst in 1–3 Jahren kaufen wollen?",
      a: "Absolut. Gerade dann ist es wichtig, heute die Weichen bei der Vorsorge und dem Sparplan zu stellen, damit du in zwei Jahren 'finanzierungsbereit' bist, wenn dein Traumobjekt auftaucht.",
      cta: "Planung frühzeitig starten"
    },
    {
      q: "Wo findet die Beratung statt?",
      a: "Wir arbeiten primär ortsunabhängig via Video-Call. Das ist effizient für dich und uns. Auf Wunsch sind nach Absprache natürlich auch physische Termine möglich.",
      cta: "Digitalen Termin buchen"
    },
    {
      q: "Wir haben keine 20% Eigenkapital – lohnt sich das trotzdem?",
      a: "Ja. Es gibt in der Schweiz verschiedene Wege (Vorsorgegelder, Schenkungen, Mietkauf-Modelle etc.), um Lücken zu schliessen. Wir prüfen für dich ehrlich, ob einer dieser Wege für dich gangbar ist.",
      cta: "Eigenkapital-Optionen prüfen"
    },
    {
      q: "Müssen wir nachher über euch finanzieren?",
      a: "Idealerweise ja, da wir so das Beste für dich herausholen. Wir arbeiten mit rund 30 Partnern zusammen, die uns vergüten – das macht unseren Service für dich kostengünstig. Liefert deine Hausbank oder ein anderes Institut am Ende doch das bessere Angebot, fragen wir dort für dich an.",
      cta: "Unabhängigen Check starten"
    }
  ];

  const toggle = (idx: number) => {
    if (openIndex === idx) {
        setOpenIndex(null);
    } else {
        console.log(`Tracking: faq_open_${idx}`);
        setOpenIndex(idx);
    }
  };

  return (
    <section id="faq" className="py-12 sm:py-24 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-8 sm:mb-12 text-center leading-tight">Was uns fast alle fragen</h2>
        
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-100 rounded-xl sm:rounded-[16px] overflow-hidden">
              <button 
                className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-slate-50 transition-colors"
                onClick={() => toggle(idx)}
              >
                <span className="font-bold text-slate-800 pr-4 text-sm sm:text-base">{faq.q}</span>
                <span className={`flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </button>
              {openIndex === idx && (
                <div className="p-4 sm:p-6 pt-0 bg-white">
                  <p className="text-slate-600 leading-relaxed mb-4 text-sm sm:text-base">{faq.a}</p>
                  <button 
                    className="text-[#F87101] font-bold text-sm hover:underline"
                    data-event="faq_cta_click"
                    onClick={onStartCheck}
                  >
                    {faq.cta} &rarr;
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
