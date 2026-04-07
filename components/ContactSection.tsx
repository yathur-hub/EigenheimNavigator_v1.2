
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ContactSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    timeframe: '',
    zip: '',
    privacyAccepted: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('https://formspree.io/f/mojprwpw', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setIsSuccess(true);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Es gab ein Problem beim Absenden. Bitte versuchen Sie es später erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-24 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">Finde heraus, ob dein Eigenheim realistisch ist.</h2>
          <p className="text-base sm:text-lg text-slate-600">Verliere keine Zeit mehr mit Suchen ohne Gewissheit. Wir helfen dir, Klarheit zu gewinnen und Chancen zu nutzen.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20">
          {/* Left: Form */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[24px] sm:rounded-[32px] shadow-xl border border-gray-100">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Anfrage gesendet!</h3>
                  <p className="text-slate-500 font-medium">Vielen Dank für dein Vertrauen. Wir haben deine Anfrage erhalten und melden uns in Kürze.</p>
                </div>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-slate-800 transition-all"
                >
                  Neues Formular
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Vorname</label>
                    <input 
                      type="text" 
                      name="firstname" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Max" 
                      required 
                      value={formData.firstname}
                      onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Nachname</label>
                    <input 
                      type="text" 
                      name="lastname" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="Mustermann" 
                      required 
                      value={formData.lastname}
                      onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">E-Mail</label>
                  <input 
                    type="email" 
                    name="email" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="max@beispiel.ch" 
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="+41 79 123 45 67" 
                    required 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Kaufzeitraum</label>
                    <select 
                      name="timeframe" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500"
                      value={formData.timeframe}
                      onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                    >
                      <option value="">Bitte wählen...</option>
                      <option value="0–12 Monate">0–12 Monate</option>
                      <option value="1–3 Jahre">1–3 Jahre</option>
                      <option value="Noch unklar">Noch unklar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">PLZ / Ort (Optional)</label>
                    <input 
                      type="text" 
                      name="zip" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-[12px] p-3 outline-none focus:ring-2 focus:ring-blue-500" 
                      placeholder="8000 Zürich" 
                      value={formData.zip}
                      onChange={(e) => setFormData({...formData, zip: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 py-2">
                  <input 
                    type="checkbox" 
                    id="privacy"
                    className="mt-1 w-4 h-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    required
                    checked={formData.privacyAccepted}
                    onChange={(e) => setFormData({...formData, privacyAccepted: e.target.checked})}
                  />
                  <label htmlFor="privacy" className="text-xs text-slate-500 cursor-pointer leading-tight">
                    Ich stimme der <Link to="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">Datenschutzerklärung</Link> zu.*
                  </label>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting || !formData.privacyAccepted}
                  className="w-full bg-[#2663EB] text-white py-5 rounded-[16px] font-bold text-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Wird gesendet...</span>
                    </>
                  ) : 'Anfrage senden'}
                </button>
                
                <p className="text-center text-slate-400 text-[10px] leading-tight">
                  Wir melden uns innerhalb kurzer Zeit mit den nächsten Schritten. Mit dem Absenden akzeptierst du unsere <Link to="/datenschutz" target="_blank" rel="noopener noreferrer" className="underline">Datenschutzerklärung</Link>.
                </p>
              </form>
            )}
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
