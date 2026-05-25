import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhatsIncluded } from "@/components/sections/WhatsIncluded";
import { Pricing } from "@/components/sections/Pricing";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { ForWhom } from "@/components/sections/ForWhom";
import { FAQ } from "@/components/sections/FAQ";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <WhatsIncluded />
      <Pricing />
      <Portfolio />
      <Process />
      <ForWhom />
      <FAQ />
      <ContactCTA />
    </>
  );
}
