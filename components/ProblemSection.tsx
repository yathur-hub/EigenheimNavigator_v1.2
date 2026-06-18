import React from 'react';
import { HelpCircle, Clock, AlertCircle } from 'lucide-react';

interface ProblemSectionProps {
  onStartCheck: () => void;
}

const ProblemSection: React.FC<ProblemSectionProps> = ({ onStartCheck }) => {
  const questions = [
    {
      id: "q_capital",
      text: "Reicht unser Eigenkapital wirklich?"
    },
    {
      id: "q_feasibility",
      text: "Ist die Tragbarkeit realistisch?"
    },
    {
      id: "q_region",
      text: "Können wir uns ein Eigenheim in der Ostschweiz leisten?"
    },
    {
      id: "q_timing",
      text: "Wann ist der richtige Zeitpunkt?"
    },
    {
      id: "q_attention",
      text: "Worauf müssen wir achten, bevor wir uns für ein Objekt entscheiden?"
    },
    {
      id: "q_delay",
      text: "Was passiert, wenn wir zu spät starten?"
    }
  ];

  return (
    <section id="problem" className="py-16 sm:py-24 px-4 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-black uppercase tracking-widest mb-6 border border-amber-100 shadow-sm">
            <Clock size={12} className="text-amber-600 animate-pulse" />
            <span>Das Timing-Problem</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-black text-slate-900 mb-6 leading-tight select-none">
            Viele starten mit dem Eigenheim erst, wenn der Druck bereits hoch ist.
          </h2>
          <div className="h-1.5 bg-[#F87101] w-20 mx-auto rounded-full mb-8"></div>
          <p className="text-slate-650 font-medium leading-relaxed text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            Der Wunsch nach einem Eigenheim entsteht oft lange vor der eigentlichen Entscheidung. Trotzdem beschäftigen sich viele erst dann mit Finanzierung, Eigenkapital und Tragbarkeit, wenn bereits ein konkretes Objekt im Raum steht.
          </p>
          <p className="text-slate-600 font-bold leading-relaxed text-sm sm:text-base mt-4 max-w-2xl mx-auto">
            Dann wird aus einer grossen Lebensentscheidung plötzlich eine Entscheidung unter Zeitdruck.
          </p>
        </div>

        {/* Two Column Layout: Video & Dilemma Questions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Embed Video and Intro Context */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-50 p-4 rounded-[28px] border border-slate-100 shadow-xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 via-transparent to-transparent pointer-events-none" />
              <div className="aspect-video rounded-[20px] overflow-hidden bg-slate-900 border border-slate-200/50 relative">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/RQxJJReNv7I?rel=0" 
                  title="Eigenheim Navigator Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <p className="text-xs text-center text-slate-500 font-bold mt-2">
              Video ansehen: Die nackte Wahrheit über den Schweizer Eigenheimmarkt.
            </p>
          </div>

          {/* Right Column: Question Cards */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-lg font-black text-slate-950 mb-3 tracking-tight">
              Typische Fragen auf dem Weg ins Eigenheim:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {questions.map((q) => (
                <div 
                  key={q.id} 
                  id={q.id}
                  className="bg-slate-50/50 hover:bg-slate-50 border border-slate-100 rounded-2xl p-5 transition-all duration-300 hover:border-blue-100 flex items-start gap-3 group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <HelpCircle size={16} />
                  </div>
                  <p className="text-sm font-bold text-slate-800 leading-snug">
                    {q.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Kernaussage Highlight Callout Box */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border border-slate-800 text-center">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#F87101]/10 rounded-full blur-2xl" />
            
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
                <AlertCircle size={22} />
              </div>
              <p className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-slate-100 max-w-2xl leading-snug">
                Der grösste Fehler ist nicht, dass man noch nicht alles weiss. <span className="text-[#F87101]">Der grösste Fehler ist, zu spät Klarheit zu schaffen.</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProblemSection;
