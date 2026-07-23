import Image from "next/image";

const socialLinks = [
  {
    href: "https://www.facebook.com/",
    label: "Facebook",
    icon: "/figma/e0/social/facebook.svg",
  },
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: "/figma/e0/social/instagram.svg",
  },
  {
    href: "https://www.tiktok.com/",
    label: "TikTok",
    icon: "/figma/e0/social/tiktok.svg",
  },
  {
    href: "https://www.youtube.com/",
    label: "YouTube",
    icon: "/figma/e0/social/youtube.svg",
  },
] as const;

/** Full-screen brand splash fixed under the landing sheet; revealed by scroll. */
export default function E0AfterFooter() {
  return (
    <aside className="e0-after-footer" aria-label="Sama Naffa — réseaux sociaux">
      <Image
        src="/figma/e0/logo-large.png"
        alt="Sama Naffa par Everest Finance"
        width={586}
        height={329}
        sizes="(max-width: 640px) 90vw, 586px"
        className="h-auto w-full max-w-[586px] object-contain"
      />
      <h2 className="e0-brand-tagline">Dencukaay bu jáppandi te woor</h2>
      <div className="e0-social-row">
        <p className="e0-social-label">Rejoins-nous sur nos plateformes</p>
        <ul className="e0-social-icons" aria-label="Réseaux sociaux">
          {socialLinks.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="e0-social-link"
                aria-label={social.label}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG brand marks from Figma */}
                <img
                  src={social.icon}
                  alt=""
                  width={30}
                  height={30}
                  className="e0-social-icon"
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
