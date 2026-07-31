import { AlertTriangle, ArrowRight, Bookmark, Check, Clock3, Share2, Sparkles } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import type { Lesson, ProgressRecord } from '../types'
import { LessonVisual } from './LessonVisual'

export function LessonPage({ lesson, date, progress, onBookmark, onStartChallenge }: { lesson: Lesson; date: Date; progress?: ProgressRecord; onBookmark: () => void; onStartChallenge: () => void }) {
  const [shared, setShared] = useState(false)
  const dateLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(date).toUpperCase()
  const share = async () => {
    const text = `${lesson.title}\n\n${lesson.premise}\n\nExplore it in Atlas of Why.`
    if (navigator.share) await navigator.share({ title: lesson.title, text, url: window.location.href })
    else await navigator.clipboard.writeText(text)
    setShared(true)
    window.setTimeout(() => setShared(false), 1800)
  }

  return (
    <article className="lesson-page" style={{ '--lesson-accent': lesson.accent } as CSSProperties}>
      <header className="lesson-hero">
        <div className="lesson-hero__meta"><span>{dateLabel}</span><span className="category-label">{lesson.category}</span></div>
        <div className="lesson-hero__title-row">
          <div>
            <h1>{lesson.title}</h1>
            <p>{lesson.subtitle}</p>
          </div>
          <button className={`bookmark-button ${progress?.bookmarked ? 'is-active' : ''}`} onClick={onBookmark} aria-label={progress?.bookmarked ? 'Remove bookmark' : 'Save lesson'}><Bookmark fill={progress?.bookmarked ? 'currentColor' : 'none'} /></button>
        </div>
        <div className="reading-time"><Clock3 size={15} /><span>{lesson.minutes} min</span><span className="dot" /><span>Lesson 1 of {6}</span>{progress?.completed && <><span className="dot" /><Check size={15} /><span>Completed</span></>}</div>
      </header>

      <LessonVisual lesson={lesson} />

      <div className="lesson-progress" aria-label="Lesson structure">
        <span>Lesson map</span>
        <div>{Array.from({ length: 6 }, (_, index) => <i key={index} className={index === 0 ? 'is-active' : ''} />)}</div>
        <b>1 / 6</b>
      </div>

      <div className="lesson-content">
        <section className="lesson-section lesson-section--opening">
          <span className="section-number">01</span>
          <div>
            <h2>Start with what must be true</h2>
            <p className="lead">{lesson.premise}</p>
            <div className="foundations">
              {lesson.foundations.map((fact, index) => <p key={fact}><b>{String(index + 1).padStart(2, '0')}</b><span>{fact}</span></p>)}
            </div>
          </div>
        </section>

        <section className="lesson-section">
          <span className="section-number">02</span>
          <div>
            <h2>Rebuild it from the ground up</h2>
            <div className="reasoning-steps">
              {lesson.steps.map((step, index) => (
                <div key={step.title}>
                  <span>{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="lesson-section">
          <span className="section-number">03</span>
          <div>
            <h2>Put the model to work</h2>
            <div className="worked-example"><Sparkles size={22} /><p>{lesson.workedExample}</p></div>
          </div>
        </section>

        <section className="lesson-section">
          <span className="section-number">04</span>
          <div>
            <h2>Where conventional thinking fails</h2>
            <p>{lesson.conventionalFailure}</p>
          </div>
        </section>

        {lesson.uncertainty && (
          <section className="lesson-section">
            <span className="section-number">05</span>
            <div>
              <h2>Boundary of the model</h2>
              <div className="uncertainty-note"><AlertTriangle size={21} /><p><b>Uncertainty and limits</b>{lesson.uncertainty}</p></div>
            </div>
          </section>
        )}

        <section className="daily-action">
          <span>Use it today</span>
          <h2>{lesson.action}</h2>
          <button className="primary-button" onClick={onStartChallenge}>{progress?.completed ? 'Practice it again' : 'Test the model'} <ArrowRight size={20} /></button>
        </section>

        <button className="share-lesson" onClick={share}><Share2 size={18} />{shared ? 'Copied' : 'Share this idea'}</button>
      </div>
    </article>
  )
}
