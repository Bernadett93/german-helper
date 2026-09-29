import { ArrowLeftRight, Check, Eye, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { useVocabulary } from '../hooks/useVocabulary'
import type { Vocabulary } from '../types/vocabulary'

type Direction = 'german-to-hungarian' | 'hungarian-to-german'

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
  const { items } = useVocabulary()
  const [deck, setDeck] = useState(() => shuffle(items))
  const [direction, setDirection] = useState<Direction>('german-to-hungarian')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [knownCount, setKnownCount] = useState(0)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [answerVisible, setAnswerVisible] = useState(false)

  const currentWord = deck[currentIndex]
  const isComplete = deck.length > 0 && answeredCount >= deck.length
  const prompt =
    direction === 'german-to-hungarian' ? getGermanWord(currentWord) : currentWord?.hungarianMeaning
  const answer =
    direction === 'german-to-hungarian' ? currentWord?.hungarianMeaning : getGermanWord(currentWord)

  const startAgain = () => {
    setDeck(shuffle(items))
    setCurrentIndex(0)
    setKnownCount(0)
    setAnsweredCount(0)
    setAnswerVisible(false)
  }

  const changeDirection = (nextDirection: Direction) => {
    setDirection(nextDirection)
    startAgain()
  }

  const rateAnswer = (knewIt: boolean) => {
    if (knewIt) setKnownCount((count) => count + 1)
    setAnsweredCount((count) => count + 1)
    setCurrentIndex((index) => index + 1)
    setAnswerVisible(false)
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
            disabled={items.length === 0}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" /> Restart
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
            <div className="rounded-2xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-slate-900">Practice complete!</h2>
              <p className="mt-2 text-sm text-slate-500">
                You knew {knownCount} of {deck.length} {deck.length === 1 ? 'word' : 'words'}.
              </p>
              <button
                type="button"
                onClick={startAgain}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
              >
                <RotateCcw className="h-4 w-4" /> Practice again
              </button>
            </div>
          ) : (
            <>
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
                      className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                    >
                      <X className="h-4 w-4" /> Not yet
                    </button>
                    <button
                      type="button"
                      onClick={() => rateAnswer(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
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
        </section>
      )}
    </>
  )
}
