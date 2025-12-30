import { HeroSection } from '@/components/home/HeroSection';
import { SubHeroSection } from '@/components/home/SubHeroSection';
import { ValuePropositions } from '@/components/home/ValuePropositions';
import { WhatWeDo } from '@/components/home/WhatWeDo';
import { ClientWins } from '@/components/home/ClientWins';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SubHeroSection />
      <ValuePropositions />
      <WhatWeDo />
      <ClientWins />
    </>
  );
}
