export type LegalSection =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
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
