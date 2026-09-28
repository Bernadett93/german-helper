import { createContext } from 'react'
import type { NewVocabulary, Vocabulary } from '../types/vocabulary'

export type LoadStatus = 'loading' | 'ready' | 'error'

export interface VocabularyContextValue {
  items: Vocabulary[]
  status: LoadStatus
  error: string | null
  reload: () => void
  /** Mutations reject with an Error when the server call fails. */
  addWord: (word: NewVocabulary) => Promise<Vocabulary>
  updateWord: (id: string, word: NewVocabulary) => Promise<Vocabulary>
  removeWord: (id: string) => Promise<void>
}

export const VocabularyContext = createContext<VocabularyContextValue | null>(null)
