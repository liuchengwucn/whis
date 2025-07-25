export interface GlossaryItem {
  id: string;
  original: string;
  translation: string;
  explanation?: string;
}

export interface Glossary {
  name: string;
  items: GlossaryItem[];
}
