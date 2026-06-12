import React, { useState, useEffect } from 'react';
import { Shield, Settings, Info, Check, X } from 'lucide-react';

interface ConsentChoice {
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [marketingEnabled, setMarketingEnabled] = useState(true);

  // Read saved consent or show banner on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('cookieConsent');
      if (stored) {
        const parsed: ConsentChoice = JSON.parse(stored);
        if (parsed) {
          applyConsent(parsed.analytics, parsed.marketing, false); // apply without pushing redundantly on GTM if unnecessary, but let's apply to be sure
          setAnalyticsEnabled(parsed.analytics);
          setMarketingEnabled(parsed.marketing);
        } else {
          setIsVisible(true);
        }
      } else {
        setIsVisible(true);
      }
    } catch (e) {
      console.error('[Consent] Failed to read cached consent', e);
      setIsVisible(true);
    }
  }, []);

  // Listen to custom event to reopen preferences from the footer link
  useEffect(() => {
    const handleOpenBanner = () => {
      // Load current choice
      try {
        const stored = localStorage.getItem('cookieConsent');
        if (stored) {
          const parsed: ConsentChoice = JSON.parse(stored);
          if (parsed) {
            setAnalyticsEnabled(parsed.analytics);
            setMarketingEnabled(parsed.marketing);
          }
        }
      } catch (e) {
        console.error('[Consent] Failed to load cached choices on reopening', e);
      }
      setShowPreferences(true);
      setIsVisible(true);
    };

    window.addEventListener('open-cookie-banner', handleOpenBanner);
    return () => {
      window.removeEventListener('open-cookie-banner', handleOpenBanner);
    };
  }, []);

  const applyConsent = (analytics: boolean, marketing: boolean, pushEvent = true) => {
    const consentObj = {
      analytics_storage: analytics ? 'granted' : 'denied',
      ad_storage: marketing ? 'granted' : 'denied',
      ad_user_data: marketing ? 'granted' : 'denied',
      ad_personalization: marketing ? 'granted' : 'denied'
    };

    // Keep GTM updated with gtag consent
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', consentObj);
    } else {
      // Fallback in case window.gtag is not yet defined
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(['consent', 'update', consentObj]);
    }

    if (pushEvent) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'cookie_consent_update',
        consent_analytics: analytics,
        consent_marketing: marketing
      });
    }
  };

  const saveConsent = (analytics: boolean, marketing: boolean) => {
    try {
      const payload: ConsentChoice = {
        analytics,
        marketing,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('cookieConsent', JSON.stringify(payload));
    } catch (e) {
      console.error('[Consent] Failed to save consent', e);
    }

    applyConsent(analytics, marketing, true);
    setIsVisible(false);
    setShowPreferences(false);
  };

  const handleAcceptAll = () => {
    saveConsent(true, true);
  };

  const handleDenyAll = () => {
    saveConsent(false, false);
  };

  const handleSaveSelected = () => {
    saveConsent(analyticsEnabled, marketingEnabled);
  };

  if (!isVisible) return null;

  return (
    <div id="cookie-consent-overlay" className="fixed bottom-0 left-0 right-0 p-4 sm:p-6 z-[999] flex justify-center items-end animate-fade-in pointer-events-none">
      <div className="w-full max-w-2xl bg-white border border-slate-100 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-900/10 pointer-events-auto flex flex-col md:flex-row md:items-center gap-5 justify-between">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Shield size={20} />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Cookie-Einstellungen</h4>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Wir verwenden Cookies und ähnliche Technologien, um unsere Website zu analysieren und Marketingmassnahmen zu optimieren. Du kannst alle akzeptieren oder nicht notwendige Cookies ablehnen.
          </p>

          {showPreferences && (
            <div className="pt-4 border-t border-slate-100 space-y-4 animate-fade-in">
              <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-2">Einstellungen verwalten</h5>
              
              {/* Statistik Option */}
              <div className="flex items-center justify-between p-3 bg-slate-50/60 rounded-2xl border border-slate-50">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">Statistik / Analytics</span>
                    <span className="px-1.5 py-0.5 bg-blue-100/60 text-blue-700 text-[9px] font-black uppercase rounded">Option</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Hilft uns zu verstehen, wie Besucher mit der Website interagieren (erfasst anonyme Nutzungsdaten).</p>
                </div>
                <div>
                  <button 
                    type="button"
                    onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      analyticsEnabled ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        analyticsEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Marketing Option */}
              <div className="flex items-center justify-between p-3 bg-slate-50/60 rounded-2xl border border-slate-50">
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">Marketing</span>
                    <span className="px-1.5 py-0.5 bg-blue-100/60 text-blue-700 text-[9px] font-black uppercase rounded">Option</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Ermöglicht personalisierte Werbeanzeigen und Conversions-Tracking über Google & Meta.</p>
                </div>
                <div>
                  <button 
                    type="button"
                    onClick={() => setMarketingEnabled(!marketingEnabled)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      marketingEnabled ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        marketingEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 min-w-[180px] sm:justify-end">
          {showPreferences ? (
            <>
              <button 
                onClick={handleSaveSelected}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow-lg shadow-blue-100 transition-all text-center"
              >
                Auswahl speichern
              </button>
              <button 
                onClick={() => setShowPreferences(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs py-3 px-4 rounded-xl transition-all text-center"
              >
                Zurück
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={handleAcceptAll}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3.5 px-4 rounded-xl shadow-lg shadow-blue-100 transition-all text-center"
              >
                Alle akzeptieren
              </button>
              <button 
                onClick={handleDenyAll}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs py-3.5 px-4 rounded-xl transition-all text-center"
              >
                Ablehnen
              </button>
              <button 
                onClick={() => setShowPreferences(true)}
                className="w-full border-2 border-slate-100 hover:border-slate-200 text-slate-500 hover:text-slate-700 font-black text-xs py-3 px-4 rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
              >
                <Settings size={14} />
                Auswahl anpassen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
