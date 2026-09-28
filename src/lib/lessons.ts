import type { Vocabulary } from '../types/vocabulary'

/** Distinct lesson dates, newest first. */
export function getLessonDates(items: Vocabulary[]): string[] {
  return [...new Set(items.map((w) => w.date))].sort((a, b) => b.localeCompare(a))
}

export function getWordsFromLesson(items: Vocabulary[], date: string): Vocabulary[] {
  return items.filter((w) => w.date === date)
}

export function getLatestLessonWords(items: Vocabulary[]): Vocabulary[] {
  const [latest] = getLessonDates(items)
  return latest ? getWordsFromLesson(items, latest) : []
}
