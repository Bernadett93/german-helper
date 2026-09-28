import type { Article } from '../../types/vocabulary'

const ARTICLE_STYLES: Record<Article, string> = {
  der: 'bg-blue-100 text-blue-700 ring-blue-200',
  die: 'bg-rose-100 text-rose-700 ring-rose-200',
  das: 'bg-emerald-100 text-emerald-700 ring-emerald-200',
}

export function ArticleBadge({ article }: { article: Article }) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wide ring-1 ring-inset ${ARTICLE_STYLES[article]}`}
    >
      {article}
    </span>
  )
}
