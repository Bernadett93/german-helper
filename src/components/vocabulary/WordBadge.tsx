import { WORD_TYPE_META } from '../../lib/wordTypes'
import type { Vocabulary, WordType } from '../../types/vocabulary'
import { ArticleBadge } from './ArticleBadge'

const TYPE_STYLES: Record<Exclude<WordType, 'noun'>, string> = {
  verb: 'bg-amber-100 text-amber-700 ring-amber-200',
  other: 'bg-slate-100 text-slate-600 ring-slate-200',
}

/** Shows the article for nouns and the word type for everything else. */
export function WordBadge({ word }: { word: Vocabulary }) {
  if (word.wordType === 'noun' && word.article) {
    return <ArticleBadge article={word.article} />
  }
  const type = word.wordType === 'noun' ? 'other' : word.wordType
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${TYPE_STYLES[type]}`}
    >
      {WORD_TYPE_META[word.wordType].label}
    </span>
  )
}
