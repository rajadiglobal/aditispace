import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsultationProvider } from "@/components/consultation-provider";
import { WhatsAppWidget } from "@/components/whatsapp-widget";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConsultationProvider>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <WhatsAppWidget />
    </ConsultationProvider>
  );
}
