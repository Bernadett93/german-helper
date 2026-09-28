import { PlusCircle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { SearchBar } from '../components/vocabulary/SearchBar'
import { VocabularyList } from '../components/vocabulary/VocabularyList'
import { useVocabulary } from '../hooks/useVocabulary'
import { formatDate } from '../lib/date'
import { getLessonDates } from '../lib/lessons'
import { ARTICLES, type Article, type Vocabulary } from '../types/vocabulary'

type WordFilter = 'all' | Article | 'verb' | 'other'

const FILTERS: { value: WordFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  ...ARTICLES.map((article) => ({ value: article, label: article })),
  { value: 'verb', label: 'Verbs' },
  { value: 'other', label: 'Other' },
]

function matchesFilter(word: Vocabulary, filter: WordFilter): boolean {
  if (filter === 'all') return true
  if (filter === 'verb' || filter === 'other') return word.wordType === filter
  return word.wordType === 'noun' && word.article === filter
}

/** 'all', 'latest', or a specific YYYY-MM-DD lesson date. */
type LessonFilter = string

export function VocabularyPage() {
  const { items, removeWord } = useVocabulary()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<WordFilter>('all')
  const [lesson, setLesson] = useState<LessonFilter>('all')

  const lessonDates = useMemo(() => getLessonDates(items), [items])
  const selectedDate = lesson === 'latest' ? lessonDates[0] : lesson

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return items.filter((w) => {
      if (lesson !== 'all' && w.date !== selectedDate) return false
      if (!matchesFilter(w, filter)) return false
      if (!q) return true
      const fullWord = w.article ? `${w.article} ${w.germanWord}` : w.germanWord
      return [w.germanWord, w.hungarianMeaning, w.exampleSentence, w.other, fullWord].some((field) =>
        field.toLowerCase().includes(q),
      )
    })
  }, [items, query, filter, lesson, selectedDate])

  return (
    <>
      <PageHeader
        title="Vocabulary"
        description={`${items.length} word${items.length === 1 ? '' : 's'} in your collection`}
        actions={
          <Link
            to="/vocabulary/new"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <PlusCircle className="h-4 w-4" /> Add word
          </Link>
        }
      />

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex-1">
          <SearchBar value={query} onChange={setQuery} placeholder="Search German, Hungarian, forms or example…" />
        </div>
        <select
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          aria-label="Filter by lesson date"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
        >
          <option value="all">All lessons</option>
          {lessonDates.length > 0 && <option value="latest">Latest lesson ({formatDate(lessonDates[0])})</option>}
          {lessonDates.map((date) => (
            <option key={date} value={date}>
              {formatDate(date)}
            </option>
          ))}
        </select>
        <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === value ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <VocabularyList items={filtered} onDelete={removeWord} />
      ) : items.length === 0 ? (
        <EmptyState title="Your vocabulary is empty" description="Add some words to see them here." />
      ) : (
        <EmptyState title="No matches" description="Try a different search term or filter." />
      )}
    </>
  )
}
