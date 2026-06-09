
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

type ModalStep = 'object' | 'timeframe' | 'name' | 'contact' | 'submit';

interface BookingFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  variant?: 'modal' | 'inline';
}

const BookingForm: React.FC<BookingFormProps> = ({ onSuccess, onClose, title, subtitle, variant = 'inline' }) => {
  const [modalView, setModalView] = useState<ModalStep>('object');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    street: '',
    zip: '',
    city: '',
    birthdate: '',
    hasObject: '',
    purchaseTimeframe: '',
    privacyAccepted: false
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
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    track('form_submit_start', formData);
    
    // Prepare the payload for the Arilla webhook as requested
    const webhookData = {
      "Geschlecht": "", // Not currently in form
      "Gender": "",     // Not currently in form
      "name": `${formData.firstname} ${formData.lastname}`.trim(),
      "vorname": formData.firstname,
      "nachname": formData.lastname,
      "geburtsdatum": formData.birthdate, // mapped
      "plz": formData.zip,                // mapped
      "ort": formData.city,               // mapped
      "email": formData.email,
      "telefon": formData.phone,
      "habt_ihr_bereits_objekt": formData.hasObject,
      "welche_region_eigenheim": "", // Not currently in form
      "was_erwartet_eigenheim_navigator": formData.purchaseTimeframe, // Mapping purchaseTimeframe here as it's relevant info
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
        track('form_submit_success', { formData, webhookData });
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
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="space-y-2 px-4">
          <h3 className="text-2xl font-black text-slate-900">Anfrage gesendet!</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">Vielen Dank für dein Vertrauen. Wir haben deine Anfrage erhalten und melden uns in Kürze für das Erstgespräch.</p>
        </div>
        {variant === 'modal' && (
           <button 
           onClick={onClose || (() => setIsSuccess(false))} 
           className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm shadow-lg hover:bg-slate-800 transition-all"
         >
           Schliessen
         </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${variant === 'inline' ? 'w-full' : ''}`}>
      {/* Title/Subtitle for inline version */}
      {variant === 'inline' && (title || subtitle) && (
        <div className="mb-8">
           {title && <h3 className="text-2xl font-black text-slate-900 mb-2">{title}</h3>}
           {subtitle && <p className="text-slate-500 text-sm">{subtitle}</p>}
        </div>
      )}

      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-grow h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-700 ease-out" 
            style={{ 
              width: 
                modalView === 'object' ? '20%' : 
                modalView === 'timeframe' ? '40%' : 
                modalView === 'name' ? '60%' : 
                modalView === 'contact' ? '80%' : '100%' 
            }}
          ></div>
        </div>
        <span className="text-[10px] font-black text-blue-600 uppercase tabular-nums">
          {modalView === 'object' ? 'Schritt 1/5' : 
           modalView === 'timeframe' ? 'Schritt 2/5' : 
           modalView === 'name' ? 'Schritt 3/5' : 
           modalView === 'contact' ? 'Schritt 4/5' : 'Schritt 5/5'}
        </span>
      </div>

      {/* STEP 1: Object */}
      {modalView === 'object' && (
        <div className="animate-fade-in space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Habt ihr bereits ein konkretes Objekt gefunden?*</h3>
            <p className="text-slate-500 text-xs sm:text-sm">Wähle die passende Option aus.</p>
          </div>

          <div className="space-y-3">
            {[
              'Ja, wir haben bereits ein konkretes Objekt',
              'Wir schauen uns gerade aktiv um',
              'Wir haben ein Wunschobjekt im Blick, aber noch nichts Konkretes',
              'Noch nicht – wir wollen erst wissen, was realistisch ist'
            ].map(opt => (
              <button
                key={opt}
                onClick={() => {
                  setFormData({...formData, hasObject: opt});
                  setModalView('timeframe');
                }}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  formData.hasObject === opt 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-sm font-bold">{opt}</span>
              </button>
            ))}
          </div>

          {variant === 'modal' && onClose && (
            <div className="pt-6 border-t border-slate-50">
              <button 
                type="button"
                onClick={onClose}
                className="w-full border-2 border-slate-200 text-slate-500 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 hover:text-slate-700 transition-all"
              >
                Abbrechen
              </button>
            </div>
          )}
        </div>
      )}

      {/* STEP 2: Timeframe */}
      {modalView === 'timeframe' && (
        <div className="animate-fade-in space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Wann möchtet ihr euer Eigenheim kaufen?*</h3>
            <p className="text-slate-500 text-xs sm:text-sm">Deine Angabe hilft uns bei der zeitlichen Einordnung.</p>
          </div>

          <div className="space-y-3">
            {[
              'In den nächsten 12 Monaten',
              'In den nächsten 24 Monaten',
              'Frühestens in 3 Jahren',
              'Noch unklar, wir wollen einfach mal Klarheit'
            ].map(opt => (
              <button
                key={opt}
                onClick={() => {
                  setFormData({...formData, purchaseTimeframe: opt});
                  setModalView('name');
                }}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  formData.purchaseTimeframe === opt 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-slate-100 bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-sm font-bold">{opt}</span>
              </button>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-50">
            <button 
              onClick={() => setModalView('object')}
              className="w-full border-2 border-slate-100 text-slate-400 py-4 rounded-xl font-black text-lg hover:bg-slate-50 transition-all"
            >
              Zurück
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Name & Geburtsdatum */}
      {modalView === 'name' && (
        <div className="animate-fade-in space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Wie dürfen wir dich ansprechen?</h3>
            <p className="text-slate-500 text-xs sm:text-sm">Gib uns deinen vollständigen Namen und dein Geburtsdatum an.</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Vorname*</label>
                <input 
                  type="text" 
                  placeholder="Max"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-sm font-bold focus:border-blue-600 outline-none"
                  value={formData.firstname}
                  onChange={(e) => setFormData({...formData, firstname: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Nachname*</label>
                <input 
                  type="text" 
                  placeholder="Mustermann"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-sm font-bold focus:border-blue-600 outline-none"
                  value={formData.lastname}
                  onChange={(e) => setFormData({...formData, lastname: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Geburtsdatum*</label>
              <input 
                type="date" 
                className={`w-full bg-slate-50 border-2 rounded-xl p-3 sm:p-4 text-sm font-bold outline-none focus:border-blue-600 ${
                  formData.birthdate && !isBirthdateValid(formData.birthdate)
                    ? 'border-rose-400 focus:border-rose-500'
                    : 'border-slate-100'
                }`}
                value={formData.birthdate}
                onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
              />
              {formData.birthdate && !isBirthdateValid(formData.birthdate) && (
                <p className="text-rose-600 text-xs font-bold mt-1">Das Geburtsjahr darf nicht nach 2026 liegen und muss eine plausible Angabe sein.</p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 flex gap-3">
            <button 
              onClick={() => setModalView('timeframe')}
              className="flex-1 border-2 border-slate-100 text-slate-400 py-4 rounded-xl font-black text-lg hover:bg-slate-50 transition-all"
            >
              Zurück
            </button>
            <button 
              onClick={() => setModalView('contact')}
              disabled={!formData.firstname || !formData.lastname || !isBirthdateValid(formData.birthdate)}
              className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-40"
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Address & Contact */}
      {modalView === 'contact' && (
        <div className="animate-fade-in space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Wie erreichen wir dich?</h3>
            <p className="text-slate-500 text-xs sm:text-sm">Bitte gib deine Adresse und Kontaktdaten an.</p>
          </div>

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">E-Mail-Adresse*</label>
                <input 
                  type="email" 
                  placeholder="beispiel@mail.ch"
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3 sm:p-4 text-sm font-bold outline-none focus:border-blue-600 ${
                    formData.email && !isEmailValid(formData.email)
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-100'
                  }`}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                {formData.email && !isEmailValid(formData.email) && (
                  <p className="text-rose-600 text-xs font-bold mt-1">Bitte gib eine gültige E-Mail-Adresse ein (z.B. name@beispiel.ch).</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Telefonnummer*</label>
                <input 
                  type="tel" 
                  placeholder="+41 79 123 45 67"
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3 sm:p-4 text-sm font-bold outline-none focus:border-blue-600 ${
                    formData.phone && !isSwissPhoneValid(formData.phone)
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-100'
                  }`}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
                {formData.phone && !isSwissPhoneValid(formData.phone) && (
                  <p className="text-rose-600 text-xs font-bold mt-1">Strikte Schweizer Nummer verlangt (z.B. +41 79 123 45 67 oder 079 123 45 67).</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Strasse und Hausnummer*</label>
              <input 
                type="text" 
                placeholder="Bahnhofstrasse 12"
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-sm font-bold focus:border-blue-600 outline-none"
                value={formData.street}
                onChange={(e) => setFormData({...formData, street: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2 col-span-1">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">PLZ*</label>
                <input 
                  type="text" 
                  placeholder="8000"
                  className={`w-full bg-slate-50 border-2 rounded-xl p-3 sm:p-4 text-sm font-bold outline-none focus:border-blue-600 ${
                    formData.zip && !isZipValid(formData.zip)
                      ? 'border-rose-400 focus:border-rose-500'
                      : 'border-slate-100'
                  }`}
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                />
                {formData.zip && !isZipValid(formData.zip) && (
                  <p className="text-rose-600 text-xs font-bold mt-1">Muss genau 4 Ziffern sein.</p>
                )}
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Ort*</label>
                <input 
                  type="text" 
                  placeholder="Zürich"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 sm:p-4 text-sm font-bold focus:border-blue-600 outline-none"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-50 flex gap-3">
            <button 
              onClick={() => setModalView('name')}
              className="flex-1 border-2 border-slate-100 text-slate-400 py-4 rounded-xl font-black text-lg hover:bg-slate-50 transition-all"
            >
              Zurück
            </button>
            <button 
              onClick={() => setModalView('submit')}
              disabled={
                !isEmailValid(formData.email) || 
                !isSwissPhoneValid(formData.phone) || 
                !formData.street || 
                !isZipValid(formData.zip) || 
                !formData.city
              }
              className="flex-[2] bg-blue-600 text-white py-4 rounded-xl font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-40"
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Submit */}
      {modalView === 'submit' && (
        <div className="animate-fade-in space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">Fast geschafft!</h3>
            <p className="text-slate-500 text-xs sm:text-sm">Bestätige deine Angaben für das Erstgespräch.</p>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Name</span>
                <span className="text-slate-900 font-black">{formData.firstname} {formData.lastname}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Geburtsdatum</span>
                <span className="text-slate-900 font-black">{formData.birthdate}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Kontakt</span>
                <span className="text-slate-900 font-black">{formData.email} / {formData.phone}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Adresse</span>
                <span className="text-slate-900 font-black truncate max-w-[150px] sm:max-w-none">{formData.street}, {formData.zip} {formData.city}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Objekt</span>
                <span className="text-slate-900 font-black truncate max-w-[150px] sm:max-w-none">{formData.hasObject}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-bold uppercase">Zeitraum</span>
                <span className="text-slate-900 font-black truncate max-w-[150px] sm:max-w-none">{formData.purchaseTimeframe}</span>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input 
                type="checkbox" 
                className="mt-1 w-5 h-5 rounded border-2 border-slate-200 text-blue-600 focus:ring-blue-500"
                checked={formData.privacyAccepted}
                onChange={(e) => setFormData({...formData, privacyAccepted: e.target.checked})}
              />
              <span className="text-xs text-slate-500 font-medium leading-relaxed group-hover:text-slate-700 transition-colors">
                Ich stimme der <Link to="/datenschutz" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold hover:underline">Datenschutzerklärung</Link> zu*
              </span>
            </label>
          </div>

          <div className="pt-6 border-t border-slate-50 flex flex-col gap-3">
            <button 
              onClick={handleSubmit}
              disabled={!formData.privacyAccepted || isSubmitting}
              className="w-full bg-blue-600 text-white py-5 rounded-xl sm:rounded-[20px] font-black text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-40 flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Wird gesendet...</span>
                </>
              ) : 'Abschicken'}
            </button>
            <button 
              onClick={() => setModalView('contact')}
              disabled={isSubmitting}
              className="w-full text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-slate-600 transition-colors disabled:opacity-20"
            >
              Daten korrigieren
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
