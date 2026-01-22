import PEE from '@/components/PEE/PEE';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/pee')({
  component: PEEPage,
  head: () => ({
    meta: [
      { title: 'Plan Épargne Éducation (PEE) | EVEREST Finance' },
      {
        name: 'description',
        content: "Préparez dès aujourd'hui l'avenir scolaire de vos enfants. Épargne progressive dès 30 000 FCFA/mois avec un rendement attractif à partir de 4,5%.",
      },
    ],
    links: [
      { rel: 'icon', href: '/logo-everest.png' },
    ],
  }),
});

function PEEPage() {
  return <PEE />;
}