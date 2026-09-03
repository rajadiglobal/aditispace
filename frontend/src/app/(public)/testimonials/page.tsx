import { TestimonialsFAQ } from "@/components/sections/testimonials-faq";
import { PageHero } from "@/components/sections/page-hero";

export default function TestimonialsPage() {
  return (
    <div className="flex flex-col">
      <PageHero 
        title="Client Testimonials" 
        subtitle="WHAT THEY SAY"
        description="Discover what our clients have to say about their experience working with Aditi Studio and how we transformed their spaces."
        imagePath="/images/hero/luxury-penthouse.jpg"
      />
      <div className="py-8">
        <TestimonialsFAQ />
      </div>
    </div>
  );
}
