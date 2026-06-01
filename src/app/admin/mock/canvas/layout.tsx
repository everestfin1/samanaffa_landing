import type { ReactNode } from 'react';
import CanvasShell from './_components/CanvasShell';

export default function CanvasLayout({ children }: { children: ReactNode }) {
  return <CanvasShell>{children}</CanvasShell>;
}
