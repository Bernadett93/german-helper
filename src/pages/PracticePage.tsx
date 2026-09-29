import { ArrowLeftRight, Check, Eye, RefreshCw, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { useVocabulary } from '../hooks/useVocabulary'
import { formatDate } from '../lib/date'
import { getLessonDates } from '../lib/lessons'
import type { Vocabulary } from '../types/vocabulary'

type Direction = 'german-to-hungarian' | 'hungarian-to-german'
type LearningFilter = 'all' | 'not-learned' | 'learned'

function shuffle(items: Vocabulary[]): Vocabulary[] {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

function getGermanWord(word: Vocabulary): string {
  return word.article ? `${word.article} ${word.germanWord}` : word.germanWord
}

export function PracticePage() {
  const { items, setWordLearned } = useVocabulary()
  const [selectedDate, setSelectedDate] = useState('all')
  const [learningFilter, setLearningFilter] = useState<LearningFilter>('all')
  const [deck, setDeck] = useState(() => shuffle(items))
  const [direction, setDirection] = useState<Direction>('german-to-hungarian')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<{ word: Vocabulary; knewIt: boolean }[]>([])
  const [answerVisible, setAnswerVisible] = useState(false)
  const [savingAnswer, setSavingAnswer] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lessonDates = getLessonDates(items)
  const practiceWords = items.filter((word) => {
    if (selectedDate !== 'all' && word.date !== selectedDate) return false
    if (learningFilter === 'learned' && !word.learned) return false
    if (learningFilter === 'not-learned' && word.learned) return false
    return true
  })
  const currentWord: Vocabulary | undefined = deck[currentIndex]
  const answeredCount = results.length
  const isComplete = deck.length > 0 && answeredCount >= deck.length
  const knownCount = results.filter((r) => r.knewIt).length
  const unlearnedForDate = items.filter(
    (word) => !word.learned && (selectedDate === 'all' || word.date === selectedDate),
  )
  const germanText = currentWord ? getGermanWord(currentWord) : ''
  const hungarianText = currentWord?.hungarianMeaning ?? ''
  const prompt = direction === 'german-to-hungarian' ? germanText : hungarianText
  const answer = direction === 'german-to-hungarian' ? hungarianText : germanText

  const resetSession = (words: Vocabulary[]) => {
    setDeck(shuffle(words))
    setCurrentIndex(0)
    setResults([])
    setAnswerVisible(false)
    setError(null)
  }

  const startAgain = () => resetSession(practiceWords)

  const changeDate = (date: string) => {
    setSelectedDate(date)
    resetSession(
      items.filter((word) => {
        if (date !== 'all' && word.date !== date) return false
        if (learningFilter === 'learned' && !word.learned) return false
        if (learningFilter === 'not-learned' && word.learned) return false
        return true
      }),
    )
  }

  const changeLearningFilter = (filter: LearningFilter) => {
    setLearningFilter(filter)
    resetSession(
      items.filter((word) => {
        if (selectedDate !== 'all' && word.date !== selectedDate) return false
        if (filter === 'learned' && !word.learned) return false
        if (filter === 'not-learned' && word.learned) return false
        return true
      }),
    )
  }

  const changeDirection = (nextDirection: Direction) => {
    setDirection(nextDirection)
    startAgain()
  }

  const rateAnswer = async (knewIt: boolean) => {
    if (!currentWord || savingAnswer) return
    setSavingAnswer(true)
    setError(null)
    try {
      await setWordLearned(currentWord.id, knewIt)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save learned status.')
      setSavingAnswer(false)
      return
    }
    setResults((prev) => [...prev, { word: currentWord, knewIt }])
    setCurrentIndex((index) => index + 1)
    setAnswerVisible(false)
    setSavingAnswer(false)
  }

  return (
    <>
      <PageHeader
        title="Practice"
        description="Test yourself with words from your vocabulary."
        actions={
          <button
            type="button"
            onClick={startAgain}
            disabled={practiceWords.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className="h-4 w-4" /> Restart
          </button>
        }
      />

      {items.length === 0 ? (
        <EmptyState
          title="No words to practice yet"
          description="Add some German vocabulary first, then come back to test yourself."
          action={
            <Link
              to="/vocabulary/new"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              Add a word
            </Link>
          }
        />
      ) : (
        <section className="mx-auto max-w-2xl">
          <label className="mb-4 flex flex-col gap-1.5 text-sm font-medium text-slate-700 sm:max-w-xs">
            Practice words from
            <select
              value={selectedDate}
              onChange={(event) => changeDate(event.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">All dates</option>
              {lessonDates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </label>
          <label className="mb-5 flex flex-col gap-1.5 text-sm font-medium text-slate-700 sm:max-w-xs">
            Word status
            <select
              value={learningFilter}
              onChange={(event) => changeLearningFilter(event.target.value as LearningFilter)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
            >
              <option value="all">All words</option>
              <option value="not-learned">Not learned</option>
              <option value="learned">Already learned</option>
            </select>
          </label>
          {deck.length === 0 ? (
            <EmptyState
              title="No words match these filters"
              description="Choose another date or word status to continue practicing."
            />
          ) : (
            <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => changeDirection('german-to-hungarian')}
                aria-pressed={direction === 'german-to-hungarian'}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  direction === 'german-to-hungarian'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                German → Hungarian
              </button>
              <button
                type="button"
                onClick={() => changeDirection('hungarian-to-german')}
                aria-pressed={direction === 'hungarian-to-german'}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  direction === 'hungarian-to-german'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Hungarian → German
              </button>
            </div>
            {!isComplete && (
              <p className="text-sm font-medium text-slate-500">
                {answeredCount + 1} / {deck.length}
              </p>
            )}
          </div>

          {isComplete ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-slate-900">Practice summary</h2>
              <div className="mx-auto mt-6 grid max-w-md grid-cols-2 gap-4">
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-3xl font-bold text-emerald-700">{knownCount}</p>
                  <p className="mt-1 text-sm font-medium text-emerald-800">Learned</p>
                </div>
                <div className="rounded-xl bg-rose-50 p-4">
                  <p className="text-3xl font-bold text-rose-700">{deck.length - knownCount}</p>
                  <p className="mt-1 text-sm font-medium text-rose-800">Still to learn</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={startAgain}
                  disabled={practiceWords.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" /> Practice again
                </button>
                <button
                  type="button"
                  onClick={() => changeLearningFilter('not-learned')}
                  disabled={unlearnedForDate.length === 0}
                  className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw className="h-4 w-4" /> Practice unlearned words ({unlearnedForDate.length})
                </button>
              </div>
            </div>
          ) : (
            <>
              {error && (
                <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
                  {error}
                </p>
              )}
              <div className="mb-2 h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all"
                  style={{ width: `${(answeredCount / deck.length) * 100}%` }}
                />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm sm:px-10">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
                  {direction === 'german-to-hungarian' ? 'Translate to Hungarian' : 'Translate to German'}
                </p>
                <p className="mt-6 text-3xl font-bold tracking-tight text-slate-900">{prompt}</p>

                {answerVisible ? (
                  <div className="mt-8 rounded-xl bg-indigo-50 px-5 py-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-500">Answer</p>
                    <p className="mt-1 text-xl font-semibold text-indigo-950">{answer}</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAnswerVisible(true)}
                    className="mt-8 inline-flex items-center gap-2 rounded-xl border border-indigo-200 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50"
                  >
                    <Eye className="h-4 w-4" /> Reveal answer
                  </button>
                )}

                {answerVisible && (
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => rateAnswer(false)}
                      disabled={savingAnswer}
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                    >
                      <X className="h-4 w-4" /> Not yet
                    </button>
                    <button
                      type="button"
                      onClick={() => rateAnswer(true)}
                      disabled={savingAnswer}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60"
                    >
                      <Check className="h-4 w-4" /> I knew it
                    </button>
                  </div>
                )}
              </div>
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-slate-500">
                <ArrowLeftRight className="h-4 w-4" />
                Words are shuffled for each practice session.
              </p>
            </>
          )}
            </>
          )}
        </section>
      )}
    </>
  )
}
