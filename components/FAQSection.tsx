
import React, { useState } from 'react';

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "Was kostet uns die Beratung?",
      a: "Das Erstgespräch und der Eigenheim-Check sind für Sie kostenlos und absolut unverbindlich. Sollten weiterführende, kostenpflichtige Dienstleistungen sinnvoll sein, kommunizieren wir dies transparent im Voraus."
    },
    {
      q: "Was genau bekommen wir nach der Beratung?",
      a: "Sie erhalten eine klare schriftliche Auswertung Ihrer Situation. Darin enthalten sind Ihr maximaler Kaufpreis, die Tragbarkeitsrechnung nach Bankenstandard und konkrete nächste Schritte für Ihre Suche."
    },
    {
      q: "Wie lange dauert das Ganze?",
      a: "Der Eigenheim-Check online dauert ca. 60 Sekunden. Das erste Analysegespräch dauert in der Regel 30-45 Minuten und findet meist digital oder telefonisch statt – ganz wie es für Sie passt."
    },
    {
      q: "Lohnt sich das, wenn wir erst in 1–3 Jahren kaufen wollen?",
      a: "Absolut. Gerade dann ist es wichtig, heute die Weichen bei der Vorsorge und dem Sparplan zu stellen, damit Sie in zwei Jahren 'finanzierungsbereit' sind, wenn Ihr Traumobjekt auftaucht."
    },
    {
      q: "Wo findet die Beratung statt?",
      a: "Wir arbeiten primär ortsunabhängig via Video-Call. Das ist effizient für Sie und uns. Auf Wunsch sind nach Absprache natürlich auch physische Termine möglich."
    },
    {
      q: "Wir haben keine 20% Eigenkapital – lohnt sich das trotzdem?",
      a: "Ja. Es gibt in der Schweiz verschiedene Wege (Vorsorgegelder, Schenkungen, Mietkauf-Modelle etc.), um Lücken zu schliessen. Wir prüfen für Sie ehrlich, ob einer dieser Wege für Sie gangbar ist."
    },
    {
      q: "Müssen wir nachher über euch finanzieren?",
      a: "Nein. Wir zeigen Ihnen Optionen auf. Ob Sie diese nutzen oder mit Ihrer Hausbank sprechen, entscheiden allein Sie. Wir sind stolz auf unsere Unabhängigkeit."
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
    <section id="faq" className="py-24 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-12 text-center">Was uns fast alle fragen</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border border-slate-100 rounded-[16px] overflow-hidden">
              <button 
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
                onClick={() => toggle(idx)}
              >
                <span className="font-bold text-slate-800 pr-4">{faq.q}</span>
                <span className={`flex-shrink-0 w-6 h-6 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
              </button>
              {openIndex === idx && (
                <div className="p-6 pt-0 bg-white">
                  <p className="text-slate-600 leading-relaxed mb-4">{faq.a}</p>
                  <button 
                    className="text-[#F87101] font-bold text-sm hover:underline"
                    data-event="faq_cta_click"
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Situation kostenlos prüfen &rarr;
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
