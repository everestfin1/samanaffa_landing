import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#2e0e36] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
          
          {/* Logo & Address */}
          <div className="text-center md:text-left space-y-4">
            <Image
              src="/everestfin_logo.png"
              alt="Everest Finance"
              width={180}
              height={60}
              className="mx-auto md:mx-0 bg-white/10 p-2 rounded"
            />
            <div className="text-gray-300 text-sm">
              <p>18 Boulevard de la République</p>
              <p>Dakar, Sénégal BP : 11659-13000</p>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-right space-y-4">
            <h4 className="font-bold text-[#C09037] uppercase tracking-wider">Nous contacter</h4>
            <div className="space-y-2 text-gray-300">
              <p>
                <a href="mailto:contact@everestfin.com" className="hover:text-white transition-colors">
                  contact@everestfin.com
                </a>
              </p>
              <p>
                <a href="tel:+221338228700" className="hover:text-white transition-colors">
                  +221 33 822 87 00
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-500 text-xs">
          <p>© {currentYear} EVEREST Finance. All Rights Reserved</p>
          <p className="mt-2">Agrément n° SGI /DA/2016/60</p>
        </div>
      </div>
    </footer>
  );
}
