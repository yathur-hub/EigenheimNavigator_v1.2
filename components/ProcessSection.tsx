
import React from 'react';

const ProcessSection: React.FC = () => {
  const steps = [
    {
      title: "Standortbestimmung",
      text: "Kurz-Check + erstes Gespräch, damit Zahlen und Realität zusammenpassen. Wir legen die Karten auf den Tisch."
    },
    {
      title: "Strategie & Möglichkeiten",
      text: "Optionen priorisieren, Finanzierung und Objektstrategie sauber aufsetzen. Wir definieren das Zielbild."
    },
    {
      title: "Umsetzung",
      text: "Begleitung bis zum Kauf – strukturiert, nachvollziehbar und stressreduziert. Wir machen den Sack zu."
    }
  ];

  return (
    <section className="py-24 px-4 bg-slate-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">So kommen Sie zu Ihrem Eigenheim – in 3 Schritten.</h2>
          <div className="h-1.5 bg-[#F87101] w-24 mx-auto rounded-full"></div>
        </div>

        <div className="relative">
          {/* Connector Line (Desktop) */}
          <div className="hidden md:block absolute top-10 left-0 w-full h-0.5 bg-slate-700 -z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="w-20 h-20 bg-[#F87101] text-white rounded-[24px] flex items-center justify-center text-3xl font-black mb-8 shadow-xl shadow-orange-900/20 ring-8 ring-slate-900">
                  {idx + 1}
                </div>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 text-center">
          <button 
            className="bg-[#2663EB] text-white px-10 py-5 rounded-[16px] font-bold text-xl shadow-2xl hover:bg-blue-700 transition-all hover:scale-105"
            data-event="cta_primary_process_click"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Erstgespräch sichern
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
