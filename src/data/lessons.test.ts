import { describe, expect, it } from 'vitest'
import { getDailyLesson, lessons } from './lessons'

describe('lesson library', () => {
  it('contains a broad rotation with no duplicate ids', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(15)
    expect(new Set(lessons.map((lesson) => lesson.id)).size).toBe(lessons.length)
    expect(new Set(lessons.map((lesson) => lesson.category)).size).toBe(lessons.length)
  })

  it('contains complete learning and reinforcement content', () => {
    for (const lesson of lessons) {
      expect(lesson.foundations.length).toBeGreaterThanOrEqual(3)
      expect(lesson.steps.length).toBeGreaterThanOrEqual(3)
      expect(lesson.workedExample.length).toBeGreaterThan(100)
      expect(lesson.conventionalFailure.length).toBeGreaterThan(80)
      expect(lesson.action.length).toBeGreaterThan(40)
      expect(lesson.quiz.choices.length).toBe(4)
      expect(lesson.quiz.answer).toBeGreaterThanOrEqual(0)
      expect(lesson.quiz.answer).toBeLessThan(lesson.quiz.choices.length)
    }
  })

  it('does not repeat a lesson inside one full rotation', () => {
    const ids = Array.from({ length: lessons.length }, (_, offset) =>
      getDailyLesson(new Date(2026, 0, 1 + offset)).id,
    )
    expect(new Set(ids).size).toBe(lessons.length)
  })
})
