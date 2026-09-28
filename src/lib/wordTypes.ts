import type { WordType } from '../types/vocabulary'

interface WordTypeMeta {
  label: string
  otherLabel: string
  otherPlaceholder: string
  germanPlaceholder: string
  hungarianPlaceholder: string
  examplePlaceholder: string
}

export const WORD_TYPE_META: Record<WordType, WordTypeMeta> = {
  noun: {
    label: 'Noun',
    otherLabel: 'Plural',
    otherPlaceholder: 'e.g. die Hunde',
    germanPlaceholder: 'e.g. Hund',
    hungarianPlaceholder: 'e.g. kutya',
    examplePlaceholder: 'e.g. Der Hund spielt im Garten.',
  },
  verb: {
    label: 'Verb',
    otherLabel: 'Präteritum & Partizip II',
    otherPlaceholder: 'e.g. ging, ist gegangen',
    germanPlaceholder: 'e.g. gehen',
    hungarianPlaceholder: 'e.g. menni',
    examplePlaceholder: 'e.g. Ich gehe nach Hause.',
  },
  other: {
    label: 'Other',
    otherLabel: 'Other forms',
    otherPlaceholder: 'e.g. besser, am besten',
    germanPlaceholder: 'e.g. gut',
    hungarianPlaceholder: 'e.g. jó',
    examplePlaceholder: 'e.g. Das Essen ist gut.',
  },
}
