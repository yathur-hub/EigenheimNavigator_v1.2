
import React from 'react';

interface HeroProps {
  onStartCheck: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStartCheck }) => {
  return (
    <section className="relative bg-white pt-10 pb-10 md:pt-24 md:pb-12 px-4 overflow-hidden border-b border-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Copy */}
          <div className="space-y-8 animate-fade-in order-2 lg:order-1">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
                Wie realistisch ist Ihr Eigenheim in der Schweiz – <span className="text-[#2663EB]">wirklich?</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed">
                Erhalten Sie eine ehrliche Einordnung zu Budget, Finanzierung und Kaufzeitpunkt – ohne Sales-Druck. Kostenlos. Unverbindlich.
              </p>
              <div className="text-slate-600 max-w-xl leading-relaxed space-y-4">
                <p>
                  In der Schweiz scheitern viele Träume nicht am Wunsch nach Eigentum, sondern an der komplexen Tragbarkeitsrechnung der Banken und fehlenden Eigenmittelstrategien. Die Suche ohne Klarheit führt oft zu monatelanger Frustration.
                </p>
                <p>
                  Unser Realitätscheck gibt Ihnen in wenigen Minuten eine erste, ehrliche Orientierung auf Basis von Schweizer Marktstandards. Er ersetzt keine Bankprüfung, aber er zeigt Ihnen klipp und klar auf, wo Sie heute stehen. Ziel ist Klarheit, nicht Überreden.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                className="w-full sm:w-auto bg-[#2663EB] text-white px-10 py-4 rounded-[14px] font-bold text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                data-event="check_start"
                onClick={onStartCheck}
              >
                Realitätscheck starten
              </button>
              <button 
                className="w-full sm:w-auto bg-white text-[#F87101] border-2 border-[#F87101] px-10 py-4 rounded-[14px] font-bold text-lg hover:bg-orange-50 transition-all active:scale-[0.98]"
                data-event="cta_secondary_click"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Kurzberatung vereinbaren
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest">
                Der Realitätscheck ersetzt keine Bankprüfung – er zeigt, ob sich die Vertiefung lohnt.
              </p>
              <div className="flex items-center gap-3 text-slate-500 text-sm font-semibold">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <span>5.0 auf Google (39 Bewertungen) · 1’350+ begleitete Kunden</span>
              </div>
            </div>
          </div>

          {/* Right Column: VSL Video */}
          <div className="relative order-1 lg:order-2">
            <div 
              className="relative overflow-hidden rounded-[24px] shadow-2xl border border-slate-100 transition-all hover:shadow-blue-200/40 group"
              data-event="video_vsl_click"
            >
              <a href="https://eigenheim-navi.ch?wvideo=zaoi3f9psr" target="_blank" rel="noopener noreferrer" className="block relative">
                <img 
                  src="https://embed-ssl.wistia.com/deliveries/339e1893038bfbaa7d96b223b1d39117.jpg?image_play_button_size=2x&image_crop_resized=960x540&image_play_button_rounded=1&image_play_button_color=F87102e0" 
                  alt="VSL Video Thumbnail" 
                  className="w-full h-auto block transform transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
              </a>
            </div>

            {/* Video Meta Info */}
            <div className="mt-6 px-2 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-slate-900 leading-tight">In 90 Sekunden: Was Banken wirklich prüfen</h3>
                <p className="text-slate-500 text-sm mt-1 font-medium">Kurz erklärt – damit Sie schneller Klarheit haben.</p>
              </div>
              <a 
                href="https://eigenheim-navi.ch?wvideo=zaoi3f9psr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="bg-slate-50 text-[#F87101] px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-orange-50 transition-colors"
              >
                VSL
              </a>
            </div>
          </div>
        </div>

        {/* Horizontal Divider line */}
        <div className="mt-12 h-px bg-slate-100 w-full"></div>
      </div>
    </section>
  );
};

export default Hero;
