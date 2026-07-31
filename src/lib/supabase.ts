import { createClient, type Session } from '@supabase/supabase-js'
import type { AtlasState } from './progress'
import type { ProgressRecord } from '../types'

const url = import.meta.env.VITE_SUPABASE_URL?.trim()
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

export const isSupabaseConfigured = Boolean(url && publishableKey)
export const supabase = isSupabaseConfigured ? createClient(url, publishableKey) : null

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function sendMagicLink(email: string): Promise<void> {
  if (!supabase) throw new Error('Cloud sync has not been configured yet.')
  const redirectTo = `${window.location.origin}${window.location.pathname}`
  const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })
  if (error) throw error
}

export async function signOut(): Promise<void> {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

interface ProgressRow {
  lesson_id: string
  completed: boolean
  score: number
  confidence: number
  attempts: number
  bookmarked: boolean
  last_reviewed: string | null
  next_review: string | null
}

export async function pullCloudState(): Promise<AtlasState> {
  if (!supabase) return { progress: {}, activityDates: [] }
  const [progressResult, activityResult] = await Promise.all([
    supabase.from('user_progress').select('lesson_id, completed, score, confidence, attempts, bookmarked, last_reviewed, next_review'),
    supabase.from('daily_activity').select('activity_date').order('activity_date'),
  ])
  if (progressResult.error) throw progressResult.error
  if (activityResult.error) throw activityResult.error

  const progress = Object.fromEntries(
    ((progressResult.data ?? []) as ProgressRow[]).map((row) => [
      row.lesson_id,
      {
        lessonId: row.lesson_id,
        completed: row.completed,
        score: row.score,
        confidence: row.confidence,
        attempts: row.attempts,
        bookmarked: row.bookmarked,
        lastReviewed: row.last_reviewed,
        nextReview: row.next_review,
      } satisfies ProgressRecord,
    ]),
  )
  return { progress, activityDates: (activityResult.data ?? []).map((row) => row.activity_date as string) }
}

export async function pushCloudState(userId: string, state: AtlasState): Promise<void> {
  if (!supabase) return
  const progressRows = Object.values(state.progress).map((record) => ({
    user_id: userId,
    lesson_id: record.lessonId,
    completed: record.completed,
    score: record.score,
    confidence: record.confidence,
    attempts: record.attempts,
    bookmarked: record.bookmarked,
    last_reviewed: record.lastReviewed,
    next_review: record.nextReview,
    updated_at: new Date().toISOString(),
  }))
  if (progressRows.length) {
    const { error } = await supabase.from('user_progress').upsert(progressRows, { onConflict: 'user_id,lesson_id' })
    if (error) throw error
  }

  const activityRows = state.activityDates.map((date) => ({ user_id: userId, activity_date: date }))
  if (activityRows.length) {
    const { error } = await supabase.from('daily_activity').upsert(activityRows, { onConflict: 'user_id,activity_date' })
    if (error) throw error
  }
}
