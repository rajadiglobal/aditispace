import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground relative overflow-hidden">
      {/* Decorative large text in background */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none select-none opacity-5 pointer-events-none flex justify-center pt-10">
        <span className="text-[20vw] font-heading font-bold whitespace-nowrap">AVYRON</span>
      </div>

      <div className="container mx-auto px-6 md:px-12 pt-32 pb-10 relative z-10">
        {/* Large CTA Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-32">
          <div className="max-w-2xl">
            <h2 className="font-heading text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              Let's create something <span className="text-accent italic">extraordinary.</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg md:text-xl font-light max-w-md">
              Elevate your lifestyle with a space designed exclusively for you.
            </p>
          </div>
          <Link 
            href="#project-planner" 
            className="group flex items-center justify-center w-40 h-40 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-500 hover:scale-105 shrink-0"
          >
            <div className="flex flex-col items-center">
              <span className="font-semibold tracking-wider uppercase text-sm mb-2">Start</span>
              <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-primary-foreground/10 pt-16 mb-16">
          {/* Brand & Socials */}
          <div className="md:col-span-5 space-y-8">
            <Link href="/" className="inline-block">
              <span className="font-heading text-3xl font-bold tracking-widest uppercase">
                AVYRON
              </span>
            </Link>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300" aria-label="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300" aria-label="Twitter">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-accent hover:text-primary hover:border-accent transition-all duration-300" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            </div>
          </div>

          {/* Links & Contact */}
          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h4 className="font-heading text-xl font-semibold">Navigation</h4>
              <ul className="space-y-4">
                <li><Link href="#portfolio" className="text-primary-foreground/70 hover:text-accent transition-colors">Portfolio</Link></li>
                <li><Link href="#services" className="text-primary-foreground/70 hover:text-accent transition-colors">Services</Link></li>
                <li><Link href="#how-we-work" className="text-primary-foreground/70 hover:text-accent transition-colors">How We Work</Link></li>
                <li><Link href="#faq" className="text-primary-foreground/70 hover:text-accent transition-colors">FAQ</Link></li>
              </ul>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-heading text-xl font-semibold">Contact Us</h4>
              <ul className="space-y-4 text-primary-foreground/70">
                <li>A-367, Sector 46,<br/>Noida, UP, India, Pin-201301</li>
                <li><a href="tel:+919110447020" className="hover:text-accent transition-colors">+91 9110447020</a></li>
                <li><a href="mailto:hello@avyronstudio.com" className="hover:text-accent transition-colors">hello@avyronstudio.com</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/40 font-light">
          <p>© {new Date().getFullYear()} AVYRON STUDIO. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
