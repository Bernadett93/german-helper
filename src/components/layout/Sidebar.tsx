import { BookOpen, Brain, LayoutDashboard, PlusCircle, type LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/vocabulary', label: 'Vocabulary', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Brain },
  { to: '/vocabulary/new', label: 'Add word', icon: PlusCircle },
]

export function Sidebar() {
  return (
    <aside className="flex w-20 shrink-0 flex-col border-r border-slate-200 bg-white md:w-64">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 via-red-600 to-amber-400 text-sm font-bold text-white shadow">
          DE
        </div>
        <span className="hidden text-lg font-semibold tracking-tight text-slate-900 md:inline">
          German Helper
        </span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="hidden md:inline">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="hidden p-4 text-xs text-slate-400 md:block">Viel Erfolg beim Lernen! 🇩🇪</div>
    </aside>
  )
}
