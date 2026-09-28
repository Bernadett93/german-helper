import { BookOpen, PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/ui/EmptyState'
import { PageHeader } from '../components/ui/PageHeader'
import { StatCard } from '../components/ui/StatCard'
import { VocabularyList } from '../components/vocabulary/VocabularyList'
import { useVocabulary } from '../hooks/useVocabulary'
import type { WordType } from '../types/vocabulary'

const buttonClass =
  'inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700'

export function DashboardPage() {
  const { items } = useVocabulary()

  const countBy = (type: WordType) => items.filter((w) => w.wordType === type).length
  const recent = items.slice(0, 6)

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of your German vocabulary."
        actions={
          <Link to="/vocabulary/new" className={buttonClass}>
            <PlusCircle className="h-4 w-4" /> Add word
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total words" value={items.length} icon={BookOpen} accent="bg-indigo-100 text-indigo-600" />
        <StatCard label="Nouns" value={countBy('noun')} icon={BookOpen} accent="bg-blue-100 text-blue-600" />
        <StatCard label="Verbs" value={countBy('verb')} icon={BookOpen} accent="bg-amber-100 text-amber-600" />
        <StatCard label="Other" value={countBy('other')} icon={BookOpen} accent="bg-slate-100 text-slate-600" />
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recently added</h2>
          {items.length > 0 && (
            <Link to="/vocabulary" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all →
            </Link>
          )}
        </div>
        {recent.length > 0 ? (
          <VocabularyList items={recent} />
        ) : (
          <EmptyState
            title="No words yet"
            description="Start building your vocabulary by adding your first German word."
            action={
              <Link to="/vocabulary/new" className={buttonClass}>
                <PlusCircle className="h-4 w-4" /> Add your first word
              </Link>
            }
          />
        )}
      </section>
    </>
  )
}
