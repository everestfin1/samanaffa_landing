import type { Metadata } from "next";
import E0LegalFooter from "@/components/landing/E0LegalFooter";
import E0MarketingHeader from "@/components/landing/E0MarketingHeader";
import NattukaaySimulator from "@/components/landing/NattukaaySimulator";

export const metadata: Metadata = {
  title: "Nattukaay Yéené | Mesure ton projet | Sama Naffa",
  description:
    "Simule ton épargne Sama Naffa : choisis ton projet, ajuste montant et durée, et découvre le montant escompté.",
};

export default function SamaNaffaPage() {
  return (
    <div className="e0-page">
      <a href="#main" className="skip-link">
        Aller au contenu principal
      </a>
      <E0MarketingHeader active="nattukaay" />
      <main id="main" className="e0-nattukaay-main">
        <NattukaaySimulator />
      </main>
      <E0LegalFooter />
    </div>
  );
}
