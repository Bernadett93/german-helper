import { Loader2, ServerCrash } from 'lucide-react'
import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useVocabulary } from '../../hooks/useVocabulary'
import { Sidebar } from './Sidebar'

function usePageTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    let pageName = 'Dashboard'
    if (pathname === '/vocabulary') pageName = 'Vocabulary'
    if (pathname === '/vocabulary/new') pageName = 'Add word'
    if (pathname === '/practice') pageName = 'Practice'
    if (pathname.startsWith('/vocabulary/') && pathname.endsWith('/edit')) pageName = 'Edit word'

    document.title = `${pageName} | German Helper`
  }, [pathname])
}

function PageContent() {
  const { status, error, reload } = useVocabulary()

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading vocabulary…
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-sm">
        <ServerCrash className="mx-auto h-10 w-10 text-rose-500" />
        <p className="mt-4 font-semibold text-slate-900">Could not load your vocabulary</p>
        <p className="mt-1 text-sm text-slate-500">{error}</p>
        <button
          type="button"
          onClick={reload}
          className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          Try again
        </button>
      </div>
    )
  }

  return <Outlet />
}

export function Layout() {
  usePageTitle()

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <PageContent />
        </div>
      </main>
    </div>
  )
}
