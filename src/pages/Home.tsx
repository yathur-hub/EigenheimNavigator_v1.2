
import React from 'react';
import Hero from '../../components/Hero';
import LogoSlider from '../../components/LogoSlider';
import RealitySection from '../../components/RealitySection';
import SolutionSection from '../../components/SolutionSection';
import SocialProofSection from '../../components/SocialProofSection';
import ProcessSection from '../../components/ProcessSection';
import PartnerSection from '../../components/PartnerSection';
import FAQSection from '../../components/FAQSection';
import ContactSection from '../../components/ContactSection';

interface HomeProps {
  onStartCheck: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartCheck }) => {
  return (
    <>
      <Hero onStartCheck={onStartCheck} />
      <LogoSlider />
      <SocialProofSection onStartCheck={onStartCheck} />
      <RealitySection onStartCheck={onStartCheck} />
      <SolutionSection onStartCheck={onStartCheck} />
      <ProcessSection onStartCheck={onStartCheck} />
      <PartnerSection onStartCheck={onStartCheck} />
      <FAQSection onStartCheck={onStartCheck} />
      <ContactSection />
    </>
  );
};

export default Home;
