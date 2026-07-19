import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/home/HeroSection';
import ValueProposition from '@/components/home/ValueProposition';
import ClassHighlights from '@/components/home/ClassHighlights';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <HeroSection
        headline="Transform Your Body, Transform Your Life"
        subheadline="Achieve sustainable fitness and a healthier lifestyle with expert guidance and a supportive community at Vikram's Fitness Studio."
        ctaText="Book a Free Trial"
      />
      <ValueProposition />
      <ClassHighlights />
      <Testimonials />
      <CtaSection />
    </Layout>
  );
};

export default HomePage;