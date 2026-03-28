
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import LogoSlider from './components/LogoSlider';
import RealitySection from './components/RealitySection';
import SolutionSection from './components/SolutionSection';
import SocialProofSection from './components/SocialProofSection';
import ProcessSection from './components/ProcessSection';
import PartnerSection from './components/PartnerSection';
import FAQSection from './components/FAQSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

type ModalStep = 'step1' | 'result' | 'step2' | 'leadCapture';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalStep>('step1');
  const [isStep2Active, setIsStep2Active] = useState(false);
  
  const [formData, setFormData] = useState({
    timeframe: '',
    region: '',
    income_band: '',
    equity_band: '',
    price_band: '',
    employment_type: '',
    equity_source: [] as string[],
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    message: ''
  });

  const track = (event: string, data?: any) => {
    console.log(`Tracking: ${event}`, data || '');
  };

  const openModal = () => {
    track('check_modal_open');
    setFormData({
      timeframe: '',
      region: '',
      income_band: '',
      equity_band: '',
      price_band: '',
      employment_type: '',
      equity_source: [],
      firstname: '',
      lastname: '',
      email: '',
      phone: '',
      message: ''
    });
    setIsModalOpen(true);
    setModalView('step1');
    setIsStep2Active(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    track('check_modal_close');
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    track('check_step1_submit');
    setModalView('step2');
  };

  const toggleEquitySource = (val: string) => {
    const current = [...formData.equity_source];
    if (current.includes(val)) {
      setFormData({ ...formData, equity_source: current.filter(i => i !== val) });
    } else {
      setFormData({ ...formData, equity_source: [...current, val] });
    }
  };

  const getResultContent = () => {
    const isHighIncome = formData.income_band.includes('200') || formData.income_band.includes('300');
    const isHighEquity = formData.equity_band.includes('200') || formData.equity_band.includes('400');
    const isLowStats = formData.income_band.includes('unter') || formData.equity_band.includes('unter');

    let status: 'positive' | 'neutral' | 'challenging' = 'neutral';
    let headline = "Erste Einordnung: Potenzial vorhanden";
    let insight = "Ihre Angaben zeigen, dass eine Finanzierung mit der richtigen Strategie realistisch ist.";

    if (isHighIncome && isHighEquity) {
      status = 'positive';
      headline = "Optimale Ausgangslage";
      insight = "Ihre finanzielle Basis ist überdurchschnittlich. Wir können direkt in die Objektsuche und Zinsoptimierung gehen.";
    } else if (isLowStats) {
      status = 'challenging';
      headline = "Herausfordernd, aber machbar";
      insight = "Aktuell liegt der Fokus auf dem Aufbau von Eigenmitteln oder der Optimierung der Tragbarkeit.";
    }

    return { headline, insight, status };
  };

  const { headline, insight, status } = getResultContent();

  const isStep1Valid = formData.timeframe && formData.region && formData.income_band && formData.equity_band;

  // Icons Helper
  const IconCheck = () => (
    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="relative min-h-screen flex flex-col bg-white font-['Inter']">
      <Header onStartCheck={openModal} />
      
      <main className="flex-grow">
        <Hero onStartCheck={openModal} />
        <LogoSlider />
        <SocialProofSection onStartCheck={openModal} />
        <RealitySection onStartCheck={openModal} />
        <SolutionSection onStartCheck={openModal} />
        <ProcessSection />
        <PartnerSection onStartCheck={openModal} />
        <FAQSection />
        <ContactSection />
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
                  <h2 className="text-lg font-extrabold text-slate-900 leading-none">Realitätscheck</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Schweizer Marktstandard</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto no-scrollbar px-4 py-6 sm:px-10 sm:py-8 space-y-6 sm:space-y-8">
              
              {/* Progress Bar */}
              <div className="flex items-center gap-4">
                <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-700 ease-out" 
                    style={{ 
                      width: 
                        modalView === 'step1' ? '25%' : 
                        modalView === 'step2' ? '50%' : 
                        modalView === 'result' ? '75%' : '100%' 
                    }}
                  ></div>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase tabular-nums">
                  {modalView === 'step1' ? 'Schritt 1/4' : 
                   modalView === 'step2' ? 'Schritt 2/4' : 
                   modalView === 'result' ? 'Schritt 3/4' : 'Schritt 4/4'}
                </span>
              </div>

              {/* STEP 1: Interactive Cards instead of Selects */}
              {modalView === 'step1' && (
                <div className="space-y-8 sm:space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Erzählen Sie uns von Ihrem Vorhaben.</h3>
                    <p className="text-slate-500 text-xs sm:text-sm">4 kurze Angaben für Ihre erste ehrliche Einordnung.</p>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    {/* Q1: Timeframe */}
                    <div className="space-y-3 sm:space-y-4">
                      <label className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest">Wann möchten Sie einziehen?</label>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {['Sofort', '6–12 Monate', '1–3 Jahre', 'Unklar'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setFormData({...formData, timeframe: opt})}
                            className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${
                              formData.timeframe === opt 
                              ? 'border-blue-600 bg-blue-50/50 shadow-md ring-1 ring-blue-600' 
                              : 'border-slate-100 bg-white hover:border-slate-300'
                            }`}
                          >
                            <span className={`block text-xs sm:text-sm font-bold ${formData.timeframe === opt ? 'text-blue-700' : 'text-slate-700'}`}>{opt}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q2: Region Cards */}
                    <div className="space-y-3 sm:space-y-4">
                      <label className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest">In welcher Region suchen Sie?</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {['St. Gallen', 'Schaffhausen', 'Thurgau', 'Graubünden', 'Solothurn', 'Anderes'].map(reg => (
                          <button
                            key={reg}
                            onClick={() => setFormData({...formData, region: reg})}
                            className={`p-2.5 sm:p-3 rounded-lg sm:rounded-xl border-2 text-center transition-all ${
                              formData.region === reg 
                              ? 'border-blue-600 bg-blue-50/50' 
                              : 'border-slate-100 bg-white hover:border-slate-300'
                            }`}
                          >
                            <span className="text-[10px] sm:text-xs font-bold text-slate-700">{reg}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Q3 & Q4: Quick Selections for Income/Equity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-3 sm:space-y-4">
                        <label className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest">Jahreseinkommen (CHF)</label>
                        <select 
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none appearance-none"
                          value={formData.income_band}
                          onChange={(e) => setFormData({...formData, income_band: e.target.value})}
                        >
                          <option value="">Bitte wählen...</option>
                          <option value="unter CHF 100k">unter CHF 100’000</option>
                          <option value="100k–150k">CHF 100k – 150k</option>
                          <option value="150k–200k">CHF 150k – 200k</option>
                          <option value="über 200k">über CHF 200k</option>
                        </select>
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <label className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest">Eigenmittel (CHF)</label>
                        <select 
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none appearance-none"
                          value={formData.equity_band}
                          onChange={(e) => setFormData({...formData, equity_band: e.target.value})}
                        >
                          <option value="">Bitte wählen...</option>
                          <option value="unter CHF 50k">unter CHF 50’000</option>
                          <option value="50k–100k">CHF 50k – 100k</option>
                          <option value="100k–200k">CHF 100k – 200k</option>
                          <option value="über 200k">über CHF 200k</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-6 border-t border-slate-50">
                    <button 
                      onClick={handleStep1Submit}
                      disabled={!isStep1Valid}
                      className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-40 disabled:shadow-none"
                    >
                      Jetzt Einordnung anzeigen
                    </button>
                    <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">Privat & Sicher · Keine Bank-Auskunft</p>
                  </div>
                </div>
              )}

              {/* RESULT VIEW: Optimized with Status Indicator */}
              {modalView === 'result' && (
                <div className="animate-fade-in space-y-8 sm:space-y-10 py-2 sm:py-4">
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest">Analyse Abgeschlossen</div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">{headline}</h3>
                  </div>

                  {/* Status Box */}
                  <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border-2 relative overflow-hidden ${
                    status === 'positive' ? 'border-emerald-100 bg-emerald-50/30' : 
                    status === 'challenging' ? 'border-orange-100 bg-orange-50/30' : 'border-blue-100 bg-blue-50/30'
                  }`}>
                    <div className="flex items-start gap-4 sm:gap-6">
                       <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                         status === 'positive' ? 'bg-emerald-500 text-white' : 
                         status === 'challenging' ? 'bg-orange-500 text-white' : 'bg-blue-600 text-white'
                       }`}>
                         {status === 'positive' ? (
                           <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                         ) : status === 'challenging' ? (
                           <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                         ) : (
                           <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                         )}
                       </div>
                       <p className="text-slate-800 font-bold text-base sm:text-lg leading-snug">{insight}</p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-4">
                    <button 
                      onClick={() => setModalView('leadCapture')}
                      className="w-full bg-slate-900 text-white py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg shadow-xl hover:bg-black transition-all"
                    >
                      Kostenlose Kurzberatung (15 Min.)
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => setModalView('step2')}
                    className="w-full text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-600 transition-colors"
                  >
                    Daten korrigieren
                  </button>
                </div>
              )}

              {/* STEP 2: Vertiefung */}
              {modalView === 'step2' && (
                <div className="animate-fade-in space-y-8 sm:space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Die entscheidenden Details.</h3>
                    <p className="text-slate-500 text-xs sm:text-sm">Je präziser Ihre Angaben, desto wertvoller ist unser Feedback.</p>
                  </div>

                  <div className="space-y-6 sm:space-y-8">
                    <div className="space-y-3 sm:space-y-4">
                      <label className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest">Erwerbsform</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                        {['Angestellt', 'Selbstständig', 'Gemischt'].map(t => (
                          <button
                            key={t}
                            onClick={() => setFormData({...formData, employment_type: t})}
                            className={`p-3 sm:p-4 rounded-xl border-2 text-xs sm:text-sm font-bold transition-all ${
                              formData.employment_type === t ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <label className="text-[10px] sm:text-xs font-black text-slate-900 uppercase tracking-widest">Eigenmittel-Quellen</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                        {['Erspartes', '3a / Vorsorge', 'Pensionskasse', 'Schenkung/Erbvorbezug'].map(src => (
                          <button
                            key={src}
                            onClick={() => toggleEquitySource(src)}
                            className={`p-3 sm:p-4 rounded-xl border-2 flex items-center justify-between text-xs sm:text-sm font-bold transition-all ${
                              formData.equity_source.includes(src) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100'
                            }`}
                          >
                            {src}
                            {formData.equity_source.includes(src) && <div className="bg-blue-600 rounded-full p-0.5"><IconCheck /></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setModalView('result')}
                    className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg shadow-xl hover:bg-blue-700 transition-all"
                  >
                    Analyse anzeigen
                  </button>
                </div>
              )}

              {/* LEAD CAPTURE: Final Form */}
              {modalView === 'leadCapture' && (
                <div className="animate-fade-in space-y-8 sm:space-y-10">
                  <div className="space-y-2">
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">Fast geschafft!</h3>
                    <p className="text-slate-500 text-xs sm:text-sm">Wohin dürfen wir Ihre detaillierte Auswertung senden?</p>
                  </div>

                  <form 
                    className="space-y-5"
                    onSubmit={(e) => {
                      e.preventDefault();
                      track('lead_capture_submit', formData);
                      setModalView('step1'); // Reset or show success
                      closeModal();
                      alert('Vielen Dank! Wir haben Ihre Daten erhalten und melden uns in Kürze.');
                    }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Vorname</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Max"
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none"
                          value={formData.firstname}
                          onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Mustermann"
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none"
                          value={formData.lastname}
                          onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Telefon</label>
                        <input 
                          type="tel" 
                          required
                          placeholder="+41 79 123 45 67"
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">E-Mail</label>
                        <input 
                          type="email" 
                          required
                          placeholder="beispiel@mail.ch"
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Nachricht (Optional)</label>
                      <textarea 
                        placeholder="Haben Sie eine spezifische Frage?"
                        rows={3}
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                      />
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit"
                        className="w-full bg-blue-600 text-white py-4 sm:py-5 rounded-xl sm:rounded-[20px] font-black text-base sm:text-lg shadow-xl hover:bg-blue-700 transition-all"
                      >
                        Analyse jetzt kostenlos anfordern
                      </button>
                      <p className="text-center text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">Kostenlos & Unverbindlich</p>
                    </div>
                  </form>
                </div>
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
  );
};

export default App;
