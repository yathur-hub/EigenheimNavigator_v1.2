import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Briefcase, 
  Coins, 
  HelpCircle, 
  Info, 
  Lock, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  AlertCircle 
} from 'lucide-react';

interface BookingFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  variant?: 'modal' | 'inline';
}

// Robust scroll-to-element helper with configurable offsets and console debugging
const scrollToElement = (target: string | HTMLElement, customOffset?: number) => {
  const el = typeof target === 'string' ? document.getElementById(target) : target;
  if (!el) {
    if (typeof target === 'string') {
      console.warn("Scroll target not found:", target);
    }
    return;
  }
  
  // Calculate relative position to the document top
  const rect = el.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const absoluteTop = rect.top + scrollTop;
  
  // Dynamic offset calculation based on viewport width (sticky elements require more offset)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const defaultOffset = isMobile ? 85 : 110; 
  const appliedOffset = customOffset !== undefined ? customOffset : defaultOffset;
  const targetScrollY = Math.max(0, absoluteTop - appliedOffset);

  console.log(`[Scroll Debug] Scrolling to element:`, typeof target === 'string' ? target : el.id || el.tagName, {
    absoluteTop,
    appliedOffset,
    targetScrollY,
    currentScrollY: window.scrollY
  });

  // Perform smooth scroll
  try {
    window.scrollTo({
      top: targetScrollY,
      behavior: 'smooth'
    });
  } catch (error) {
    // Fallback for older browsers
    window.scrollTo(0, targetScrollY);
  }
};

const STEP_1_QUESTIONS = [
  {
    id: 'region' as const,
    label: 'In welcher Region suchst du ein Eigenheim?',
    required: true,
    placeholder: 'Bitte wähle deine Wunschregion aus',
    options: [
      { label: 'St. Gallen', value: 'St. Gallen' },
      { label: 'Thurgau', value: 'Thurgau' },
      { label: 'Appenzell', value: 'Appenzell' },
      { label: 'Graubünden', value: 'Graubünden' },
      { label: 'Zürich / angrenzende Region', value: 'Zürich / angrenzende Region' },
      { label: 'Andere Region', value: 'Andere Region' },
      { label: 'Noch offen', value: 'Noch offen' }
    ]
  },
  {
    id: 'purchaseTimeframe' as const,
    label: 'Wann möchtest du realistisch kaufen?',
    required: true,
    placeholder: 'Bitte wähle deinen Wunschzeitraum aus',
    options: [
      { label: 'Sobald das passende Objekt kommt', value: 'Sobald das passende Objekt kommt' },
      { label: 'In den nächsten 6 Monaten', value: 'In den nächsten 6 Monaten' },
      { label: 'In 6 bis 24 Monaten', value: 'In 6 bis 24 Monaten' },
      { label: 'In mehr als 2 Jahren', value: 'In mehr als 2 Jahren' },
      { label: 'Noch unklar', value: 'Noch unklar' }
    ]
  },
  {
    id: 'situation' as const,
    label: 'Wie ist deine aktuelle Situation?',
    required: false,
    placeholder: 'Bitte auswählen...',
    options: [
      { label: 'Einzelperson', value: 'Einzelperson' },
      { label: 'Paar', value: 'Paar' },
      { label: 'Familie', value: 'Familie' },
      { label: 'Wir planen Familiengründung', value: 'Wir planen Familiengründung' },
      { label: 'Andere Situation', value: 'Andere Situation' }
    ]
  },
  {
    id: 'employment' as const,
    label: 'Bist du aktuell berufstätig?',
    required: true,
    placeholder: 'Bitte wähle deine Erwerbssituation aus',
    options: [
      { label: 'Ja, Vollzeit', value: 'Ja, Vollzeit' },
      { label: 'Ja, Teilzeit', value: 'Ja, Teilzeit' },
      { label: 'Selbstständig', value: 'Selbstständig' },
      { label: 'In Ausbildung', value: 'In Ausbildung' },
      { label: 'Aktuell nicht', value: 'Aktuell nicht' }
    ]
  },
  {
    id: 'equity' as const,
    label: 'Hast du bereits Eigenkapital angespart?',
    required: true,
    placeholder: 'Bitte wähle deine finanzielle Ausgangslage aus',
    options: [
      { label: 'Ja, ungefähr 20 % oder mehr', value: 'Ja, ungefähr 20 % oder mehr' },
      { label: 'Ja, aber weniger als 20 %', value: 'Ja, aber weniger als 20 %' },
      { label: 'Ein Teil ist vorhanden', value: 'Ein Teil ist vorhanden' },
      { label: 'Noch wenig', value: 'Noch wenig' },
      { label: 'Ich weiss es nicht genau', value: 'Ich weiss es nicht genau' }
    ]
  },
  {
    id: 'hasObject' as const,
    label: 'Gibt es bereits ein konkretes Objekt?',
    required: false,
    placeholder: 'Bitte auswählen...',
    options: [
      { label: 'Ja', value: 'Ja' },
      { label: 'Nein, aber ich suche aktiv', value: 'Nein, aber ich suche aktiv' },
      { label: 'Nein, ich orientiere mich erst', value: 'Nein, ich orientiere mich erst' }
    ]
  },
  {
    id: 'uncertainty' as const,
    label: 'Was ist deine grösste Unsicherheit?',
    required: true,
    placeholder: 'Bitte wähle deine grösste Hürde aus',
    options: [
      { label: 'Eigenkapital', value: 'Eigenkapital' },
      { label: 'Tragbarkeit', value: 'Tragbarkeit' },
      { label: 'Hypothek / Finanzierung', value: 'Hypothek / Finanzierung' },
      { label: 'Kaufprozess', value: 'Kaufprozess' },
      { label: 'Timing', value: 'Timing' },
      { label: 'Objektbewertung', value: 'Objektbewertung' },
      { label: 'Ich weiss nicht, wo ich starten soll', value: 'Ich weiss nicht, wo ich starten soll' }
    ]
  }
];

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onClose, title, subtitle, variant = 'inline' }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showStep1Errors, setShowStep1Errors] = useState(false);
  
  // Mobile-first State Wizard
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  // Smooth scroll to top of form when moving between steps (accounts for sticky header)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (step === 2) {
      console.log("Scrolling to step 2 contact fields");
      // Wait slightly for the layout transition / animation to complete so positions are accurate
      setTimeout(() => {
        scrollToElement('step-2-container');
        
        // Gently focus the first input on Step 2 (Vorname) if it exists
        const container = document.getElementById('step-2-container');
        if (container) {
          const firstNameInput = container.querySelector('input[type="text"]') as HTMLInputElement;
          if (firstNameInput) {
            console.log("Focusing first name input");
            firstNameInput.focus({ preventScroll: true });
          }
        }
      }, 150);
    } else {
      console.log("Scrolling back to step 1");
      setTimeout(() => {
        if (containerRef.current) {
          scrollToElement(containerRef.current);
        }
      }, 150);
    }
  }, [step]);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    street: '',
    zip: '',
    city: '',
    birthdate: '',
    hasObject: '', // "Gibt es bereits ein konkretes Objekt?"
    purchaseTimeframe: '', // "Wann möchtest du realistisch kaufen?"
    privacyAccepted: false,
    
    // New Qualification fields
    region: '', // In welcher Region suchst du ein Eigenheim?
    situation: '', // Wie ist deine aktuelle Situation?
    employment: '', // Bist du aktuell berufstätig?
    equity: '', // Hast du bereits Eigenkapital angespart?
    uncertainty: '', // Was ist deine grösste Unsicherheit?
    message: '' // Nachricht optional
  });

  const isEmailValid = (val: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const isSwissPhoneValid = (val: string): boolean => {
    const cleaned = val.replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+41')) {
      return /^\+41[1-9]\d{8}$/.test(cleaned);
    }
    if (cleaned.startsWith('0041')) {
      return /^0041[1-9]\d{8}$/.test(cleaned);
    }
    if (cleaned.startsWith('0')) {
      return /^0[1-9]\d{8}$/.test(cleaned);
    }
    return false;
  };

  const isZipValid = (val: string): boolean => {
    return /^\d{4}$/.test(val);
  };

  const isBirthdateValid = (val: string): boolean => {
    if (!val) return false;
    const d = new Date(val);
    if (isNaN(d.getTime())) return false;
    const year = d.getFullYear();
    return year <= 2026 && year >= 1900;
  };

  const track = (event: string, data?: any) => {
    console.log(`Tracking: ${event}`, data || '');
    if (typeof window !== 'undefined') {
      // Dispatch standard DOM events for Google Tag Manager or other tracking systems to observe
      const customEvent = new CustomEvent(event, { detail: data });
      window.dispatchEvent(customEvent);
      
      // GA4 & GTM fallback checks
      const dataLayer = (window as any).dataLayer;
      if (dataLayer && Array.isArray(dataLayer)) {
        dataLayer.push({ event, ...data });
      }
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Track start on first modification
      if (Object.values(prev).filter(v => v !== '' && v !== false).length === 0) {
        track('form_started');
      }
      return updated;
    });

    track('wizard_question_answered', { questionId: field, value });

    // Mobile automatic scroll logic to walk smoothly through fields (only if not using mobile wizard view)
    if (!isMobileView && typeof window !== 'undefined' && window.innerWidth < 768 && value !== '') {
      // Blur current select so picker sheet dismisses cleanly before scrolling on iOS/Android
      if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      const fieldScrollMap: { [key: string]: string } = {
        region: 'field-purchaseTimeframe',
        purchaseTimeframe: 'field-situation',
        situation: 'field-employment',
        employment: 'field-equity',
        equity: 'field-hasObject',
        hasObject: 'field-uncertainty',
        uncertainty: 'field-submitBtn'
      };

      const nextFieldId = fieldScrollMap[field];
      if (nextFieldId) {
        console.log("Scrolling to next field:", nextFieldId);
        setTimeout(() => {
          scrollToElement(nextFieldId);
        }, 350); // Safe delay for mobile picker animations to close
      } else {
        console.warn("Scroll target not found:", field);
      }
    }
  };

  const handleMobileSelect = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      // Track start on first modification
      if (Object.values(prev).filter(v => v !== '' && v !== false).length === 0) {
        track('form_started');
      }
      return updated;
    });

    track('wizard_question_answered', { questionId: field, value });
    console.log("Answer saved for:", field, "->", value);

    // Auto-advance if not the last question in our list
    if (currentQuestionIndex < STEP_1_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => {
          const nextIdx = prev + 1;
          console.log("Scrolling to next field:", STEP_1_QUESTIONS[nextIdx].id);
          return nextIdx;
        });
      }, 280); // Quiet transitions for nice flow feeling
    } else {
      console.log("Reached last question: Was ist deine grösste Unsicherheit?");
      
      // Automatic Step-by-Step transition logic for mobile
      // We must check if other mandatory Step 1 fields are fully answered
      const updatedFormData = { ...formData, [field]: value };
      const requiredFields = ['region', 'purchaseTimeframe', 'employment', 'equity', 'uncertainty'];
      const firstInvalidOnNext = requiredFields.find(f => updatedFormData[f as keyof typeof updatedFormData] === '');

      if (firstInvalidOnNext) {
        // Bounce back to the topmost unanswered required question first
        setShowStep1Errors(true);
        const invalidIdx = STEP_1_QUESTIONS.findIndex(q => q.id === firstInvalidOnNext);
        if (invalidIdx !== -1) {
          setTimeout(() => {
            setCurrentQuestionIndex(invalidIdx);
          }, 320);
        }
      } else {
        // All required Qualifier Questions in Step 1 answered. Triggers automatic transition to Step 2
        setIsTransitioning(true);
        
        setTimeout(() => {
          // Trigger the step completion events
          track('form_step1_complete', {
            region: updatedFormData.region,
            purchaseTimeframe: updatedFormData.purchaseTimeframe,
            employment: updatedFormData.employment,
            equity: updatedFormData.equity,
            hasObject: updatedFormData.hasObject,
            situation: updatedFormData.situation,
            uncertainty: updatedFormData.uncertainty
          });
          track('form_step2_displayed');
          
          setStep(2);
          setIsTransitioning(false);

          // Force viewport alignment to the top of the booking form area
          setTimeout(() => {
            if (containerRef.current) {
              containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }, 450); // Quiet premium transition delay (300ms to 500ms range)
      }
    }
  };

  const isStep1Valid = (): boolean => {
    return (
      formData.region !== '' &&
      formData.purchaseTimeframe !== '' &&
      formData.employment !== '' &&
      formData.equity !== '' &&
      formData.uncertainty !== ''
    );
  };

  const isStep2Valid = (): boolean => {
    return (
      formData.firstname.trim() !== '' &&
      formData.lastname.trim() !== '' &&
      isEmailValid(formData.email) &&
      isSwissPhoneValid(formData.phone) &&
      formData.street.trim() !== '' &&
      isZipValid(formData.zip) &&
      formData.city.trim() !== '' &&
      isBirthdateValid(formData.birthdate) &&
      formData.privacyAccepted
    );
  };

  const handleNextStep = () => {
    if (isStep1Valid()) {
      track('form_step1_complete', {
        region: formData.region,
        purchaseTimeframe: formData.purchaseTimeframe,
        employment: formData.employment,
        equity: formData.equity,
        hasObject: formData.hasObject,
        situation: formData.situation,
        uncertainty: formData.uncertainty
      });
      track('form_step2_displayed');
      setStep(2);
    } else {
      setShowStep1Errors(true);
      const requiredFields = ['region', 'purchaseTimeframe', 'employment', 'equity', 'uncertainty'];
      const firstInvalid = requiredFields.find(f => formData[f as keyof typeof formData] === '');
      
      if (firstInvalid) {
        console.log("Validation failed, scrolling to:", firstInvalid);
        if (isMobileView) {
          // Progress Mobile Wizard to the first incomplete required question
          const invalidIdx = STEP_1_QUESTIONS.findIndex(q => q.id === firstInvalid);
          if (invalidIdx !== -1) {
            setCurrentQuestionIndex(invalidIdx);
          }
        } else {
          // Desktop scrolling target
          setTimeout(() => {
            const elId = `field-${firstInvalid}`;
            scrollToElement(elId);
            const el = document.getElementById(elId);
            if (el) {
              const selectEl = el.querySelector('select');
              if (selectEl) {
                selectEl.focus({ preventScroll: true });
              }
            }
          }, 150);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isStep2Valid()) return;

    setIsSubmitting(true);
    track('form_submit_start', formData);
    
    // Prepare standardized payload for the backend API proxy (matches standard layout expectations)
    const webhookData = {
      "Geschlecht": "",
      "Gender": "",
      "name": `${formData.firstname} ${formData.lastname}`.trim(),
      "vorname": formData.firstname,
      "nachname": formData.lastname,
      "geburtsdatum": formData.birthdate,
      "plz": formData.zip,
      "ort": formData.city,
      "email": formData.email,
      "telefon": formData.phone,
      "habt_ihr_bereits_objekt": formData.hasObject,
      "welche_region_eigenheim": formData.region,
      "was_erwartet_eigenheim_navigator": formData.purchaseTimeframe,
      "documents": []
    };

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ formData, webhookData })
      });
      
      if (response.ok) {
        setIsSuccess(true);
        track('form_submit_success', { formData });
        if (onSuccess) onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Submission failed');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      alert(error?.message || 'Es gab ein Problem beim Absenden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center py-12 text-center space-y-6">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-100">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-3 px-4">
          <h3 className="text-2xl font-black text-slate-900 leading-tight">Danke für deine Anfrage.</h3>
          <p className="text-slate-600 font-medium max-w-md mx-auto text-sm sm:text-base">
            Wir prüfen deine Angaben und melden uns mit dem passenden nächsten Schritt für deinen Eigenheim-Realitätscheck.
          </p>
        </div>
        {variant === 'modal' && onClose && (
          <button 
            onClick={onClose} 
            className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-slate-800 transition-all cursor-pointer"
          >
            Schliessen
          </button>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`flex flex-col ${variant === 'inline' ? 'w-full' : ''}`}>
      {/* Title block */}
      {title && (
        <div className="mb-6">
          <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{title}</h3>
          {subtitle && <p className="text-slate-500 text-sm font-medium">{subtitle}</p>}
        </div>
      )}

      {/* Progress Indicator */}
      <div className="mb-8 bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1.5 overflow-hidden">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${step === 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-emerald-500 text-white border-emerald-500'}`}>
              {step === 1 ? '1' : <Check size={10} strokeWidth={4} />}
            </span>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${step === 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-200 text-slate-500 border-white'}`}>
              2
            </span>
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 leading-none">
              {step === 1 ? 'Schritt 1: Deine Ausgangslage' : 'Schritt 2: Deine Kontaktdaten'}
            </p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {step === 1 ? 'Qualifizierungsfragen' : 'Abschluss & Kontakt'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
          {step === 1 ? '50% geschafft' : 'Fast bereit'}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* STEP 1: QUALIFIER OUTCOME */}
        {step === 1 && (
          isMobileView ? (
            /* MOBILE PROGRESSIVE STEP-BY-STEP WIZARD */
            <div className="animate-fade-in space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-black uppercase tracking-wider text-[#F87101]">
                  1. Deine Ausgangslage
                </h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Bitte beantworte diese Fragen ehrlich, um uns eine Einschätzung zu ermöglichen.
                </p>
              </div>

              {isTransitioning ? (
                <div role="status" className="animate-fade-in flex flex-col items-center justify-center py-20 px-4 bg-slate-50/50 border border-slate-100/60 rounded-2xl text-center space-y-5 h-[280px]">
                  <div className="relative flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                    <Check size={16} className="text-blue-600 absolute animate-pulse" strokeWidth={3} />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <p className="text-sm font-black text-slate-900 leading-snug">
                      Danke. Jetzt fehlen nur noch deine Kontaktdaten.
                    </p>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest animate-pulse">
                      Automatischer Übergang...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Progress Indicator */}
                  <div className="space-y-1 bg-slate-50 border border-slate-100 p-3 rounded-xl">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      <span>Frage {currentQuestionIndex + 1} von {STEP_1_QUESTIONS.length}</span>
                      <span className="text-blue-600 font-black">
                        {Math.round(((currentQuestionIndex + 1) / STEP_1_QUESTIONS.length) * 100)}% geschafft
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 rounded-full transition-all duration-350 ease-out"
                        style={{ width: `${((currentQuestionIndex + 1) / STEP_1_QUESTIONS.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Active Wizard Question Block */}
                  {(() => {
                    const q = STEP_1_QUESTIONS[currentQuestionIndex];
                    const valueOfField = formData[q.id];
                    return (
                      <div className="space-y-4 animate-fade-in py-1" key={q.id}>
                        <label className="text-sm font-black text-slate-900 leading-snug block">
                          <span>{q.label}</span>
                          {q.required ? (
                            <span className="text-rose-500 font-bold ml-1">*</span>
                          ) : (
                            <span className="text-[9px] font-extrabold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase ml-1.5 normal-case tracking-normal">optional</span>
                          )}
                        </label>

                        <div className="space-y-2.5">
                          {q.options.map((opt) => {
                            const isSelected = valueOfField === opt.value;
                            return (
                              <button
                                type="button"
                                key={opt.value}
                                onClick={() => handleMobileSelect(q.id, opt.value)}
                                className={`w-full p-4 rounded-xl text-left transition-all border-2 flex items-center justify-between group active:scale-[0.98] cursor-pointer min-h-[52px] ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-50/20 text-blue-900 shadow-md shadow-blue-50 font-extrabold'
                                    : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-slate-100/50 font-bold'
                                }`}
                              >
                                <span className="text-xs leading-relaxed pr-2">{opt.label}</span>
                                <span className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all flex-shrink-0 ${
                                  isSelected
                                    ? 'border-blue-600 bg-blue-600 text-white'
                                    : 'border-slate-300 bg-white group-hover:border-slate-400'
                                }`}>
                                  {isSelected && <Check size={11} strokeWidth={4} />}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {showStep1Errors && !valueOfField && q.required && (
                          <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-2.5 flex items-center gap-1.5 animate-fade-in">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span>Bitte beantworte diese Frage, damit wir deine Ausgangslage einschätzen können.</span>
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  {/* Wizard Multi-Step Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3 mt-6">
                    {currentQuestionIndex > 0 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        className="flex items-center gap-1.5 px-4 py-3 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white font-bold text-xs rounded-xl active:scale-95 transition-all cursor-pointer"
                      >
                        <ArrowLeft size={14} />
                        <span>Zurück</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {currentQuestionIndex < STEP_1_QUESTIONS.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          const activeQ = STEP_1_QUESTIONS[currentQuestionIndex];
                          if (activeQ.required && !formData[activeQ.id]) {
                            setShowStep1Errors(true);
                            console.warn("Validation failed, question required:", activeQ.id);
                            return;
                          }
                          setShowStep1Errors(false);
                          setCurrentQuestionIndex(prev => prev + 1);
                        }}
                        className={`flex items-center gap-1.5 px-5 py-3 font-black text-xs rounded-xl active:scale-95 transition-all cursor-pointer ${
                          !formData[STEP_1_QUESTIONS[currentQuestionIndex].id] && !STEP_1_QUESTIONS[currentQuestionIndex].required
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        <span>
                          {!formData[STEP_1_QUESTIONS[currentQuestionIndex].id] && !STEP_1_QUESTIONS[currentQuestionIndex].required 
                            ? 'Überspringen' 
                            : 'Weiter'}
                        </span>
                        <ArrowRight size={14} />
                      </button>
                    ) : (
                      /* Since transition is automatic when they choose the option, we only show "Weiter" here if they navigated back manually and want to proceed without changing their choice */
                      formData.uncertainty && isStep1Valid() ? (
                        <button
                          type="button"
                          onClick={handleNextStep}
                          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl active:scale-95 transition-all flex-1 cursor-pointer animate-fade-in"
                        >
                          <span>Weiter zu den Kontaktdaten</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : null
                    )}
                  </div>
                </>
              )}
            </div>
          ) : (
            /* DESKTOP COMPACT ALL-IN-ONE VIEW */
            <div className="animate-fade-in space-y-6">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="text-sm font-black uppercase tracking-wider text-[#F87101]">
                  1. Deine Ausgangslage
                </h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Bitte beantworte diese Fragen ehrlich, um uns eine realistische Einschätzung zu ermöglichen.
                </p>
              </div>

              {/* Field 1: Region */}
              <div id="field-region" className="space-y-2">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                  In welcher Region suchst du ein Eigenheim? <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.region}
                  onChange={(e) => handleFieldChange('region', e.target.value)}
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3.5 text-sm font-bold focus:border-blue-650 outline-none transition-all ${
                    showStep1Errors && formData.region === ''
                      ? 'border-rose-400 focus:border-rose-500 text-rose-900 bg-rose-50/10'
                      : 'border-slate-100 text-slate-800'
                  }`}
                >
                  <option value="" disabled>Bitte auswählen...</option>
                  <option value="St. Gallen">St. Gallen</option>
                  <option value="Thurgau">Thurgau</option>
                  <option value="Appenzell">Appenzell</option>
                  <option value="Graubünden">Graubünden</option>
                  <option value="Zürich / angrenzende Region">Zürich / angrenzende Region</option>
                  <option value="Andere Region">Andere Region</option>
                  <option value="Noch offen">Noch offen</option>
                </select>
                {showStep1Errors && formData.region === '' && (
                  <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1.5 flex items-center gap-1.5 animate-fade-in animate-duration-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Bitte wähle deine Wunschregion aus</span>
                  </p>
                )}
              </div>

              {/* Field 2: Timeframe */}
              <div id="field-purchaseTimeframe" className="space-y-2">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                  Wann möchtest du realistisch kaufen? <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.purchaseTimeframe}
                  onChange={(e) => handleFieldChange('purchaseTimeframe', e.target.value)}
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3.5 text-sm font-bold focus:border-blue-650 outline-none transition-all ${
                    showStep1Errors && formData.purchaseTimeframe === ''
                      ? 'border-rose-400 focus:border-rose-500 text-rose-900 bg-rose-50/10'
                      : 'border-slate-100 text-slate-800'
                  }`}
                >
                  <option value="" disabled>Bitte auswählen...</option>
                  <option value="Sobald das passende Objekt kommt">Sobald das passende Objekt kommt</option>
                  <option value="In den nächsten 6 Monaten">In den nächsten 6 Monaten</option>
                  <option value="In 6 bis 24 Monaten">In 6 bis 24 Monaten</option>
                  <option value="In mehr als 2 Jahren">In mehr als 2 Jahren</option>
                  <option value="Noch unklar">Noch unklar</option>
                </select>
                {showStep1Errors && formData.purchaseTimeframe === '' && (
                  <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1.5 flex items-center gap-1.5 animate-fade-in animate-duration-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Bitte wähle deinen Wunschzeitraum aus</span>
                  </p>
                )}
              </div>

              {/* Field 3: Situation (Optional) */}
              <div id="field-situation" className="space-y-2">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                  Wie ist deine aktuelle Situation? <span className="text-slate-450 font-normal italic">(optional)</span>
                </label>
                <select
                  value={formData.situation}
                  onChange={(e) => handleFieldChange('situation', e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-bold focus:border-blue-650 outline-none text-slate-800"
                >
                  <option value="">Bitte auswählen...</option>
                  <option value="Einzelperson">Einzelperson</option>
                  <option value="Paar">Paar</option>
                  <option value="Familie">Familie</option>
                  <option value="Wir planen Familiengründung">Wir planen Familiengründung</option>
                  <option value="Andere Situation">Andere Situation</option>
                </select>
              </div>

              {/* Field 4: Employment status */}
              <div id="field-employment" className="space-y-2">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                  Bist du aktuell berufstätig? <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.employment}
                  onChange={(e) => handleFieldChange('employment', e.target.value)}
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3.5 text-sm font-bold focus:border-blue-650 outline-none transition-all ${
                    showStep1Errors && formData.employment === ''
                      ? 'border-rose-400 focus:border-rose-500 text-rose-900 bg-rose-50/10'
                      : 'border-slate-100 text-slate-800'
                  }`}
                >
                  <option value="" disabled>Bitte auswählen...</option>
                  <option value="Ja, Vollzeit">Ja, Vollzeit</option>
                  <option value="Ja, Teilzeit">Ja, Teilzeit</option>
                  <option value="Selbstständig">Selbstständig</option>
                  <option value="In Ausbildung">In Ausbildung</option>
                  <option value="Aktuell nicht">Aktuell nicht</option>
                </select>
                {showStep1Errors && formData.employment === '' && (
                  <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1.5 flex items-center gap-1.5 animate-fade-in animate-duration-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Bitte wähle deine Erwerbssituation aus</span>
                  </p>
                )}
              </div>

              {/* Field 5: Equity */}
              <div id="field-equity" className="space-y-2">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                  Hast du bereits Eigenkapital angespart? <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.equity}
                  onChange={(e) => handleFieldChange('equity', e.target.value)}
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3.5 text-sm font-bold focus:border-blue-650 outline-none transition-all ${
                    showStep1Errors && formData.equity === ''
                      ? 'border-rose-450 focus:border-rose-500 text-rose-900 bg-rose-50/10'
                      : 'border-slate-100 text-slate-800'
                  }`}
                >
                  <option value="" disabled>Bitte auswählen...</option>
                  <option value="Ja, ungefähr 20 % oder mehr">Ja, ungefähr 20 % oder mehr</option>
                  <option value="Ja, aber weniger als 20 %">Ja, aber weniger als 20 %</option>
                  <option value="Ein Teil ist vorhanden">Ein Teil ist vorhanden</option>
                  <option value="Noch wenig">Noch wenig</option>
                  <option value="Ich weiss es nicht genau">Ich weiss es nicht genau</option>
                </select>
                {showStep1Errors && formData.equity === '' && (
                  <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1.5 flex items-center gap-1.5 animate-fade-in animate-duration-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Bitte wähle deine finanzielle Ausgangslage aus</span>
                  </p>
                )}
              </div>

              {/* Field 6: Has Object (Optional) */}
              <div id="field-hasObject" className="space-y-2">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                  Gibt es bereits ein konkretes Objekt? <span className="text-slate-450 font-normal italic">(optional)</span>
                </label>
                <select
                  value={formData.hasObject}
                  onChange={(e) => handleFieldChange('hasObject', e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3.5 text-sm font-bold focus:border-blue-650 outline-none text-slate-800"
                >
                  <option value="">Bitte auswählen...</option>
                  <option value="Ja">Ja</option>
                  <option value="Nein, aber ich suche aktiv">Nein, aber ich suche aktiv</option>
                  <option value="Nein, ich orientiere mich erst">Nein, ich orientiere mich erst</option>
                </select>
              </div>

              {/* Field 7: Greatest Uncertainty */}
              <div id="field-uncertainty" className="space-y-2">
                <label className="text-[11px] font-black text-slate-900 uppercase tracking-wider block">
                  Was ist deine grösste Unsicherheit? <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.uncertainty}
                  onChange={(e) => handleFieldChange('uncertainty', e.target.value)}
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3.5 text-sm font-bold focus:border-blue-650 outline-none transition-all ${
                    showStep1Errors && formData.uncertainty === ''
                      ? 'border-rose-400 focus:border-rose-500 text-rose-900 bg-rose-50/10'
                      : 'border-slate-100 text-slate-800'
                  }`}
                >
                  <option value="" disabled>Bitte auswählen...</option>
                  <option value="Eigenkapital">Eigenkapital</option>
                  <option value="Tragbarkeit">Tragbarkeit</option>
                  <option value="Hypothek / Finanzierung">Hypothek / Finanzierung</option>
                  <option value="Kaufprozess">Kaufprozess</option>
                  <option value="Timing">Timing</option>
                  <option value="Objektbewertung">Objektbewertung</option>
                  <option value="Ich weiss nicht, wo ich starten soll">Ich weiss nicht, wo ich starten soll</option>
                </select>
                {showStep1Errors && formData.uncertainty === '' && (
                  <p className="text-rose-500 text-[10px] font-black uppercase tracking-wider mt-1.5 flex items-center gap-1.5 animate-fade-in animate-duration-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    <span>Bitte wähle deine grösste Hürde aus</span>
                  </p>
                )}
              </div>

              <div id="field-submitBtn" className="pt-4">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Weiter zu den Kontaktdaten</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )
        )}

        {/* STEP 2: PERSONAL CONTACTS */}
        {step === 2 && (
          <div id="step-2-container" className="animate-fade-in space-y-6">
            <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black uppercase tracking-wider text-[#F87101] flex flex-wrap items-center gap-2">
                  <span>2. Deine Kontaktdaten</span>
                  <span className="text-[10px] font-black bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-md normal-case tracking-normal">Schritt 2 von 2</span>
                </h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Wer soll die Einschätzung erhalten?
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 bg-slate-100 hover:bg-slate-200/60 px-2.5 py-1 rounded-lg transition-all"
              >
                <ArrowLeft size={12} />
                <span>Ausgangslage ändern</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Vorname */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Vorname *</label>
                <input 
                  required
                  type="text" 
                  placeholder="Max"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-blue-600 outline-none"
                  value={formData.firstname}
                  onChange={(e) => handleFieldChange('firstname', e.target.value)}
                />
              </div>

              {/* Nachname */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Nachname *</label>
                <input 
                  required
                  type="text" 
                  placeholder="Muster"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-blue-600 outline-none"
                  value={formData.lastname}
                  onChange={(e) => handleFieldChange('lastname', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">E-Mail-Adresse *</label>
                <input 
                  required
                  type="email" 
                  placeholder="max@beispiel.ch"
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-600 ${
                    formData.email && !isEmailValid(formData.email)
                      ? 'border-rose-450 focus:border-rose-500'
                      : 'border-slate-100'
                  }`}
                  value={formData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
                {formData.email && !isEmailValid(formData.email) && (
                  <p className="text-rose-600 text-[10px] font-black">Bitte gültige E-Mail-Adresse eingeben.</p>
                )}
              </div>

              {/* Telefon */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Telefonnummer *</label>
                <input 
                  required
                  type="tel" 
                  placeholder="079 123 45 67"
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-600 ${
                    formData.phone && !isSwissPhoneValid(formData.phone)
                      ? 'border-rose-450 focus:border-rose-500'
                      : 'border-slate-100'
                  }`}
                  value={formData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                />
                {formData.phone && !isSwissPhoneValid(formData.phone) && (
                  <p className="text-rose-600 text-[10px] font-black">Gültige Schweizer Nummer verlangt.</p>
                )}
              </div>
            </div>

            {/* Birthdate - Mandatory (Strict backend integrity validation) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">
                Geburtsdatum * <span className="text-slate-400 font-normal italic">(für Alters- & Tragbarkeits-Indikation)</span>
              </label>
              <input 
                required
                type="date" 
                className={`w-full bg-slate-50 border-2 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-600 ${
                  formData.birthdate && !isBirthdateValid(formData.birthdate)
                    ? 'border-rose-450 focus:border-rose-500'
                    : 'border-slate-100'
                }`}
                value={formData.birthdate}
                onChange={(e) => handleFieldChange('birthdate', e.target.value)}
              />
              {formData.birthdate && !isBirthdateValid(formData.birthdate) && (
                <p className="text-rose-650 text-[10px] font-black">Jahr muss zwischen 1900 und 2026 liegen.</p>
              )}
            </div>

            {/* Street - Mandatory (Strict backend validation) */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">Strasse und Hausnummer *</label>
              <input 
                required
                type="text" 
                placeholder="Bahnhofstrasse 1"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-blue-600 outline-none"
                value={formData.street}
                onChange={(e) => handleFieldChange('street', e.target.value)}
              />
            </div>

            {/* PLZ & Ort - Mandatory (Strict backend validation) */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">PLZ *</label>
                <input 
                  required
                  type="text" 
                  placeholder="9000"
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3 text-sm font-bold outline-none focus:border-blue-600 ${
                    formData.zip && !isZipValid(formData.zip)
                      ? 'border-rose-450 focus:border-rose-500'
                      : 'border-slate-100'
                  }`}
                  value={formData.zip}
                  onChange={(e) => handleFieldChange('zip', e.target.value)}
                />
                {formData.zip && !isZipValid(formData.zip) && (
                  <p className="text-rose-600 text-[9px] font-black">4 Ziffern.</p>
                )}
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Ort *</label>
                <input 
                  required
                  type="text" 
                  placeholder="St. Gallen"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-blue-600 outline-none"
                  value={formData.city}
                  onChange={(e) => handleFieldChange('city', e.target.value)}
                />
              </div>
            </div>

            {/* Optional message / comment */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest block">Ergänzende Nachricht <span className="text-slate-400 font-normal italic">(optional)</span></label>
              <textarea 
                placeholder="Falls es noch etwas Spezielles zu erwähnen gibt..."
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-sm font-bold focus:border-blue-600 outline-none min-h-[70px] max-h-[140px]"
                value={formData.message}
                onChange={(e) => handleFieldChange('message', e.target.value)}
              />
            </div>

            {/* Privacy Checkbox */}
            <label className="flex items-start gap-3 cursor-pointer group pt-2 select-none">
              <input 
                required
                type="checkbox" 
                className="mt-1 w-5 h-5 rounded border-2 border-slate-200 text-blue-600 focus:ring-blue-500"
                checked={formData.privacyAccepted}
                onChange={(e) => handleFieldChange('privacyAccepted', e.target.checked)}
              />
              <span className="text-xs text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                Ich stimme der <Link to="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">Datenschutzerklärung</Link> zu *
              </span>
            </label>

            {/* Microcopy directly above submit */}
            <div className="bg-blue-50/40 border border-blue-50 text-slate-600 p-4 rounded-xl text-xs font-semibold leading-relaxed flex gap-2.5 items-start mt-4">
              <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                Der Realitätscheck ist kostenlos und unverbindlich. Du erhältst eine ehrliche Einschätzung deiner Ausgangslage, keine Verkaufspräsentation.
              </span>
            </div>

            {/* Submit Actions */}
            <div className="pt-2 flex flex-col gap-3">
              <button 
                type="submit"
                disabled={!isStep2Valid() || isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-base py-4 px-6 rounded-2xl shadow-xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Einschätzung wird gesendet...</span>
                  </>
                ) : (
                  <>
                    <span>Realitätscheck anfragen</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
      </form>
    </div>
  );
};

export default BookingForm;
