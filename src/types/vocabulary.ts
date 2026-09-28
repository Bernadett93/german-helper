export const ARTICLES = ['der', 'die', 'das'] as const
export const WORD_TYPES = ['noun', 'verb', 'other'] as const

export type Article = (typeof ARTICLES)[number]
export type WordType = (typeof WORD_TYPES)[number]

export interface Vocabulary {
  id: string
  wordType: WordType
  /** Only set for nouns. */
  article?: Article
  germanWord: string
  hungarianMeaning: string
  exampleSentence: string
  /** Noun: plural form. Verb: Präteritum and Partizip II. */
  other: string
  /** Lesson date as YYYY-MM-DD. */
  date: string
}

export type NewVocabulary = Omit<Vocabulary, 'id'>
