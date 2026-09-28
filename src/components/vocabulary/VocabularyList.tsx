import type { Vocabulary } from '../../types/vocabulary'
import { VocabularyCard } from './VocabularyCard'

interface VocabularyListProps {
  items: Vocabulary[]
  onDelete?: (id: string) => void
}

export function VocabularyList({ items, onDelete }: VocabularyListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((word) => (
        <VocabularyCard key={word.id} word={word} onDelete={onDelete} />
      ))}
    </div>
  )
}
