import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsultationProvider } from "@/components/consultation-provider";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { MotionProvider } from "@/components/motion-provider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AVYRON STUDIO | Luxury Interior Design",
  description: "Luxury interiors crafted for modern living.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfair.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ConsultationProvider>
            <MotionProvider>
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <WhatsAppWidget />
            </MotionProvider>
          </ConsultationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
