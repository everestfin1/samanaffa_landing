"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { SAMA_NAFFA_CONTACT } from "@/lib/contact";
import { shouldHideWhatsApp } from "@/lib/site-chrome";

const WHATSAPP_PREFILL =
  "Bonjour, je souhaite en savoir plus sur vos services d'investissement.";

export const WhatsAppButton: React.FC = () => {
  const pathname = usePathname();

  if (shouldHideWhatsApp(pathname)) {
    return null;
  }

  const handleClick = () => {
    const message = encodeURIComponent(WHATSAPP_PREFILL);
    const whatsappUrl = `${SAMA_NAFFA_CONTACT.whatsappHref}?text=${message}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 rounded-full bg-green-500 p-2 text-white shadow-lg transition-all duration-300 transform hover:scale-110 hover:bg-green-600 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-300"
      aria-label="Contacter Everest Finance sur WhatsApp"
      title="Discuter sur WhatsApp"
    >
      <Image src="/whatsapp.png" alt="WhatsApp" width={36} height={36} />
    </button>
  );
};
