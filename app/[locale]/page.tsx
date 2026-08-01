import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/Hero";
import ScrollTextReveal from "@/components/ScrollTextReveal";
import Collection from "@/components/Collection";
import MarinShowcase from "@/components/MarinShowcase";
import LightReveal from "@/components/LightReveal";
import LightCollectionShowcase from "@/components/LightCollectionShowcase";
import Footer from "@/components/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen bg-[var(--color-black)]">
      <Hero />
      <ScrollTextReveal />
      <Collection />
      <MarinShowcase />
      <LightReveal />
      <LightCollectionShowcase />
      <Footer />
    </main>
  );
}
