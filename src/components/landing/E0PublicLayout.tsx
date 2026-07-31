import E0LegalFooter from '@/components/landing/E0LegalFooter';
import E0MarketingHeader from '@/components/landing/E0MarketingHeader';

type E0PublicLayoutProps = {
  children: React.ReactNode;
  active?: 'accueil' | 'nattukaay';
};

export default function E0PublicLayout({
  children,
  active = 'accueil',
}: E0PublicLayoutProps) {
  return (
    <div className="e0-page flex min-h-dvh flex-col">
      <a href="#main" className="skip-link">
        Aller au contenu principal
      </a>
      <E0MarketingHeader active={active} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <E0LegalFooter />
    </div>
  );
}
