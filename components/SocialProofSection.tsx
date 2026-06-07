
import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SocialProofSectionProps {
  onStartCheck: () => void;
}

const SocialProofSection: React.FC<SocialProofSectionProps> = ({ onStartCheck }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const testimonials = [
    { 
      name: "Bojana & Milos", 
      text: "Wir haben gemerkt, wir geben so viele Mittel für die Mietwohnung aus und das war der Beweggrund für das Eigenheim, dass man für das eigene Zuhause im Monat viel weniger zahlt als zur Miete.",
      videoId: "MceBnGpFSd8"
    },
    { 
      name: "Anna & Marc", 
      text: "Unsere grösste Sorge war das Finanzielle: Klappt das überhaupt? Funktioniert das überhaupt? Ich glaube, die Transparenz, dass wir das immer in den Listen und die Zahlen gesehen haben, hat uns das verständlich gemacht. Dadurch wurde man beruhigt.",
      videoId: "O5T_7lwLa3M"
    },
    { 
      name: "David & Kristina", 
      text: "Ich denke, ohne den Eigenheimnavigator wäre der Kauf ziemlich stressig verlaufen. Wir hätten sicher sehr viel Zeit damit verloren, uns selbst zu erkundigen und uns durch die vielen verschiedenen Methoden und Vorgehensweisen zu kämpfen.",
      videoId: "-IoxwK9KQ3w"
    },
    { 
      name: "Niru & Adsaya", 
      text: "Zwei Tage vor dem Notartermin hat uns die Bank plötzlich abgesagt. Wir dachten, jetzt haben wir das ganze Geld verloren. Aber der Eigenheimnavigator hat extrem flexibel und lösungsorientiert reagiert und innerhalb von wenigen Tagen direkt die nächste Bank und die perfekte Lösung für uns gefunden.",
      videoId: "eIOh5YimjMQ" 
    },
    { 
      name: "Familie Lekaj", 
      text: "Unsere grösste Angst war, dass uns die liquiden, finanziellen Mittel für den Hauskauf fehlen. Wir haben uns immer vorgestellt, dass wir zwingend 20 Prozent in bar brauchen. Aber der Eigenheimnavigator hat uns eine andere Perspektive aufgezeigt und bewiesen, dass es doch möglich ist.",
      videoId: "HXzGOikamlg" 
    }
  ];

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScroll);
    }
    window.addEventListener('resize', checkScroll);
    return () => {
      if (currentRef) currentRef.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Scroll by one full viewport width to better align with snapped cards
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="customers" className="py-12 sm:py-24 px-4 bg-slate-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight leading-tight">
              Diese Kunden standen genau dort, wo du heute stehst.
            </h2>
            <p className="text-lg sm:text-xl text-slate-500 italic">“Vom Zweifel zur Finanzierung – mit Klarheit statt Hoffnung.”</p>
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                canScrollLeft ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white' : 'border-slate-200 text-slate-200 cursor-not-allowed'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                canScrollRight ? 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white' : 'border-slate-200 text-slate-200 cursor-not-allowed'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>

        {/* Slider Container */}
        <div 
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-12 no-scrollbar scroll-smooth"
        >
          {testimonials.map((t, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[90vw] md:min-w-[400px] snap-center bg-white border border-slate-100 p-5 sm:p-8 rounded-[32px] shadow-sm flex flex-col hover:shadow-xl transition-shadow duration-500"
            >
              <div className="aspect-video bg-slate-100 rounded-[20px] sm:rounded-[24px] mb-6 sm:mb-8 overflow-hidden shadow-inner relative group">
                {t.videoId ? (
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${t.videoId}?rel=0`}
                    title={`Kundenstory ${t.name}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer group hover:bg-slate-200 transition-colors" data-event="video_placeholder_click">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-[#2663EB] ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6 4l10 6-10 6V4z"></path></svg>
                    </div>
                    <span className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Kundenstory Video</span>
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <p className="text-slate-700 italic mb-6 leading-relaxed text-base sm:text-lg">“{t.text}”</p>
              </div>
              <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                  {t.name.split(' ')[0][0]}
                </div>
                <h4 className="font-extrabold text-slate-900 tracking-tight">{t.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-4">
           <button 
            className="bg-[#2663EB] text-white px-12 py-5 rounded-2xl font-black text-lg shadow-xl hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95"
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
    </section>
  );
};

export default SocialProofSection;
