
import React from 'react';
import Hero from '../../components/Hero';
import LogoSlider from '../../components/LogoSlider';
import ProblemSection from '../../components/ProblemSection';
import TargetGroupSection from '../../components/TargetGroupSection';
import SolutionSection from '../../components/SolutionSection';
import SocialProofSection from '../../components/SocialProofSection';
import ProcessSection from '../../components/ProcessSection';
import TrustSection from '../../components/TrustSection';
import GlossarySection from '../../components/GlossarySection';
import PartnerSection from '../../components/PartnerSection';
import TeamSection from '../../components/TeamSection';
import FAQSection from '../../components/FAQSection';
import ContactSection from '../../components/ContactSection';
import Reveal from '../../components/Reveal';

interface HomeProps {
  onStartCheck: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartCheck }) => {
  return (
    <>
      <Reveal className="w-full" delay={0}>
        <Hero onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={100}>
        <SocialProofSection onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <ProblemSection onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <TargetGroupSection onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <SolutionSection onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <ProcessSection onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <TrustSection onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <GlossarySection onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <PartnerSection onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <TeamSection onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <LogoSlider />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <FAQSection onStartCheck={onStartCheck} />
      </Reveal>
      
      <Reveal className="w-full" delay={50}>
        <ContactSection />
      </Reveal>
    </>
  );
};

export default Home;
