import { useEffect, useMemo, useState } from 'react'
import type { ProgressRecord } from '../types'

const STORAGE_KEY = 'atlas-of-why-state-v1'

export interface AtlasState {
  progress: Record<string, ProgressRecord>
  activityDates: string[]
}

const emptyState: AtlasState = { progress: {}, activityDates: [] }

function localDateKey(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function readStoredState(): AtlasState {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (!value) return emptyState
    const parsed = JSON.parse(value) as AtlasState
    return {
      progress: parsed.progress ?? {},
      activityDates: Array.from(new Set(parsed.activityDates ?? [])).sort(),
    }
  } catch {
    return emptyState
  }
}

export function mergeStates(local: AtlasState, remote: AtlasState): AtlasState {
  const progress = { ...remote.progress, ...local.progress }
  for (const lessonId of new Set([...Object.keys(remote.progress), ...Object.keys(local.progress)])) {
    const localRecord = local.progress[lessonId]
    const remoteRecord = remote.progress[lessonId]
    if (!localRecord || !remoteRecord) continue
    const localTime = localRecord.lastReviewed ? Date.parse(localRecord.lastReviewed) : 0
    const remoteTime = remoteRecord.lastReviewed ? Date.parse(remoteRecord.lastReviewed) : 0
    progress[lessonId] = localTime >= remoteTime ? localRecord : remoteRecord
    progress[lessonId].bookmarked = localRecord.bookmarked || remoteRecord.bookmarked
  }
  return {
    progress,
    activityDates: Array.from(new Set([...local.activityDates, ...remote.activityDates])).sort(),
  }
}

export function calculateStreak(activityDates: string[], today = new Date()): number {
  const days = new Set(activityDates)
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  if (!days.has(localDateKey(cursor))) cursor.setDate(cursor.getDate() - 1)

  let streak = 0
  while (days.has(localDateKey(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export function useProgress() {
  const [state, setState] = useState<AtlasState>(() => readStoredState())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const answerLesson = (lessonId: string, correct: boolean, confidence: number) => {
    const now = new Date()
    const next = new Date(now)
    next.setDate(next.getDate() + (correct ? 7 : 1))
    setState((current) => {
      const previous = current.progress[lessonId]
      return {
        progress: {
          ...current.progress,
          [lessonId]: {
            lessonId,
            completed: true,
            score: correct ? 100 : 0,
            confidence,
            attempts: (previous?.attempts ?? 0) + 1,
            bookmarked: previous?.bookmarked ?? false,
            lastReviewed: now.toISOString(),
            nextReview: next.toISOString(),
          },
        },
        activityDates: Array.from(new Set([...current.activityDates, localDateKey(now)])).sort(),
      }
    })
  }

  const toggleBookmark = (lessonId: string) => {
    setState((current) => {
      const previous = current.progress[lessonId]
      return {
        ...current,
        progress: {
          ...current.progress,
          [lessonId]: {
            lessonId,
            completed: previous?.completed ?? false,
            score: previous?.score ?? 0,
            confidence: previous?.confidence ?? 50,
            attempts: previous?.attempts ?? 0,
            bookmarked: !(previous?.bookmarked ?? false),
            lastReviewed: previous?.lastReviewed ?? null,
            nextReview: previous?.nextReview ?? null,
          },
        },
      }
    })
  }

  const stats = useMemo(() => {
    const records = Object.values(state.progress)
    const completed = records.filter((record) => record.completed)
    const correct = completed.filter((record) => record.score === 100)
    return {
      completed: completed.length,
      bookmarked: records.filter((record) => record.bookmarked).length,
      mastery: completed.length ? Math.round((correct.length / completed.length) * 100) : 0,
      streak: calculateStreak(state.activityDates),
    }
  }, [state])

  return { state, setState, stats, answerLesson, toggleBookmark }
}
