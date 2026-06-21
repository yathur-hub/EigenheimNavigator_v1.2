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
  if (!consultation.contact_preference) {
    return res.status(400).json({ error: 'Bitte wählen Sie eine bevorzugte Kontaktmethode aus.' });
  }

  // Webhook URLs (Active and fallback destinations)
  const webhookUrl = process.env.WEBHOOK_URL || 'https://mis13.app.n8n.cloud/webhook-test/7ff9cd84-6980-459a-8109-12799c07d4cb?t=957b1bbf705f3e384c3315842ea2be9c5eb5fe3f9680501a14de8cdb06e93b846a5d469f2c12e0b9a3fd6ad2b4c63e88a5993a267d11b5badd55c10002ffc2ba';
  const formspreeUrl = process.env.FORMSPREE_URL || 'https://formspree.io/f/mojprwpw';

  console.log(`[Vercel API Lead] Dispatching lead to Webhook (${webhookUrl}) and Formspree (${formspreeUrl})`);

  let webhookSuccess = false;
  let formspreeSuccess = false;

  let webhookErrorText = '';
  let formspreeErrorText = '';

  // 1. Send complete detailed JSON payload to primary CRM / Automation Webhook
  try {
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
      body: JSON.stringify(payload)
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
