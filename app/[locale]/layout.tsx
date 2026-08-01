import type { Metadata } from "next";
import { Montserrat, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
import Header from "@/components/Header";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Preloader from "@/components/Preloader";
import { PreloaderProvider } from "@/contexts/PreloaderContext";

import trMessages from "@/messages/tr.json";
import enMessages from "@/messages/en.json";

const messagesMap: Record<string, Record<string, any>> = {
  tr: trMessages,
  en: enMessages,
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LODE — Kitchen + Bathroom",
  description: "Luxury architectural kitchen and bathroom furniture, crafted with precision.",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering in next-intl for static export (SSG)
  setRequestLocale(locale);

  const messages = messagesMap[locale] || trMessages;

  return (
    <html
      lang={locale}
      className={`${montserrat.variable} ${cormorant.variable} h-full bg-[var(--color-black)] text-[var(--color-cream)]`}
    >
      <body className="min-h-full flex flex-col font-sans antialiased selection:bg-[var(--color-gold)] selection:text-[var(--color-black)]">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <PreloaderProvider>
            <Preloader />
            <SmoothScrollProvider>
              <Header />
              {children}
            </SmoothScrollProvider>
          </PreloaderProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
