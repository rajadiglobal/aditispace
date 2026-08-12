import { Hero } from "@/components/sections/hero";
import { LogoTicker } from "@/components/sections/logo-ticker";
import { Services } from "@/components/sections/services";
import { WhyChooseUs } from "@/components/sections/why-choose-us";
import { BeforeAfter } from "@/components/sections/before-after";
import { Portfolio } from "@/components/sections/portfolio";
import { HowItWorks } from "@/components/sections/how-it-works";
import { ProjectPlanner } from "@/components/sections/project-planner";
import { SpecialOffer } from "@/components/sections/special-offer";
import { TestimonialsFAQ } from "@/components/sections/testimonials-faq";
import { ContactSection } from "@/components/sections/contact";
import { FinalCTA } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Hero />
      <LogoTicker />
      <Services />
      <WhyChooseUs />
      <BeforeAfter />
      <Portfolio />
      <HowItWorks />
      <ProjectPlanner />
      <SpecialOffer />
      <TestimonialsFAQ />
      <ContactSection />
      <FinalCTA />
    </div>
  );
}
