import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { useState, type CSSProperties } from 'react'
import type { Lesson } from '../types'
import { LessonVisual } from './LessonVisual'

export function Challenge({ lesson, onClose, onAnswer }: { lesson: Lesson; onClose: () => void; onAnswer: (correct: boolean, confidence: number) => void }) {
  const [selected, setSelected] = useState<number | null>(null)
  const [confidence, setConfidence] = useState(60)
  const [locked, setLocked] = useState(false)
  const correct = selected === lesson.quiz.answer

  const lock = () => {
    if (selected === null) return
    setLocked(true)
    onAnswer(selected === lesson.quiz.answer, confidence)
  }

  return (
    <div className="challenge" style={{ '--lesson-accent': lesson.accent } as CSSProperties}>
      <header className="challenge__header">
        <button className="icon-button" onClick={onClose} aria-label="Close challenge"><ArrowLeft /></button>
        <div><span>Test the model</span><b>1 of 1</b></div>
      </header>
      <main className="challenge__body">
        <p className="challenge__scenario">{lesson.quiz.scenario}</p>
        <LessonVisual lesson={lesson} compact />
        <section className="challenge__question">
          <h1>{lesson.quiz.question}</h1>
          <div className="choice-grid">
            {lesson.quiz.choices.map((choice, index) => {
              const state = locked ? index === lesson.quiz.answer ? 'is-correct' : index === selected ? 'is-wrong' : '' : selected === index ? 'is-selected' : ''
              return (
                <button key={choice.label} className={state} onClick={() => !locked && setSelected(index)} disabled={locked}>
                  <span className="choice-index">{index + 1}</span>
                  <span>{choice.label}</span>
                  {locked && index === lesson.quiz.answer && <Check size={18} />}
                  {locked && index === selected && index !== lesson.quiz.answer && <X size={18} />}
                </button>
              )
            })}
          </div>
        </section>

        {!locked ? (
          <section className="confidence">
            <div><label htmlFor="confidence">How confident are you?</label><output>{confidence}%</output></div>
            <input id="confidence" type="range" min="0" max="100" step="10" value={confidence} onChange={(event) => setConfidence(Number(event.target.value))} style={{ '--confidence': `${confidence}%` } as CSSProperties} />
            <div className="range-labels"><span>Not sure</span><span>Very confident</span></div>
          </section>
        ) : (
          <aside className={`answer-note ${correct ? 'answer-note--correct' : ''}`}>
            <span>{correct ? 'Model holds' : 'Useful correction'}</span>
            <p>{lesson.quiz.explanation}</p>
          </aside>
        )}
      </main>
      <footer className="challenge__footer">
        {!locked ? (
          <button className="primary-button" onClick={lock} disabled={selected === null}>Lock in answer <ArrowRight size={20} /></button>
        ) : (
          <button className="primary-button" onClick={onClose}>Return to the lesson <ArrowRight size={20} /></button>
        )}
      </footer>
    </div>
  )
}
