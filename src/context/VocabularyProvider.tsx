import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { vocabularyApi } from '../lib/api'
import { loadLegacyVocabulary, markLegacyVocabularyMigrated } from '../lib/legacyStorage'
import type { NewVocabulary, Vocabulary } from '../types/vocabulary'
import { VocabularyContext, type LoadStatus } from './vocabularyContext'

async function fetchAndMigrate(): Promise<Vocabulary[]> {
  const legacy = loadLegacyVocabulary()
  if (legacy.length === 0) return vocabularyApi.list()
  // The import endpoint skips ids it already has, so running this twice is harmless.
  const items = await vocabularyApi.import(legacy)
  markLegacyVocabularyMigrated()
  return items
}

export function VocabularyProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Vocabulary[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetchAndMigrate()
      .then((loaded) => {
        if (cancelled) return
        setItems(loaded)
        setStatus('ready')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : String(err))
        setStatus('error')
      })
    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const reload = useCallback(() => {
    setStatus('loading')
    setError(null)
    setReloadToken((token) => token + 1)
  }, [])

  const addWord = useCallback(async (word: NewVocabulary) => {
    const created = await vocabularyApi.create(word)
    setItems((prev) => [created, ...prev])
    return created
  }, [])

  const updateWord = useCallback(async (id: string, word: NewVocabulary) => {
    const updated = await vocabularyApi.update(id, word)
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }, [])

  const setWordLearned = useCallback(async (id: string, learned: boolean) => {
    const updated = await vocabularyApi.setLearned(id, learned)
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }, [])

  const removeWord = useCallback(async (id: string) => {
    await vocabularyApi.remove(id)
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const value = useMemo(
    () => ({ items, status, error, reload, addWord, updateWord, setWordLearned, removeWord }),
    [items, status, error, reload, addWord, updateWord, setWordLearned, removeWord],
  )

  return <VocabularyContext.Provider value={value}>{children}</VocabularyContext.Provider>
}
