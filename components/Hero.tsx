
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
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[0.95] tracking-tighter">
                Wie realistisch ist Ihr Eigenheim – <span className="text-blue-600">wirklich?</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
                Erhalten Sie eine ehrliche Einordnung zu Budget, Finanzierung und Kaufzeitpunkt – ohne Sales-Druck. In 90 Sekunden.
              </p>
            </div>

            <div className="hidden sm:flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4">
              <button 
                className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                data-event="check_start"
                onClick={onStartCheck}
              >
                Realitätscheck starten
              </button>
              <button 
                className="w-full sm:w-auto bg-white text-orange-600 border-2 border-orange-600 px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg hover:bg-orange-50 transition-all active:scale-[0.98]"
                data-event="cta_secondary_click"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Kurzberatung vereinbaren
              </button>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                       <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                     </div>
                   ))}
                 </div>
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-tight">
                    Über 1’350+ erfolgreiche <br />Analysen durchgeführt
                 </div>
              </div>
              <div className="flex items-center gap-2 text-amber-500 font-bold">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <span className="text-slate-900">5.0</span>
                <span className="text-slate-400 font-medium">Google (39 Bewertungen)</span>
              </div>
            </div>
          </div>

          {/* Right Column: VSL Video */}
          <div className="relative order-1 lg:order-2">
            <div 
              className="relative aspect-video overflow-hidden rounded-[32px] shadow-2xl border border-slate-100 transition-all hover:shadow-blue-200/40 group bg-slate-100"
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/ELibSv3mUSo?rel=0"
                title="Eigenheim Navigator Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            
            {/* Decoration */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-orange-600/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
