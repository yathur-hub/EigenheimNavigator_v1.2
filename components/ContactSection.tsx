
import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-12 sm:py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">Finden Sie heraus, ob Ihr Eigenheim realistisch ist.</h2>
          <p className="text-base sm:text-lg text-slate-600">Verlieren Sie keine Zeit mehr mit Suchen ohne Gewissheit. Wir helfen Ihnen, Klarheit zu gewinnen und Chancen zu nutzen.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
          {/* Left: Form */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[32px] shadow-xl border border-gray-100">
            <form className="space-y-6" data-event="form_start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Vorname</label>
                  <input type="text" name="firstname" className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Max" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Nachname</label>
                  <input type="text" name="lastname" className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mustermann" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">E-Mail</label>
                <input type="email" name="email" className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="max@beispiel.ch" required />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon</label>
                <input type="tel" name="phone" className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="+41 79 123 45 67" required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Kaufzeitraum</label>
                  <select name="timeframe" className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Bitte wählen...</option>
                    <option>0–12 Monate</option>
                    <option>1–3 Jahre</option>
                    <option>Noch unklar</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">PLZ / Ort (Optional)</label>
                  <input type="text" name="zip" className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500" placeholder="8000 Zürich" />
                </div>
              </div>

              <div className="flex items-center gap-3 py-2">
                <div className="w-6 h-6 border border-slate-200 bg-slate-50 rounded flex items-center justify-center">
                   <svg className="w-4 h-4 text-slate-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                </div>
                <span className="text-xs text-slate-500">Ich bin kein Roboter (Sicherheit-Placeholder)</span>
              </div>

              <button 
                type="submit"
                className="w-full bg-[#2663EB] text-white py-5 rounded-[16px] font-bold text-xl shadow-lg hover:bg-blue-700 transition-all"
                data-event="form_submit"
              >
                Anfrage senden
              </button>
              
              <p className="text-center text-slate-400 text-[10px] leading-tight">
                Wir melden uns innerhalb kurzer Zeit mit den nächsten Schritten. Mit dem Absenden akzeptieren Sie unsere <a href="#" className="underline">Datenschutzerklärung</a>.
              </p>
            </form>
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

              <div className="mt-12 pt-8 border-t border-slate-50 flex items-center gap-4">
                <div className="text-3xl font-black text-slate-900">5.0</div>
                <div>
                  <div className="text-yellow-400 text-lg">★★★★★</div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Google Rating (39 Rezensionen)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
