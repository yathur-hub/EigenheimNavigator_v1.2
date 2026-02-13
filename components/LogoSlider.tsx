
import React from 'react';

const logos = [
  "https://eigenheimnavigator.ch/images/partners/eki_logo.svg",
  "https://eigenheimnavigator.ch/images/partners/bcm_logo.svg",
  "https://eigenheimnavigator.ch/images/partners/bankslim_logo.svg",
  "https://eigenheimnavigator.ch/images/partners/baloise_logo.svg",
  "https://eigenheimnavigator.ch/images/partners/bekb_logo.svg",
  "https://eigenheimnavigator.ch/images/partners/gkb_logo.svg",
  "https://eigenheimnavigator.ch/images/partners/lkb_logo.svg",
  "https://eigenheimnavigator.ch/images/partners/sgkb_logo.svg",
  "https://eigenheimnavigator.ch/images/partners/thalwil_logo.svg",
  "https://eigenheimnavigator.ch/images/partners/acrevis_logo.svg",
  "https://eigenheimnavigator.ch/images/partners/axa_logo.svg"
];

const LogoSlider: React.FC = () => {
  // Double the logos for infinite scroll effect
  const displayLogos = [...logos, ...logos];

  return (
    <div className="bg-white py-12 overflow-hidden border-b border-slate-50 relative">
      <div className="relative w-full overflow-hidden">
        {/* Gradients for smooth fade out at edges */}
        <div className="absolute left-0 top-0 bottom-0 w-32 z-10 logo-shadow-left pointer-events-none hidden sm:block"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 z-10 logo-shadow-right pointer-events-none hidden sm:block"></div>

        <div className="flex w-fit items-center gap-20 sm:gap-32 animate-scroll">
          {displayLogos.map((logo, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-default"
            >
              <img 
                src={logo} 
                alt="Partner Logo" 
                className="h-32 sm:h-40 w-auto object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LogoSlider;
