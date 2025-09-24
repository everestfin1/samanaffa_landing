"use client"

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export const WhatsAppButton: React.FC = () => {
  const pathname = usePathname();
  
  // Check if user is in admin portal
  const isInAdminorClientPortal = pathname.startsWith('/admin') || pathname.startsWith('/portal');
  
  // Hide WhatsApp button if in admin portal
  if (isInAdminorClientPortal) {
    return null;
  }

  const handleClick = () => {
    // Replace with actual WhatsApp number
    const phoneNumber = '+221770993382';
    const message = encodeURIComponent('Bonjour, je souhaite en savoir plus sur vos services d\'investissement.');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-300"
      aria-label="Contacter Everest Finance sur WhatsApp"
      title="Discuter sur WhatsApp"
    >
      <Image src="/whatsapp.png" alt="WhatsApp" width={24} height={24} />
    </button>
  );
};

