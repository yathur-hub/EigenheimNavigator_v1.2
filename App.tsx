
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './src/pages/Home';
import Impressum from './src/pages/Impressum';
import Privacy from './src/pages/Privacy';

import { Link } from 'react-router-dom';

type ModalStep = 'name' | 'contact' | 'object' | 'timeframe' | 'submit';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalStep>('name');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    hasObject: '',
    purchaseTimeframe: '',
    privacyAccepted: false
  });

  const track = (event: string, data?: any) => {
    console.log(`Tracking: ${event}`, data || '');
  };

  const openModal = () => {
    track('modal_open');
    setFormData({
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      hasObject: '',
      purchaseTimeframe: '',
      privacyAccepted: false
    });
    setIsModalOpen(true);
    setModalView('name');
    setIsSuccess(false);
    setIsSubmitting(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    track('check_modal_close');
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleSubmit = async () => {
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
        track('form_submit_success', formData);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Es gab ein Problem beim Absenden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Router>
      <div className="relative min-h-screen flex flex-col bg-white font-['Inter']">
        <Header onStartCheck={openModal} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onStartCheck={openModal} />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Privacy />} />
          </Routes>
        </main>

        <Footer />
        
        {/* OPTIMIZED REALITÄTSCHECK MODAL */}
        {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[92vh] sm:h-auto max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">CH</div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-none">Erstgespräch buchen</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Persönliche Beratung</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto no-scrollbar px-4 py-6 sm:px-10 sm:py-8 space-y-6 sm:space-y-8">
              
              {isSuccess ? (
                <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900">Anfrage gesendet!</h3>
                    <p className="text-slate-500 font-medium">Vielen Dank für dein Vertrauen. Wir haben deine Anfrage erhalten und melden uns in Kürze für das Erstgespräch.</p>
                  </div>
                  <button 
                    onClick={closeModal}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-slate-800 transition-all"
                  >
                    Schliessen
                  </button>
                </div>
              ) : (
                <>
                  {/* Progress Bar */}
                  <div className="flex items-center gap-4">
                    <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-700 ease-out" 
                        style={{ 
                          width: 
                            modalView === 'name' ? '20%' : 
                            modalView === 'contact' ? '40%' : 
                            modalView === 'object' ? '60%' : 
                            modalView === 'timeframe' ? '80%' : '100%' 
                        }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-black text-blue-600 uppercase tabular-nums">
                      {modalView === 'name' ? 'Schritt 1/5' : 
                       modalView === 'contact' ? 'Schritt 2/5' : 
                       modalView === 'object' ? 'Schritt 3/5' : 
                       modalView === 'timeframe' ? 'Schritt 4/5' : 'Schritt 5/5'}
                    </span>
                  </div>

                  {/* STEP 1: Name */}
                  {modalView === 'name' && (
                    <div className="animate-fade-in space-y-8 sm:space-y-10">
                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Wie dürfen wir dich ansprechen?</h3>
                        <p className="text-slate-500 text-xs sm:text-sm">Gib uns deinen Namen für eine persönliche Beratung.</p>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Vorname</label>
                          <input 
                            type="text" 
                            placeholder="Max"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none"
                            value={formData.firstname}
                            onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Nachname</label>
                          <input 
                            type="text" 
                            placeholder="Mustermann"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none"
                            value={formData.lastname}
                            onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="pt-4 sm:pt-6 border-t border-slate-50">
                        <button 
                          onClick={() => setModalView('contact')}
                          disabled={!formData.firstname || !formData.lastname}
                          className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:shadow-none"
                        >
                          Weiter
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Contact */}
                  {modalView === 'contact' && (
                    <div className="animate-fade-in space-y-8 sm:space-y-10">
                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Wie erreichen wir dich?</h3>
                        <p className="text-slate-500 text-xs sm:text-sm">Deine Daten werden vertraulich behandelt.</p>
                      </div>

                      <div className="space-y-5">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">E-Mail-Adresse</label>
                          <input 
                            type="email" 
                            placeholder="beispiel@mail.ch"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Telefonnummer</label>
                          <input 
                            type="tel" 
                            placeholder="+41 79 123 45 67"
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="pt-4 sm:pt-6 border-t border-slate-50 flex gap-3">
                        <button 
                          onClick={() => setModalView('name')}
                          className="flex-1 border-2 border-slate-100 text-slate-400 py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg hover:bg-slate-50 transition-all"
                        >
                          Zurück
                        </button>
                        <button 
                          onClick={() => setModalView('object')}
                          disabled={!formData.email || !formData.phone}
                          className="flex-[2] bg-blue-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:shadow-none"
                        >
                          Weiter
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Object */}
                  {modalView === 'object' && (
                    <div className="animate-fade-in space-y-8 sm:space-y-10">
                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Habt ihr bereits ein konkretes Objekt gefunden?</h3>
                      </div>

                      <div className="space-y-3">
                        {[
                          'Ja, wir haben bereits ein konkretes Objekt',
                          'Wir schauen uns gerade aktiv um',
                          'Wir haben ein Wunschobjekt im Blick, aber noch nichts Konkretes',
                          'Noch nicht – wir wollen erst wissen, was realistisch ist'
                        ].map(opt => (
                          <button
                            key={opt}
                            onClick={() => {
                              setFormData({...formData, hasObject: opt});
                              setModalView('timeframe');
                            }}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                              formData.hasObject === opt 
                              ? 'border-blue-600 bg-blue-50 text-blue-700' 
                              : 'border-slate-100 bg-white hover:border-slate-300'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold">{opt}</span>
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 sm:pt-6 border-t border-slate-50">
                        <button 
                          onClick={() => setModalView('contact')}
                          className="w-full border-2 border-slate-100 text-slate-400 py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg hover:bg-slate-50 transition-all"
                        >
                          Zurück
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 4: Timeframe */}
                  {modalView === 'timeframe' && (
                    <div className="animate-fade-in space-y-8 sm:space-y-10">
                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Wann möchtet ihr euer Eigenheim kaufen?</h3>
                      </div>

                      <div className="space-y-3">
                        {[
                          'In den nächsten 12 Monaten',
                          'In den nächsten 24 Monaten',
                          'Frühestens in 3 Jahren',
                          'Noch unklar, wir wollen einfach mal Klarheit'
                        ].map(opt => (
                          <button
                            key={opt}
                            onClick={() => {
                              setFormData({...formData, purchaseTimeframe: opt});
                              setModalView('submit');
                            }}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                              formData.purchaseTimeframe === opt 
                              ? 'border-blue-600 bg-blue-50 text-blue-700' 
                              : 'border-slate-100 bg-white hover:border-slate-300'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold">{opt}</span>
                          </button>
                        ))}
                      </div>

                      <div className="pt-4 sm:pt-6 border-t border-slate-50">
                        <button 
                          onClick={() => setModalView('object')}
                          className="w-full border-2 border-slate-100 text-slate-400 py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg hover:bg-slate-50 transition-all"
                        >
                          Zurück
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 5: Submit */}
                  {modalView === 'submit' && (
                    <div className="animate-fade-in space-y-8 sm:space-y-10">
                      <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Fast geschafft!</h3>
                        <p className="text-slate-500 text-xs sm:text-sm">Bestätige deine Anfrage für das Erstgespräch.</p>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400 font-bold uppercase">Name</span>
                            <span className="text-slate-900 font-black">{formData.firstname} {formData.lastname}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400 font-bold uppercase">Kontakt</span>
                            <span className="text-slate-900 font-black">{formData.email}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-400 font-bold uppercase">Objekt</span>
                            <span className="text-slate-900 font-black truncate max-w-[150px]">{formData.hasObject}</span>
                          </div>
                        </div>

                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            className="mt-1 w-5 h-5 rounded border-2 border-slate-200 text-blue-600 focus:ring-blue-500"
                            checked={formData.privacyAccepted}
                            onChange={(e) => setFormData({...formData, privacyAccepted: e.target.checked})}
                          />
                          <span className="text-xs text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                            Ich stimme der <Link to="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">Datenschutzerklärung</Link> zu*
                          </span>
                        </label>
                      </div>

                      <div className="pt-4 sm:pt-6 border-t border-slate-50 flex flex-col gap-3">
                        <button 
                          onClick={handleSubmit}
                          disabled={!formData.privacyAccepted || isSubmitting}
                          className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:shadow-none flex items-center justify-center gap-3"
                        >
                          {isSubmitting ? (
                            <>
                              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Wird gesendet...</span>
                            </>
                          ) : 'Abschicken'}
                        </button>
                        <button 
                          onClick={() => setModalView('timeframe')}
                          disabled={isSubmitting}
                          className="w-full text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-600 transition-colors disabled:opacity-20"
                        >
                          Daten korrigieren
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex-shrink-0 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                 <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.181-6.5 11.5a11.954 11.954 0 01-6.5-11.5c0-.68.056-1.35.166-2.001zm8.341 8.592a.75.75 0 00-1.014-1.074 3.25 3.25 0 01-4.493-4.493.75.75 0 00-1.074-1.014 4.75 4.75 0 006.581 6.581z" clipRule="evenodd" /></svg>
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">DSGVO Konform · SSL Verschlüsselt</span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </Router>
  );
};

export default App;
