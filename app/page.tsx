import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { BriefSection } from "@/components/sections/BriefSection";
import { Deliverables } from "@/components/sections/Deliverables";
import { Demo3D } from "@/components/sections/Demo3D";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/sections/Footer";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Problem } from "@/components/sections/Problem";
import { SampleDeliverable } from "@/components/sections/SampleDeliverable";
import { Scenario } from "@/components/sections/Scenario";

export default function Home() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <main id="contenido">
        <Hero />
        <Scenario />
        <Problem />
        <HowItWorks />
        <Deliverables />
        <Demo3D />
        <SampleDeliverable />
        <FAQ />
        <BriefSection />
      </main>
      <Footer />
    </>
  );
}
