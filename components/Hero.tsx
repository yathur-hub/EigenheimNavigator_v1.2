
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
                Dein Weg zum Eigenheim – <span className="text-blue-600">einfach & klar.</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-slate-600 font-medium leading-relaxed max-w-lg">
                Buche dein kostenloses Erstgespräch und erhalte eine ehrliche Einordnung zu deinem Vorhaben.
              </p>
            </div>

            <div className="flex flex-col items-start gap-4 pt-4">
              <button 
                className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-10 py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
                data-event="check_start"
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

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                 <div className="flex -space-x-3">
                   {[
                     "https://eigenheimnavigator.ch/images/client4.png",
                     "https://eigenheimnavigator.ch/images/client5.png",
                     "https://eigenheimnavigator.ch/images/client6.png",
                     "https://eigenheimnavigator.ch/images/client7.png"
                   ].map((src, i) => (
                     <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden">
                       <img src={src} alt="user" className="w-full h-full object-cover" />
                     </div>
                   ))}
                 </div>
                 <div className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-tight">
                    5.000 begleitete Paare <br />in der Schweiz
                 </div>
              </div>
              <a 
                href="https://www.google.com/search?q=mission+13&sca_esv=68dd12cce3572cd1&sxsrf=ANbL-n7GnYnqLxrx2peeTniue77CYhX_Lg%3A1777961850493&ei=eov5aYDjHZyli-gPgaiJwAU&biw=2560&bih=1210&ved=0ahUKEwiAiJeEwKGUAxWc0gIHHQFUAlgQ4dUDCBE&uact=5&oq=mission+13&gs_lp=Egxnd3Mtd2l6LXNlcnAiCm1pc3Npb24gMTMyCxAuGK8BGMcBGIAEMgUQABiABDIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yGhAuGK8BGMcBGIAEGJcFGNwEGN4EGOAE2AECSP8KUMoHWMoHcAF4AZABAJgBXKABXKoBATG4AQPIAQD4AQGYAgKgAmLCAgoQABhHGNYEGLADwgINEAAYgAQYigUYQxiwA8ICFxAuGNwGGLgGGNoGGNgCGMgDGLAD2AEBmAMAiAYBkAYNugYECAEYGboGBggCEAEYFJIHATKgB6MIsgcBMbgHX8IHAzAuMsgHBYAIAQ&sclient=gws-wiz-serp#lrd=0x479aeb40d83a929f:0x9511e8ffc914af69,1,,,,"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-amber-500 font-bold hover:opacity-80 transition-opacity"
                data-event="google_reviews_click"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <span className="text-slate-900 uppercase">4.9 Sterne</span>
                <span className="text-slate-400 font-medium whitespace-nowrap">45 Google-Bewertungen</span>
              </a>
            </div>
          </div>

          {/* Right Column: VSL Video */}
          <div className="relative order-1 lg:order-2">
            <div 
              className="relative aspect-video overflow-hidden rounded-[32px] shadow-2xl border border-slate-100 transition-all hover:shadow-blue-200/40 group bg-slate-100"
            >
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/vVioptejOHM?rel=0"
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
