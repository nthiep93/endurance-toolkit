export interface GuideSection {
  heading: string;
  /** Paragraphs of plain text. Use \n\n-free strings; one array item = one paragraph. */
  paragraphs: string[];
  /** optional bullet list rendered after the paragraphs */
  bullets?: string[];
  /** optional simple table */
  table?: { headers: string[]; rows: string[][] };
}

export interface Faq {
  q: string;
  a: string;
}

export interface Guide {
  slug: string;
  /** 1–2 sentence lede shown right under the H1, above the tool */
  intro: string;
  /** numbered "How to use" steps (HowTo schema) */
  howTo: string[];
  sections: GuideSection[];
  faqs: Faq[];
  /** ISO date the guide was last reviewed */
  updated: string;
}
