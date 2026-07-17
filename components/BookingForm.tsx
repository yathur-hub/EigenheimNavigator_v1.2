import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  ChevronLeft,
  Check, 
  Info, 
  AlertCircle, 
  Briefcase, 
  Coins, 
  MapPin, 
  Calendar, 
  User, 
  Clock, 
  Lock, 
  Sparkles,
  PhoneCall,
  CheckCircle2,
  FileCheck2,
  Building,
  UserCheck,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const MOBILE_AUTO_ADVANCE_DEBOUNCE_MS = 900;

interface BookingFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  variant?: 'modal' | 'inline';
  onProgressUpdate?: (percent: number, remaining: number) => void;
}

interface FormState {
  step_1_property_goal: {
    property_goal: string;
    property_type: string[];
    buying_timeline: string;
  };
  step_2_financial_situation: {
    employment_status: string;
    own_funds_range: string;
    financing_status: string;
    household_income_range: string;
  };
  step_3_region_profile: {
    canton: string;
    zip_code: string;
    preferred_region: string[];
    age_range: string;
    current_situation: string;
  };
  step_4_contact: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    consultation_interest: string;
    contact_preference: string;
    preferred_contact_time: string;
    message: string;
    privacy_consent: boolean;
    marketing_consent: boolean;
  };
}

const initialFormState: FormState = {
  step_1_property_goal: {
    property_goal: '',
    property_type: [],
    buying_timeline: ''
  },
  step_2_financial_situation: {
    employment_status: '',
    own_funds_range: '',
    financing_status: '',
    household_income_range: ''
  },
  step_3_region_profile: {
    canton: '',
    zip_code: '',
    preferred_region: [],
    age_range: '',
    current_situation: ''
  },
  step_4_contact: {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    consultation_interest: '',
    contact_preference: 'phone',
    preferred_contact_time: '',
    message: '',
    privacy_consent: false,
    marketing_consent: false
  }
};

const PROPERTY_GOAL_OPTIONS = [
  { value: 'buy_home', label: 'Ich möchte ein Eigenheim kaufen', score: 25 },
  { value: 'build_home', label: 'Ich möchte ein Eigenheim bauen', score: 25 },
  { value: 'check_feasibility', label: 'Ich möchte prüfen, ob ein Eigenheim für mich realistisch ist', score: 20 },
  { value: 'general_information', label: 'Ich informiere mich erst allgemein', score: 5 },
  { value: 'no_current_goal', label: 'Ich habe aktuell keinen konkreten Eigenheimwunsch', score: -30 }
];

const PROPERTY_TYPE_OPTIONS = [
  { value: 'single_family_house', label: 'Einfamilienhaus' },
  { value: 'semi_detached_house', label: 'Doppeleinfamilienhaus' },
  { value: 'terraced_house', label: 'Reihenhaus' },
  { value: 'condominium', label: 'Eigentumswohnung' },
  { value: 'building_land', label: 'Bauland' },
  { value: 'undecided', label: 'Noch offen' }
];

const BUYING_TIMELINE_OPTIONS = [
  { value: 'as_soon_as_possible', label: 'So bald wie möglich', score: 30 },
  { value: 'within_3_months', label: 'In den nächsten 3 Monaten', score: 30 },
  { value: '3_6_months', label: 'In 3–6 Monaten', score: 25 },
  { value: '6_12_months', label: 'In 6–12 Monaten', score: 20 },
  { value: '1_2_years', label: 'In 1–2 Jahren', score: 10 },
  { value: 'unknown', label: 'Noch offen', score: 0 }
];

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: 'employed_full_time', label: 'Angestellt, Vollzeit', score: 25 },
  { value: 'employed_part_time', label: 'Angestellt, Teilzeit', score: 15 },
  { value: 'self_employed', label: 'Selbstständig', score: 15 },
  { value: 'student', label: 'In Ausbildung / Studium', score: -15 },
  { value: 'not_employed', label: 'Aktuell nicht erwerbstätig', score: -30 },
  { value: 'retired', label: 'Pensioniert', score: -15 }
];

const OWN_FUNDS_OPTIONS = [
  { value: 'under_25000', label: 'Unter CHF 25’000', score: -20 },
  { value: '25000_49999', label: 'CHF 25’000–49’999', score: 0 },
  { value: '50000_99999', label: 'CHF 50’000–99’999', score: 15 },
  { value: '100000_199999', label: 'CHF 100’000–199’999', score: 25 },
  { value: '200000_plus', label: 'CHF 200’000+', score: 30 },
  { value: 'unknown', label: 'Ich weiss es noch nicht genau', score: 5 }
];

const FINANCING_STATUS_OPTIONS = [
  { value: 'financing_checked', label: 'Ja, Finanzierung ist bereits geprüft', score: 20 },
  { value: 'partly_checked', label: 'Teilweise, aber ich bin unsicher', score: 25 },
  { value: 'not_checked', label: 'Nein, ich brauche eine Einschätzung', score: 25 },
  { value: 'no_starting_point', label: 'Ich weiss nicht, wo ich anfangen soll', score: 20 }
];

const HOUSEHOLD_INCOME_OPTIONS = [
  { value: 'under_6000', label: 'Unter CHF 6’000', score: -10 },
  { value: '6000_8999', label: 'CHF 6’000–8’999', score: 10 },
  { value: '9000_11999', label: 'CHF 9’050–11’999', score: 20 },
  { value: '12000_15999', label: 'CHF 12’000–15’999', score: 25 },
  { value: '16000_plus', label: 'CHF 16’000+', score: 25 },
  { value: 'prefer_not_to_say', label: 'Möchte ich nicht angeben', score: 0 }
];

const CANTON_OPTIONS = [
  { value: 'SG', label: 'St. Gallen', score: 25 },
  { value: 'TG', label: 'Thurgau', score: 25 },
  { value: 'AR', label: 'Appenzell Ausserrhoden', score: 25 },
  { value: 'AI', label: 'Appenzell Innerrhoden', score: 25 },
  { value: 'GR', label: 'Graubünden', score: 15 },
  { value: 'SH', label: 'Schaffhausen', score: 10 },
  { value: 'ZH', label: 'Zürich', score: 5 },
  { value: 'other', label: 'Anderer Kanton', score: -10 }
];

const PREFERRED_REGION_OPTIONS = [
  { value: 'st_gallen', label: 'St. Gallen', score: 25 },
  { value: 'rheintal', label: 'Rheintal', score: 25 },
  { value: 'thurgau', label: 'Thurgau', score: 25 },
  { value: 'appenzellerland', label: 'Appenzellerland', score: 25 },
  { value: 'wil_toggenburg', label: 'Wil / Toggenburg', score: 25 },
  { value: 'bodensee_region', label: 'Bodensee-Region', score: 20 },
  { value: 'graubuenden', label: 'Graubünden', score: 10 },
  { value: 'zurich_region', label: 'Zürich / Umgebung', score: 0 },
  { value: 'other_region', label: 'Andere Region', score: -10 },
  { value: 'undecided', label: 'Noch offen', score: 5 }
];

const AGE_RANGE_OPTIONS = [
  { value: 'under_25', label: 'Unter 25', score: -20 },
  { value: '25_27', label: '25–27', score: 5 },
  { value: '28_34', label: '28–34', score: 25 },
  { value: '35_44', label: '35–44', score: 25 },
  { value: '45_54', label: '45–54', score: 5 },
  { value: '55_plus', label: '55+', score: -10 }
];

const CURRENT_SITUATION_OPTIONS = [
  { value: 'renting', label: 'Zur Miete', score: 15 },
  { value: 'living_with_family_or_partner', label: 'Bei Familie / Partner / Partnerin', score: 5 },
  { value: 'already_owner', label: 'Bereits im Eigenheim', score: -5 },
  { value: 'other', label: 'Andere Situation', score: 0 }
];

const CONSULTATION_INTEREST_OPTIONS = [
  { value: 'yes_asap', label: 'Ja, gerne so bald wie möglich', score: 30 },
  { value: 'yes_not_urgent', label: 'Ja, aber nicht dringend', score: 20 },
  { value: 'maybe_information_first', label: 'Vielleicht, ich möchte zuerst Informationen', score: 5 },
  { value: 'no', label: 'Nein, aktuell nicht', score: -20 }
];

const CONTACT_PREFERENCE_OPTIONS = [
  { value: 'phone', label: 'Telefon' },
  { value: 'email', label: 'E-Mail' },
  { value: 'whatsapp', label: 'WhatsApp' }
];

const PREFERRED_CONTACT_TIME_OPTIONS = [
  { value: 'morning', label: 'Morgens' },
  { value: 'midday', label: 'Mittags' },
  { value: 'afternoon', label: 'Nachmittags' },
  { value: 'evening', label: 'Abends' },
  { value: 'flexible', label: 'Flexibel' }
];

const REACTION_MAPPING: Record<string, Record<string, string>> = {
  property_goal: {
    buy_home: "Alles klar. Wir schauen uns deine Kauf-Ausgangslage an.",
    build_home: "Hervorragend. Ein Bauvorhaben erfordert eine präzise Planung.",
    check_feasibility: "Sehr gut. Dafür ist dieser Realitätscheck genau richtig.",
    general_information: "Kein Problem — wir halten den Check entsprechend allgemein.",
    no_current_goal: "Verstanden. Wir zeigen dir, wie man sich darauf vorbereiten kann."
  },
  property_type: {
    single_family_house: "Klassisch und beliebt. Viel Platz für deine Wohnträume.",
    semi_detached_house: "Ein guter Mittelweg mit Privatsphäre und Effizienz.",
    terraced_house: "Gemeinschaftlich und oft eine sehr wirtschaftliche Option.",
    condominium: "Eigentumswohnung — komfortabel und pflegeleicht.",
    building_land: "Bauland bietet dir die maximale Gestaltungsfreiheit.",
    undecided: "Kein Problem — wir lassen alle Optionen offen."
  },
  buying_timeline: {
    as_soon_as_possible: "Bereit für den Start — wir beschleunigen den Check für dich.",
    within_3_months: "Perfektes Timing. Wir ermitteln rasch deine Möglichkeiten.",
    "3_6_months": "Gute Vorlaufzeit. Ideal, um jetzt die Finanzen zu prüfen.",
    "6_12_months": "Perfekt. So hast du ausreichend Zeit für die Vorbereitung.",
    "1_2_years": "Vorausschauend geplant. Wir legen das Fundament.",
    unknown: "Alles klar. Wir gehen das entspannt und ohne Eile an."
  },
  employment_status: {
    employed_full_time: "Stabile Basis. Eine Vollzeitstelle erleichtert die Finanzierung.",
    employed_part_time: "Notiert. Wir berücksichtigen deine Teilzeitsituation präzise.",
    self_employed: "Spannend. Bei Selbstständigkeit prüfen wir die Details genauer.",
    student: "Zukunftsorientiert. Wir zeigen dir Wege für die Zukunft auf.",
    not_employed: "Verstanden. Wir schauen, was unter diesen Bedingungen möglich ist.",
    retired: "Notiert. Wir prüfen die Tragbarkeit für deine Pensionierung."
  },
  own_funds_range: {
    under_25000: "Verstanden. Wir zeigen dir kreative Wege zum Eigenkapital auf.",
    "25000_49999": "Ein solider Anfang. Wir berechnen das passende Budget.",
    "50000_99999": "Guter Grundstock. Das erweitert deine Kaufoptionen spürbar.",
    "100000_199999": "Sehr stark. Damit stehen viele Türen für dich offen.",
    "200000_plus": "Hervorragend. Damit hast du eine erstklassige Ausgangslage.",
    unknown: "Kein Problem — wir kalkulieren mit Schätzwerten für dich."
  },
  financing_status: {
    financing_checked: "Perfekt. Das spart wertvolle Zeit im weiteren Prozess.",
    partly_checked: "Gut. Wir bringen zusätzliche Klarheit in offene Punkte.",
    not_checked: "Kein Problem — dafür erstellen wir eine erste Einschätzung.",
    no_starting_point: "Genau richtig. Wir zeigen dir Schritt für Schritt den Weg."
  },
  household_income_range: {
    under_6000: "Notiert. Wir passen den Realitätscheck genau darauf an.",
    "6000_8999": "Ein gesundes Einkommen. Wir berechnen dein maximales Budget.",
    "9000_11999": "Sehr gut. Das bietet eine solide Tragbarkeit für viele Objekte.",
    "12000_15999": "Ausgezeichnet. Das eröffnet dir sehr attraktive Möglichkeiten.",
    "16000_plus": "Erstklassig. Damit hast du finanziell einen grossen Spielraum.",
    prefer_not_to_say: "Absolut verständlich. Wir rechnen mit Durchschnittswerten weiter."
  },
  canton: {
    SG: "Kanton St. Gallen — eine wunderschöne Wohngegend mit Potenzial.",
    TG: "Kanton Thurgau — naturnah und sehr beliebt für Eigenheime.",
    AR: "Appenzell Ausserrhoden — traditionsreich und landschaftlich reizvoll.",
    AI: "Appenzell Innerrhoden — idyllisch und mit hoher Lebensqualität.",
    GR: "Kanton Graubünden — Wohnen, wo andere Ferien machen.",
    SH: "Kanton Schaffhausen — charmant und grenznah gelegen.",
    ZH: "Kanton Zürich — dynamisch und mit hervorragender Infrastruktur.",
    other: "Alles klar. Wir prüfen die Bedingungen in deinem Kanton."
  },
  zip_code: {
    valid: "Postleitzahl erfasst. Wir prüfen regionale Besonderheiten."
  },
  preferred_region: {
    st_gallen: "Region St. Gallen — urbanes Leben gepaart mit hoher Lebensqualität.",
    rheintal: "Region Rheintal — wirtschaftsstark und landschaftlich einmalig.",
    thurgau: "Region Thurgau — familienfreundlich und naturnah gelegen.",
    appenzellerland: "Appenzellerland — herrlicher Weitblick und viel Charme.",
    wil_toggenburg: "Wil / Toggenburg — gut angebunden und sehr vielseitig.",
    bodensee_region: "Bodensee-Region — begehrtes Wohnen direkt am Wasser.",
    graubuenden: "Region Graubünden — alpine Idylle und hohe Lebensqualität.",
    zurich_region: "Zürich und Umgebung — äusserst dynamisch und wertstabil.",
    other_region: "Spannende Wahl. Wir behalten diese Region im Fokus.",
    undecided: "Alles klar, wir halten den Check flexibel für dich."
  },
  age_range: {
    under_25: "Jung und ambitioniert. Frühzeitige Planung zahlt sich aus.",
    "25_27": "Der perfekte Zeitpunkt, um den Grundstein zu legen.",
    "28_34": "Ideale Altersgruppe für den ersten Schritt ins Eigenheim.",
    "35_44": "Beste Lebensphase, um Wohnträume langfristig zu verwirklichen.",
    "45_54": "Lebenserfahren. Wir richten die Finanzierung optimal aus.",
    "55_plus": "Vorausschauend. Wir planen die passende Wohnlösung für dich."
  },
  current_situation: {
    renting: "Mietverhältnis — der klassische Ausgangspunkt fürs Wohneigentum.",
    living_with_family_or_partner: "Flexibler Startpunkt, ideal um Eigenkapital anzusparen.",
    already_owner: "Interessant. Wir prüfen deine Optionen als bestehender Eigentümer.",
    other: "Notiert. Wir passen den Check an deine individuelle Situation an."
  },
  consultation_interest: {
    yes_asap: "Wunderbar. Wir kontaktieren dich zeitnah für den Austausch.",
    yes_not_urgent: "Gerne. Wir melden uns ganz entspannt bei dir.",
    maybe_information_first: "Gerne senden wir dir vorab nützliche Informationen zu.",
    no: "Kein Problem — du erhältst die Auswertung ohne Anruf."
  },
  preferred_contact_time: {
    morning: "Morgens passt perfekt — wir rufen dich am Vormittag an.",
    midday: "Über den Mittag — ideal für ein kurzes Gespräch.",
    afternoon: "Nachmittags — wir kontaktieren dich im späteren Tagesverlauf.",
    evening: "Abends — entspannter Austausch nach dem Feierabend.",
    flexible: "Flexibel erreichbar — wir finden den passenden Moment."
  },
  first_name: {
    valid: "Freut uns, dich kennenzulernen!"
  },
  last_name: {
    valid: "Nachname erfolgreich hinterlegt."
  },
  email: {
    valid: "E-Mail-Adresse für die Zustellung notiert."
  },
  phone: {
    valid: "Telefonnummer für die Kontaktaufnahme hinterlegt."
  },
  message: {
    valid: "Deine Nachricht wurde erfolgreich erfasst."
  }
};

const SCHEDULER_LINK = "https://calendly.com/";

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onClose, title, subtitle, variant = 'inline', onProgressUpdate }) => {
  const [confirmations, setConfirmations] = useState<Record<string, { text: string; id: string }>>({});
  const debounceTimersRef = useRef<Record<string, any>>({});
  const mobileAutoAdvanceTimerRef = useRef<any>(null);

  const showConfirmation = (fieldKey: string, text: string) => {
    const id = Math.random().toString();
    setConfirmations((prev) => ({
      ...prev,
      [fieldKey]: { text, id }
    }));
    setTimeout(() => {
      setConfirmations((prev) => {
        if (prev[fieldKey]?.id === id) {
          const copy = { ...prev };
          delete copy[fieldKey];
          return copy;
        }
        return prev;
      });
    }, 2500);
  };

  const triggerMultiConfirm = (fieldKey: string, text: string) => {
    if (debounceTimersRef.current[fieldKey]) {
      clearTimeout(debounceTimersRef.current[fieldKey]);
    }
    debounceTimersRef.current[fieldKey] = setTimeout(() => {
      showConfirmation(fieldKey, text);
      delete debounceTimersRef.current[fieldKey];
    }, 400);
  };

  useEffect(() => {
    return () => {
      Object.values(debounceTimersRef.current).forEach(clearTimeout);
      if (mobileAutoAdvanceTimerRef.current) {
        clearTimeout(mobileAutoAdvanceTimerRef.current);
      }
    };
  }, []);

  const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderInlineConfirm = (fieldKey: string) => {
    const conf = confirmations[fieldKey];
    if (!conf) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="text-[11px] font-extrabold text-blue-700 bg-blue-50/40 border border-blue-100/50 rounded-lg px-3 py-1.5 flex items-center gap-1.5 mt-2 w-fit"
          role="status"
          aria-live="polite"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse flex-shrink-0" />
          <span>{conf.text}</span>
        </motion.div>
      </AnimatePresence>
    );
  };

  const [step, setStep] = useState<1 | 2 | 3 | 4>(() => {
    try {
      const saved = localStorage.getItem('eigenheim_navigator_step');
      return saved ? (parseInt(saved, 10) as 1 | 2 | 3 | 4) : 1;
    } catch (e) {
      return 1;
    }
  });
  const [formData, setFormData] = useState<FormState>(() => {
    try {
      const saved = localStorage.getItem('eigenheim_navigator_form_data');
      return saved ? JSON.parse(saved) : initialFormState;
    } catch (e) {
      return initialFormState;
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Transition simulation loading
  const [isCalculatingTransition, setIsCalculatingTransition] = useState(false);
  const [transitionLoadingText, setTransitionLoadingText] = useState('Daten werden analysiert...');

  // Target percent and animated percent for dynamic progress calculation (Klarheits-Score)
  const [targetPercent, setTargetPercent] = useState(0);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // Track focused state for mobile keyboard avoidance
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Mobile specific navigation state
  const [isMobile, setIsMobile] = useState(false);
  const [mobileQuestionIndex, setMobileQuestionIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('eigenheim_navigator_mobile_index');
      return saved ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });
  const [direction, setDirection] = useState(1);
  const [interstitial, setInterstitial] = useState<{
    completedCategory: string;
    nextCategory: string;
    nextIndex: number;
  } | null>(null);
  const [autoAdvanceTimerKey, setAutoAdvanceTimerKey] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('eigenheim_navigator_form_data', JSON.stringify(formData));
    } catch (e) {
      console.error(e);
    }
  }, [formData]);

  useEffect(() => {
    try {
      localStorage.setItem('eigenheim_navigator_step', step.toString());
    } catch (e) {
      console.error(e);
    }
  }, [step]);

  useEffect(() => {
    try {
      localStorage.setItem('eigenheim_navigator_mobile_index', mobileQuestionIndex.toString());
    } catch (e) {
      console.error(e);
    }
  }, [mobileQuestionIndex]);

  useEffect(() => {
    if (!interstitial) return;

    const timer = setTimeout(() => {
      setDirection(1);
      setMobileQuestionIndex(interstitial.nextIndex);
      setInterstitial(null);
      setErrors({});
      setValidationTriggered(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [interstitial]);

  const transitionToNextMobileQuestion = (nextIndex: number) => {
    if (mobileAutoAdvanceTimerRef.current) {
      clearTimeout(mobileAutoAdvanceTimerRef.current);
      mobileAutoAdvanceTimerRef.current = null;
    }
    setAutoAdvanceTimerKey(null);

    const currentQ = MOBILE_QUESTIONS[mobileQuestionIndex];
    const nextQ = MOBILE_QUESTIONS[nextIndex];
    
    if (nextQ && currentQ && currentQ.category !== nextQ.category) {
      setInterstitial({
        completedCategory: currentQ.category,
        nextCategory: nextQ.category,
        nextIndex: nextIndex
      });
    } else {
      setDirection(1);
      setMobileQuestionIndex(nextIndex);
      setErrors({});
      setValidationTriggered(false);
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Calculate target percent based on ALL 17 required questions across all 4 categories (Klarheits-Score)
    const s1 = formData.step_1_property_goal;
    const s2 = formData.step_2_financial_situation;
    const s3 = formData.step_3_region_profile;
    const s4 = formData.step_4_contact;

    const totalRequired = 17;
    let answered = 0;

    // Step 1: Eigenheimwunsch (3 Pflichtfragen)
    if (s1.property_goal) answered++;
    if (s1.property_type && s1.property_type.length > 0) answered++;
    if (s1.buying_timeline) answered++;

    // Step 2: Finanzen (3 Pflichtfragen - household_income_range ist optional)
    if (s2.employment_status) answered++;
    if (s2.own_funds_range) answered++;
    if (s2.financing_status) answered++;

    // Step 3: Region & Situation (5 Pflichtfragen)
    if (s3.canton) answered++;
    if (s3.zip_code && /^[0-9]{4}$/.test(s3.zip_code.trim())) answered++;
    if (s3.preferred_region && s3.preferred_region.length > 0) answered++;
    if (s3.age_range) answered++;
    if (s3.current_situation) answered++;

    // Step 4: Kontaktdaten (6 Pflichtfragen - message und preferred_contact_time sind optional)
    if (s4.first_name && s4.first_name.trim().length >= 2) answered++;
    if (s4.last_name && s4.last_name.trim().length >= 2) answered++;
    if (s4.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s4.email.trim())) answered++;

    const phoneClean = s4.phone.replace(/[^\d+]/g, '');
    let isPhoneValid = false;
    if (phoneClean.startsWith('+41')) isPhoneValid = /^\+41[1-9]\d{8}$/.test(phoneClean);
    else if (phoneClean.startsWith('0041')) isPhoneValid = /^0041[1-9]\d{8}$/.test(phoneClean);
    else if (phoneClean.startsWith('0')) isPhoneValid = /^0[1-9]\d{8}$/.test(phoneClean);
    if (isPhoneValid) answered++;

    if (s4.consultation_interest) answered++;
    if (s4.privacy_consent) answered++;

    const percent = Math.round((answered / totalRequired) * 100);
    setTargetPercent(percent);
  }, [formData]);

  // Sync core step state with active mobile question step for header calculations
  useEffect(() => {
    if (isMobile) {
      const currentQ = MOBILE_QUESTIONS[mobileQuestionIndex];
      if (currentQ) {
        setStep(currentQ.step);
      }
    }
  }, [mobileQuestionIndex, isMobile]);

  useEffect(() => {
    if (prefersReduced) {
      setAnimatedPercent(targetPercent);
      return;
    }

    const duration = 400; // ~400ms countup animation
    const startValue = animatedPercent;
    const endValue = targetPercent;
    if (startValue === endValue) {
      setAnimatedPercent(endValue);
      return;
    }

    const startTime = performance.now();
    let animationFrameId: number;

    const updateValue = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // easeOutQuad easing
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.round(startValue + (endValue - startValue) * easeProgress);
      
      setAnimatedPercent(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateValue);
      }
    };

    animationFrameId = requestAnimationFrame(updateValue);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [targetPercent, prefersReduced]);

  // Propagate progress and remaining questions count to parent container (for close warning etc)
  useEffect(() => {
    if (onProgressUpdate) {
      const s1 = formData.step_1_property_goal;
      const s2 = formData.step_2_financial_situation;
      const s3 = formData.step_3_region_profile;
      const s4 = formData.step_4_contact;

      const totalRequired = 17;
      let answered = 0;

      // Step 1: Eigenheimwunsch (3 Pflichtfragen)
      if (s1.property_goal) answered++;
      if (s1.property_type && s1.property_type.length > 0) answered++;
      if (s1.buying_timeline) answered++;

      // Step 2: Finanzen (3 Pflichtfragen)
      if (s2.employment_status) answered++;
      if (s2.own_funds_range) answered++;
      if (s2.financing_status) answered++;

      // Step 3: Region & Situation (5 Pflichtfragen)
      if (s3.canton) answered++;
      if (s3.zip_code && /^[0-9]{4}$/.test(s3.zip_code.trim())) answered++;
      if (s3.preferred_region && s3.preferred_region.length > 0) answered++;
      if (s3.age_range) answered++;
      if (s3.current_situation) answered++;

      // Step 4: Kontaktdaten (6 Pflichtfragen)
      if (s4.first_name && s4.first_name.trim().length >= 2) answered++;
      if (s4.last_name && s4.last_name.trim().length >= 2) answered++;
      if (s4.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s4.email.trim())) answered++;

      const phoneClean = s4.phone.replace(/[^\d+]/g, '');
      let isPhoneValid = false;
      if (phoneClean.startsWith('+41')) isPhoneValid = /^\+41[1-9]\d{8}$/.test(phoneClean);
      else if (phoneClean.startsWith('0041')) isPhoneValid = /^0041[1-9]\d{8}$/.test(phoneClean);
      else if (phoneClean.startsWith('0')) isPhoneValid = /^0[1-9]\d{8}$/.test(phoneClean);
      if (isPhoneValid) answered++;

      if (s4.consultation_interest) answered++;
      if (s4.privacy_consent) answered++;

      const remaining = Math.max(0, totalRequired - answered);
      onProgressUpdate(animatedPercent, remaining);
    }
  }, [animatedPercent, formData, onProgressUpdate]);

  // Focus tracking for input elements
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
        setIsInputFocused(true);
      }
    };
    const handleFocusOut = () => {
      setIsInputFocused(false);
    };
    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('focusout', handleFocusOut);
    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('focusout', handleFocusOut);
    };
  }, []);

  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [validationTriggered, setValidationTriggered] = useState(false);

  // Scroll target ref
  const headerRef = useRef<HTMLDivElement>(null);

  // Track event dispatch helpers
  const track = (event: string, data?: any) => {
    console.log(`Tracking Event: ${event}`, data || '');
    if (typeof window !== 'undefined') {
      const customEvent = new CustomEvent(event, { detail: data });
      window.dispatchEvent(customEvent);
      
      const dataLayer = (window as any).dataLayer;
      if (dataLayer && Array.isArray(dataLayer)) {
        dataLayer.push({ event, ...data });
      }
    }
  };

  useEffect(() => {
    track('form_started', { form_id: 'eigenheimnavi_lead_form_v1' });
  }, []);

  // Validation routines per step matching Schweizer Hochdeutsch specs
  const validateStep1 = (data: FormState): Record<string, string> => {
    const errorMap: Record<string, string> = {};
    if (!data.step_1_property_goal.property_goal) {
      errorMap.property_goal = 'Bitte wähle eine Option aus.';
    }
    if (!data.step_1_property_goal.property_type || data.step_1_property_goal.property_type.length === 0) {
      errorMap.property_type = 'Bitte wähle mindestens eine Option aus.';
    }
    if (!data.step_1_property_goal.buying_timeline) {
      errorMap.buying_timeline = 'Bitte wähle eine Option aus.';
    }
    return errorMap;
  };

  const validateStep2 = (data: FormState): Record<string, string> => {
    const errorMap: Record<string, string> = {};
    if (!data.step_2_financial_situation.employment_status) {
      errorMap.employment_status = 'Bitte wähle eine Option aus.';
    }
    if (!data.step_2_financial_situation.own_funds_range) {
      errorMap.own_funds_range = 'Bitte wähle eine Option aus.';
    }
    if (!data.step_2_financial_situation.financing_status) {
      errorMap.financing_status = 'Bitte wähle eine Option aus.';
    }
    return errorMap;
  };

  const validateStep3 = (data: FormState): Record<string, string> => {
    const errorMap: Record<string, string> = {};
    if (!data.step_3_region_profile.canton) {
      errorMap.canton = 'Bitte wähle eine Option aus.';
    }
    const zip = data.step_3_region_profile.zip_code.trim();
    if (!zip) {
      errorMap.zip_code = 'Bitte fülle dieses Feld aus.';
    } else if (!/^[0-9]{4}$/.test(zip)) {
      errorMap.zip_code = 'Bitte gib eine gültige Schweizer Postleitzahl ein.';
    }
    if (!data.step_3_region_profile.preferred_region || data.step_3_region_profile.preferred_region.length === 0) {
      errorMap.preferred_region = 'Bitte wähle mindestens eine Option aus.';
    }
    if (!data.step_3_region_profile.age_range) {
      errorMap.age_range = 'Bitte wähle eine Option aus.';
    }
    if (!data.step_3_region_profile.current_situation) {
      errorMap.current_situation = 'Bitte wähle eine Option aus.';
    }
    return errorMap;
  };

  const validateStep4 = (data: FormState): Record<string, string> => {
    const errorMap: Record<string, string> = {};
    
    if (!data.step_4_contact.first_name.trim()) {
      errorMap.first_name = 'Bitte fülle dieses Feld aus.';
    } else if (data.step_4_contact.first_name.trim().length < 2) {
      errorMap.first_name = 'Bitte gib mindestens zwei Zeichen ein.';
    }
    
    if (!data.step_4_contact.last_name.trim()) {
      errorMap.last_name = 'Bitte fülle dieses Feld aus.';
    } else if (data.step_4_contact.last_name.trim().length < 2) {
      errorMap.last_name = 'Bitte gib mindestens zwei Zeichen ein.';
    }
    
    const email = data.step_4_contact.email.trim();
    if (!email) {
      errorMap.email = 'Bitte fülle dieses Feld aus.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMap.email = 'Bitte gib eine gültige E-Mail-Adresse ein.';
    }

    const phoneClean = data.step_4_contact.phone.replace(/[^\d+]/g, '');
    let isPhoneValid = false;
    if (phoneClean.startsWith('+41')) {
      isPhoneValid = /^\+41[1-9]\d{8}$/.test(phoneClean);
    } else if (phoneClean.startsWith('0041')) {
      isPhoneValid = /^0041[1-9]\d{8}$/.test(phoneClean);
    } else if (phoneClean.startsWith('0')) {
      isPhoneValid = /^0[1-9]\d{8}$/.test(phoneClean);
    }
    
    if (!phoneClean) {
      errorMap.phone = 'Bitte fülle dieses Feld aus.';
    } else if (!isPhoneValid) {
      errorMap.phone = 'Bitte gib eine gültige Telefonnummer ein.';
    }

    if (!data.step_4_contact.consultation_interest) {
      errorMap.consultation_interest = 'Bitte wähle eine Option aus.';
    }
    if (!data.step_4_contact.privacy_consent) {
      errorMap.privacy_consent = 'Bitte bestätige die Datenschutzerklärung.';
    }

    return errorMap;
  };

  // Scroll smoothly to first validation error with dynamic offset
  const scrollToFirstError = (stepErrors: Record<string, string>) => {
    const firstErrorKey = Object.keys(stepErrors)[0];
    if (!firstErrorKey) return;

    const element = document.querySelector(`[data-field-key="${firstErrorKey}"]`) as HTMLElement;
    if (element) {
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      element.scrollIntoView({
        behavior: prefersReduced ? 'auto' : 'smooth',
        block: 'center'
      });

      // Attempt focus safely
      const focusable = element.querySelector('input, button, select, textarea') as HTMLElement;
      if (focusable) {
        setTimeout(() => {
          focusable.focus();
        }, 300);
      }
    }
  };

  // State calculations & scoring logic
  const calculateLeadEvaluation = () => {
    const s1 = formData.step_1_property_goal;
    const s2 = formData.step_2_financial_situation;
    const s3 = formData.step_3_region_profile;
    const s4 = formData.step_4_contact;

    const propertyGoalScores: Record<string, number> = {
      buy_home: 25,
      build_home: 25,
      check_feasibility: 20,
      general_information: 5,
      no_current_goal: -30
    };

    const buyingTimelineScores: Record<string, number> = {
      as_soon_as_possible: 30,
      within_3_months: 30,
      '3_6_months': 25,
      '6_12_months': 20,
      '1_2_years': 10,
      unknown: 0
    };

    const employmentStatusScores: Record<string, number> = {
      employed_full_time: 25,
      employed_part_time: 15,
      self_employed: 15,
      student: -15,
      not_employed: -30,
      retired: -15
    };

    const ownFundsScores: Record<string, number> = {
      under_25000: -20,
      '25000_49999': 0,
      '50000_99999': 15,
      '100000_199999': 25,
      '200000_plus': 30,
      unknown: 5
    };

    const financingStatusScores: Record<string, number> = {
      financing_checked: 20,
      partly_checked: 25,
      not_checked: 25,
      no_starting_point: 20
    };

    const householdIncomeScores: Record<string, number> = {
      under_6000: -10,
      '6000_8999': 10,
      '9000_11999': 20,
      '12000_15999': 25,
      '16000_plus': 25,
      prefer_not_to_say: 0
    };

    const cantonScores: Record<string, number> = {
      SG: 25,
      TG: 25,
      AR: 25,
      AI: 25,
      GR: 15,
      SH: 10,
      ZH: 5,
      other: -10
    };

    const preferredRegionScores: Record<string, number> = {
      st_gallen: 25,
      rheintal: 25,
      thurgau: 25,
      appenzellerland: 25,
      wil_toggenburg: 25,
      bodensee_region: 20,
      graubuenden: 10,
      zurich_region: 0,
      other_region: -10,
      undecided: 5
    };

    const ageRangeScores: Record<string, number> = {
      under_25: -20,
      '25_27': 5,
      '28_34': 25,
      '35_44': 25,
      '45_54': 5,
      '55_plus': -10
    };

    const currentSituationScores: Record<string, number> = {
      renting: 15,
      living_with_family_or_partner: 5,
      already_owner: -5,
      other: 0
    };

    const consultationInterestScores: Record<string, number> = {
      yes_asap: 30,
      yes_not_urgent: 20,
      maybe_information_first: 5,
      no: -20
    };

    const scorePropertyGoal = propertyGoalScores[s1.property_goal] ?? 0;
    const scoreBuyingTimeline = buyingTimelineScores[s1.buying_timeline] ?? 0;
    const scoreEmploymentStatus = employmentStatusScores[s2.employment_status] ?? 0;
    const scoreOwnFundsRange = ownFundsScores[s2.own_funds_range] ?? 0;
    const scoreFinancingStatus = financingStatusScores[s2.financing_status] ?? 0;
    const scoreHouseholdIncomeRange = householdIncomeScores[s2.household_income_range] ?? 0;
    const scoreCanton = cantonScores[s3.canton] ?? 0;

    let scorePreferredRegion = 0;
    if (s3.preferred_region && s3.preferred_region.length > 0) {
      const regionScores = s3.preferred_region.map(r => preferredRegionScores[r] ?? 0);
      scorePreferredRegion = Math.max(...regionScores);
    }

    const scoreAgeRange = ageRangeScores[s3.age_range] ?? 0;
    const scoreCurrentSituation = currentSituationScores[s3.current_situation] ?? 0;
    const scoreConsultationInterest = consultationInterestScores[s4.consultation_interest] ?? 0;

    const lead_score = 
      scorePropertyGoal +
      scoreBuyingTimeline +
      scoreEmploymentStatus +
      scoreOwnFundsRange +
      scoreFinancingStatus +
      scoreHouseholdIncomeRange +
      scoreCanton +
      scorePreferredRegion +
      scoreAgeRange +
      scoreCurrentSituation +
      scoreConsultationInterest;

    let lead_quality: 'A' | 'B' | 'C' | 'disqualified' = 'C';
    if (lead_score >= 150) {
      lead_quality = 'A';
    } else if (lead_score >= 90) {
      lead_quality = 'B';
    } else if (lead_score >= 40) {
      lead_quality = 'C';
    } else {
      lead_quality = 'disqualified';
    }

    let sales_priority: 'high' | 'medium' | 'low' | 'none' = 'low';
    if (lead_quality === 'A') sales_priority = 'high';
    else if (lead_quality === 'B') sales_priority = 'medium';
    else if (lead_quality === 'C') sales_priority = 'low';
    else if (lead_quality === 'disqualified') sales_priority = 'none';

    let recommended_action: 'call_now' | 'manual_review' | 'nurture' | 'no_sales_action' = 'nurture';
    if (lead_quality === 'A') recommended_action = 'call_now';
    else if (lead_quality === 'B') recommended_action = 'manual_review';
    else if (lead_quality === 'C') recommended_action = 'nurture';
    else if (lead_quality === 'disqualified') recommended_action = 'no_sales_action';

    let disqualification_reason: string | null = null;
    if (s1.property_goal === 'no_current_goal') {
      disqualification_reason = 'no_current_property_goal';
    } else if (s4.consultation_interest === 'no') {
      disqualification_reason = 'no_consultation_interest';
    } else if (s2.employment_status === 'not_employed') {
      disqualification_reason = 'not_currently_employed';
    } else if (lead_score < 40) {
      disqualification_reason = 'low_score';
    }

    return {
      lead_score,
      lead_quality,
      sales_priority,
      recommended_action,
      disqualification_reason
    };
  };

  const getHiddenFields = () => {
    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    return {
      page_url: typeof window !== 'undefined' ? window.location.href : 'https://eigenheimnavi.ch/',
      referrer_url: typeof document !== 'undefined' ? document.referrer : '',
      utm_source: urlParams?.get('utm_source') || '',
      utm_medium: urlParams?.get('utm_medium') || '',
      utm_campaign: urlParams?.get('utm_campaign') || '',
      utm_content: urlParams?.get('utm_content') || '',
      utm_term: urlParams?.get('utm_term') || '',
      gclid: urlParams?.get('gclid') || '',
      fbclid: urlParams?.get('fbclid') || '',
      submitted_at: new Date().toISOString(),
      device_type: typeof navigator !== 'undefined' && /mobile|android|iphone/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
      language: typeof navigator !== 'undefined' ? navigator.language : 'de-CH',
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
    };
  };

  const currentStepTitle = () => {
    switch(step) {
      case 1: return 'Dein Eigenheimwunsch';
      case 2: return 'Deine finanzielle Ausgangslage';
      case 3: return 'Region und persönliche Situation';
      case 4: return 'Deine Kontaktdaten';
    }
  };

  const currentProgressPercentText = () => {
    switch(step) {
      case 1: return '25 % abgeschlossen';
      case 2: return '50 % abgeschlossen';
      case 3: return '75 % abgeschlossen';
      case 4: return 'Fast geschafft';
    }
  };

  // Scroll helper back to form header
  const scrollToTop = () => {
    if (headerRef.current) {
      const prefersReduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      headerRef.current.scrollIntoView({ 
        behavior: prefersReduced ? 'auto' : 'smooth', 
        block: 'start' 
      });
    }
  };

  const handleNext = () => {
    setValidationTriggered(true);
    let stepErrors: Record<string, string> = {};

    if (step === 1) stepErrors = validateStep1(formData);
    else if (step === 2) stepErrors = validateStep2(formData);
    else if (step === 3) stepErrors = validateStep3(formData);

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      track(`form_step${step}_complete`, { formDataStep: formData });
      
      let loadingText = 'Daten werden analysiert...';
      if (step === 1) loadingText = 'Wohnwunsch-Faktoren werden ausgewertet...';
      else if (step === 2) loadingText = 'Finanzielle Tragbarkeit wird berechnet...';
      else if (step === 3) loadingText = 'Regionale Optionen werden geprüft...';

      setTransitionLoadingText(loadingText);
      setIsCalculatingTransition(true);

      setTimeout(() => {
        setStep((prev) => {
          const next = (prev + 1) as 1 | 2 | 3 | 4;
          return next;
        });
        setIsCalculatingTransition(false);
        setValidationTriggered(false);
        setTimeout(scrollToTop, 50);
      }, 700);
    } else {
      console.warn("Validation failed for step", step, stepErrors);
      setTimeout(() => {
        scrollToFirstError(stepErrors);
      }, 100);
    }
  };

  const handleBack = () => {
    setStep((prev) => {
      const prevStep = (prev - 1) as 1 | 2 | 3 | 4;
      return prevStep;
    });
    setValidationTriggered(false);
    setErrors({});
    setTimeout(scrollToTop, 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationTriggered(true);
    
    if (isMobile) {
      for (let i = 0; i < MOBILE_QUESTIONS.length; i++) {
        const q = MOBILE_QUESTIONS[i];
        const err = q.validate(formData);
        if (err) {
          setMobileQuestionIndex(i);
          setErrors({ [q.fieldKey]: err });
          return;
        }
      }
    } else {
      const step4Errors = validateStep4(formData);
      setErrors(step4Errors);

      if (Object.keys(step4Errors).length > 0) {
        console.warn("Validation failed for step 4", step4Errors);
        setTimeout(() => {
          scrollToFirstError(step4Errors);
        }, 100);
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitError(null);
    track('form_submit_start', { formData });

    const tracking = getHiddenFields();
    const evaluation = calculateLeadEvaluation();

    const payload = {
      form_id: "eigenheimnavi_lead_form_v1",
      lead_source: "eigenheimnavi_landingpage",
      contact: {
        first_name: formData.step_4_contact.first_name,
        last_name: formData.step_4_contact.last_name,
        email: formData.step_4_contact.email,
        phone: formData.step_4_contact.phone
      },
      property_goal: {
        goal: formData.step_1_property_goal.property_goal,
        property_type: formData.step_1_property_goal.property_type,
        buying_timeline: formData.step_1_property_goal.buying_timeline
      },
      financial_situation: {
        employment_status: formData.step_2_financial_situation.employment_status,
        own_funds_range: formData.step_2_financial_situation.own_funds_range,
        financing_status: formData.step_2_financial_situation.financing_status,
        household_income_range: formData.step_2_financial_situation.household_income_range || "prefer_not_to_say"
      },
      regional_profile: {
        canton: formData.step_3_region_profile.canton,
        zip_code: formData.step_3_region_profile.zip_code,
        preferred_region: formData.step_3_region_profile.preferred_region,
        age_range: formData.step_3_region_profile.age_range,
        current_situation: formData.step_3_region_profile.current_situation
      },
      consultation: {
        consultation_interest: formData.step_4_contact.consultation_interest,
        contact_preference: formData.step_4_contact.contact_preference,
        preferred_contact_time: formData.step_4_contact.preferred_contact_time || "flexible",
        message: formData.step_4_contact.message
      },
      consents: {
        privacy_consent: formData.step_4_contact.privacy_consent,
        marketing_consent: formData.step_4_contact.marketing_consent
      },
      tracking,
      lead_evaluation: evaluation
    };

    try {
      console.log("Sending Eigenheimnavi lead to webhook:", "https://mis13.app.n8n.cloud/webhook/7ff9cd84-6980-459a-8109-12799c07d4cb?t=957b1bbf705f3e384c3315842ea2be9c5eb5fe3f9680501a14de8cdb06e93b846a5d469f2c12e0b9a3fd6ad2b4c63e88a5993a267d11b5badd55c10002ffc2ba");
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setIsSuccess(true);
        track('form_submit_success', { payload });
        try {
          localStorage.removeItem('eigenheim_navigator_form_data');
          localStorage.removeItem('eigenheim_navigator_step');
          localStorage.removeItem('eigenheim_navigator_mobile_index');
        } catch (e) {
          console.error(e);
        }
        if (onSuccess) onSuccess();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Serverfehler bei der Übertragungs-Verarbeitung.');
      }
    } catch (err: any) {
      console.error('Submit execution error:', err);
      setSubmitError(err?.message || 'Es gab ein Problem beim Absenden deines Eigenheim-Checks. Bitte versuche es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSingleSelectChange = (group: keyof FormState, key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value
      }
    }));
    
    // Trigger micro-affirmation
    if (REACTION_MAPPING[key] && REACTION_MAPPING[key][value]) {
      showConfirmation(key, REACTION_MAPPING[key][value]);
    }
    
    // Remove error immediately
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const handleMultiSelectToggle = (group: keyof FormState, key: string, value: string) => {
    setFormData((prev) => {
      const currentList = (prev[group] as any)[key] as string[];
      const newList = currentList.includes(value)
        ? currentList.filter((item) => item !== value)
        : [...currentList, value];
      
      return {
        ...prev,
        [group]: {
          ...prev[group],
          [key]: newList
        }
      };
    });

    // Remove error immediately after selection
    setErrors((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleTextChange = (group: keyof FormState, key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: value
      }
    }));

    // Trigger micro-affirmations on valid input (debounced)
    if (key === 'zip_code' && /^\d{4}$/.test(value)) {
      triggerMultiConfirm('zip_code', REACTION_MAPPING.zip_code.valid);
    } else if (key === 'first_name' && value.trim().length >= 2) {
      triggerMultiConfirm('first_name', REACTION_MAPPING.first_name.valid);
    } else if (key === 'last_name' && value.trim().length >= 2) {
      triggerMultiConfirm('last_name', REACTION_MAPPING.last_name.valid);
    } else if (key === 'email' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      triggerMultiConfirm('email', REACTION_MAPPING.email.valid);
    } else if (key === 'phone' && value.replace(/[^0-9]/g, '').length >= 10) {
      triggerMultiConfirm('phone', REACTION_MAPPING.phone.valid);
    } else if (key === 'message' && value.trim().length >= 10) {
      triggerMultiConfirm('message', REACTION_MAPPING.message.valid);
    }
    
    // Remove validation errors immediately upon user entering correct values
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
  };

  const MOBILE_QUESTIONS: {
    id: string;
    category: string;
    step: 1 | 2 | 3 | 4;
    title: string;
    type: 'single_select' | 'multi_select' | 'dropdown' | 'text' | 'textarea' | 'final_submit';
    fieldGroup: keyof FormState;
    fieldKey: string;
    options?: any[];
    validate: (data: FormState) => string | null;
  }[] = [
    {
      id: 'property_goal',
      category: 'Eigenheimwunsch',
      step: 1,
      title: 'Was möchtest du realisieren?',
      type: 'single_select',
      fieldGroup: 'step_1_property_goal',
      fieldKey: 'property_goal',
      options: PROPERTY_GOAL_OPTIONS,
      validate: (data) => !data.step_1_property_goal.property_goal ? 'Bitte wähle eine Option aus.' : null
    },
    {
      id: 'property_type',
      category: 'Eigenheimwunsch',
      step: 1,
      title: 'Welche Art von Eigenheim interessiert dich?',
      type: 'multi_select',
      fieldGroup: 'step_1_property_goal',
      fieldKey: 'property_type',
      options: PROPERTY_TYPE_OPTIONS,
      validate: (data) => data.step_1_property_goal.property_type.length === 0 ? 'Bitte wähle mindestens eine Option aus.' : null
    },
    {
      id: 'buying_timeline',
      category: 'Eigenheimwunsch',
      step: 1,
      title: 'Wann möchtest du dein Eigenheim realisieren?',
      type: 'single_select',
      fieldGroup: 'step_1_property_goal',
      fieldKey: 'buying_timeline',
      options: BUYING_TIMELINE_OPTIONS,
      validate: (data) => !data.step_1_property_goal.buying_timeline ? 'Bitte wähle eine Option aus.' : null
    },
    {
      id: 'employment_status',
      category: 'Finanzen',
      step: 2,
      title: 'Wie ist deine aktuelle Erwerbssituation?',
      type: 'single_select',
      fieldGroup: 'step_2_financial_situation',
      fieldKey: 'employment_status',
      options: EMPLOYMENT_STATUS_OPTIONS,
      validate: (data) => !data.step_2_financial_situation.employment_status ? 'Bitte wähle eine Option aus.' : null
    },
    {
      id: 'own_funds_range',
      category: 'Finanzen',
      step: 2,
      title: 'Wie viel Eigenkapital steht dir ungefähr zur Verfügung?',
      type: 'single_select',
      fieldGroup: 'step_2_financial_situation',
      fieldKey: 'own_funds_range',
      options: OWN_FUNDS_OPTIONS,
      validate: (data) => !data.step_2_financial_situation.own_funds_range ? 'Bitte wähle eine Option aus.' : null
    },
    {
      id: 'financing_status',
      category: 'Finanzen',
      step: 2,
      title: 'Hast du deine Finanzierung bereits geprüft?',
      type: 'single_select',
      fieldGroup: 'step_2_financial_situation',
      fieldKey: 'financing_status',
      options: FINANCING_STATUS_OPTIONS,
      validate: (data) => !data.step_2_financial_situation.financing_status ? 'Bitte wähle eine Option aus.' : null
    },
    {
      id: 'household_income_range',
      category: 'Finanzen',
      step: 2,
      title: 'Wie hoch ist ungefähr dein monatliches Brutto-Haushaltseinkommen?',
      type: 'single_select',
      fieldGroup: 'step_2_financial_situation',
      fieldKey: 'household_income_range',
      options: HOUSEHOLD_INCOME_OPTIONS,
      validate: () => null
    },
    {
      id: 'canton',
      category: 'Region & Situation',
      step: 3,
      title: 'In welchem Kanton wohnst du aktuell?',
      type: 'dropdown',
      fieldGroup: 'step_3_region_profile',
      fieldKey: 'canton',
      options: CANTON_OPTIONS,
      validate: (data) => !data.step_3_region_profile.canton ? 'Bitte wähle eine Option aus.' : null
    },
    {
      id: 'zip_code',
      category: 'Region & Situation',
      step: 3,
      title: 'Deine Postleitzahl',
      type: 'text',
      fieldGroup: 'step_3_region_profile',
      fieldKey: 'zip_code',
      validate: (data) => {
        const zip = data.step_3_region_profile.zip_code.trim();
        if (!zip) return 'Bitte fülle dieses Feld aus.';
        if (!/^[0-9]{4}$/.test(zip)) return 'Bitte gib eine gültige Schweizer Postleitzahl ein.';
        return null;
      }
    },
    {
      id: 'preferred_region',
      category: 'Region & Situation',
      step: 3,
      title: 'In welcher Region möchtest du realisieren?',
      type: 'multi_select',
      fieldGroup: 'step_3_region_profile',
      fieldKey: 'preferred_region',
      options: PREFERRED_REGION_OPTIONS,
      validate: (data) => data.step_3_region_profile.preferred_region.length === 0 ? 'Bitte wähle mindestens eine Option aus.' : null
    },
    {
      id: 'age_range',
      category: 'Region & Situation',
      step: 3,
      title: 'Wie alt bist du?',
      type: 'single_select',
      fieldGroup: 'step_3_region_profile',
      fieldKey: 'age_range',
      options: AGE_RANGE_OPTIONS,
      validate: (data) => !data.step_3_region_profile.age_range ? 'Bitte wähle eine Option aus.' : null
    },
    {
      id: 'current_situation',
      category: 'Region & Situation',
      step: 3,
      title: 'Wie wohnst du aktuell?',
      type: 'single_select',
      fieldGroup: 'step_3_region_profile',
      fieldKey: 'current_situation',
      options: CURRENT_SITUATION_OPTIONS,
      validate: (data) => !data.step_3_region_profile.current_situation ? 'Bitte wähle eine Option aus.' : null
    },
    {
      id: 'first_name',
      category: 'Kontaktdaten',
      step: 4,
      title: 'Wie ist dein Vorname?',
      type: 'text',
      fieldGroup: 'step_4_contact',
      fieldKey: 'first_name',
      validate: (data) => {
        if (!data.step_4_contact.first_name.trim()) return 'Bitte fülle dieses Feld aus.';
        if (data.step_4_contact.first_name.trim().length < 2) return 'Bitte gib mindestens zwei Zeichen ein.';
        return null;
      }
    },
    {
      id: 'last_name',
      category: 'Kontaktdaten',
      step: 4,
      title: 'Wie ist dein Nachname?',
      type: 'text',
      fieldGroup: 'step_4_contact',
      fieldKey: 'last_name',
      validate: (data) => {
        if (!data.step_4_contact.last_name.trim()) return 'Bitte fülle dieses Feld aus.';
        if (data.step_4_contact.last_name.trim().length < 2) return 'Bitte gib mindestens zwei Zeichen ein.';
        return null;
      }
    },
    {
      id: 'email',
      category: 'Kontaktdaten',
      step: 4,
      title: 'Wie lautet deine E-Mail-Adresse?',
      type: 'text',
      fieldGroup: 'step_4_contact',
      fieldKey: 'email',
      validate: (data) => {
        const email = data.step_4_contact.email.trim();
        if (!email) return 'Bitte fülle dieses Feld aus.';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Bitte gib eine gültige E-Mail-Adresse ein.';
        return null;
      }
    },
    {
      id: 'phone',
      category: 'Kontaktdaten',
      step: 4,
      title: 'Wie lautet deine Telefonnummer?',
      type: 'text',
      fieldGroup: 'step_4_contact',
      fieldKey: 'phone',
      validate: (data) => {
        const phoneClean = data.step_4_contact.phone.replace(/[^\d+]/g, '');
        let isPhoneValid = false;
        if (phoneClean.startsWith('+41')) isPhoneValid = /^\+41[1-9]\d{8}$/.test(phoneClean);
        else if (phoneClean.startsWith('0041')) isPhoneValid = /^0041[1-9]\d{8}$/.test(phoneClean);
        else if (phoneClean.startsWith('0')) isPhoneValid = /^0[1-9]\d{8}$/.test(phoneClean);
        if (!phoneClean) return 'Bitte fülle dieses Feld aus.';
        if (!isPhoneValid) return 'Bitte gib eine gültige Telefonnummer ein.';
        return null;
      }
    },
    {
      id: 'consultation_interest',
      category: 'Kontaktdaten',
      step: 4,
      title: 'Möchtest du eine persönliche Einschätzung?',
      type: 'single_select',
      fieldGroup: 'step_4_contact',
      fieldKey: 'consultation_interest',
      options: CONSULTATION_INTEREST_OPTIONS,
      validate: (data) => !data.step_4_contact.consultation_interest ? 'Bitte wähle eine Option aus.' : null
    },
    {
      id: 'preferred_contact_time',
      category: 'Kontaktdaten',
      step: 4,
      title: 'Wann bist du am besten erreichbar?',
      type: 'single_select',
      fieldGroup: 'step_4_contact',
      fieldKey: 'preferred_contact_time',
      options: PREFERRED_CONTACT_TIME_OPTIONS,
      validate: () => null
    },
    {
      id: 'message',
      category: 'Kontaktdaten',
      step: 4,
      title: 'Gibt es etwas, das wir vorab wissen sollten?',
      type: 'final_submit',
      fieldGroup: 'step_4_contact',
      fieldKey: 'message',
      validate: (data) => !data.step_4_contact.privacy_consent ? 'Bitte bestätige die Datenschutzerklärung.' : null
    }
  ];

  const variants = prefersReduced
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1 },
        exit: { opacity: 0 }
      }
    : {
        enter: (dir: number) => ({
          x: dir > 0 ? '100%' : '-100%',
          opacity: 0
        }),
        center: {
          x: 0,
          opacity: 1
        },
        exit: (dir: number) => ({
          x: dir < 0 ? '100%' : '-100%',
          opacity: 0
        })
      };

  const handleMobileNext = () => {
    if (mobileAutoAdvanceTimerRef.current) {
      clearTimeout(mobileAutoAdvanceTimerRef.current);
      mobileAutoAdvanceTimerRef.current = null;
    }

    const currentQ = MOBILE_QUESTIONS[mobileQuestionIndex];
    const errorText = currentQ.validate(formData);
    if (errorText) {
      setErrors({ [currentQ.fieldKey]: errorText });
      setValidationTriggered(true);
      return;
    }
    setErrors({});
    setValidationTriggered(false);

    if (currentQ.type === 'multi_select') {
      const values = formData[currentQ.fieldGroup][currentQ.fieldKey as keyof FormState[typeof currentQ.fieldGroup]] as string[];
      let comment = '';
      if (currentQ.fieldKey === 'property_type') {
        if (values && values.length > 0) {
          if (values.length === 1) {
            comment = REACTION_MAPPING.property_type[values[0]] || '';
          } else {
            comment = "Mehrere Objekttypen ausgewählt. Wir analysieren alle Optionen für dich.";
          }
        }
      } else if (currentQ.fieldKey === 'preferred_region') {
        if (values && values.length > 0) {
          if (values.length === 1) {
            comment = REACTION_MAPPING.preferred_region[values[0]] || '';
          } else {
            comment = "Mehrere Wunschregionen erfasst. Wir vergleichen diese für dich.";
          }
        }
      }

      if (comment) {
        showConfirmation(currentQ.fieldKey, comment);
      }

      setTimeout(() => {
        if (mobileQuestionIndex < MOBILE_QUESTIONS.length - 1) {
          transitionToNextMobileQuestion(mobileQuestionIndex + 1);
        }
      }, 350);
    } else if (currentQ.type === 'text') {
      const value = formData[currentQ.fieldGroup][currentQ.fieldKey as keyof FormState[typeof currentQ.fieldGroup]] as string;
      if (currentQ.fieldKey === 'zip_code' && /^\d{4}$/.test(value)) {
        showConfirmation('zip_code', REACTION_MAPPING.zip_code.valid);
      }
      setTimeout(() => {
        if (mobileQuestionIndex < MOBILE_QUESTIONS.length - 1) {
          transitionToNextMobileQuestion(mobileQuestionIndex + 1);
        }
      }, 350);
    } else {
      if (mobileQuestionIndex < MOBILE_QUESTIONS.length - 1) {
        transitionToNextMobileQuestion(mobileQuestionIndex + 1);
      }
    }
  };

  const handleMobileBack = () => {
    if (mobileAutoAdvanceTimerRef.current) {
      clearTimeout(mobileAutoAdvanceTimerRef.current);
      mobileAutoAdvanceTimerRef.current = null;
    }
    setAutoAdvanceTimerKey(null);
    if (mobileQuestionIndex > 0) {
      setDirection(-1);
      setMobileQuestionIndex((prev) => prev - 1);
      setErrors({});
      setValidationTriggered(false);
    }
  };

  const handleMobileSingleSelect = (group: keyof FormState, key: string, value: string) => {
    if (mobileAutoAdvanceTimerRef.current) {
      clearTimeout(mobileAutoAdvanceTimerRef.current);
      mobileAutoAdvanceTimerRef.current = null;
    }
    setAutoAdvanceTimerKey(null);
    handleSingleSelectChange(group, key, value);

    const activeQ = MOBILE_QUESTIONS[mobileQuestionIndex];
    if (activeQ.category !== 'Kontaktdaten') {
      setTimeout(() => {
        if (mobileQuestionIndex < MOBILE_QUESTIONS.length - 1) {
          transitionToNextMobileQuestion(mobileQuestionIndex + 1);
        }
      }, 320);
    }
  };

  const handleMobileDropdownChange = (group: keyof FormState, key: string, value: string) => {
    if (mobileAutoAdvanceTimerRef.current) {
      clearTimeout(mobileAutoAdvanceTimerRef.current);
      mobileAutoAdvanceTimerRef.current = null;
    }
    setAutoAdvanceTimerKey(null);
    handleSingleSelectChange(group, key, value);

    const activeQ = MOBILE_QUESTIONS[mobileQuestionIndex];
    if (value && activeQ.category !== 'Kontaktdaten') {
      setTimeout(() => {
        if (mobileQuestionIndex < MOBILE_QUESTIONS.length - 1) {
          transitionToNextMobileQuestion(mobileQuestionIndex + 1);
        }
      }, 320);
    }
  };

  const handleMobileMultiSelectToggle = (group: keyof FormState, key: string, value: string) => {
    handleMultiSelectToggle(group, key, value);

    if (mobileAutoAdvanceTimerRef.current) {
      clearTimeout(mobileAutoAdvanceTimerRef.current);
      mobileAutoAdvanceTimerRef.current = null;
    }
    setAutoAdvanceTimerKey(null);

    setConfirmations((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    const currentList = (formData[group] as any)[key] as string[];
    const newList = currentList.includes(value)
      ? currentList.filter((item) => item !== value)
      : [...currentList, value];

    if (newList.length > 0) {
      setAutoAdvanceTimerKey(key);
      mobileAutoAdvanceTimerRef.current = setTimeout(() => {
        let comment = '';
        if (key === 'property_type') {
          if (newList.length === 1) {
            comment = REACTION_MAPPING.property_type[newList[0]] || '';
          } else {
            comment = "Mehrere Objekttypen ausgewählt. Wir analysieren alle Optionen für dich.";
          }
        } else if (key === 'preferred_region') {
          if (newList.length === 1) {
            comment = REACTION_MAPPING.preferred_region[newList[0]] || '';
          } else {
            comment = "Mehrere Wunschregionen erfasst. Wir vergleichen diese für dich.";
          }
        }

        if (comment) {
          showConfirmation(key, comment);
        }

        setAutoAdvanceTimerKey(null);
        if (mobileQuestionIndex < MOBILE_QUESTIONS.length - 1) {
          transitionToNextMobileQuestion(mobileQuestionIndex + 1);
        }
      }, MOBILE_AUTO_ADVANCE_DEBOUNCE_MS);
    }
  };

  const handleMobileTextChange = (group: keyof FormState, key: string, value: any) => {
    handleTextChange(group, key, value);

    if (mobileAutoAdvanceTimerRef.current) {
      clearTimeout(mobileAutoAdvanceTimerRef.current);
      mobileAutoAdvanceTimerRef.current = null;
    }
    setAutoAdvanceTimerKey(null);

    setConfirmations((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

    if (key === 'zip_code') {
      if (/^\d{4}$/.test(value)) {
        setAutoAdvanceTimerKey(key);
        mobileAutoAdvanceTimerRef.current = setTimeout(() => {
          showConfirmation('zip_code', REACTION_MAPPING.zip_code.valid);
          setAutoAdvanceTimerKey(null);
          if (mobileQuestionIndex < MOBILE_QUESTIONS.length - 1) {
            transitionToNextMobileQuestion(mobileQuestionIndex + 1);
          }
        }, MOBILE_AUTO_ADVANCE_DEBOUNCE_MS);
      }
    }
  };

  const renderMobileQuestionContent = (q: typeof MOBILE_QUESTIONS[0]) => {
    const isError = validationTriggered && errors[q.fieldKey];
    const value = formData[q.fieldGroup][q.fieldKey as keyof FormState[typeof q.fieldGroup]];

    switch (q.type) {
      case 'single_select': {
        return (
          <div className="grid grid-cols-1 gap-2.5 pt-1" role="radiogroup">
            {q.options?.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <motion.button
                  type="button"
                  key={opt.value}
                  onClick={() => handleMobileSingleSelect(q.fieldGroup, q.fieldKey, opt.value)}
                  aria-checked={isSelected}
                  role="radio"
                  animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className={`w-full p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[52px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                      : isError
                        ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                        : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                  }`}
                >
                  <span className="text-xs sm:text-sm leading-relaxed pr-3 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                  <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white group-hover:border-slate-450'
                  }`}>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 12 }}
                          className="flex items-center justify-center"
                        >
                          <Check size={11} strokeWidth={4.5} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              );
            })}
          </div>
        );
      }
      case 'multi_select': {
        return (
          <div className="grid grid-cols-1 gap-2.5 pt-1" role="group">
            {q.options?.map((opt) => {
              const isSelected = (value as string[]).includes(opt.value);
              return (
                <motion.button
                  type="button"
                  key={opt.value}
                  onClick={() => handleMobileMultiSelectToggle(q.fieldGroup, q.fieldKey, opt.value)}
                  aria-pressed={isSelected}
                  animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className={`p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                      : isError
                        ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                        : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                  }`}
                >
                  <span className="text-xs sm:text-sm leading-relaxed pr-2 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                  <span className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-slate-300 bg-white group-hover:border-slate-450'
                  }`}>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 12 }}
                          className="flex items-center justify-center"
                        >
                          <Check size={11} strokeWidth={4.5} />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </motion.button>
              );
            })}
          </div>
        );
      }
      case 'dropdown': {
        const isSelected = !!value;
        return (
          <div className="relative pt-1">
            <motion.div
              animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="relative"
            >
              <select
                value={value as string}
                onChange={(e) => handleMobileDropdownChange(q.fieldGroup, q.fieldKey, e.target.value)}
                className={`w-full bg-white border rounded-xl p-4 pr-12 text-base sm:text-sm font-bold focus:border-blue-600 outline-none transition-all text-slate-800 focus:ring-2 focus:ring-blue-600/20 appearance-none min-h-[50px] cursor-pointer ${
                  isSelected ? 'border-blue-600 bg-blue-50/5' : isError ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <option value="">Bitte auswählen...</option>
                {q.options?.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 pt-1 gap-2">
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <Check size={11} strokeWidth={4.5} />
                  </span>
                )}
                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </motion.div>
          </div>
        );
      }
      case 'text': {
        const inputMode = q.fieldKey === 'zip_code' ? 'numeric' : (q.fieldKey === 'email' ? 'email' : (q.fieldKey === 'phone' ? 'tel' : 'text'));
        const pattern = q.fieldKey === 'zip_code' ? '[0-9]*' : undefined;
        const maxLength = q.fieldKey === 'zip_code' ? 4 : undefined;
        const type = q.fieldKey === 'email' ? 'email' : (q.fieldKey === 'phone' ? 'tel' : 'text');
        const placeholder = q.fieldKey === 'zip_code' ? 'z.B. 9000' : (q.fieldKey === 'phone' ? '079 123 45 67' : (q.fieldKey === 'email' ? 'max@beispiel.ch' : (q.fieldKey === 'first_name' ? 'Max' : 'Muster')));
        const isZipValid = q.fieldKey === 'zip_code' && /^\d{4}$/.test(value as string);

        return (
          <div className="space-y-2 pt-1">
            <motion.div
              animate={isZipValid && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="relative"
            >
              <input
                type={type}
                pattern={pattern}
                inputMode={inputMode}
                maxLength={maxLength}
                placeholder={placeholder}
                value={value as string}
                onChange={(e) => {
                  const val = q.fieldKey === 'zip_code' ? e.target.value.replace(/[^0-9]/g, '') : e.target.value;
                  handleMobileTextChange(q.fieldGroup, q.fieldKey, val);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleMobileNext();
                  }
                }}
                className={`w-full bg-white border rounded-xl p-4 pr-12 text-base sm:text-sm font-bold focus:border-blue-600 outline-none transition-all text-slate-800 focus:ring-2 focus:ring-blue-600/20 placeholder:text-slate-350 min-h-[50px] ${
                  isZipValid ? 'border-emerald-500 bg-emerald-50/5' : isError ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              />
              {isZipValid && (
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-emerald-500 pt-1">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <Check size={11} strokeWidth={4.5} />
                  </span>
                </div>
              )}
            </motion.div>
            {q.fieldKey === 'phone' && (
              <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-1">Wir melden uns telefonisch bei dir. Deine Telefonnummer verwenden wir nur zur Bearbeitung deiner Anfrage.</p>
            )}
          </div>
        );
      }
      case 'final_submit': {
        return (
          <div className="space-y-3 pt-0.5 max-h-[250px] overflow-y-auto pr-1 no-scrollbar">
            <div className="space-y-1">
              <textarea
                placeholder="Zum Beispiel: Wunschregion, vorhandenes Eigenkapital, geplantes Kaufdatum oder konkrete Fragen."
                maxLength={1000}
                value={formData.step_4_contact.message}
                onChange={(e) => handleTextChange('step_4_contact', 'message', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 text-base sm:text-sm font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all placeholder:text-slate-350 min-h-[64px] max-h-[90px] text-slate-800 leading-normal"
              />
            </div>

            {/* Consents */}
            <div className="space-y-2 pt-0.5">
              <div className="space-y-0.5">
                <label className="flex items-start gap-2.5 cursor-pointer select-none group py-0.5">
                  <input
                    type="checkbox"
                    checked={formData.step_4_contact.privacy_consent}
                    onChange={(e) => handleTextChange('step_4_contact', 'privacy_consent', e.target.checked)}
                    className={`w-4.5 h-4.5 rounded border-2 text-blue-600 focus:ring-blue-550 cursor-pointer flex-shrink-0 mt-0.5 ${
                      validationTriggered && errors.privacy_consent ? 'border-rose-450 bg-rose-50' : 'border-slate-300'
                    }`}
                  />
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-normal group-hover:text-slate-800 transition-colors">
                    Ich bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage und zur Kontaktaufnahme verwendet werden. *
                  </span>
                </label>
                {validationTriggered && errors.privacy_consent && (
                  <p className="text-rose-600 text-[10px] sm:text-[11px] font-bold leading-tight mt-0.5 flex items-center gap-1 animate-fade-in">{errors.privacy_consent}</p>
                )}
              </div>

              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none group py-0.5">
                  <input
                    type="checkbox"
                    checked={formData.step_4_contact.marketing_consent}
                    onChange={(e) => handleTextChange('step_4_contact', 'marketing_consent', e.target.checked)}
                    className="w-4.5 h-4.5 rounded border-2 border-slate-300 text-blue-600 focus:ring-blue-550 cursor-pointer flex-shrink-0 mt-0.5"
                  />
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-semibold leading-normal group-hover:text-slate-800 transition-colors">
                    Ich möchte gelegentlich wertvolle Informationen rund um Eigenheim, Finanzierung und Ostschweizer Immobilien erhalten.
                  </span>
                </label>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  const renderMobileInterstitial = () => {
    if (!interstitial) return null;

    let confirmationText = '';
    if (interstitial.completedCategory === 'Eigenheimwunsch') {
      confirmationText = 'Dein Eigenheimwunsch ist erfasst.';
    } else if (interstitial.completedCategory === 'Finanzen') {
      confirmationText = 'Deine finanzielle Ausgangslage ist notiert.';
    } else if (interstitial.completedCategory === 'Region & Situation') {
      confirmationText = 'Deine Situation vor Ort ist klar. Fast geschafft — letzter Schritt.';
    }

    const skipInterstitial = () => {
      setDirection(1);
      setMobileQuestionIndex(interstitial.nextIndex);
      setInterstitial(null);
      setErrors({});
      setValidationTriggered(false);
    };

    return (
      <div 
        onClick={skipInterstitial}
        className="flex flex-col justify-between items-center w-full min-h-[500px] max-w-md mx-auto text-slate-900 bg-white select-none p-6 cursor-pointer"
      >
        <div className="w-full flex justify-between items-center pt-2 flex-shrink-0">
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
            Eigenheim-Check
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider animate-pulse">
            Tippen zum Überspringen
          </span>
        </div>

        <motion.div 
          initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex-1 flex flex-col justify-center items-center text-center px-4"
        >
          <div className="mb-6 relative">
            <motion.div 
              initial={prefersReduced ? {} : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm"
            >
              <CheckCircle2 size={32} strokeWidth={2.5} />
            </motion.div>
            
            {!prefersReduced && (
              <span className="absolute inset-0 rounded-full border-2 border-emerald-500/20 animate-ping opacity-75" />
            )}
          </div>

          <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug mb-3 max-w-xs">
            {confirmationText}
          </h3>

          <div className="w-12 h-0.5 bg-slate-100 rounded-full my-4" />

          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
              Als nächstes
            </span>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">
              {interstitial.nextCategory}
            </span>
          </div>
        </motion.div>

        <div className="w-full mb-2 flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-32 h-1 bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: "linear" }}
              className="h-full bg-blue-600 rounded-full"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderMobileView = () => {
    if (interstitial) {
      return renderMobileInterstitial();
    }

    const activeQuestion = MOBILE_QUESTIONS[mobileQuestionIndex];
    const isCurrentFieldValid = !activeQuestion.validate(formData);
    const needsNextButton = activeQuestion.category === 'Kontaktdaten' && activeQuestion.type !== 'final_submit';

    const s1 = formData.step_1_property_goal;
    const s2 = formData.step_2_financial_situation;
    const s3 = formData.step_3_region_profile;
    const s4 = formData.step_4_contact;

    const cat1Completed = !!(s1.property_goal && s1.property_type && s1.property_type.length > 0 && s1.buying_timeline);
    const cat2Completed = !!(s2.employment_status && s2.own_funds_range && s2.financing_status);
    const cat3Completed = !!(s3.canton && s3.zip_code && /^[0-9]{4}$/.test(s3.zip_code.trim()) && s3.preferred_region && s3.preferred_region.length > 0 && s3.age_range && s3.current_situation);

    const phoneClean = s4.phone.replace(/[^\d+]/g, '');
    let isPhoneValid = false;
    if (phoneClean.startsWith('+41')) isPhoneValid = /^\+41[1-9]\d{8}$/.test(phoneClean);
    else if (phoneClean.startsWith('0041')) isPhoneValid = /^0041[1-9]\d{8}$/.test(phoneClean);
    else if (phoneClean.startsWith('0')) isPhoneValid = /^0[1-9]\d{8}$/.test(phoneClean);

    const cat4Completed = !!(
      s4.first_name && s4.first_name.trim().length >= 2 &&
      s4.last_name && s4.last_name.trim().length >= 2 &&
      s4.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s4.email.trim()) &&
      isPhoneValid &&
      s4.consultation_interest &&
      s4.privacy_consent
    );

    let stageText = "Dein Profil entsteht …";
    if (animatedPercent >= 100) {
      stageText = "Bereit für deine Einschätzung.";
    } else if (animatedPercent >= 75) {
      stageText = "Nur noch ein Schritt.";
    } else if (animatedPercent >= 50) {
      stageText = "Fast vollständig.";
    } else if (animatedPercent >= 25) {
      stageText = "Schon ein gutes Stück sichtbar.";
    }

    return (
      <form 
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className={`flex flex-col justify-between w-full ${activeQuestion.type === 'final_submit' ? 'min-h-[380px]' : 'min-h-[460px]'} max-w-md mx-auto text-slate-900 bg-white select-none`}
      >
        {/* 1. COMPACT PROGRESS HEADER WITH 4 SEGMENTS */}
        <div className="flex flex-col border-b border-slate-100 mb-3 pb-1.5 flex-shrink-0">
          <div className="flex items-center justify-between px-1 py-1">
            <button
              type="button"
              onClick={handleMobileBack}
              className={`p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors ${mobileQuestionIndex === 0 ? 'opacity-0 pointer-events-none' : ''}`}
              aria-label="Zurück"
            >
              <ChevronLeft size={22} strokeWidth={2.5} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Eigenheim-Check
              </span>
              <div className="flex gap-1.5 mt-1">
                <div className={`h-1 w-6 rounded-full transition-all duration-500 ${cat1Completed ? 'bg-blue-600 shadow-sm' : 'bg-slate-200'}`} title="Eigenheimwunsch" />
                <div className={`h-1 w-6 rounded-full transition-all duration-500 ${cat2Completed ? 'bg-indigo-600 shadow-sm' : 'bg-slate-200'}`} title="Finanzen" />
                <div className={`h-1 w-6 rounded-full transition-all duration-500 ${cat3Completed ? 'bg-purple-600 shadow-sm' : 'bg-slate-200'}`} title="Region & Situation" />
                <div className={`h-1 w-6 rounded-full transition-all duration-500 ${cat4Completed ? 'bg-emerald-600 shadow-sm' : 'bg-slate-200'}`} title="Kontaktdaten" />
              </div>
            </div>
            <div className="w-9" />
          </div>
          {/* Micro-text darunter */}
          <div className="text-center text-[10px] font-bold text-slate-500/80 mt-0.5">
            {stageText}
          </div>
        </div>

        {/* 2. KLARHEITS-SCORE PROGRESS AREA */}
        <div className="px-1 mb-5 flex-shrink-0">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
              Dein Fortschritt
            </span>
            <span className={`text-xs font-black text-blue-600 transition-all duration-300 ${
              (animatedPercent === 100 && !prefersReduced) ? 'text-emerald-600 animate-pulse scale-105' : ''
            }`}>
              Klarheits-Score: {animatedPercent} %
            </span>
          </div>
          <div className="w-full h-1 bg-slate-100 rounded-full overflow-visible relative">
            <div 
              className={`h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-300 ease-out relative ${
                (animatedPercent === 100 && !prefersReduced) 
                  ? 'shadow-[0_0_10px_rgba(16,185,129,0.7)] animate-pulse' 
                  : ''
              }`}
              style={{ width: `${animatedPercent}%` }}
            >
              {/* Soft glowing particle head on progress bar */}
              {animatedPercent > 0 && animatedPercent < 100 && (
                <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_rgba(255,255,255,1)]" />
              )}
            </div>
          </div>
        </div>

        {/* 2. SLIDING ACTIVE QUESTION CONTAINER */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeQuestion.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: prefersReduced ? 0.15 : 0.3, ease: "easeInOut" }}
            drag={mobileQuestionIndex > 0 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.2 }}
            onDragEnd={(e, info) => {
              if (info.offset.x > 80 && mobileQuestionIndex > 0) {
                handleMobileBack();
              }
            }}
            className="flex-1 flex flex-col justify-start touch-pan-y"
          >
            {/* Eyebrow Category */}
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-2">
              {activeQuestion.category}
            </span>
            
            {/* Title */}
            <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug mb-3.5">
              {activeQuestion.title}
              {(activeQuestion.fieldKey === 'household_income_range' || activeQuestion.fieldKey === 'preferred_contact_time' || activeQuestion.fieldKey === 'message') && (
                <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md ml-2 normal-case tracking-normal">optional</span>
              )}
            </h3>

            {/* Visual countdown progress feedback */}
            {autoAdvanceTimerKey === activeQuestion.fieldKey && (
              <div className="w-full h-1 bg-slate-100 rounded-full mb-3.5 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: MOBILE_AUTO_ADVANCE_DEBOUNCE_MS / 1000, ease: "linear" }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
            )}

            {/* Question Render content */}
            <div className="flex-1">
              {renderMobileQuestionContent(activeQuestion)}
            </div>

            {/* Micro confirmation and Errors */}
            {activeQuestion.type !== 'final_submit' && (
              <div className="min-h-[44px] mt-1">
                {renderInlineConfirm(activeQuestion.fieldKey)}
              </div>
            )}

            {validationTriggered && errors[activeQuestion.fieldKey] && (
              <div className="text-rose-600 text-xs font-bold leading-none mt-1 flex items-center gap-1.5 animate-fade-in" role="alert">
                <AlertCircle size={13} className="flex-shrink-0" />
                <span>{errors[activeQuestion.fieldKey]}</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* 3. NEXT BUTTON AREA */}
        {needsNextButton && activeQuestion.type !== 'final_submit' && (
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex-shrink-0">
            <button
              type="button"
              onClick={handleMobileNext}
              className={`w-full font-black text-sm py-4 rounded-xl transition-all flex items-center justify-center gap-1.5 min-h-[48px] outline-none ${
                isCurrentFieldValid
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-100/80 active:scale-[0.99]'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Weiter</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* 4. FINAL SUBMIT AREA */}
        {activeQuestion.type === 'final_submit' && (
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex-shrink-0 space-y-3">
            {submitError && (
              <div className="bg-rose-50 border border-rose-100 p-3.5 rounded-xl text-rose-700 text-xs font-bold leading-relaxed flex gap-2.5 items-start animate-fade-in" role="alert">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-[#F87101] hover:bg-[#e06101] text-white font-black text-sm py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer outline-none min-h-[48px]"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Wird gesendet...</span>
                </>
              ) : (
                <>
                  <span>Kostenlosen Check jetzt abschliessen</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex gap-2 items-center justify-center text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              <Lock size={12} className="text-slate-350" />
              <span>Sicher & Vertraulich</span>
            </div>
          </div>
        )}
      </form>
    );
  };

  // SUCCESS VIEW: HIGH CONVERSION DYNAMIC THANK YOU PAGE
  if (isSuccess) {
    const evaluation = calculateLeadEvaluation();
    const isALead = evaluation.lead_quality === 'A';
    const isBLead = evaluation.lead_quality === 'B';
    const isCLead = evaluation.lead_quality === 'C';
    const isDisqualified = evaluation.lead_quality === 'disqualified';

    return (
      <div className="flex flex-col items-center justify-center py-8 sm:py-14 text-center px-4 sm:px-6 bg-white max-w-2xl mx-auto rounded-[32px]">
        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-6 sm:mb-8 animate-pulse shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        
        <div className="space-y-4 max-w-lg mb-8">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
            Vielleicht bald dein Zuhause
          </h3>
          <p className="text-xs text-slate-400 font-extrabold uppercase tracking-widest">
            Eigenheim-Check erfolgreich übermittelt
          </p>
 
          <div className="pt-2">
            {isALead && (
              <p className="text-slate-650 font-medium text-sm sm:text-base leading-relaxed">
                Vielen Dank. Deine Angaben zeigen, dass eine persönliche Einschätzung sinnvoll ist.
                <br className="hidden sm:inline" /> Wir prüfen deine Situation und melden uns zeitnah bei dir.
              </p>
            )}
 
            {isBLead && (
              <p className="text-slate-650 font-medium text-sm sm:text-base leading-relaxed">
                Vielen Dank. Wir prüfen deine Angaben und melden uns mit einer ersten Einschätzung zu deinen Eigenheim-Möglichkeiten.
              </p>
            )}
 
            {isCLead && (
              <p className="text-slate-650 font-medium text-sm sm:text-base leading-relaxed">
                Vielen Dank. Du erhältst weitere Informationen, wie du deinen Eigenheimwunsch besser einschätzen kannst.
              </p>
            )}
 
            {isDisqualified && (
              <p className="text-slate-650 font-medium text-sm sm:text-base leading-relaxed">
                Vielen Dank für deine Angaben. Wir senden dir passende Informationen rund um die ersten Schritte zum Eigenheim.
              </p>
            )}
          </div>
        </div>

        {variant === 'modal' && onClose && (
          <button 
            type="button"
            onClick={onClose} 
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-[1.01]"
          >
            Vielen Dank
          </button>
        )}
      </div>
    );
  }

  if (isMobile) {
    return renderMobileView();
  }

  const isStep1GoalFilled = !!formData.step_1_property_goal.property_goal;
  const isStep1TypeFilled = formData.step_1_property_goal.property_type.length > 0;
  const isStep1TimelineFilled = !!formData.step_1_property_goal.buying_timeline;

  const showPropertyType = isStep1GoalFilled || validationTriggered;
  const showBuyingTimeline = (isStep1GoalFilled && isStep1TypeFilled) || validationTriggered;
  const showActionDock = (isStep1GoalFilled && isStep1TypeFilled && isStep1TimelineFilled) || validationTriggered;

  return (
    <div className="flex flex-col w-full text-slate-900" ref={headerRef}>
      
      {/* 1. PROGRESS STATUS BLOCK */}
      <div className="mb-8" id="step_header">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] sm:text-xs font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase tracking-widest">
            Schritt {step} von 4
          </span>
          <span className={`text-[10px] sm:text-xs font-black text-blue-600/90 tracking-wide bg-blue-50/50 px-2.5 py-1 rounded-full transition-all duration-300 ${animatedPercent === 100 ? 'animate-pulse bg-emerald-50 text-emerald-700 shadow-[0_0_12px_rgba(16,185,129,0.35)]' : ''}`}>
            Klarheits-Score: {animatedPercent} %
          </span>
        </div>
        
        {/* Continuous Progress Bar with Gradient and optional Glow/Pulse at 100% */}
        <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-visible mb-5">
          <div 
            className={`h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-300 ease-out relative ${
              animatedPercent === 100 
                ? 'shadow-[0_0_15px_rgba(16,185,129,0.7)] animate-pulse' 
                : ''
            }`}
            style={{ width: `${animatedPercent}%` }}
          >
            {/* Soft glowing particle head on progress bar */}
            {animatedPercent > 0 && animatedPercent < 100 && (
              <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
            )}
          </div>
        </div>

        {/* Transparent Segmented Labels under progress bar */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'Eigenheimwunsch', num: 1 },
            { label: 'Finanzen', num: 2 },
            { label: 'Region & Situation', num: 3 },
            { label: 'Kontaktdaten', num: 4 }
          ].map((s) => {
            const isActive = step === s.num;
            const isCompleted = step > s.num;
            return (
              <div key={s.num} className="text-center flex flex-col items-stretch">
                <span className={`text-[9px] sm:text-[10px] font-black tracking-tight transition-colors duration-200 block text-center ${
                  isActive 
                    ? 'text-blue-750 font-black' 
                    : isCompleted 
                      ? 'text-blue-500 font-bold' 
                      : 'text-slate-400 font-medium'
                }`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. FORM ACTION HEADER */}
      <div className="mb-6 sm:mb-8 border-b border-slate-100/80 pb-4">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight tracking-tight mb-2">
          {currentStepTitle()}
        </h3>
        
        {/* Dynamic description helper depending on active step */}
        <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed">
          {step === 1 && "Damit wir deine Situation richtig einschätzen können, starten wir mit deinem Eigenheimwunsch."}
          {step === 2 && "Ungefähre Angaben reichen. Es handelt sich nicht um eine verbindliche Finanzierungsprüfung."}
          {step === 3 && "EigenheimNavi richtet sich besonders an Personen mit Eigenheimwunsch in der Ostschweiz."}
          {step === 4 && "Wir prüfen deine Angaben und melden uns mit einer ersten Einschätzung zu deinen Eigenheim-Möglichkeiten."}
        </p>
      </div>

      {/* Form Area wrapper */}
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 relative" noValidate>
        
        {isCalculatingTransition && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-x-0 -top-4 bottom-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative mb-5 flex items-center justify-center">
              <span className="absolute inline-flex h-16 w-16 rounded-full bg-blue-100 animate-ping opacity-75"></span>
              <div className="relative w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin flex items-center justify-center bg-white shadow-md">
                <div className="w-3.5 h-3.5 rounded-full bg-[#F87101] animate-pulse" />
              </div>
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest animate-pulse">Schritt-Auswertung</h3>
            <p className="text-xs font-bold text-slate-500 mt-2 max-w-xs">{transitionLoadingText}</p>
          </motion.div>
        )}
        
        {/* STEP 1: EIGENHEIMWUNSCH CARD SELECTIONS */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="space-y-6 sm:space-y-8"
          >
            {/* PROPERTY GOAL */}
            <div className="space-y-3" data-field-key="property_goal">
              <label id="property_goal_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                <span>Was möchtest du realisieren?</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              
              <div className="grid grid-cols-1 gap-2.5" role="radiogroup" aria-labelledby="property_goal_label">
                {PROPERTY_GOAL_OPTIONS.map((opt) => {
                  const isSelected = formData.step_1_property_goal.property_goal === opt.value;
                  const isError = validationTriggered && errors.property_goal;
                  return (
                    <motion.button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_1_property_goal', 'property_goal', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`w-full p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[52px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/20'
                          : isError 
                            ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                      }`}
                    >
                      <span className="text-xs sm:text-sm leading-relaxed pr-3 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 12 }}
                              className="flex items-center justify-center"
                            >
                              <Check size={11} strokeWidth={4.5} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {renderInlineConfirm('property_goal')}
              {validationTriggered && errors.property_goal && (
                <div className="text-rose-600 text-xs font-bold leading-tight mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.property_goal}</span>
                </div>
              )}
            </div>

            {/* PROPERTY TYPE */}
            {showPropertyType && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3" 
                data-field-key="property_type"
              >
                <label id="property_type_label" className="text-xs sm:text-sm font-black text-slate-800 flex flex-wrap items-center gap-1.5 uppercase tracking-wider">
                  <span>Welche Art von Eigenheim interessiert dich?</span>
                  <span className="text-rose-500" aria-hidden="true">*</span>
                  <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md ml-auto normal-case tracking-normal">Mehrfachauswahl möglich</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="group" aria-labelledby="property_type_label">
                  {PROPERTY_TYPE_OPTIONS.map((opt) => {
                    const isSelected = formData.step_1_property_goal.property_type.includes(opt.value);
                    const isError = validationTriggered && errors.property_type;
                    return (
                      <motion.button
                        type="button"
                        key={opt.value}
                        onClick={() => handleMultiSelectToggle('step_1_property_goal', 'property_type', opt.value)}
                        aria-pressed={isSelected}
                        animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                            : isError
                              ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                              : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                        }`}
                      >
                        <span className="text-xs sm:text-sm leading-relaxed pr-2 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                        <span className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300 bg-white group-hover:border-slate-450'
                        }`}>
                          <AnimatePresence>
                            {isSelected && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                                className="flex items-center justify-center"
                              >
                                <Check size={11} strokeWidth={4.5} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
                {renderInlineConfirm('property_type')}
                {validationTriggered && errors.property_type && (
                  <div className="text-rose-600 text-xs font-bold leading-tight mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                    <AlertCircle size={13} className="flex-shrink-0" />
                    <span>{errors.property_type}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* BUYING TIMELINE */}
            {showBuyingTimeline && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3" 
                data-field-key="buying_timeline"
              >
                <label id="buying_timeline_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                  <span>Wann möchtest du dein Eigenheim realisieren?</span>
                  <span className="text-rose-500" aria-hidden="true">*</span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-labelledby="buying_timeline_label">
                  {BUYING_TIMELINE_OPTIONS.map((opt) => {
                    const isSelected = formData.step_1_property_goal.buying_timeline === opt.value;
                    const isError = validationTriggered && errors.buying_timeline;
                    return (
                      <motion.button
                        type="button"
                        key={opt.value}
                        onClick={() => handleSingleSelectChange('step_1_property_goal', 'buying_timeline', opt.value)}
                        aria-checked={isSelected}
                        role="radio"
                        animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={`p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                            : isError
                              ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                              : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                        }`}
                      >
                        <span className="text-xs sm:text-sm leading-relaxed pr-2 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                          isSelected
                            ? 'border-blue-600 bg-blue-600 text-white'
                            : 'border-slate-300 bg-white group-hover:border-slate-450'
                        }`}>
                          <AnimatePresence>
                            {isSelected && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                                className="flex items-center justify-center"
                              >
                                <Check size={11} strokeWidth={4.5} />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
                {renderInlineConfirm('buying_timeline')}
                {validationTriggered && errors.buying_timeline && (
                  <div className="text-rose-600 text-xs font-bold leading-tight mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                    <AlertCircle size={13} className="flex-shrink-0" />
                    <span>{errors.buying_timeline}</span>
                  </div>
                )}
              </motion.div>
            )}

            {/* ACTION DOCK */}
            {showActionDock && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`pt-6 mt-8 border-t border-slate-150 z-30 transition-all duration-200 ${
                  !isInputFocused 
                    ? 'sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-4 px-6 -mx-6 sm:-mx-0 sm:px-0 sm:py-0 sm:relative sm:bg-transparent sm:backdrop-blur-none sm:border-t-0 shadow-[0_-8px_24px_-10px_rgba(0,0,0,0.08)] sm:shadow-none' 
                    : 'relative bg-transparent border-t-0 py-0 px-0 sm:relative'
                }`}
              >
                <button
                  type="button"
                  onClick={handleNext}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-4 px-6 rounded-xl shadow-lg shadow-blue-100/80 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer outline-none focus:ring-3 focus:ring-blue-400 min-h-[48px]"
                >
                  <span>Weiter zur Machbarkeit</span>
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* STEP 2: FINANZIELLE AUSGANGSLAGE */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="space-y-6 sm:space-y-8"
          >
            
            {/* EMPLOYMENT STATUS */}
            <div className="space-y-3" data-field-key="employment_status">
              <label id="employment_status_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                <span>Wie ist deine aktuelle Erwerbssituation?</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-labelledby="employment_status_label">
                {EMPLOYMENT_STATUS_OPTIONS.map((opt) => {
                  const isSelected = formData.step_2_financial_situation.employment_status === opt.value;
                  const isError = validationTriggered && errors.employment_status;
                  return (
                    <motion.button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_2_financial_situation', 'employment_status', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                          : isError
                            ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                      }`}
                    >
                      <span className="text-xs sm:text-sm leading-relaxed pr-2 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 12 }}
                              className="flex items-center justify-center"
                            >
                              <Check size={11} strokeWidth={4.5} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {renderInlineConfirm('employment_status')}
              {validationTriggered && errors.employment_status && (
                <div className="text-rose-600 text-xs font-bold leading-none mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.employment_status}</span>
                </div>
              )}
            </div>

            {/* OWN FUNDS RANGE */}
            <div className="space-y-3" data-field-key="own_funds_range">
              <label id="own_funds_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                <span>Wie viel Eigenkapital steht dir ungefähr zur Verfügung?</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-labelledby="own_funds_label">
                {OWN_FUNDS_OPTIONS.map((opt) => {
                  const isSelected = formData.step_2_financial_situation.own_funds_range === opt.value;
                  const isError = validationTriggered && errors.own_funds_range;
                  return (
                    <motion.button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_2_financial_situation', 'own_funds_range', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                          : isError
                            ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                      }`}
                    >
                      <span className="text-xs sm:text-sm leading-relaxed pr-2 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 12 }}
                              className="flex items-center justify-center"
                            >
                              <Check size={11} strokeWidth={4.5} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {renderInlineConfirm('own_funds_range')}
              {validationTriggered && errors.own_funds_range && (
                <div className="text-rose-600 text-xs font-bold leading-none mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.own_funds_range}</span>
                </div>
              )}
            </div>

            {/* FINANCING STATUS */}
            <div className="space-y-3" data-field-key="financing_status">
              <label id="financing_checked_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                <span>Hast du deine Finanzierung bereits geprüft?</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              
              <div className="grid grid-cols-1 gap-2.5" role="radiogroup" aria-labelledby="financing_checked_label">
                {FINANCING_STATUS_OPTIONS.map((opt) => {
                  const isSelected = formData.step_2_financial_situation.financing_status === opt.value;
                  const isError = validationTriggered && errors.financing_status;
                  return (
                    <motion.button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_2_financial_situation', 'financing_status', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`w-full p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                          : isError
                            ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                      }`}
                    >
                      <span className="text-xs sm:text-sm leading-relaxed pr-3 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 12 }}
                              className="flex items-center justify-center"
                            >
                              <Check size={11} strokeWidth={4.5} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {renderInlineConfirm('financing_status')}
              {validationTriggered && errors.financing_status && (
                <div className="text-rose-600 text-xs font-bold leading-none mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.financing_status}</span>
                </div>
              )}
            </div>

            {/* HOUSEHOLD INCOME RANGE */}
            <div className="space-y-3" data-field-key="household_income_range">
              <label id="household_income_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <span>Wie hoch ist ungefähr dein monatliches Brutto-Haushaltseinkommen?</span>
                <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md ml-auto normal-case tracking-normal">optional</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-labelledby="household_income_label">
                {HOUSEHOLD_INCOME_OPTIONS.map((opt) => {
                  const isSelected = formData.step_2_financial_situation.household_income_range === opt.value;
                  return (
                    <motion.button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_2_financial_situation', 'household_income_range', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                          : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                      }`}
                    >
                      <span className="text-xs sm:text-sm leading-relaxed pr-2 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 12 }}
                              className="flex items-center justify-center"
                            >
                              <Check size={11} strokeWidth={4.5} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {renderInlineConfirm('household_income_range')}
            </div>

            {/* TRUSTWORTHY FOOTER BOX */}
            <div className="bg-slate-50 border border-slate-150/75 p-5 rounded-2xl text-xs font-semibold text-slate-500 leading-relaxed flex gap-3 items-start shadow-sm mt-2">
              <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                Ungefähre Angaben reichen. Es handelt sich nicht um eine verbindliche Finanzierungsprüfung.
              </span>
            </div>

            {/* ACTION DOCK */}
            <div className={`pt-6 mt-8 border-t border-slate-150 z-30 transition-all duration-200 ${
              !isInputFocused 
                ? 'sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-4 px-6 -mx-6 sm:-mx-0 sm:px-0 sm:py-0 sm:relative sm:bg-transparent sm:backdrop-blur-none sm:border-t-0 shadow-[0_-8px_24px_-10px_rgba(0,0,0,0.08)] sm:shadow-none' 
                : 'relative bg-transparent border-t-0 py-0 px-0 sm:relative'
            } grid grid-cols-3 gap-3`}>
              <button
                type="button"
                onClick={handleBack}
                className="col-span-1 bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 font-bold text-xs sm:text-sm py-4 rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer group outline-none focus:ring-3 focus:ring-slate-300 min-h-[48px]"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>Zurück</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm py-4 rounded-xl shadow-lg shadow-blue-100/80 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer outline-none focus:ring-3 focus:ring-blue-400 min-h-[48px]"
              >
                <span>Weiter zur Region</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: REGION UND PERSÖNLICHE SITUATION */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="space-y-6 sm:space-y-8"
          >
            
            {/* CANTON SELECT */}
            <div className="space-y-3" data-field-key="canton">
              <label htmlFor="canton_select" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                <span>In welchem Kanton wohnst du aktuell?</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              
              <div className="relative">
                <select
                  id="canton_select"
                  value={formData.step_3_region_profile.canton}
                  onChange={(e) => handleSingleSelectChange('step_3_region_profile', 'canton', e.target.value)}
                  className={`w-full bg-white border rounded-xl p-4 text-base sm:text-sm font-bold focus:border-blue-600 outline-none transition-all text-slate-800 focus:ring-2 focus:ring-blue-600/20 appearance-none min-h-[50px] cursor-pointer ${
                    validationTriggered && errors.canton ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <option value="">Bitte auswählen...</option>
                  {CANTON_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {renderInlineConfirm('canton')}
              {validationTriggered && errors.canton && (
                <div className="text-rose-600 text-xs font-bold leading-none mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.canton}</span>
                </div>
              )}
            </div>

            {/* ZIP CODE */}
            <div className="space-y-3" data-field-key="zip_code">
              <label htmlFor="zip_code_input" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                <span>Deine Postleitzahl</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              
              <input
                id="zip_code_input"
                type="text"
                pattern="[0-9]*"
                inputMode="numeric"
                maxLength={4}
                autoComplete="postal-code"
                placeholder="z.B. 9000"
                value={formData.step_3_region_profile.zip_code}
                onChange={(e) => handleTextChange('step_3_region_profile', 'zip_code', e.target.value.replace(/[^0-9]/g, ''))}
                className={`w-full bg-white border rounded-xl p-4 text-base sm:text-sm font-bold focus:border-blue-600 outline-none transition-all text-slate-800 focus:ring-2 focus:ring-blue-600/20 placeholder:text-slate-350 min-h-[50px] ${
                  validationTriggered && errors.zip_code ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              />
              {renderInlineConfirm('zip_code')}
              {validationTriggered && errors.zip_code && (
                <div className="text-rose-600 text-xs font-bold leading-none mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.zip_code}</span>
                </div>
              )}
            </div>

            {/* PREFERRED REGION CANTON CARDS */}
            <div className="space-y-3" data-field-key="preferred_region">
              <label id="preferred_region_label" className="text-xs sm:text-sm font-black text-slate-800 flex flex-wrap items-center gap-1.5 uppercase tracking-wider">
                <span>In welcher Region möchtest du ein Eigenheim realisieren?</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
                <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md ml-auto normal-case tracking-normal">Mehrfachauswahl möglich</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="group" aria-labelledby="preferred_region_label">
                {PREFERRED_REGION_OPTIONS.map((opt) => {
                  const isSelected = formData.step_3_region_profile.preferred_region.includes(opt.value);
                  const isError = validationTriggered && errors.preferred_region;
                  return (
                    <motion.button
                      type="button"
                      key={opt.value}
                      onClick={() => handleMultiSelectToggle('step_3_region_profile', 'preferred_region', opt.value)}
                      aria-pressed={isSelected}
                      animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                          : isError
                            ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                      }`}
                    >
                      <span className="text-xs sm:text-sm leading-relaxed pr-2 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      <span className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 12 }}
                              className="flex items-center justify-center"
                            >
                              <Check size={11} strokeWidth={4.5} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {renderInlineConfirm('preferred_region')}
              {validationTriggered && errors.preferred_region && (
                <div className="text-rose-600 text-xs font-bold leading-none mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.preferred_region}</span>
                </div>
              )}
            </div>

            {/* AGE RANGE OPTIONS */}
            <div className="space-y-3" data-field-key="age_range">
              <label id="age_range_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                <span>Wie alt bist du?</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2" role="radiogroup" aria-labelledby="age_range_label">
                {AGE_RANGE_OPTIONS.map((opt) => {
                  const isSelected = formData.step_3_region_profile.age_range === opt.value;
                  const isError = validationTriggered && errors.age_range;
                  return (
                    <motion.button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_3_region_profile', 'age_range', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      animate={isSelected && !prefersReduced ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`p-3.5 rounded-xl text-center transition-all border outline-none active:scale-[0.99] cursor-pointer text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                          : isError
                            ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-450'
                            : 'border-slate-200/95 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              {renderInlineConfirm('age_range')}
              {validationTriggered && errors.age_range && (
                <div className="text-rose-600 text-xs font-bold leading-none mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.age_range}</span>
                </div>
              )}
            </div>

            {/* CURRENT SITUATION */}
            <div className="space-y-3" data-field-key="current_situation">
              <label id="current_situation_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                <span>Wie wohnst du aktuell?</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-labelledby="current_situation_label">
                {CURRENT_SITUATION_OPTIONS.map((opt) => {
                  const isSelected = formData.step_3_region_profile.current_situation === opt.value;
                  const isError = validationTriggered && errors.current_situation;
                  return (
                    <motion.button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_3_region_profile', 'current_situation', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                          : isError
                            ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                      }`}
                    >
                      <span className="text-xs sm:text-sm leading-relaxed pr-2 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 12 }}
                              className="flex items-center justify-center"
                            >
                              <Check size={11} strokeWidth={4.5} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {renderInlineConfirm('current_situation')}
              {validationTriggered && errors.current_situation && (
                <div className="text-rose-600 text-xs font-bold leading-none mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.current_situation}</span>
                </div>
              )}
            </div>

            {/* TRUSTWORTHY REGIONAL FOOTER */}
            <div className="bg-slate-50 border border-slate-150/75 p-5 rounded-2xl text-xs font-semibold text-slate-500 leading-relaxed flex gap-3 items-start shadow-sm mt-2">
              <MapPin size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                EigenheimNavi richtet sich besonders an Personen mit Eigenheimwunsch in der Ostschweiz.
              </span>
            </div>

            {/* ACTION DOCK */}
            <div className={`pt-6 mt-8 border-t border-slate-150 z-30 transition-all duration-200 ${
              !isInputFocused 
                ? 'sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-4 px-6 -mx-6 sm:-mx-0 sm:px-0 sm:py-0 sm:relative sm:bg-transparent sm:backdrop-blur-none sm:border-t-0 shadow-[0_-8px_24px_-10px_rgba(0,0,0,0.08)] sm:shadow-none' 
                : 'relative bg-transparent border-t-0 py-0 px-0 sm:relative'
            } grid grid-cols-3 gap-3`}>
              <button
                type="button"
                onClick={handleBack}
                className="col-span-1 bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 font-bold text-xs sm:text-sm py-4 rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer group outline-none focus:ring-3 focus:ring-slate-300 min-h-[48px]"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>Zurück</span>
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm py-4 rounded-xl shadow-lg shadow-blue-100/80 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-1.5 cursor-pointer outline-none focus:ring-3 focus:ring-blue-400 min-h-[48px]"
              >
                <span>Weiter zur persönlichen Einschätzung</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: KONTAKTANGABEN */}
        {step === 4 && (
          <motion.div
            key="step-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="space-y-6 sm:space-y-8"
          >
            
            {/* FIRST NAME AND LAST NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2.5" data-field-key="first_name">
                <label htmlFor="first_name_input" className="text-xs font-black text-slate-800 uppercase tracking-wide">Vorname <span className="text-rose-500">*</span></label>
                <input
                  id="first_name_input"
                  type="text"
                  autoComplete="given-name"
                  placeholder="Max"
                  value={formData.step_4_contact.first_name}
                  onChange={(e) => handleTextChange('step_4_contact', 'first_name', e.target.value)}
                  className={`w-full bg-white border rounded-xl p-4 text-base sm:text-sm font-bold focus:border-blue-600 outline-none transition-all focus:ring-2 focus:ring-blue-600/20 text-slate-800 min-h-[48px] ${
                    validationTriggered && errors.first_name ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                {renderInlineConfirm('first_name')}
                {validationTriggered && errors.first_name && (
                  <p className="text-rose-600 text-xs font-bold leading-tight mt-1 flex items-center gap-1 animate-fade-in" role="alert">{errors.first_name}</p>
                )}
              </div>
              <div className="space-y-2.5" data-field-key="last_name">
                <label htmlFor="last_name_input" className="text-xs font-black text-slate-800 uppercase tracking-wide">Nachname <span className="text-rose-500">*</span></label>
                <input
                  id="last_name_input"
                  type="text"
                  autoComplete="family-name"
                  placeholder="Muster"
                  value={formData.step_4_contact.last_name}
                  onChange={(e) => handleTextChange('step_4_contact', 'last_name', e.target.value)}
                  className={`w-full bg-white border rounded-xl p-4 text-base sm:text-sm font-bold focus:border-blue-600 outline-none transition-all focus:ring-2 focus:ring-blue-600/20 text-slate-800 min-h-[48px] ${
                    validationTriggered && errors.last_name ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                {renderInlineConfirm('last_name')}
                {validationTriggered && errors.last_name && (
                  <p className="text-rose-600 text-xs font-bold leading-tight mt-1 flex items-center gap-1 animate-fade-in" role="alert">{errors.last_name}</p>
                )}
              </div>
            </div>

            {/* EMAIL AND PHONE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2.5" data-field-key="email">
                <label htmlFor="email_input" className="text-xs font-black text-slate-800 uppercase tracking-wide">E-Mail-Adresse <span className="text-rose-500">*</span></label>
                <input
                  id="email_input"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="max@beispiel.ch"
                  value={formData.step_4_contact.email}
                  onChange={(e) => handleTextChange('step_4_contact', 'email', e.target.value)}
                  className={`w-full bg-white border rounded-xl p-4 text-base sm:text-sm font-bold focus:border-blue-600 outline-none transition-all focus:ring-2 focus:ring-blue-600/20 text-slate-800 min-h-[48px] ${
                    validationTriggered && errors.email ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                {renderInlineConfirm('email')}
                {validationTriggered && errors.email && (
                  <p className="text-rose-600 text-xs font-bold leading-tight mt-1 flex items-center gap-1 animate-fade-in" role="alert">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2.5" data-field-key="phone">
                <label htmlFor="phone_input" className="text-xs font-black text-slate-800 uppercase tracking-wide">Telefonnummer <span className="text-rose-500">*</span></label>
                <input
                  id="phone_input"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="079 123 45 67"
                  value={formData.step_4_contact.phone}
                  onChange={(e) => handleTextChange('step_4_contact', 'phone', e.target.value)}
                  className={`w-full bg-white border rounded-xl p-4 text-base sm:text-sm font-bold focus:border-blue-600 outline-none transition-all focus:ring-2 focus:ring-blue-600/20 text-slate-800 min-h-[48px] ${
                    validationTriggered && errors.phone ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-1">Wir melden uns telefonisch bei dir. Deine Telefonnummer verwenden wir nur zur Bearbeitung deiner Anfrage.</p>
                {renderInlineConfirm('phone')}
                {validationTriggered && errors.phone && (
                  <p className="text-rose-600 text-xs font-bold leading-tight mt-1 flex items-center gap-1 animate-fade-in" role="alert">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* CONSULTATION INTEREST */}
            <div className="space-y-3" data-field-key="consultation_interest">
              <label id="consultation_interest_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                <span>Möchtest du eine persönliche Einschätzung?</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              
              <div className="grid grid-cols-1 gap-2.5" role="radiogroup" aria-labelledby="consultation_interest_label">
                {CONSULTATION_INTEREST_OPTIONS.map((opt) => {
                  const isSelected = formData.step_4_contact.consultation_interest === opt.value;
                  const isError = validationTriggered && errors.consultation_interest;
                  return (
                    <motion.button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_4_contact', 'consultation_interest', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      animate={isSelected && !prefersReduced ? { scale: [1, 1.03, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`w-full p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                          : isError
                            ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-400'
                            : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                      }`}
                    >
                      <span className="text-xs sm:text-sm leading-relaxed pr-3 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white scale-110'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        <AnimatePresence>
                          {isSelected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              transition={{ type: "spring", stiffness: 400, damping: 12 }}
                              className="flex items-center justify-center"
                            >
                              <Check size={11} strokeWidth={4.5} />
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </span>
                    </motion.button>
                  );
                })}
              </div>
              {renderInlineConfirm('consultation_interest')}
              {validationTriggered && errors.consultation_interest && (
                <div className="text-rose-600 text-xs font-bold leading-none mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.consultation_interest}</span>
                </div>
              )}
            </div>

            {/* PREFERRED CONTACT TIME */}
            <div className="space-y-3" data-field-key="preferred_contact_time">
              <label id="contact_time_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                <span>Wann bist du am besten erreichbar?</span>
                <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md ml-auto normal-case tracking-normal">optional</span>
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" role="radiogroup" aria-labelledby="contact_time_label">
                {PREFERRED_CONTACT_TIME_OPTIONS.map((opt) => {
                  const isSelected = formData.step_4_contact.preferred_contact_time === opt.value;
                  return (
                    <motion.button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_4_contact', 'preferred_contact_time', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      animate={isSelected && !prefersReduced ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={`p-2.5 rounded-xl text-center transition-all border outline-none active:scale-[0.99] cursor-pointer text-xs focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white scale-105 shadow-sm font-bold'
                          : 'border-slate-200 bg-white text-slate-650 hover:border-slate-350 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </motion.button>
                  );
                })}
              </div>
              {renderInlineConfirm('preferred_contact_time')}
            </div>

            {/* MESSAGE TEXTAREA */}
            <div className="space-y-2.5" data-field-key="message">
              <label htmlFor="message_textarea" className="text-xs font-black text-slate-800 uppercase tracking-wide">Gibt es etwas, das wir vorab wissen sollten? <span className="text-[10px] font-extrabold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md normal-case tracking-normal">optional</span></label>
              <textarea
                id="message_textarea"
                placeholder="Zum Beispiel: Wunschregion, vorhandenes Eigenkapital, geplantes Kaufdatum oder konkrete Fragen."
                maxLength={1000}
                value={formData.step_4_contact.message}
                onChange={(e) => handleTextChange('step_4_contact', 'message', e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-base sm:text-sm font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all placeholder:text-slate-350 min-h-[100px] max-h-[220px] text-slate-800 leading-relaxed"
              />
              {renderInlineConfirm('message')}
            </div>

            {/* CONSENTS AND AGREEMENTS */}
            <div className="space-y-4 pt-2">
              
              {/* PRIVACY CONSENT */}
              <div data-field-key="privacy_consent" className="space-y-1.5">
                <label className="flex items-start gap-4 cursor-pointer select-none group py-1.5">
                  <div className="relative flex items-center">
                    <input
                      id="privacy_consent_cb"
                      type="checkbox"
                      checked={formData.step_4_contact.privacy_consent}
                      onChange={(e) => handleTextChange('step_4_contact', 'privacy_consent', e.target.checked)}
                      className={`w-5 h-5 rounded border-2 text-blue-600 focus:ring-blue-550 cursor-pointer ${
                        validationTriggered && errors.privacy_consent ? 'border-rose-450 bg-rose-50' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold leading-relaxed group-hover:text-slate-800 transition-colors">
                    Ich bin einverstanden, dass meine Angaben zur Bearbeitung meiner Anfrage und zur Kontaktaufnahme verwendet werden. *
                  </span>
                </label>
                {validationTriggered && errors.privacy_consent && (
                  <p className="text-rose-600 text-xs font-bold leading-tight mt-1 flex items-center gap-1 animate-fade-in" role="alert">{errors.privacy_consent}</p>
                )}
              </div>

              {/* MARKETING CONSENT */}
              <div className="space-y-1.5">
                <label className="flex items-start gap-4 cursor-pointer select-none group py-1.5">
                  <div className="relative flex items-center">
                    <input
                      id="marketing_consent_cb"
                      type="checkbox"
                      checked={formData.step_4_contact.marketing_consent}
                      onChange={(e) => handleTextChange('step_4_contact', 'marketing_consent', e.target.checked)}
                      className="w-5 h-5 rounded border-2 border-slate-300 text-blue-600 focus:ring-blue-550 cursor-pointer"
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-semibold leading-relaxed group-hover:text-slate-800 transition-colors">
                    Ich möchte gelegentlich wertvolle Informationen rund um Eigenheim, Finanzierung und Ostschweizer Immobilien erhalten.
                  </span>
                </label>
              </div>
              
              {/* PRIVACY NOTICE AND CREDIT */}
              <div className="flex gap-2.5 items-center mt-3 text-[10px] text-slate-400 font-black uppercase tracking-wider border-t border-slate-100 pt-4">
                <Lock size={12} className="text-slate-350" />
                <span>Deine Angaben werden vertraulich behandelt.</span>
              </div>
            </div>

            {submitError && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-rose-700 text-xs font-bold leading-relaxed flex gap-2.5 items-start animate-fade-in" role="alert">
                <AlertCircle size={16} className="text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            {/* ACTION DOCK & STICKY NAVIGATION AREA */}
            <div className={`pt-6 mt-8 border-t border-slate-150 z-30 transition-all duration-200 ${
              !isInputFocused 
                ? 'sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-4 px-6 -mx-6 sm:-mx-0 sm:px-0 sm:py-0 sm:relative sm:bg-transparent sm:backdrop-blur-none sm:border-t-0 shadow-[0_-8px_24px_-10px_rgba(0,0,0,0.08)] sm:shadow-none' 
                : 'relative bg-transparent border-t-0 py-0 px-0 sm:relative'
            } grid grid-cols-3 gap-3`}>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleBack}
                className="col-span-1 bg-slate-100/80 hover:bg-slate-200/80 text-slate-600 font-bold text-xs sm:text-sm py-4 rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer group outline-none focus:ring-3 focus:ring-slate-300 min-h-[48px]"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>Zurück</span>
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="col-span-2 bg-[#F87101] hover:bg-[#e06101] text-white font-black text-xs sm:text-sm py-4 rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer outline-none focus:ring-3 focus:ring-orange-400 min-h-[48px]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Wird gesendet...</span>
                  </>
                ) : (
                  <>
                    <span>Kostenlosen Check jetzt abschliessen</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>

            {/* TRUST SIGNALS & EXPECTATION CONTROL BEFORE SUBMITTING */}
            <div className="bg-gradient-to-br from-blue-50/50 to-amber-50/20 border border-blue-100/60 rounded-2xl p-5 space-y-4 mt-8 shadow-sm">
              {/* Star Rating & Stat */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-150/50">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-extrabold text-slate-800">4.9 / 5 Sterne</span>
                </div>
                <span className="text-[11px] font-black text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/40">
                  Über 5'000 begleitete Paare in der Schweiz
                </span>
              </div>

              {/* Next Steps Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F87101]" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Was passiert nach dem Absenden?</h4>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800">1. Kostenlose Analyse</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Wir prüfen deine Angaben vertraulich und berechnen deine reale Machbarkeit.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800">2. Einschätzung in 1-2 Tagen</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Du erhältst deine ehrliche und transparente Einschätzung direkt per Telefon.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 sm:col-span-2 border-t border-slate-100 pt-2.5">
                    <div className="w-5 h-5 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} strokeWidth={3} />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-800">3. 100% unverbindlich & kein Verkaufsdruck</p>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">Keine Abopflicht, keine versteckten Gebühren. Du entscheidest selbst, ob du weitermachen möchtest.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* MINI TESTIMONIAL BANNER */}
              <div className="border-t border-slate-100 pt-3 flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200">
                  <img referrerPolicy="no-referrer" src="https://raw.githubusercontent.com/yathur-hub/EigenheimNavi-BrandAssets/main/Buob-Familie.jpg" alt="Familie Buob" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-800 block">Familie Buob, Ostschweiz</span>
                  <p className="text-[10px] text-slate-500 font-semibold leading-normal italic">
                    "Der Realitätscheck gab uns endlich Klarheit. Kein Verkaufsdruck, sondern ein ehrliches, professionelles Gespräch auf Augenhöhe."
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </form>
    </div>
  );
};

export default BookingForm;
