import { Services } from "@/components/sections/services";
import { PageHero } from "@/components/sections/page-hero";

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      <PageHero 
        title="Our Services" 
        subtitle="WHAT WE DO"
        description="Comprehensive interior design solutions tailored to your lifestyle and preferences, delivered with uncompromising quality."
        imagePath="/images/hero/elegant-living-room.jpg"
      />
      <div className="py-8">
        <Services />
      </div>
    </div>
  );
}
