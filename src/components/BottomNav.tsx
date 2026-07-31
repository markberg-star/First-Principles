import { BookOpen, CircleUserRound, Dumbbell, Sun } from 'lucide-react'

export type Tab = 'today' | 'library' | 'practice' | 'you'

const items: { id: Tab; label: string; Icon: typeof Sun }[] = [
  { id: 'today', label: 'Today', Icon: Sun },
  { id: 'library', label: 'Library', Icon: BookOpen },
  { id: 'practice', label: 'Practice', Icon: Dumbbell },
  { id: 'you', label: 'You', Icon: CircleUserRound },
]

export function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {items.map(({ id, label, Icon }) => (
        <button key={id} className={active === id ? 'is-active' : ''} onClick={() => onChange(id)} aria-current={active === id ? 'page' : undefined}>
          <Icon size={21} strokeWidth={1.55} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  )
}
