import { ArrowRight, Brain, CheckCircle2, RotateCcw } from 'lucide-react'
import type { Lesson, ProgressRecord } from '../types'
import { lessons } from '../data/lessons'

export function PracticePage({ progress, onPractice }: { progress: Record<string, ProgressRecord>; onPractice: (lesson: Lesson) => void }) {
  const now = Date.now()
  const completed = lessons.filter((lesson) => progress[lesson.id]?.completed)
  const due = completed.filter((lesson) => {
    const date = progress[lesson.id]?.nextReview
    return date && Date.parse(date) <= now
  })
  const missed = completed.filter((lesson) => progress[lesson.id]?.score === 0)
  const queue = [...new Map([...missed, ...due, ...completed].map((lesson) => [lesson.id, lesson])).values()]
  const next = queue[0] ?? lessons[0]
  const reviewCount = Math.max(due.length, 1)

  return (
    <main className="page-shell practice-page">
      <header className="page-intro">
        <h1>Practice</h1>
        <p>Retrieval strengthens the model. Explanations feel familiar long before they become usable.</p>
      </header>
      <section className="practice-focus">
        <div className="practice-orbit"><Brain /><i /><i /><i /></div>
        <span>{completed.length ? `${reviewCount} review${reviewCount === 1 ? '' : 's'} ready` : 'Start your first recall'}</span>
        <h2>{next.title}</h2>
        <p>{completed.length ? 'A short recall now will make this idea easier to use when it matters.' : 'Read today\'s lesson, then answer one concrete question without looking back.'}</p>
        <button className="primary-button" onClick={() => onPractice(next)}>{completed.length ? 'Begin review' : 'Try the challenge'} <ArrowRight size={20} /></button>
      </section>
      <section className="practice-method">
        <h2>How review works</h2>
        <div><RotateCcw /><p><b>Missed ideas return sooner</b><span>A wrong answer comes back tomorrow. A correct one waits a week.</span></p></div>
        <div><CheckCircle2 /><p><b>Confidence matters</b><span>Being confidently wrong is a stronger signal to rebuild the model.</span></p></div>
      </section>
    </main>
  )
}
