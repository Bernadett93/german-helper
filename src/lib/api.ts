import type { NewVocabulary, Vocabulary } from '../types/vocabulary'

const BASE_URL = '/api/vocabulary'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    throw new Error('Cannot reach the vocabulary server. Is it running (npm run dev)?')
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Request failed with status ${response.status}.`)
  }
  return (response.status === 204 ? undefined : await response.json()) as T
}

export const vocabularyApi = {
  list: () => request<Vocabulary[]>(''),
  create: (word: NewVocabulary) =>
    request<Vocabulary>('', { method: 'POST', body: JSON.stringify(word) }),
  update: (id: string, word: NewVocabulary) =>
    request<Vocabulary>(`/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify(word) }),
  remove: (id: string) => request<void>(`/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  import: (words: Vocabulary[]) =>
    request<Vocabulary[]>('/import', { method: 'POST', body: JSON.stringify(words) }),
}
