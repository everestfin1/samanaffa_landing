import Image from "next/image";
import Link from "next/link";

type E0MarketingHeaderProps = {
  active?: "accueil" | "nattukaay";
};

export default function E0MarketingHeader({ active = "accueil" }: E0MarketingHeaderProps) {
  const linkClass = (key: "accueil" | "nattukaay") =>
    [
      "text-[15px] font-medium transition-colors hover:text-[var(--sama-marigold)]",
      active === key ? "text-[var(--sama-forest)]" : "text-[var(--sama-cod-gray)]",
    ].join(" ");

  return (
    <header className="e0-header">
      <div className="relative mx-auto flex h-[88px] max-w-[1200px] items-center justify-between px-5 sm:px-8 lg:px-11">
        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          <Link className={linkClass("accueil")} href="/">
            Accueil
          </Link>
          <Link className={linkClass("nattukaay")} href="/sama-naffa">
            Nattukaay Yéené
          </Link>
        </nav>

        <Link
          className="absolute left-1/2 -translate-x-1/2 transition-opacity hover:opacity-80"
          href="/"
          aria-label="Accueil Sama Naffa"
        >
          <Image
            src="/figma/e0/logo-small.png"
            alt="Sama Naffa par Everest Finance"
            width={180}
            height={100}
            priority
            className="h-[72px] w-auto object-contain"
          />
        </Link>

        <Link href="/login" className="e0-cta-forest ml-auto">
          Se connecter
        </Link>
      </div>
    </header>
  );
}
