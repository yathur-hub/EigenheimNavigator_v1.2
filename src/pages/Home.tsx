
import React from 'react';
import Hero from '../../components/Hero';
import LogoSlider from '../../components/LogoSlider';
import RealitySection from '../../components/RealitySection';
import SolutionSection from '../../components/SolutionSection';
import SocialProofSection from '../../components/SocialProofSection';
import ProcessSection from '../../components/ProcessSection';
import GlossarySection from '../../components/GlossarySection';
import PartnerSection from '../../components/PartnerSection';
import TeamSection from '../../components/TeamSection';
import FAQSection from '../../components/FAQSection';
import ContactSection from '../../components/ContactSection';

interface HomeProps {
  onStartCheck: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartCheck }) => {
  return (
    <>
      <Hero onStartCheck={onStartCheck} />
      <SocialProofSection onStartCheck={onStartCheck} />
      <RealitySection onStartCheck={onStartCheck} />
      <SolutionSection onStartCheck={onStartCheck} />
      <ProcessSection onStartCheck={onStartCheck} />
      <GlossarySection onStartCheck={onStartCheck} />
      <PartnerSection onStartCheck={onStartCheck} />
      <TeamSection onStartCheck={onStartCheck} />
      <LogoSlider />
      <FAQSection onStartCheck={onStartCheck} />
      <ContactSection />
    </>
  );
};

export default Home;
