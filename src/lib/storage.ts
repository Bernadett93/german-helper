import { ARTICLES, WORD_TYPES, type Article, type Vocabulary, type WordType } from '../types/vocabulary'
import { isISODate, todayISO } from './date'

const STORAGE_KEY = 'german-helper.vocabulary'

const isArticle = (value: unknown): value is Article => ARTICLES.includes(value as Article)
const isWordType = (value: unknown): value is WordType => WORD_TYPES.includes(value as WordType)

/** Validates a stored entry and upgrades older entries (missing word type → noun, missing date → today). */
function normalize(value: unknown): Vocabulary | null {
  if (typeof value !== 'object' || value === null) return null
  const v = value as Record<string, unknown>
  if (
    typeof v.id !== 'string' ||
    typeof v.germanWord !== 'string' ||
    typeof v.hungarianMeaning !== 'string' ||
    typeof v.exampleSentence !== 'string'
  ) {
    return null
  }

  const wordType: WordType = isWordType(v.wordType) ? v.wordType : 'noun'
  if (wordType === 'noun' && !isArticle(v.article)) return null

  return {
    id: v.id,
    wordType,
    article: wordType === 'noun' ? (v.article as Article) : undefined,
    germanWord: v.germanWord,
    hungarianMeaning: v.hungarianMeaning,
    exampleSentence: v.exampleSentence,
    other: typeof v.other === 'string' ? v.other : '',
    date: isISODate(v.date) ? v.date : todayISO(),
  }
}

export function loadVocabulary(): Vocabulary[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map(normalize).filter((item): item is Vocabulary => item !== null)
  } catch {
    return []
  }
}

export function saveVocabulary(items: Vocabulary[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch (error) {
    console.error('Failed to save vocabulary to localStorage', error)
  }
}
