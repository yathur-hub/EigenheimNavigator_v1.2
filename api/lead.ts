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

  const { formData, webhookData: clientWebhookData } = req.body || {};

  // Log incoming submission (without logging sensitive info if not needed, but metadata is good)
  console.log('[Vercel API Lead] Received post request with body keys:', Object.keys(req.body || {}));

  // Validate required fields
  if (
    !formData || 
    !formData.email || 
    !formData.firstname || 
    !formData.lastname ||
    !formData.phone ||
    !formData.street ||
    !formData.zip ||
    !formData.city ||
    !formData.birthdate ||
    !formData.hasObject ||
    !formData.purchaseTimeframe
  ) {
    console.error('[Vercel API Lead] Validation failed: Missing required fields', { formData });
    return res.status(400).json({ 
      error: 'All fields (firstname, lastname, email, phone, street, zip, city, birthdate, hasObject, purchaseTimeframe) are mandatory.' 
    });
  }

  // Validate formatting/integrity
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  
  // Swiss phone validation
  const cleanedPhone = formData.phone.replace(/[^\d+]/g, '');
  let isPhoneValid = false;
  if (cleanedPhone.startsWith('+41')) {
    isPhoneValid = /^\+41[1-9]\d{8}$/.test(cleanedPhone);
  } else if (cleanedPhone.startsWith('0041')) {
    isPhoneValid = /^0041[1-9]\d{8}$/.test(cleanedPhone);
  } else if (cleanedPhone.startsWith('0')) {
    isPhoneValid = /^0[1-9]\d{8}$/.test(cleanedPhone);
  }

  // 4-digit zip validation
  const isZipValid = /^\d{4}$/.test(formData.zip);

  // Birthdate year validation: <= 2026 and >= 1900
  let isBirthdateValid = false;
  if (formData.birthdate) {
    const d = new Date(formData.birthdate);
    if (!isNaN(d.getTime())) {
      const year = d.getFullYear();
      isBirthdateValid = year <= 2026 && year >= 1900;
    }
  }

  if (!isEmailValid) {
    return res.status(400).json({ error: 'Ungültiges E-Mail-Format.' });
  }
  if (!isPhoneValid) {
    return res.status(400).json({ error: 'Ungültige Schweizer Telefonnummer. Akzeptiert werden z.B. +41 79 123 45 67 oder 079 123 45 67.' });
  }
  if (!isZipValid) {
    return res.status(400).json({ error: 'Die Postleitzahl muss eine 4-stellige Nummer sein.' });
  }
  if (!isBirthdateValid) {
    return res.status(400).json({ error: 'Das Geburtsdatum ist ungültig oder das Jahr liegt nach 2026.' });
  }

  // Construct the standardized, exact JSON payload for Arilla Webhook
  const standardizedWebhookData = {
    "Geschlecht": formData.gender || formData.Geschlecht || "", // Accept if exists or empty
    "Gender": formData.gender || formData.Gender || "",
    "name": `${formData.firstname} ${formData.lastname}`.trim(),
    "vorname": formData.firstname,
    "nachname": formData.lastname,
    "geburtsdatum": formData.birthdate || formData.geburtsdatum || "",
    "plz": formData.zip || formData.plz || "",
    "ort": formData.city || formData.ort || "",
    "email": formData.email,
    "telefon": formData.phone || "",
    "habt_ihr_bereits_objekt": formData.hasObject || formData.habt_ihr_bereits_objekt || "",
    "welche_region_eigenheim": formData.region || formData.welche_region_eigenheim || "",
    "was_erwartet_eigenheim_navigator": formData.purchaseTimeframe || formData.was_erwartet_eigenheim_navigator || "",
    "documents": formData.documents || [] // Ensures always an array, fallback to default []
  };

  // Resolve target endpoints from environment variables or use the fallback defaults
  const formspreeUrl = process.env.FORMSPREE_URL || 'https://formspree.io/f/mojprwpw';
  const arillaWebhookUrl = process.env.ARILLA_WEBHOOK_URL || 'https://app.arilla.ch/tools/lead-json-webhook/form/535/7c0a1a580d31df63ed08d1ea9322031c';

  console.log(`[Vercel API Lead] Dispatching lead to Formspree (${formspreeUrl}) and Arilla Webhook (${arillaWebhookUrl})`);

  let formspreeSuccess = false;
  let webhookSuccess = false;
  let formspreeError = '';
  let webhookError = '';

  // 1. Dispatch to Formspree
  try {
    const formspreeResponse = await fetch(formspreeUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    formspreeSuccess = formspreeResponse.ok;
    if (!formspreeResponse.ok) {
      formspreeError = await formspreeResponse.text();
      console.error('[Vercel API Lead] Formspree responded with error status:', formspreeResponse.status, formspreeError);
    } else {
      console.log('[Vercel API Lead] Formspree submission successful');
    }
  } catch (error: any) {
    console.error('[Vercel API Lead] Error posting to Formspree:', error);
    formspreeError = error?.message || String(error);
  }

  // 2. Dispatch to Arilla Webhook
  try {
    const webhookResponse = await fetch(arillaWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(standardizedWebhookData)
    });

    webhookSuccess = webhookResponse.ok;
    if (!webhookResponse.ok) {
      webhookError = await webhookResponse.text();
      console.error('[Vercel API Lead] Arilla Webhook responded with error status:', webhookResponse.status, webhookError);
    } else {
      console.log('[Vercel API Lead] Arilla Webhook submission successful');
    }
  } catch (error: any) {
    console.error('[Vercel API Lead] Error posting to Arilla Webhook:', error);
    webhookError = error?.message || String(error);
  }

  // Handle Response logic according to requirements
  // "200 wenn mindestens ein Lead-Ziel erfolgreich war"
  // "500 wenn beide externen Services fehlschlagen"
  if (formspreeSuccess || webhookSuccess) {
    console.log('[Vercel API Lead] Lead processing completed successfully. Success states:', { formspreeSuccess, webhookSuccess });
    return res.status(200).json({
      success: true,
      formspreeSuccess,
      webhookSuccess
    });
  } else {
    console.error('[Vercel API Lead] Both formspree and webhook dispatch actions failed entirely.');
    return res.status(500).json({
      error: 'Submission failed',
      formspreeError,
      webhookError
    });
  }
}
