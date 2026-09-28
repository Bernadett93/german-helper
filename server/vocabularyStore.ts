import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { normalizeVocabulary } from '../src/lib/vocabularyValidation'
import type { NewVocabulary, Vocabulary } from '../src/types/vocabulary'

export class NotFoundError extends Error {}

export class VocabularyStore {
  private readonly filePath: string
  // Serializes read-modify-write cycles so concurrent requests can't overwrite each other.
  private queue: Promise<unknown> = Promise.resolve()

  constructor(filePath: string) {
    this.filePath = filePath
  }

  list(): Promise<Vocabulary[]> {
    return this.enqueue(() => this.read())
  }

  create(word: NewVocabulary): Promise<Vocabulary> {
    return this.enqueue(async () => {
      const items = await this.read()
      const created: Vocabulary = { id: randomUUID(), ...word }
      await this.write([created, ...items])
      return created
    })
  }

  update(id: string, word: NewVocabulary): Promise<Vocabulary> {
    return this.enqueue(async () => {
      const items = await this.read()
      const index = items.findIndex((item) => item.id === id)
      if (index === -1) throw new NotFoundError(`Word ${id} not found.`)
      const updated: Vocabulary = { id, ...word }
      items[index] = updated
      await this.write(items)
      return updated
    })
  }

  remove(id: string): Promise<void> {
    return this.enqueue(async () => {
      const items = await this.read()
      const remaining = items.filter((item) => item.id !== id)
      if (remaining.length === items.length) throw new NotFoundError(`Word ${id} not found.`)
      await this.write(remaining)
    })
  }

  /** Adds words whose id is not yet in the file (safe to call repeatedly). */
  import(words: Vocabulary[]): Promise<Vocabulary[]> {
    return this.enqueue(async () => {
      const items = await this.read()
      const existingIds = new Set(items.map((item) => item.id))
      const added = words.filter((word) => !existingIds.has(word.id))
      if (added.length === 0) return items
      const merged = [...added, ...items]
      await this.write(merged)
      return merged
    })
  }

  private enqueue<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task, task)
    this.queue = result.catch(() => undefined)
    return result
  }

  private async read(): Promise<Vocabulary[]> {
    let raw: string
    try {
      raw = await readFile(this.filePath, 'utf8')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []
      throw error
    }
    if (!raw.trim()) return []

    // Throwing on invalid JSON (instead of returning []) prevents a hand-edit typo from wiping the file.
    let parsed: unknown
    try {
      parsed = JSON.parse(raw.replace(/^\uFEFF/, ''))
    } catch (error) {
      throw new Error(`${this.filePath} contains invalid JSON: ${(error as Error).message}`, { cause: error })
    }
    if (!Array.isArray(parsed)) throw new Error(`${this.filePath} must contain a JSON array.`)
    return parsed.map(normalizeVocabulary).filter((item): item is Vocabulary => item !== null)
  }

  private async write(items: Vocabulary[]): Promise<void> {
    await mkdir(path.dirname(this.filePath), { recursive: true })
    // Write to a temp file first, then rename, so a crash never leaves a half-written file.
    const tempPath = `${this.filePath}.tmp`
    await writeFile(tempPath, `${JSON.stringify(items, null, 2)}\n`, 'utf8')
    await rename(tempPath, this.filePath)
  }
}
