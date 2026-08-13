
import React from 'react';
import Hero from '../../components/Hero';
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
import SectionEngagement from '../../components/SectionEngagement';

interface HomeProps {
  onStartCheck: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartCheck }) => {
  return (
    <>
      <SectionEngagement sectionId="hero">
        <Reveal className="w-full" delay={0}>
          <Hero onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="customers">
        <Reveal className="w-full" delay={100}>
          <SocialProofSection onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="problem">
        <Reveal className="w-full" delay={50}>
          <ProblemSection onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="zielgruppe">
        <Reveal className="w-full" delay={50}>
          <TargetGroupSection onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="solution">
        <Reveal className="w-full" delay={50}>
          <SolutionSection onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="ablauf">
        <Reveal className="w-full" delay={50}>
          <ProcessSection onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="trust">
        <Reveal className="w-full" delay={50}>
          <TrustSection onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="glossar">
        <Reveal className="w-full" delay={50}>
          <GlossarySection onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="gallery">
        <Reveal className="w-full" delay={50}>
          <PartnerSection onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="team">
        <Reveal className="w-full" delay={50}>
          <TeamSection onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="faq">
        <Reveal className="w-full" delay={50}>
          <FAQSection onStartCheck={onStartCheck} />
        </Reveal>
      </SectionEngagement>

      <SectionEngagement sectionId="contact">
        <Reveal className="w-full" delay={50}>
          <ContactSection />
        </Reveal>
      </SectionEngagement>
    </>
  );
};

export default Home;
