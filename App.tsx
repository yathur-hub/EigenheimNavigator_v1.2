
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './src/pages/Home';
import Impressum from './src/pages/Impressum';
import Privacy from './src/pages/Privacy';
import BookingForm from './components/BookingForm';
import CookieConsent from './components/CookieConsent';

import { Link } from 'react-router-dom';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const track = (event: string, data?: any) => {
    console.log(`Tracking: ${event}`, data || '');
  };

  const openModal = () => {
    track('modal_open');
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    track('check_modal_close');
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <Router>
      <div className="relative min-h-screen flex flex-col bg-white font-['Inter']">
        <Header onStartCheck={openModal} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home onStartCheck={openModal} />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Privacy />} />
          </Routes>
        </main>

        <Footer />
        <CookieConsent />
        
        {/* OPTIMIZED REALITÄTSCHECK MODAL */}
        {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={closeModal}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[92vh] sm:h-auto max-h-[92vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">CH</div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-none">Erstgespräch buchen</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Persönliche Beratung</p>
                </div>
              </div>
              <button onClick={closeModal} aria-label="Schliessen" className="w-11 h-11 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-full text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto no-scrollbar px-4 py-6 sm:px-10 sm:py-8">
               <BookingForm variant="modal" onSuccess={() => track('check_success')} onClose={closeModal} />
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex-shrink-0 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                 <svg className="w-3 h-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 4.946-2.597 9.181-6.5 11.5a11.954 11.954 0 01-6.5-11.5c0-.68.056-1.35.166-2.001zm8.341 8.592a.75.75 0 00-1.014-1.074 3.25 3.25 0 01-4.493-4.493.75.75 0 00-1.074-1.014 4.75 4.75 0 006.581 6.581z" clipRule="evenodd" /></svg>
                 <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">DSGVO Konform · SSL Verschlüsselt</span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </Router>
  );
};

export default App;
