import { useState, type FormEvent } from 'react'
import { isISODate, todayISO } from '../../lib/date'
import { WORD_TYPE_META } from '../../lib/wordTypes'
import { ARTICLES, WORD_TYPES, type Article, type NewVocabulary, type WordType } from '../../types/vocabulary'

interface VocabularyFormProps {
  onSubmit: (word: NewVocabulary) => void | Promise<void>
  /** When provided, the form is pre-filled and not reset after submitting (edit mode). */
  initialValue?: NewVocabulary
  submitLabel?: string
  onCancel?: () => void
}

interface FormState {
  wordType: WordType
  article: Article
  germanWord: string
  hungarianMeaning: string
  exampleSentence: string
  other: string
  date: string
}

const createEmptyForm = (): FormState => ({
  wordType: 'noun',
  article: 'der',
  germanWord: '',
  hungarianMeaning: '',
  exampleSentence: '',
  other: '',
  date: todayISO(),
})

const toFormState = (word: NewVocabulary): FormState => ({
  ...word,
  article: word.article ?? 'der',
})

const ARTICLE_ACTIVE: Record<Article, string> = {
  der: 'border-blue-500 bg-blue-50 text-blue-700',
  die: 'border-rose-500 bg-rose-50 text-rose-700',
  das: 'border-emerald-500 bg-emerald-50 text-emerald-700',
}

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100'

const optionClass = (active: boolean, activeClass: string) =>
  `cursor-pointer rounded-xl border-2 py-2.5 text-center text-sm font-semibold transition ${
    active ? activeClass : 'border-slate-200 text-slate-500 hover:border-slate-300'
  }`

export function VocabularyForm({
  onSubmit,
  initialValue,
  submitLabel = 'Save word',
  onCancel,
}: VocabularyFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    initialValue ? toFormState(initialValue) : createEmptyForm(),
  )
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const meta = WORD_TYPE_META[form.wordType]

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (saving) return
    const word: NewVocabulary = {
      wordType: form.wordType,
      article: form.wordType === 'noun' ? form.article : undefined,
      germanWord: form.germanWord.trim(),
      hungarianMeaning: form.hungarianMeaning.trim(),
      exampleSentence: form.exampleSentence.trim(),
      other: form.other.trim(),
      date: form.date,
    }
    if (!word.germanWord || !word.hungarianMeaning) {
      setError('German word and Hungarian meaning are required.')
      return
    }
    if (!isISODate(word.date)) {
      setError('Please choose a valid lesson date.')
      return
    }
    setError(null)
    setSaving(true)
    try {
      await onSubmit(word)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Saving failed.')
      return
    } finally {
      setSaving(false)
    }
    if (initialValue) return
    // Keep type, article and date so several words from the same lesson can be entered quickly.
    setForm({ ...createEmptyForm(), wordType: form.wordType, article: form.article, date: form.date })
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <fieldset>
        <legend className="mb-2 text-sm font-medium text-slate-700">Word type</legend>
        <div className="grid grid-cols-3 gap-3">
          {WORD_TYPES.map((type) => (
            <label
              key={type}
              className={optionClass(form.wordType === type, 'border-indigo-500 bg-indigo-50 text-indigo-700')}
            >
              <input
                type="radio"
                name="wordType"
                value={type}
                checked={form.wordType === type}
                onChange={() => update('wordType', type)}
                className="sr-only"
              />
              {WORD_TYPE_META[type].label}
            </label>
          ))}
        </div>
      </fieldset>

      {form.wordType === 'noun' && (
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">Article</legend>
          <div className="grid grid-cols-3 gap-3">
            {ARTICLES.map((article) => (
              <label key={article} className={optionClass(form.article === article, ARTICLE_ACTIVE[article])}>
                <input
                  type="radio"
                  name="article"
                  value={article}
                  checked={form.article === article}
                  onChange={() => update('article', article)}
                  className="sr-only"
                />
                {article}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="germanWord" className="mb-2 block text-sm font-medium text-slate-700">
            German word <span className="text-rose-500">*</span>
          </label>
          <input
            id="germanWord"
            value={form.germanWord}
            onChange={(e) => update('germanWord', e.target.value)}
            placeholder={meta.germanPlaceholder}
            className={inputClass}
            autoFocus
          />
        </div>
        <div>
          <label htmlFor="hungarianMeaning" className="mb-2 block text-sm font-medium text-slate-700">
            Hungarian meaning <span className="text-rose-500">*</span>
          </label>
          <input
            id="hungarianMeaning"
            value={form.hungarianMeaning}
            onChange={(e) => update('hungarianMeaning', e.target.value)}
            placeholder={meta.hungarianPlaceholder}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="other" className="mb-2 block text-sm font-medium text-slate-700">
            {meta.otherLabel}
          </label>
          <input
            id="other"
            value={form.other}
            onChange={(e) => update('other', e.target.value)}
            placeholder={meta.otherPlaceholder}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="date" className="mb-2 block text-sm font-medium text-slate-700">
            Lesson date <span className="text-rose-500">*</span>
          </label>
          <input
            id="date"
            type="date"
            value={form.date}
            onChange={(e) => update('date', e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="exampleSentence" className="mb-2 block text-sm font-medium text-slate-700">
          Example sentence
        </label>
        <textarea
          id="exampleSentence"
          rows={3}
          value={form.exampleSentence}
          onChange={(e) => update('exampleSentence', e.target.value)}
          placeholder={meta.examplePlaceholder}
          className={`${inputClass} resize-none`}
        />
      </div>

      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-wait disabled:opacity-60"
        >
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
