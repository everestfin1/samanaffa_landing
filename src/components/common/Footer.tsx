import Link from "next/link";
import { Facebook, Twitter, Instagram, MessageCircle } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { href: "/pourquoi-sama-naffa", label: "Pourquoi Sama Naffa" },
      { href: "/securite", label: "Sécurité" },
      { href: "/conformite", label: "Conformité BCEAO" },
      { href: "/carriere", label: "Carrières" },
    ],
    support: [
      { href: "/faq", label: "FAQ" },
      { href: "/assistance", label: "Assistance" },
      { href: "/contact", label: "Contact" },
      { href: "/guide", label: "Guide d'utilisation" },
    ],
    legal: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Politique de confidentialité" },
      { href: "/conditions-generales", label: "Conditions générales" },
      { href: "/cookies", label: "Politique cookies" },
    ],
  };

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "https://wa.me/221XXXXXXXXX", icon: MessageCircle, label: "WhatsApp" },
  ];

  return (
    <footer className="bg-muted border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center">
                <span className="text-background font-bold text-sm">SN</span>
              </div>
              <span className="text-xl font-bold text-foreground">Sama Naffa</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Épargner pour vos projets, facilement et en toute sécurité.
              Plateforme mobile-first avec confirmation immédiate.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors duration-300 p-2 rounded-lg hover:bg-card"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </Link>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
              Société
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-6">
              Légal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
              <span className="text-sm text-muted-foreground">
                © {currentYear} Sama Naffa. Tous droits réservés.
              </span>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-foreground rounded-full flex items-center justify-center">
                  <span className="text-background text-xs font-bold">✓</span>
                </div>
                <span className="text-sm text-muted-foreground">Conforme BCEAO</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              <Link href="/intouch" className="hover:text-foreground transition-colors duration-300">
                Powered by Intouch
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
