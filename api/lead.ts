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
  if (!formData || !formData.email || !formData.firstname || !formData.lastname) {
    console.error('[Vercel API Lead] Validation failed: Missing required fields');
    return res.status(400).json({ 
      error: 'Invalid form data. Firstname, lastname, and email are required.' 
    });
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
