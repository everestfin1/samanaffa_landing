import APETogo from "@/components/APETogo/APETogo";
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/ape')({
  component: APETogoPage,
  head: () => ({
    meta: [
      { title: "APE Togo - Appel Public à l'Épargne État du Togo 2026-2031 | EVEREST Finance" },
      {
        name: 'description',
        content: "Appel Public à l'Épargne de l'État du Togo 2026-2031. EVEREST Finance, co-chef de file de l'opération.",
      },
    ],
  }),
});

export default function APETogoPage() {
  return <APETogo />;
}
