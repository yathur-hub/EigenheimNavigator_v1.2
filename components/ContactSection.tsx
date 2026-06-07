
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import BookingForm from './BookingForm';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-12 sm:py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">Finde heraus, ob dein Eigenheim realistisch ist.</h2>
          <p className="text-base sm:text-lg text-slate-600">Verliere keine Zeit mehr mit Suchen ohne Gewissheit. Wir helfen dir, Klarheit zu gewinnen und Chancen zu nutzen.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
          {/* Left: Form Card */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[32px] shadow-xl border border-gray-100 flex flex-col">
             <BookingForm />
          </div>

          {/* Right: Trust Box */}

          <div className="flex flex-col justify-center">
            <div className="bg-white p-8 rounded-[24px] border border-gray-100 shadow-sm relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#F87101] rounded-full flex items-center justify-center text-white text-center p-2 transform rotate-12 shadow-lg">
                <span className="text-xs font-black uppercase leading-none">100% Kostenlos</span>
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-8">Warum wir?</h4>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                   <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                   </div>
                   <div>
                    <span className="block font-bold text-slate-800">Kostenloser Erst-Check</span>
                    <span className="text-slate-500 text-sm">Kein Risiko, volle Transparenz von Anfang an.</span>
                   </div>
                </li>
                <li className="flex items-start gap-4">
                   <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                   </div>
                   <div>
                    <span className="block font-bold text-slate-800">Schweizer Fokus</span>
                    <span className="text-slate-500 text-sm">Spezialisiert auf den hiesigen Immobilienmarkt.</span>
                   </div>
                </li>
                <li className="flex items-start gap-4">
                   <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                   </div>
                   <div>
                    <span className="block font-bold text-slate-800">Struktur statt Bauchgefühl</span>
                    <span className="text-slate-500 text-sm">Wir arbeiten datenbasiert nach Bankenlogik.</span>
                   </div>
                </li>
              </ul>

              <a 
                href="https://www.google.com/search?q=mission+13&sca_esv=68dd12cce3572cd1&sxsrf=ANbL-n7GnYnqLxrx2peeTniue77CYhX_Lg%3A1777961850493&ei=eov5aYDjHZyli-gPgaiJwAU&biw=2560&bih=1210&ved=0ahUKEwiAiJeEwKGUAxWc0gIHHQFUAlgQ4dUDCBE&uact=5&oq=mission+13&gs_lp=Egxnd3Mtd2l6LXNlcnAiCm1pc3Npb24gMTMyCxAuGK8BGMcBGIAEMgUQABiABDIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yBhAAGBYYHjIGEAAYFhgeMgYQABgWGB4yGhAuGK8BGMcBGIAEGJcFGNwEGN4EGOAE2AECSP8KUMoHWMoHcAF4AZABAJgBXKABXKoBATG4AQPIAQD4AQGYAgKgAmLCAgoQABhHGNYEGLADwgINEAAYgAQYigUYQxiwA8ICFxAuGNwGGLgGGNoGGNgCGMgDGLAD2AEBmAMAiAYBkAYNugYECAEYGboGBggCEAEYFJIHATKgB6MIsgcBMbgHX8IHAzAuMsgHBYAIAQ&sclient=gws-wiz-serp#lrd=0x479aeb40d83a929f:0x9511e8ffc914af69,1,,,,"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-12 pt-8 border-t border-slate-50 flex items-center gap-4 hover:opacity-80 transition-opacity"
                data-event="google_reviews_click"
              >
                <div className="text-3xl font-black text-slate-900">4.9</div>
                <div>
                  <div className="text-yellow-400 text-lg">★★★★★</div>
                  <div className="text-xs text-slate-400 font-bold uppercase whitespace-nowrap">45 Google-Bewertungen</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
