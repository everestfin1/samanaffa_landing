export type LegalSection =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  /** A paragraph introduced by a bold inline term/lead-in (not a standalone title). */
  | { type: 'lead-paragraph'; lead: string; text: string }
  | { type: 'list'; items: string[] }
  | {
      type: 'table';
      headers: string[];
      rows: string[][];
    };

export type LegalDocument = {
  title: string;
  subtitle?: string;
  sections: LegalSection[];
};
