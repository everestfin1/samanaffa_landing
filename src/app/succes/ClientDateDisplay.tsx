'use client';

import { useState, useEffect } from 'react';

interface ClientDateDisplayProps {
  type: 'current' | 'next-month';
}

export default function ClientDateDisplay({ type }: ClientDateDisplayProps) {
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    if (type === 'current') {
      setDateString(new Date().toLocaleDateString('fr-FR'));
    } else if (type === 'next-month') {
      setDateString(`1er ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { month: 'long' })}`);
    }
  }, [type]);

  return <span className="font-semibold text-card-foreground">{dateString}</span>;
}
