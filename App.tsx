
import React, { useState, useEffect, useRef } from 'react';
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
import StickyMobileCTA from './components/StickyMobileCTA';

type ModalStep = 'step1' | 'result' | 'step2' | 'leadCapture';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalStep>('step1');
  const [hasStartedStep1, setHasStartedStep1] = useState(false);
  const [isStep2Active, setIsStep2Active] = useState(false);
  
  const [formData, setFormData] = useState({
    timeframe: '',
    region: '',
    income_band: '',
    equity_band: '',
    price_band: '',
    employment_type: '',
    equity_source: [] as string[],
    email: '',
    phone: ''
  });

  const track = (event: string, data?: any) => {
    console.log(`Tracking: ${event}`, data || '');
  };

  const openModal = () => {
    track('check_modal_open');
    setIsModalOpen(true);
    setModalView('step1');
    setIsStep2Active(false);
    setHasStartedStep1(false);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    track('check_modal_close');
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  const handleInteraction = () => {
    if (!hasStartedStep1) {
      track('check_step1_start');
      setHasStartedStep1(true);
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    track('check_step1_submit');
    setModalView('result');
    track('check_result_view', { step: 1, data: formData });
  };

  const startStep2 = () => {
    track('check_step2_start');
    setModalView('step2');
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    track('check_step2_submit');
    setIsStep2Active(true);
    setModalView('result');
    track('check_result_view', { step: 2, data: formData });
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
    // Basic logic for dynamic content based on input
    const isHighIncome = formData.income_band.includes('200') || formData.income_band.includes('300');
    const isHighEquity = formData.equity_band.includes('200') || formData.equity_band.includes('400');
    const isLowStats = formData.income_band.includes('unter') || formData.equity_band.includes('unter') || formData.equity_band.includes('unklar');

    let headline = "Erste Einordnung: Potenzial mit Hebeln";
    let insight = "Region und Timing beeinflussen die Realisierbarkeit stärker, als viele erwarten.";

    if (isHighIncome && isHighEquity) {
      headline = "Erste Einordnung: gute Ausgangslage";
      insight = "Der grösste Hebel liegt oft im Zusammenspiel von Eigenmitteln und Preisband.";
    } else if (isLowStats) {
      headline = "Erste Einordnung: aktuell eher schwierig – aber planbar";
      insight = "Wenn Eigenmittel noch im Aufbau sind, lohnt sich eine klare Etappierung.";
    }

    if (isStep2Active) {
      if (formData.employment_type === 'selbstständig') {
        insight = "Bei selbstständigem Einkommen lohnt sich eine frühe Strukturierung für Banken.";
      } else if (formData.equity_source.includes('Pensionskasse (2. Säule)')) {
        insight = "Wenn ein Teil der Eigenmittel aus Vorsorge kommt, ist die Planung der Bezüge zentral.";
      } else if (formData.price_band.includes('2.0') || formData.price_band.includes('1.5')) {
        insight = "Bei Ihrem Preisband wird die Eigenmittelstrategie meist zum entscheidenden Hebel.";
      }
    }

    return { headline, insight };
  };

  const { headline, insight } = getResultContent();

  const isStep1Valid = formData.timeframe && formData.region && formData.income_band && formData.equity_band;
  const isStep2Valid = (formData.price_band ? 1 : 0) + (formData.employment_type ? 1 : 0) + (formData.equity_source.length > 0 ? 1 : 0) >= 2;

  // Close on ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-white font-['Inter']">
      <Header onStartCheck={openModal} />
      
      <main className="flex-grow">
        <Hero onStartCheck={openModal} />
        <LogoSlider />
        <RealitySection onStartCheck={openModal} />
        <SolutionSection onStartCheck={openModal} />
        <SocialProofSection onStartCheck={openModal} />
        <ProcessSection />
        <PartnerSection onStartCheck={openModal} />
        <FAQSection />
        <ContactSection />
      </main>

      <Footer />
      <StickyMobileCTA onStartCheck={openModal} />

      {/* REALITÄTSCHECK MODAL (Variante A) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-fade-in">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={closeModal}
          ></div>
          
          {/* Modal Container */}
          <div className="relative w-full max-w-xl bg-white rounded-t-[24px] sm:rounded-[24px] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] sm:max-h-none">
            
            {/* Modal Header */}
            <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Realitätscheck (90 Sekunden)</h2>
                <p className="text-slate-500 text-xs mt-1">Erste Einordnung zu Budget, Finanzierung und Kaufzeitpunkt.</p>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Schliessen"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto no-scrollbar p-6 sm:p-8 space-y-8">
              
              {/* Progress & Erwartungssteuerung */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-grow">
                   <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#2663EB] transition-all duration-500" 
                        style={{ width: modalView === 'step1' ? '25%' : (modalView === 'step2' ? '75%' : '100%') }}
                      ></div>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                     {modalView === 'step1' ? 'Stufe 1 von 2 (Vertiefung optional)' : (modalView === 'step2' ? 'Stufe 2 von 2 (Vertiefung)' : 'Einordnung bereit')}
                   </p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] text-slate-400 font-medium">Dauer: ca. 90s · Keine Zusage</p>
                </div>
              </div>

              {/* STEP 1 */}
              {modalView === 'step1' && (
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  <p className="text-sm text-slate-600">Beantworten Sie 4 kurze Fragen – Sie erhalten sofort eine erste Einordnung.</p>
                  
                  <div className="grid grid-cols-1 gap-5">
                    {/* Q1: timeframe */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">1. Wann möchten Sie kaufen?</label>
                      <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={formData.timeframe}
                        onFocus={handleInteraction}
                        onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="innerhalb 6 Monate">innerhalb 6 Monate</option>
                        <option value="6–12 Monate">6–12 Monate</option>
                        <option value="1–3 Jahre">1–3 Jahre</option>
                        <option value="unklar / ich prüfe erst">unklar / ich prüfe erst</option>
                      </select>
                    </div>

                    {/* Q2: region (AKTUALISIERT) */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">2. Welche Region ist für Sie aktuell am relevantesten?</label>
                      <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={formData.region}
                        onFocus={handleInteraction}
                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="St. Gallen">St. Gallen</option>
                        <option value="Schaffhausen">Schaffhausen</option>
                        <option value="Appenzell Innerrhoden">Appenzell Innerrhoden</option>
                        <option value="Appenzell Ausserrhoden">Appenzell Ausserrhoden</option>
                        <option value="Graubünden">Graubünden</option>
                        <option value="Solothurn">Solothurn</option>
                        <option value="Thurgau">Thurgau</option>
                        <option value="Andere Region">Andere Region</option>
                        <option value="Noch offen / flexibel">Noch offen / flexibel</option>
                      </select>
                      <p className="text-[10px] text-slate-400">Die Region beeinflusst Finanzierung, Preisband and Möglichkeiten.</p>
                    </div>

                    {/* Q3: income_band */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">3. Haushalts-Bruttoeinkommen pro Jahr</label>
                      <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={formData.income_band}
                        onFocus={handleInteraction}
                        onChange={(e) => setFormData({...formData, income_band: e.target.value})}
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="unter CHF 100’000">unter CHF 100’000</option>
                        <option value="CHF 100’000 – 150’000">CHF 100’000 – 150’000</option>
                        <option value="CHF 150’000 – 200’000">CHF 150’000 – 200’000</option>
                        <option value="CHF 200’000 – 300’000">CHF 200’000 – 300’000</option>
                        <option value="über CHF 300’000">über CHF 300’000</option>
                        <option value="möchte ich nicht angeben">möchte ich nicht angeben</option>
                      </select>
                      <p className="text-[10px] text-slate-400">Damit wir die Tragbarkeit grob einordnen können.</p>
                    </div>

                    {/* Q4: equity_band */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">4. Eigenmittel, die heute verfügbar sind</label>
                      <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={formData.equity_band}
                        onFocus={handleInteraction}
                        onChange={(e) => setFormData({...formData, equity_band: e.target.value})}
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="unter CHF 50’000">unter CHF 50’000</option>
                        <option value="CHF 50’000 – 100’000">CHF 50’000 – 100’000</option>
                        <option value="CHF 100’000 – 200’000">CHF 100’000 – 200’000</option>
                        <option value="CHF 200’000 – 400’000">CHF 200’000 – 400’000</option>
                        <option value="über CHF 400’000">über CHF 400’000</option>
                        <option value="unklar / muss ich prüfen">unklar / muss ich prüfen</option>
                      </select>
                      <p className="text-[10px] text-slate-400">Eigenmittel bestimmen Ihren Handlungsspielraum.</p>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!isStep1Valid}
                    className="w-full bg-[#2663EB] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Einordnung anzeigen
                  </button>
                </form>
              )}

              {/* RESULT PANEL */}
              {modalView === 'result' && (
                <div className="animate-fade-in space-y-8">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16"></div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-2">{headline}</h3>
                    <p className="text-[#2663EB] font-bold text-sm leading-relaxed">{insight}</p>
                    
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <p className="text-slate-600 text-sm leading-relaxed">
                        Wenn Sie möchten, validieren wir diese Einordnung in einem kurzen Gespräch. Sie erhalten klare nächste Schritte – ohne Verpflichtung.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={() => {
                        track('check_result_cta_primary_click');
                        closeModal();
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full bg-[#2663EB] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all"
                    >
                      Kurz validieren lassen (15 Min)
                    </button>
                    
                    <div className="space-y-4">
                      {/* Option «Ergebnis per E-Mail sichern» wurde entfernt. Nur «Vertiefen» wird angezeigt, wenn Step 2 noch nicht aktiv ist. */}
                      {!isStep2Active && (
                        <button 
                          onClick={startStep2}
                          className="w-full border-2 border-[#F87101] text-[#F87101] py-4 rounded-xl font-bold text-lg hover:bg-orange-50 transition-all"
                        >
                          Vertiefen (60 Sekunden)
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setModalView('step1');
                      setIsStep2Active(false);
                    }}
                    className="w-full text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-600"
                  >
                    &larr; Antworten bearbeiten
                  </button>
                </div>
              )}

              {/* STEP 2 */}
              {modalView === 'step2' && (
                <form onSubmit={handleStep2Submit} className="animate-fade-in space-y-6">
                  <div className="grid grid-cols-1 gap-5">
                    {/* Q5: price_band */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">5. Zielpreisband (Kaufpreis)</label>
                      <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={formData.price_band}
                        onChange={(e) => setFormData({...formData, price_band: e.target.value})}
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="unter CHF 700’000">unter CHF 700’000</option>
                        <option value="CHF 700’000 – 1.0 Mio.">CHF 700’000 – 1.0 Mio.</option>
                        <option value="CHF 1.0 – 1.5 Mio.">CHF 1.0 – 1.5 Mio.</option>
                        <option value="CHF 1.5 – 2.0 Mio.">CHF 1.5 – 2.0 Mio.</option>
                        <option value="über CHF 2.0 Mio.">über CHF 2.0 Mio.</option>
                        <option value="noch offen">noch offen</option>
                      </select>
                    </div>

                    {/* Q6: employment_type */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">6. Beschäftigung / Einkommensform</label>
                      <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        value={formData.employment_type}
                        onChange={(e) => setFormData({...formData, employment_type: e.target.value})}
                      >
                        <option value="">Bitte wählen...</option>
                        <option value="angestellt">angestellt</option>
                        <option value="selbstständig">selbstständig</option>
                        <option value="gemischt">gemischt</option>
                        <option value="variabel (Bonus/Provision)">variabel (Bonus/Provision)</option>
                        <option value="lieber nicht angeben">lieber nicht angeben</option>
                      </select>
                    </div>

                    {/* Q7: equity_source (Multi-select style) */}
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">7. Eigenmittel-Quelle (Mehrfachauswahl)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Erspartes", "Säule 3a", "Pensionskasse (2. Säule)", 
                          "Familie/Schenkung", "noch im Aufbau", "unklar"
                        ].map((src) => (
                          <button
                            key={src}
                            type="button"
                            onClick={() => toggleEquitySource(src)}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 text-xs font-bold transition-all ${
                              formData.equity_source.includes(src) 
                              ? 'bg-blue-50 border-blue-500 text-blue-700' 
                              : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              formData.equity_source.includes(src) ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'
                            }`}>
                              {formData.equity_source.includes(src) && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                              )}
                            </div>
                            {src}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={!isStep2Valid}
                    className="w-full bg-[#2663EB] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
                  >
                    Ergebnis präzisieren
                  </button>
                  
                  <button 
                    type="button"
                    onClick={() => setModalView('result')}
                    className="w-full text-slate-400 text-[10px] font-bold uppercase tracking-widest hover:text-slate-600"
                  >
                    &larr; Zurück zum Ergebnis
                  </button>
                </form>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex-shrink-0">
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest text-center leading-relaxed">
                Hinweis: Dieser Realitätscheck ist eine erste Einordnung und ersetzt keine Bankprüfung. Ihre Angaben werden ausschliesslich zur Einordnung verwendet.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
