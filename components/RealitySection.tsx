
import React from 'react';

interface RealitySectionProps {
  onStartCheck: () => void;
}

const RealitySection: React.FC<RealitySectionProps> = ({ onStartCheck }) => {
  const cards = [
    {
      title: "Banken bewerten anders, als viele denken.",
      text: "Ein hohes Einkommen allein reicht oft nicht. Die kalkulatorische Tragbarkeit und die Bewertung der Bank sind die eigentlichen Hürden."
    },
    {
      title: "Eigenkapital ist nicht nur eine Zahl – sondern eine Strategie.",
      text: "Wie man Vorsorgegelder und Ersparnisse kombiniert, entscheidet darüber, ob die Finanzierung überhaupt bewilligt wird."
    },
    {
      title: "Timing entscheidet über Chancen und Verhandlung.",
      text: "Wer erst sucht und dann die Finanzierung klärt, verliert gegen schnellere Käufer. Wir drehen diesen Prozess für Sie um."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Die meisten scheitern nicht am Traum – sondern an falschen Annahmen.
          </h2>
          <p className="text-slate-600 mb-4 leading-relaxed">
            In der Schweiz ist der Markt für Eigenheime gnadenlos. Bankenlogik, steigende Zinsen und komplexe Tragbarkeitsrechnungen führen dazu, dass viele Interessenten jahrelang "blind" suchen und bei jedem Objekt eine Absage kassieren. Das ist frustrierend und kostet wertvolle Lebenszeit.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Unsere Aufgabe ist es, diese Blackbox zu öffnen. Wir geben Ihnen die nackte Wahrheit über Ihre Situation, damit Sie nicht auf Hoffnungen bauen, sondern auf Fakten. Nur wer seine Zahlen wirklich kennt, kann am Markt als seriöser Käufer auftreten.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {cards.map((card, idx) => (
            <div key={idx} className="bg-white border border-slate-100 p-8 rounded-[20px] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-1 bg-[#F87101] mb-6"></div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{card.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button 
            className="bg-[#2663EB] text-white px-10 py-4 rounded-[14px] font-bold text-lg shadow-lg hover:bg-blue-700 transition-all"
            data-event="cta_primary_mid_click"
            onClick={onStartCheck}
          >
            Meine Situation prüfen
          </button>
        </div>
      </div>
    </section>
  );
};

export default RealitySection;
