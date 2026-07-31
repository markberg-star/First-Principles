import { Bookmark, Check, Search } from 'lucide-react'
import { useMemo, useState, type CSSProperties } from 'react'
import { lessons } from '../data/lessons'
import type { ProgressRecord, Lesson } from '../types'

function KnowledgeMap({ completed }: { completed: number }) {
  const nodes = lessons.slice(0, 8)
  return (
    <div className="knowledge-map" aria-label={`Knowledge map with ${completed} completed lessons`}>
      <svg viewBox="0 0 360 360" aria-hidden="true">
        <circle cx="180" cy="180" r="116" className="map-ring" />
        <circle cx="180" cy="180" r="76" className="map-ring" />
        {nodes.map((lesson, index) => {
          const angle = (Math.PI * 2 * index) / nodes.length - Math.PI / 2
          const x = 180 + Math.cos(angle) * 116
          const y = 180 + Math.sin(angle) * 116
          return <line key={lesson.id} x1="180" y1="180" x2={x} y2={y} className="map-line" />
        })}
        <circle cx="180" cy="180" r="35" className="map-core" />
        <path d="M180 158c-12 0-22 10-22 22s10 22 22 22c10 0 18-8 18-18 0-8-7-15-15-15-7 0-12 5-12 12 0 5 4 9 9 9" className="map-spiral" />
      </svg>
      {nodes.map((lesson, index) => {
        const angle = (Math.PI * 2 * index) / nodes.length - Math.PI / 2
        const left = 50 + Math.cos(angle) * 34
        const top = 50 + Math.sin(angle) * 34
        return <span key={lesson.id} style={{ left: `${left}%`, top: `${top}%`, '--node-accent': lesson.accent } as CSSProperties}>{lesson.category}</span>
      })}
    </div>
  )
}

export function LibraryPage({ progress, onOpen, onBookmark }: { progress: Record<string, ProgressRecord>; onOpen: (lesson: Lesson) => void; onBookmark: (lessonId: string) => void }) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => lessons.filter((lesson) => `${lesson.title} ${lesson.category} ${lesson.subtitle}`.toLowerCase().includes(query.toLowerCase())), [query])
  const completed = Object.values(progress).filter((record) => record.completed).length
  const mastery = completed ? Math.round(Object.values(progress).filter((record) => record.completed && record.score === 100).length / completed * 100) : 0

  return (
    <main className="page-shell library-page">
      <header className="page-intro">
        <h1>Your atlas</h1>
        <p>Follow the connections. Build a world model one useful idea at a time.</p>
      </header>
      <div className="atlas-stats"><div><b>{completed}</b><span>lessons</span></div><div><b>{new Set(lessons.map((lesson) => lesson.category)).size}</b><span>domains</span></div><div><b>{mastery}%</b><span>mastery</span></div></div>
      <KnowledgeMap completed={completed} />
      <label className="search-field"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ideas and fields" /></label>
      <section className="library-list">
        <div className="section-heading"><h2>{query ? 'Results' : 'All lessons'}</h2><span>{filtered.length}</span></div>
        {filtered.map((lesson) => {
          const record = progress[lesson.id]
          return (
            <article key={lesson.id} className="library-row" style={{ '--row-accent': lesson.accent } as CSSProperties}>
              <button className="library-row__main" onClick={() => onOpen(lesson)}>
                <span className="library-row__visual">{lesson.visualLabels.map((label) => label[0].toUpperCase()).join('')}</span>
                <span className="library-row__copy"><small>{lesson.category} · {lesson.minutes} min</small><b>{lesson.title}</b><em>{lesson.subtitle}</em></span>
                {record?.completed && <Check className="completion-check" size={18} />}
              </button>
              <button className={`row-bookmark ${record?.bookmarked ? 'is-active' : ''}`} onClick={() => onBookmark(lesson.id)} aria-label={record?.bookmarked ? 'Remove bookmark' : 'Save lesson'}><Bookmark size={19} fill={record?.bookmarked ? 'currentColor' : 'none'} /></button>
            </article>
          )
        })}
      </section>
    </main>
  )
}
