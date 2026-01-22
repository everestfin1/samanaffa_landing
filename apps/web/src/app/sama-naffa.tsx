import SamaNaffa from '@/components/SamaNaffa/SamaNaffa';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/sama-naffa')({
  component: SamaNaffaPage,
});

export default function SamaNaffaPage() {
  return <SamaNaffa />;
}
