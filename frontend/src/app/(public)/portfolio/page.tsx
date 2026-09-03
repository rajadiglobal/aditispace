import { Portfolio } from "@/components/sections/portfolio";
import { PageHero } from "@/components/sections/page-hero";

export default function PortfolioPage() {
  return (
    <div className="flex flex-col">
      <PageHero 
        title="Our Portfolio" 
        subtitle="DESIGN GALLERY"
        description="Explore our curated collection of luxury interior projects. From elegant living rooms to modern modular kitchens, see how we bring visions to life."
        imagePath="/images/portfolio/master-bedroom.jpg"
      />
      <div className="py-8">
        <Portfolio />
      </div>
    </div>
  );
}
