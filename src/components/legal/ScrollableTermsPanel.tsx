'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LegalDocument } from '@/lib/legal/types';
import LegalSectionContent from './LegalSectionContent';

const SCROLL_BOTTOM_THRESHOLD_PX = 24;

interface ScrollableTermsPanelProps {
  document: LegalDocument;
  accepted: boolean;
  onAcceptedChange: (accepted: boolean) => void;
  acceptanceLabel: string;
  className?: string;
}

export default function ScrollableTermsPanel({
  document,
  accepted,
  onAcceptedChange,
  acceptanceLabel,
  className = '',
}: ScrollableTermsPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_BOTTOM_THRESHOLD_PX;
    if (atBottom) {
      setHasScrolledToBottom(true);
    }
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => {
      updateScrollState();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateScrollState, document.sections.length]);

  useEffect(() => {
    if (!hasScrolledToBottom && accepted) {
      onAcceptedChange(false);
    }
  }, [accepted, hasScrolledToBottom, onAcceptedChange]);

  return (
    <div className={`scrollable-terms ${className}`.trim()}>
      <p className="scrollable-terms-version">{document.subtitle}</p>
      <div
        ref={scrollRef}
        className="scrollable-terms-body"
        onScroll={updateScrollState}
        tabIndex={0}
        role="region"
        aria-label={document.title}
      >
        {document.sections.map((section, index) => (
          <LegalSectionContent
            key={`${section.type}-${index}`}
            section={section}
            variant="compact"
          />
        ))}
      </div>

      {!hasScrolledToBottom && (
        <p className="scrollable-terms-hint" role="status">
          Faites défiler jusqu&apos;en bas pour pouvoir accepter les conditions.
        </p>
      )}

      <label
        className={`scrollable-terms-check${!hasScrolledToBottom ? ' scrollable-terms-check--disabled' : ''}`}
      >
        <input
          type="checkbox"
          checked={accepted}
          disabled={!hasScrolledToBottom}
          onChange={(e) => onAcceptedChange(e.target.checked)}
          className="scrollable-terms-check-input"
        />
        <span className="scrollable-terms-check-label">{acceptanceLabel}</span>
      </label>
    </div>
  );
}
