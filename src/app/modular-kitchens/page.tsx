import { Services } from "@/components/sections/services";
import { PageHero } from "@/components/sections/page-hero";

export default function ModularKitchensPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <PageHero 
        title="Modular Kitchens" 
        subtitle="THE HEART OF YOUR HOME"
        description="Discover our range of elegant, functional, and fully customized modular kitchens designed to perfectly blend aesthetics with utility."
        imagePath="/images/hero/luxury-kitchen.jpg"
        whatsappAction={{
          text: "Discuss Your Kitchen Project",
          message: "Hi Avyron Studio! I'm interested in getting a custom Modular Kitchen designed. Can we discuss?"
        }}
      />
      <div className="py-12">
        <Services />
      </div>
    </div>
  );
}
