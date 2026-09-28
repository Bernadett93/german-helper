import { CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { VocabularyForm } from '../components/vocabulary/VocabularyForm'
import { useVocabulary } from '../hooks/useVocabulary'
import type { Vocabulary } from '../types/vocabulary'

export function AddVocabularyPage() {
  const { addWord } = useVocabulary()
  const [lastAdded, setLastAdded] = useState<Vocabulary | null>(null)

  return (
    <div className="max-w-2xl">
      <PageHeader title="Add word" description="Add a new German word to your vocabulary." />

      {lastAdded && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span className="flex-1">
            Added{' '}
            <strong>
              {lastAdded.article ? `${lastAdded.article} ` : ''}
              {lastAdded.germanWord}
            </strong>{' '}
            ({lastAdded.hungarianMeaning}).
          </span>
          <Link to="/vocabulary" className="font-medium underline-offset-2 hover:underline">
            View list
          </Link>
        </div>
      )}

      <VocabularyForm onSubmit={(word) => setLastAdded(addWord(word))} />
    </div>
  )
}
