import {
  ARTICLES,
  WORD_TYPES,
  type Article,
  type NewVocabulary,
  type Vocabulary,
  type WordType,
} from '../types/vocabulary'
import { isISODate, todayISO } from './date'

const isArticle = (value: unknown): value is Article => ARTICLES.includes(value as Article)
const isWordType = (value: unknown): value is WordType => WORD_TYPES.includes(value as WordType)
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const optionalString = (value: unknown): string => (typeof value === 'string' ? value.trim() : '')

/**
 * Validates a stored entry and upgrades older entries
 * (missing word type → noun, missing other → '', missing date → today).
 */
export function normalizeVocabulary(value: unknown): Vocabulary | null {
  if (!isRecord(value) || typeof value.id !== 'string' || !value.id) return null
  const parsed = parseNewVocabulary({
    ...value,
    wordType: value.wordType ?? 'noun',
    date: isISODate(value.date) ? value.date : todayISO(),
  })
  return typeof parsed === 'string'
    ? null
    : { id: value.id, ...parsed, learned: value.learned === true }
}

/** Validates user input for a new or updated word. Returns an error message when invalid. */
export function parseNewVocabulary(value: unknown): NewVocabulary | string {
  if (!isRecord(value)) return 'Expected a vocabulary object.'

  const { wordType, article, date } = value
  const germanWord = optionalString(value.germanWord)
  const hungarianMeaning = optionalString(value.hungarianMeaning)

  if (!isWordType(wordType)) return `wordType must be one of: ${WORD_TYPES.join(', ')}.`
  if (wordType === 'noun' && !isArticle(article)) return `Nouns need an article: ${ARTICLES.join(', ')}.`
  if (!germanWord) return 'germanWord is required.'
  if (!hungarianMeaning) return 'hungarianMeaning is required.'
  if (!isISODate(date)) return 'date must be in YYYY-MM-DD format.'

  return {
    wordType,
    article: wordType === 'noun' ? (article as Article) : undefined,
    germanWord,
    hungarianMeaning,
    exampleSentence: optionalString(value.exampleSentence),
    other: optionalString(value.other),
    date,
  }
}
