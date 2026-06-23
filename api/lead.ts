import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Ensure we only handle POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const payload = req.body || {};

  console.log('[Vercel API Lead] Received post request with body keys:', Object.keys(payload));

  const {
    form_id,
    lead_source,
    contact,
    property_goal,
    financial_situation,
    regional_profile,
    consultation,
    consents,
    tracking,
    lead_evaluation
  } = payload;

  // Validate presence of standard request containers
  if (!contact || !property_goal || !financial_situation || !regional_profile || !consultation || !consents) {
    console.error('[Vercel API Lead] Validation failed: Missing payload containers');
    return res.status(400).json({
      error: 'Ungültige Payload-Struktur. Datencontainer fehlen.'
    });
  }

  // Validate personal contact fields
  if (
    !contact.first_name || contact.first_name.trim().length < 2 ||
    !contact.last_name || contact.last_name.trim().length < 2 ||
    !contact.email ||
    !contact.phone ||
    !consents.privacy_consent
  ) {
    console.error('[Vercel API Lead] Validation failed: Invalid contact fields or missing privacy consent', { contact, consents });
    return res.status(400).json({
      error: 'Vorname, Nachname, E-Mail-Adresse und Telefonnummer sind erforderlich. Die Datenschutzerklärung muss bestätigt werden.'
    });
  }

  // Email format validation
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);
  if (!isEmailValid) {
    return res.status(400).json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.' });
  }

  // Swiss phone validation
  const cleanedPhone = contact.phone.replace(/[^\d+]/g, '');
  let isPhoneValid = false;
  if (cleanedPhone.startsWith('+41')) {
    isPhoneValid = /^\+41[1-9]\d{8}$/.test(cleanedPhone);
  } else if (cleanedPhone.startsWith('0041')) {
    isPhoneValid = /^0041[1-9]\d{8}$/.test(cleanedPhone);
  } else if (cleanedPhone.startsWith('0')) {
    isPhoneValid = /^0[1-9]\d{8}$/.test(cleanedPhone);
  } else {
    // Basic fallback for other numbers to be resilient
    isPhoneValid = cleanedPhone.length >= 8;
  }

  if (!isPhoneValid) {
    return res.status(400).json({ error: 'Bitte geben Sie eine gültige Telefonnummer ein.' });
  }

  // ZIP Code validation (exactly 4 digits)
  const isZipValid = /^\d{4}$/.test(regional_profile.zip_code || '');
  if (!isZipValid) {
    return res.status(400).json({ error: 'Bitte geben Sie eine gültige Schweizer Postleitzahl ein.' });
  }

  // Required Single Select & Multi Select validation
  if (!property_goal.goal) {
    return res.status(400).json({ error: 'Zielauswahl für das Eigenheim ist ein Pflichtfeld.' });
  }
  if (!property_goal.property_type || !Array.isArray(property_goal.property_type) || property_goal.property_type.length === 0) {
    return res.status(400).json({ error: 'Bitte wählen Sie mindestens eine Art von Eigenheim aus.' });
  }
  if (!property_goal.buying_timeline) {
    return res.status(400).json({ error: 'Zeitraumauswahl ist ein Pflichtfeld.' });
  }
  if (!financial_situation.employment_status) {
    return res.status(400).json({ error: 'Erwerbssituation ist ein Pflichtfeld.' });
  }
  if (!financial_situation.own_funds_range) {
    return res.status(400).json({ error: 'Angabe zum Eigenkapital ist ein Pflichtfeld.' });
  }
  if (!financial_situation.financing_status) {
    return res.status(400).json({ error: 'Angabe zum Finanzierungsstatus ist ein Pflichtfeld.' });
  }
  if (!regional_profile.canton) {
    return res.status(400).json({ error: 'Angabe zum aktuellen Kanton ist ein Pflichtfeld.' });
  }
  if (!regional_profile.preferred_region || !Array.isArray(regional_profile.preferred_region) || regional_profile.preferred_region.length === 0) {
    return res.status(400).json({ error: 'Bitte wählen Sie mindestens eine bevorzugte Region aus.' });
  }
  if (!regional_profile.age_range) {
    return res.status(400).json({ error: 'Altersangabe ist ein Pflichtfeld.' });
  }
  if (!regional_profile.current_situation) {
    return res.status(400).json({ error: 'Angabe zur aktuellen Wohnsituation ist ein Pflichtfeld.' });
  }
  if (!consultation.consultation_interest) {
    return res.status(400).json({ error: 'Information über Beratungsinteresse ist ein Pflichtfeld.' });
  }
  const contactPreference = consultation.contact_preference || 'phone';
  if (!contactPreference) {
    return res.status(400).json({ error: 'Bitte wählen Sie eine bevorzugte Kontaktmethode aus.' });
  }

  // Webhook URLs (Active and fallback destinations)
  const webhookUrl = process.env.WEBHOOK_URL || 'https://mis13.app.n8n.cloud/webhook/7ff9cd84-6980-459a-8109-12799c07d4cb?t=957b1bbf705f3e384c3315842ea2be9c5eb5fe3f9680501a14de8cdb06e93b846a5d469f2c12e0b9a3fd6ad2b4c63e88a5993a267d11b5badd55c10002ffc2ba';
  const formspreeUrl = process.env.FORMSPREE_URL || 'https://formspree.io/f/mojprwpw';

  console.log(`[Vercel API Lead] Dispatching lead to Webhook (${webhookUrl}) and Formspree (${formspreeUrl})`);

  let webhookSuccess = false;
  let formspreeSuccess = false;

  let webhookErrorText = '';
  let formspreeErrorText = '';

  const germanPayload = transformPayloadToGerman(payload);

  // 1. Send complete detailed JSON payload to primary CRM / Automation Webhook
  try {
    console.log("Sending Eigenheimnavi lead to webhook:", webhookUrl);
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(germanPayload)
    });
    webhookSuccess = webhookResponse.ok;
    if (!webhookSuccess) {
      webhookErrorText = await webhookResponse.text();
      console.error('[Vercel API Lead] Primary Webhook error status:', webhookResponse.status, webhookErrorText);
    }
  } catch (error: any) {
    console.error('[Vercel API Lead] Error sending to primary Webhook:', error);
    webhookErrorText = error?.message || String(error);
  }

  // 2. Fallbacks: Send to Formspree for reliable email backup delivery
  try {
    const formspreeResponse = await fetch(formspreeUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(germanPayload)
    });
    formspreeSuccess = formspreeResponse.ok;
    if (!formspreeSuccess) {
      formspreeErrorText = await formspreeResponse.text();
    }
  } catch (error: any) {
    console.error('[Vercel API Lead] Error sending to Formspree:', error);
    formspreeErrorText = error?.message || String(error);
  }

  // Return success if at least one submission succeeded
  if (webhookSuccess || formspreeSuccess) {
    return res.status(200).json({
      success: true,
      webhookSuccess,
      formspreeSuccess
    });
  } else {
    return res.status(500).json({
      error: 'Übermittlung im Hintergrund fehlgeschlagen.',
      webhookError: webhookErrorText,
      formspreeError: formspreeErrorText
    });
  }
}

// Translate helpers for transformPayloadToGerman
function translateGoal(val: string): string {
  const map: Record<string, string> = {
    'buy_home': 'Eigenheim kaufen',
    'build_home': 'Eigenheim bauen',
    'check_feasibility': 'Machbarkeit prüfen',
    'compare_options': 'Optionen vergleichen',
    'undecided': 'Noch unentschieden'
  };
  return map[val] || val;
}

function translatePropertyType(val: any): any {
  if (Array.isArray(val)) {
    return val.map(translatePropertyType);
  }
  const map: Record<string, string> = {
    'single_family_house': 'Einfamilienhaus',
    'apartment': 'Wohnung',
    'semi_detached_house': 'Doppelhaushälfte',
    'terraced_house': 'Reihenhaus',
    'building_land': 'Bauland',
    'undecided': 'Noch unentschieden'
  };
  return map[val] || val;
}

function translateBuyingTimeline(val: string): string {
  const map: Record<string, string> = {
    'as_soon_as_possible': 'So bald wie möglich',
    'within_3_months': 'Innerhalb von 3 Monaten',
    '3_6_months': 'In 3 bis 6 Monaten',
    '6_12_months': 'In 6 bis 12 Monaten',
    'later_than_12_months': 'Später als in 12 Monaten',
    'undecided': 'Noch unklar'
  };
  return map[val] || val;
}

function translateEmploymentStatus(val: string): string {
  const map: Record<string, string> = {
    'employed_full_time': 'Vollzeit angestellt',
    'employed_part_time': 'Teilzeit angestellt',
    'self_employed': 'Selbstständig',
    'business_owner': 'Unternehmer/in',
    'retired': 'Pensioniert',
    'in_training': 'In Ausbildung',
    'unemployed': 'Nicht erwerbstätig',
    'other': 'Sonstiges'
  };
  return map[val] || val;
}

function translateOwnFundsRange(val: string): string {
  const map: Record<string, string> = {
    'under_25000': "Unter CHF 25'000",
    '25000_49999': "CHF 25'000 bis 49'999",
    '50000_99999': "CHF 50'000 bis 99'999",
    '100000_199999': "CHF 100'000 bis 199'999",
    '200000_399999': "CHF 200'000 bis 399'999",
    '400000_plus': "Über CHF 400'000",
    'prefer_not_to_say': "Keine Angabe"
  };
  return map[val] || val;
}

function translateFinancingStatus(val: string): string {
  const map: Record<string, string> = {
    'not_checked': 'Noch nicht geprüft',
    'roughly_checked': 'Grob geprüft',
    'financing_checked': 'Finanzierung geprüft',
    'mortgage_offer_available': 'Hypothekarangebot vorhanden',
    'rejected_before': 'Bereits abgelehnt worden',
    'no_starting_point': 'Weiss nicht, wo starten'
  };
  return map[val] || val;
}

function translateHouseholdIncomeRange(val: string): string {
  const map: Record<string, string> = {
    'under_6000': "Unter CHF 6'000",
    '6000_8999': "CHF 6'000 bis 8'999",
    '9000_11999': "CHF 9'000 bis 11'999",
    '12000_15999': "CHF 12'000 bis 15'999",
    '16000_19999': "CHF 16'000 bis 19'999",
    '20000_plus': "Über CHF 20'000",
    'prefer_not_to_say': "Keine Angabe"
  };
  return map[val] || val;
}

function translateCanton(val: string): string {
  const map: Record<string, string> = {
    'SG': 'St. Gallen',
    'TG': 'Thurgau',
    'GR': 'Graubünden',
    'ZH': 'Zürich',
    'AR': 'Appenzell Ausserrhoden',
    'AI': 'Appenzell Innerrhoden',
    'SH': 'Schaffhausen',
    'GL': 'Glarus',
    'SZ': 'Schwyz',
    'LU': 'Luzern',
    'AG': 'Aargau',
    'other': 'Andere Region'
  };
  return map[val] || val;
}

function translatePreferredRegion(val: any): any {
  if (Array.isArray(val)) {
    return val.map(translatePreferredRegion);
  }
  const map: Record<string, string> = {
    'st_gallen': 'Region St. Gallen',
    'rheintal': 'Rheintal',
    'thurgau': 'Thurgau',
    'graubuenden': 'Graubünden',
    'zürich': 'Zürich',
    'zurich': 'Zürich',
    'ostschweiz': 'Ostschweiz',
    'bodensee': 'Bodensee-Region',
    'appenzell': 'Appenzellerland',
    'undecided': 'Noch offen',
    'other': 'Andere Region'
  };
  return map[val] || val;
}

function translateAgeRange(val: string): string {
  const map: Record<string, string> = {
    'under_25': 'Unter 25 Jahre',
    '25_27': '25 bis 27 Jahre',
    '28_34': '28 bis 34 Jahre',
    '35_44': '35 bis 44 Jahre',
    '45_54': '45 bis 54 Jahre',
    '55_plus': 'Über 55 Jahre'
  };
  return map[val] || val;
}

function translateCurrentSituation(val: string): string {
  const map: Record<string, string> = {
    'renting': 'Zur Miete',
    'living_with_parents': 'Wohnt bei Familie/Eltern',
    'already_owner': 'Bereits Wohneigentümer/in',
    'temporary_housing': 'Temporäre Wohnsituation',
    'other': 'Andere Wohnsituation'
  };
  return map[val] || val;
}

function translateConsultationInterest(val: string): string {
  const map: Record<string, string> = {
    'yes_asap': 'Ja, möglichst bald',
    'yes_but_not_urgent': 'Ja, aber nicht dringend',
    'maybe_information_first': 'Vielleicht, zuerst Informationen erhalten',
    'no_not_now': 'Nein, aktuell nicht'
  };
  return map[val] || val;
}

function translateContactPreference(val: string): string {
  const map: Record<string, string> = {
    'phone': 'Telefon',
    'email': 'E-Mail',
    'whatsapp': 'WhatsApp'
  };
  return map[val] || val;
}

function translatePreferredContactTime(val: string): string {
  const map: Record<string, string> = {
    'morning': 'Vormittag',
    'afternoon': 'Nachmittag',
    'evening': 'Abend',
    'flexible': 'Flexibel',
    'no_preference': 'Keine Präferenz'
  };
  return map[val] || val;
}

function translateBoolean(val: any): string {
  if (val === true) return 'Ja';
  if (val === false) return 'Nein';
  return String(val);
}

function translateDeviceType(val: string): string {
  const map: Record<string, string> = {
    'mobile': 'Mobilgerät',
    'desktop': 'Desktop',
    'tablet': 'Tablet'
  };
  return map[val] || val;
}

function translateLeadQuality(val: string): string {
  const map: Record<string, string> = {
    'A': 'A-Lead',
    'B': 'B-Lead',
    'C': 'C-Lead',
    'disqualified': 'Disqualifiziert'
  };
  return map[val] || val;
}

function translateSalesPriority(val: string): string {
  const map: Record<string, string> = {
    'high': 'Hoch',
    'medium': 'Mittel',
    'low': 'Tief',
    'none': 'Keine'
  };
  return map[val] || val;
}

function translateRecommendedAction(val: string): string {
  const map: Record<string, string> = {
    'call_now': 'Sofort telefonisch kontaktieren',
    'manual_review': 'Manuell prüfen',
    'nurture': 'In Nurturing aufnehmen',
    'no_sales_action': 'Keine Vertriebsaktion'
  };
  return map[val] || val;
}

function translateDisqualificationReason(val: any): string {
  if (val === null || val === undefined) return 'Kein Ausschlussgrund';
  const map: Record<string, string> = {
    'no_consultation_interest': 'Kein Beratungsinteresse',
    'too_low_budget': 'Zu tiefe Eigenmittel',
    'outside_region': 'Ausserhalb Zielregion',
    'invalid_contact_data': 'Ungültige Kontaktdaten'
  };
  return map[val] || val;
}

function transformPayloadToGerman(payload: any): any {
  if (!payload) return {};

  const contact = payload.contact || {};
  const property_goal = payload.property_goal || {};
  const financial_situation = payload.financial_situation || {};
  const regional_profile = payload.regional_profile || {};
  const consultation = payload.consultation || {};
  const consents = payload.consents || {};
  const tracking = payload.tracking || {};
  const lead_evaluation = payload.lead_evaluation || {};

  return {
    formular_id: payload.form_id === 'eigenheimnavi_lead_form_v1' ? 'Eigenheimnavi Lead-Formular v1' : payload.form_id,
    lead_quelle: payload.lead_source === 'eigenheimnavi_landingpage' ? 'Eigenheimnavi Landingpage' : payload.lead_source,
    kontakt: {
      vorname: contact.first_name || '',
      nachname: contact.last_name || '',
      e_mail: contact.email || '',
      telefon: contact.phone || ''
    },
    vorhaben_und_objektwunsch: {
      ziel: translateGoal(property_goal.goal),
      immobilientyp: translatePropertyType(property_goal.property_type),
      kaufzeitraum: translateBuyingTimeline(property_goal.buying_timeline)
    },
    finanzielle_situation: {
      erwerbsstatus: translateEmploymentStatus(financial_situation.employment_status),
      eigenmittel: translateOwnFundsRange(financial_situation.own_funds_range),
      finanzierungsstatus: translateFinancingStatus(financial_situation.financing_status),
      haushaltseinkommen: translateHouseholdIncomeRange(financial_situation.household_income_range)
    },
    regionales_profil: {
      kanton: translateCanton(regional_profile.canton),
      postleitzahl: regional_profile.zip_code || '',
      wunschregion: translatePreferredRegion(regional_profile.preferred_region),
      altersgruppe: translateAgeRange(regional_profile.age_range),
      aktuelle_wohnsituation: translateCurrentSituation(regional_profile.current_situation)
    },
    beratung: {
      beratungsinteresse: translateConsultationInterest(consultation.consultation_interest),
      kontaktpraeferenz: translateContactPreference(consultation.contact_preference || 'phone'),
      bevorzugte_kontaktzeit: translatePreferredContactTime(consultation.preferred_contact_time),
      nachricht: consultation.message || ''
    },
    einwilligungen: {
      datenschutz_akzeptiert: translateBoolean(consents.privacy_consent),
      marketing_einwilligung: translateBoolean(consents.marketing_consent)
    },
    tracking: {
      seiten_url: tracking.page_url || '',
      referrer_url: tracking.referrer_url || '',
      utm_source: tracking.utm_source || '',
      utm_medium: tracking.utm_medium || '',
      utm_campaign: tracking.utm_campaign || '',
      utm_content: tracking.utm_content || '',
      utm_term: tracking.utm_term || '',
      gclid: tracking.gclid || '',
      fbclid: tracking.fbclid || '',
      abgesendet_am: tracking.submitted_at || '',
      geraetetyp: translateDeviceType(tracking.device_type),
      sprache: tracking.language || '',
      user_agent: tracking.user_agent || ''
    },
    lead_auswertung: {
      lead_score: lead_evaluation.lead_score || 0,
      lead_qualitaet: translateLeadQuality(lead_evaluation.lead_quality),
      vertriebsprioritaet: translateSalesPriority(lead_evaluation.sales_priority),
      empfohlene_massnahme: translateRecommendedAction(lead_evaluation.recommended_action),
      ausschlussgrund: translateDisqualificationReason(lead_evaluation.disqualification_reason)
    }
  };
}
