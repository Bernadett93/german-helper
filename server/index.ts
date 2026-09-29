import express, { type ErrorRequestHandler } from 'express'
import path from 'node:path'
import { normalizeVocabulary, parseNewVocabulary } from '../src/lib/vocabularyValidation'
import type { Vocabulary } from '../src/types/vocabulary'
import { NotFoundError, VocabularyStore } from './vocabularyStore'

const PORT = Number(process.env.PORT ?? 3001)
// Bound to localhost only, so the API is not reachable from other machines on the network.
const HOST = process.env.HOST ?? '127.0.0.1'
const DATA_FILE = process.env.DATA_FILE ?? path.join(import.meta.dirname, '..', 'data', 'vocabulary.json')

const store = new VocabularyStore(DATA_FILE)
const app = express()

app.use(express.json({ limit: '2mb' }))

app.get('/api/vocabulary', async (_req, res) => {
  res.json(await store.list())
})

app.post('/api/vocabulary', async (req, res) => {
  const word = parseNewVocabulary(req.body)
  if (typeof word === 'string') {
    res.status(400).json({ error: word })
    return
  }
  res.status(201).json(await store.create(word))
})

app.put('/api/vocabulary/:id', async (req, res) => {
  const word = parseNewVocabulary(req.body)
  if (typeof word === 'string') {
    res.status(400).json({ error: word })
    return
  }
  res.json(await store.update(req.params.id, word))
})

app.patch('/api/vocabulary/:id/learned', async (req, res) => {
  if (typeof req.body?.learned !== 'boolean') {
    res.status(400).json({ error: 'learned must be a boolean.' })
    return
  }
  res.json(await store.setLearned(req.params.id, req.body.learned))
})

app.delete('/api/vocabulary/:id', async (req, res) => {
  await store.remove(req.params.id)
  res.status(204).end()
})

app.post('/api/vocabulary/import', async (req, res) => {
  if (!Array.isArray(req.body)) {
    res.status(400).json({ error: 'Expected an array of words.' })
    return
  }
  const words = req.body.map(normalizeVocabulary).filter((w): w is Vocabulary => w !== null)
  res.json(await store.import(words))
})

app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found.' })
})

// Express only treats a middleware as an error handler when it declares all four parameters.
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  void _next
  if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message })
    return
  }
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ error: 'Invalid JSON body.' })
    return
  }
  console.error(error)
  res.status(500).json({ error: error instanceof Error ? error.message : 'Internal server error.' })
}
app.use(errorHandler)

app.listen(PORT, HOST, () => {
  console.log(`Vocabulary API listening on http://${HOST}:${PORT}`)
  console.log(`Data file: ${DATA_FILE}`)
})
