import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { loadVocabulary, saveVocabulary } from '../lib/storage'
import type { NewVocabulary, Vocabulary } from '../types/vocabulary'
import { VocabularyContext } from './vocabularyContext'

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Vocabulary[]>(loadVocabulary)

  useEffect(() => {
    saveVocabulary(items)
  }, [items])

  const addWord = useCallback((word: NewVocabulary) => {
    const created: Vocabulary = { ...word, id: crypto.randomUUID() }
    setItems((prev) => [created, ...prev])
    return created
  }, [])

  const removeWord = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const value = useMemo(() => ({ items, addWord, removeWord }), [items, addWord, removeWord])

  return <VocabularyContext.Provider value={value}>{children}</VocabularyContext.Provider>
}
