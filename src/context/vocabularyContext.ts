import { createContext } from 'react'
import type { NewVocabulary, Vocabulary } from '../types/vocabulary'

export interface VocabularyContextValue {
  items: Vocabulary[]
  addWord: (word: NewVocabulary) => Vocabulary
  removeWord: (id: string) => void
}

export const VocabularyContext = createContext<VocabularyContextValue | null>(null)
