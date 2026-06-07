
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to proxy Lead data to avoid CORS issues
  app.post("/api/lead", async (req, res) => {
    const { formData, webhookData } = req.body;

    let formspreeSuccess = false;
    let webhookSuccess = false;
    let formspreeError = "";
    let webhookError = "";

    try {
      // 1. Send to Formspree
      const formspreeRes = await fetch('https://formspree.io/f/mojprwpw', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      formspreeSuccess = formspreeRes.ok;
      if (!formspreeRes.ok) {
        formspreeError = await formspreeRes.text();
      }
    } catch (error: any) {
      console.error('Error sending to Formspree:', error);
      formspreeError = error?.message || String(error);
    }

    try {
      // 2. Send to Arilla Webhook
      const webhookRes = await fetch('https://app.arilla.ch/tools/lead-json-webhook/form/535/7c0a1a580d31df63ed08d1ea9322031c', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      });
      webhookSuccess = webhookRes.ok;
      if (!webhookRes.ok) {
        webhookError = await webhookRes.text();
      }
    } catch (error: any) {
      console.error('Error sending to Arilla Webhook:', error);
      webhookError = error?.message || String(error);
    }

    if (formspreeSuccess || webhookSuccess) {
      res.status(200).json({ 
        success: true, 
        formspreeSuccess, 
        webhookSuccess 
      });
    } else {
      console.error('Submission failed entirely.', { formspreeError, webhookError });
      res.status(500).json({ 
        error: 'Submission failed', 
        formspreeError, 
        webhookError 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
