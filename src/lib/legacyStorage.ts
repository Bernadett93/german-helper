import type { Vocabulary } from '../types/vocabulary'
import { normalizeVocabulary } from './vocabularyValidation'

/** Words were stored in localStorage before the local backend existed. */
const LEGACY_KEY = 'german-helper.vocabulary'
const BACKUP_KEY = 'german-helper.vocabulary.migrated-backup'

export function loadLegacyVocabulary(): Vocabulary[] {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalizeVocabulary).filter((item): item is Vocabulary => item !== null)
  } catch {
    return []
  }
}

/** Keeps a backup copy so nothing is lost, but stops the migration from running again. */
export function markLegacyVocabularyMigrated(): void {
  try {
    const raw = localStorage.getItem(LEGACY_KEY)
    if (raw !== null) localStorage.setItem(BACKUP_KEY, raw)
    localStorage.removeItem(LEGACY_KEY)
  } catch (error) {
    console.error('Failed to clean up legacy localStorage vocabulary', error)
  }
}
