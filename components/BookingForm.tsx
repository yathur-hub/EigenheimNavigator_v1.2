import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
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

interface BookingFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  variant?: 'modal' | 'inline';
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

const SCHEDULER_LINK = "https://calendly.com/";

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onClose, title, subtitle, variant = 'inline' }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
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
      element.scrollIntoView({
        behavior: 'smooth',
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
      headerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      setStep((prev) => {
        const next = (prev + 1) as 1 | 2 | 3 | 4;
        return next;
      });
      setValidationTriggered(false);
      // Wait for React to transition steps before scrolling
      setTimeout(scrollToTop, 50);
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
    
    const step4Errors = validateStep4(formData);
    setErrors(step4Errors);

    if (Object.keys(step4Errors).length > 0) {
      console.warn("Validation failed for step 4", step4Errors);
      setTimeout(() => {
        scrollToFirstError(step4Errors);
      }, 100);
      return;
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
    
    // Remove validation errors immediately upon user entering correct values
    if (errors[key]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
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

  return (
    <div className="flex flex-col w-full text-slate-900" ref={headerRef}>
      
      {/* 1. PROGRESS STATUS BLOCK */}
      <div className="mb-6 sm:mb-8" id="step_header">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-xs font-black bg-blue-50 text-blue-700 px-3 py-1 rounded-full uppercase tracking-wider">
            Schritt {step} von 4
          </span>
          <span className="text-[10px] sm:text-xs font-black text-blue-600/90 tracking-wide bg-blue-50/50 px-2.5 py-1 rounded-full">
            {currentProgressPercentText()}
          </span>
        </div>
        
        {/* Progress bar with smooth motion */}
        <div className="relative h-2 w-full bg-slate-100/80 rounded-full overflow-hidden border border-slate-200/40">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-inner"
            initial={{ width: `${(step - 1) * 25}%` }}
            animate={{ width: `${step * 25}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
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
      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8" noValidate>
        
        {/* STEP 1: EIGENHEIMWUNSCH CARD SELECTIONS */}
        {step === 1 && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_1_property_goal', 'property_goal', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
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
                          ? 'border-blue-600 bg-blue-600 text-white scale-110'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={4.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {validationTriggered && errors.property_goal && (
                <div className="text-rose-600 text-xs font-bold leading-tight mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.property_goal}</span>
                </div>
              )}
            </div>

            {/* PROPERTY TYPE */}
            <div className="space-y-3" data-field-key="property_type">
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleMultiSelectToggle('step_1_property_goal', 'property_type', opt.value)}
                      aria-pressed={isSelected}
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
                          ? 'border-blue-600 bg-blue-600 text-white scale-105'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={4.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {validationTriggered && errors.property_type && (
                <div className="text-rose-600 text-xs font-bold leading-tight mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.property_type}</span>
                </div>
              )}
            </div>

            {/* BUYING TIMELINE */}
            <div className="space-y-3" data-field-key="buying_timeline">
              <label id="buying_timeline_label" className="text-xs sm:text-sm font-black text-slate-800 flex items-center gap-1 uppercase tracking-wider">
                <span>Wann möchtest du dein Eigenheim realisieren?</span>
                <span className="text-rose-500" aria-hidden="true">*</span>
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5" role="radiogroup" aria-labelledby="buying_timeline_label">
                {BUYING_TIMELINE_OPTIONS.map((opt) => {
                  const isSelected = formData.step_1_property_goal.buying_timeline === opt.value;
                  const isError = validationTriggered && errors.buying_timeline;
                  return (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_1_property_goal', 'buying_timeline', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
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
                          ? 'border-blue-600 bg-blue-600 text-white scale-110'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={4.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>
              {validationTriggered && errors.buying_timeline && (
                <div className="text-rose-600 text-xs font-bold leading-tight mt-1.5 flex items-center gap-1.5 animate-fade-in" role="alert">
                  <AlertCircle size={13} className="flex-shrink-0" />
                  <span>{errors.buying_timeline}</span>
                </div>
              )}
            </div>

            {/* ACTION DOCK */}
            <div className="pt-4 sticky bottom-0 bg-white border-t border-slate-100 py-3 px-4 -mx-6 sm:mx-0 sm:px-0 sm:border-0 sm:relative sm:-mb-2 z-20">
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-4 px-6 rounded-xl shadow-lg shadow-blue-100/80 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer outline-none focus:ring-3 focus:ring-blue-400 min-h-[48px]"
              >
                <span>Weiter zur Machbarkeit</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: FINANZIELLE AUSGANGSLAGE */}
        {step === 2 && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_2_financial_situation', 'employment_status', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
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
                          ? 'border-blue-600 bg-blue-600 text-white scale-110'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={4.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_2_financial_situation', 'own_funds_range', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
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
                          ? 'border-blue-600 bg-blue-600 text-white scale-110'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={4.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_2_financial_situation', 'financing_status', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
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
                        {isSelected && <Check size={11} strokeWidth={4.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_2_financial_situation', 'household_income_range', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      className={`p-4 rounded-xl text-left transition-all border outline-none flex items-center justify-between active:scale-[0.99] cursor-pointer min-h-[50px] group focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/10 text-blue-900 font-bold shadow-sm shadow-blue-50/15'
                          : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50/30 font-medium'
                      }`}
                    >
                      <span className="text-xs sm:text-sm leading-relaxed pr-2 group-hover:text-slate-900 transition-colors">{opt.label}</span>
                      <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white scale-110'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={4.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TRUSTWORTHY FOOTER BOX */}
            <div className="bg-slate-50 border border-slate-150/75 p-5 rounded-2xl text-xs font-semibold text-slate-500 leading-relaxed flex gap-3 items-start shadow-sm mt-2">
              <Info size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <span>
                Ungefähre Angaben reichen. Es handelt sich nicht um eine verbindliche Finanzierungsprüfung.
              </span>
            </div>

            {/* ACTION DOCK */}
            <div className="pt-4 sticky bottom-0 bg-white border-t border-slate-100 py-3 px-4 -mx-6 sm:mx-0 sm:px-0 sm:border-0 sm:relative sm:-mb-2 z-20 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="col-span-1 border border-slate-200 hover:border-slate-350 text-slate-600 font-bold text-xs sm:text-sm py-4 rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] bg-white cursor-pointer group outline-none focus:ring-3 focus:ring-slate-300 min-h-[48px]"
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
          </div>
        )}

        {/* STEP 3: REGION UND PERSÖNLICHE SITUATION */}
        {step === 3 && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            
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
                  className={`w-full bg-white border rounded-xl p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none transition-all text-slate-800 focus:ring-2 focus:ring-blue-600/20 appearance-none min-h-[50px] cursor-pointer ${
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
                placeholder="z.B. 9000"
                value={formData.step_3_region_profile.zip_code}
                onChange={(e) => handleTextChange('step_3_region_profile', 'zip_code', e.target.value.replace(/[^0-9]/g, ''))}
                className={`w-full bg-white border rounded-xl p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none transition-all text-slate-800 focus:ring-2 focus:ring-blue-600/20 placeholder:text-slate-350 min-h-[50px] ${
                  validationTriggered && errors.zip_code ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              />
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleMultiSelectToggle('step_3_region_profile', 'preferred_region', opt.value)}
                      aria-pressed={isSelected}
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
                          ? 'border-blue-600 bg-blue-600 text-white scale-105'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={4.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_3_region_profile', 'age_range', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      className={`p-3.5 rounded-xl text-center transition-all border outline-none active:scale-[0.99] cursor-pointer text-xs sm:text-sm font-bold focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white shadow-md'
                          : isError
                            ? 'border-rose-300 bg-rose-50/10 text-slate-700 hover:border-rose-450'
                            : 'border-slate-200/95 bg-white text-slate-700 hover:border-slate-350 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_3_region_profile', 'current_situation', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
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
                          ? 'border-blue-600 bg-blue-600 text-white scale-110'
                          : 'border-slate-300 bg-white group-hover:border-slate-450'
                      }`}>
                        {isSelected && <Check size={11} strokeWidth={4.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>
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
            <div className="pt-4 sticky bottom-0 bg-white border-t border-slate-100 py-3 px-4 -mx-6 sm:mx-0 sm:px-0 sm:border-0 sm:relative sm:-mb-2 z-20 grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="col-span-1 border border-slate-200 hover:border-slate-350 text-slate-600 font-bold text-xs sm:text-sm py-4 rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] bg-white cursor-pointer group outline-none focus:ring-3 focus:ring-slate-300 min-h-[48px]"
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
          </div>
        )}

        {/* STEP 4: KONTAKTANGABEN */}
        {step === 4 && (
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            
            {/* FIRST NAME AND LAST NAME */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2.5" data-field-key="first_name">
                <label htmlFor="first_name_input" className="text-xs font-black text-slate-800 uppercase tracking-wide">Vorname <span className="text-rose-500">*</span></label>
                <input
                  id="first_name_input"
                  type="text"
                  placeholder="Max"
                  value={formData.step_4_contact.first_name}
                  onChange={(e) => handleTextChange('step_4_contact', 'first_name', e.target.value)}
                  className={`w-full bg-white border rounded-xl p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none transition-all focus:ring-2 focus:ring-blue-600/20 text-slate-800 min-h-[48px] ${
                    validationTriggered && errors.first_name ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                {validationTriggered && errors.first_name && (
                  <p className="text-rose-600 text-xs font-bold leading-tight mt-1 flex items-center gap-1 animate-fade-in" role="alert">{errors.first_name}</p>
                )}
              </div>
              <div className="space-y-2.5" data-field-key="last_name">
                <label htmlFor="last_name_input" className="text-xs font-black text-slate-800 uppercase tracking-wide">Nachname <span className="text-rose-500">*</span></label>
                <input
                  id="last_name_input"
                  type="text"
                  placeholder="Muster"
                  value={formData.step_4_contact.last_name}
                  onChange={(e) => handleTextChange('step_4_contact', 'last_name', e.target.value)}
                  className={`w-full bg-white border rounded-xl p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none transition-all focus:ring-2 focus:ring-blue-600/20 text-slate-800 min-h-[48px] ${
                    validationTriggered && errors.last_name ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
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
                  placeholder="max@beispiel.ch"
                  value={formData.step_4_contact.email}
                  onChange={(e) => handleTextChange('step_4_contact', 'email', e.target.value)}
                  className={`w-full bg-white border rounded-xl p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none transition-all focus:ring-2 focus:ring-blue-600/20 text-slate-800 min-h-[48px] ${
                    validationTriggered && errors.email ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                {validationTriggered && errors.email && (
                  <p className="text-rose-600 text-xs font-bold leading-tight mt-1 flex items-center gap-1 animate-fade-in" role="alert">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2.5" data-field-key="phone">
                <label htmlFor="phone_input" className="text-xs font-black text-slate-800 uppercase tracking-wide">Telefonnummer <span className="text-rose-500">*</span></label>
                <input
                  id="phone_input"
                  type="tel"
                  placeholder="079 123 45 67"
                  value={formData.step_4_contact.phone}
                  onChange={(e) => handleTextChange('step_4_contact', 'phone', e.target.value)}
                  className={`w-full bg-white border rounded-xl p-4 text-xs sm:text-sm font-bold focus:border-blue-600 outline-none transition-all focus:ring-2 focus:ring-blue-600/20 text-slate-800 min-h-[48px] ${
                    validationTriggered && errors.phone ? 'border-rose-350 bg-rose-50/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                />
                <p className="text-[10px] text-slate-400 font-semibold leading-normal mt-1">Wir melden uns telefonisch bei dir. Deine Telefonnummer verwenden wir nur zur Bearbeitung deiner Anfrage.</p>
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_4_contact', 'consultation_interest', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
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
                        {isSelected && <Check size={11} strokeWidth={4.5} />}
                      </span>
                    </button>
                  );
                })}
              </div>
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
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => handleSingleSelectChange('step_4_contact', 'preferred_contact_time', opt.value)}
                      aria-checked={isSelected}
                      role="radio"
                      className={`p-2.5 rounded-xl text-center transition-all border outline-none active:scale-[0.99] cursor-pointer text-xs focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-600 text-white scale-105 shadow-sm font-bold'
                          : 'border-slate-200 bg-white text-slate-650 hover:border-slate-350 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
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
                className="w-full bg-white border border-slate-200 rounded-xl p-4 text-xs sm:text-sm font-semibold focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all placeholder:text-slate-350 min-h-[100px] max-h-[220px] text-slate-800 leading-relaxed"
              />
            </div>

            {/* CONSENTS AND AGREEMENTS */}
            <div className="space-y-4 pt-2">
              
              {/* PRIVACY CONSENT */}
              <div data-field-key="privacy_consent" className="space-y-1.5">
                <label className="flex items-start gap-4 cursor-pointer select-none group">
                  <div className="relative flex items-center">
                    <input
                      id="privacy_consent_cb"
                      type="checkbox"
                      checked={formData.step_4_contact.privacy_consent}
                      onChange={(e) => handleTextChange('step_4_contact', 'privacy_consent', e.target.checked)}
                      className={`w-5 h-5 rounded border-2 text-blue-600 focus:ring-blue-500 cursor-pointer ${
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
                <label className="flex items-start gap-4 cursor-pointer select-none group">
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
            <div className="pt-4 sticky bottom-0 bg-white border-t border-slate-100 py-3 px-4 -mx-6 sm:mx-0 sm:px-0 sm:border-0 sm:relative sm:-mb-2 z-20 grid grid-cols-3 gap-3">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleBack}
                className="col-span-1 border border-slate-200 hover:border-slate-350 text-slate-600 font-bold text-xs sm:text-sm py-4 rounded-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98] bg-white cursor-pointer group outline-none focus:ring-3 focus:ring-slate-300 min-h-[48px]"
              >
                <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
                <span>Zurück</span>
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="col-span-2 bg-blue-650 bg-blue-600 hover:bg-blue-750 hover:bg-blue-700 text-white font-black text-xs sm:text-sm py-4 rounded-xl shadow-lg shadow-blue-100/90 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 flex items-center justify-center gap-2 cursor-pointer outline-none focus:ring-3 focus:ring-blue-400 min-h-[48px]"
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
                    <span>Eigenheim-Check absenden</span>
                    <ArrowRight size={16} />
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
