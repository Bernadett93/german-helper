import { Link, useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { VocabularyForm } from '../components/vocabulary/VocabularyForm'
import { useVocabulary } from '../hooks/useVocabulary'

export function EditVocabularyPage() {
  const { id } = useParams<{ id: string }>()
  const { items, updateWord } = useVocabulary()
  const navigate = useNavigate()
  const word = items.find((item) => item.id === id)

  const goBack = () => navigate('/vocabulary')

  if (!word) {
    return (
      <EmptyState
        title="Word not found"
        description="It may have been deleted."
        action={
          <Link to="/vocabulary" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            ← Back to vocabulary
          </Link>
        }
      />
    )
  }

  const { id: wordId, ...initialValue } = word

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit word" description={`Update “${word.germanWord}”.`} />
      <VocabularyForm
        key={wordId}
        initialValue={initialValue}
        submitLabel="Save changes"
        onCancel={goBack}
        onSubmit={async (updated) => {
          await updateWord(wordId, updated)
          goBack()
        }}
      />
    </div>
  )
}
