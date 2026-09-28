import { CalendarDays, Trash2 } from 'lucide-react'
import type { Vocabulary } from '../../types/vocabulary'
import { formatDate } from '../../lib/date'
import { WORD_TYPE_META } from '../../lib/wordTypes'
import { WordBadge } from './WordBadge'

interface VocabularyCardProps {
  word: Vocabulary
  onDelete?: (id: string) => void
}

export function VocabularyCard({ word, onDelete }: VocabularyCardProps) {
  return (
    <article className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <WordBadge word={word} />
          <h3 className="mt-2 truncate text-lg font-semibold text-slate-900">{word.germanWord}</h3>
          {word.other && (
            <p className="text-sm text-slate-700">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {WORD_TYPE_META[word.wordType].otherLabel}:
              </span>{' '}
              {word.other}
            </p>
          )}
          <p className="text-sm text-slate-500">{word.hungarianMeaning}</p>
        </div>
        {onDelete && (
          <button
            type="button"
            onClick={() => onDelete(word.id)}
            aria-label={`Delete ${word.germanWord}`}
            className="rounded-lg p-2 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 focus:opacity-100"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
      {word.exampleSentence && (
        <p className="mt-4 border-l-2 border-indigo-200 pl-3 text-sm italic text-slate-600">
          „{word.exampleSentence}“
        </p>
      )}
      <p className="mt-auto flex items-center gap-1.5 pt-4 text-xs text-slate-400">
        <CalendarDays className="h-3.5 w-3.5" />
        <time dateTime={word.date}>{formatDate(word.date)}</time>
      </p>
    </article>
  )
}
