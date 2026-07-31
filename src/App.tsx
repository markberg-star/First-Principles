import type { Session } from '@supabase/supabase-js'
import { Flame } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { BottomNav, type Tab } from './components/BottomNav'
import { BrandMark } from './components/BrandMark'
import { Challenge } from './components/Challenge'
import { LessonPage } from './components/LessonPage'
import { LibraryPage } from './components/LibraryPage'
import { PracticePage } from './components/PracticePage'
import { ProfilePage } from './components/ProfilePage'
import { getDailyLesson } from './data/lessons'
import { mergeStates, useProgress } from './lib/progress'
import { getSession, isSupabaseConfigured, pullCloudState, pushCloudState, signOut, supabase } from './lib/supabase'
import type { Lesson } from './types'

const today = new Date()
const dailyLesson = getDailyLesson(today)

export default function App() {
  const [tab, setTab] = useState<Tab>('today')
  const [lesson, setLesson] = useState<Lesson>(dailyLesson)
  const [challengeLesson, setChallengeLesson] = useState<Lesson | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [syncReady, setSyncReady] = useState(false)
  const [syncStatus, setSyncStatus] = useState('Ready to sync')
  const { state, setState, stats, answerLesson, toggleBookmark } = useProgress()

  const syncFromCloud = useCallback(async (activeSession: Session) => {
    setSyncStatus('Checking your private cloud...')
    try {
      const remote = await pullCloudState()
      setState((local) => {
        const merged = mergeStates(local, remote)
        void pushCloudState(activeSession.user.id, merged)
        return merged
      })
      setSyncStatus('Progress is synced')
      setSyncReady(true)
    } catch (error) {
      setSyncStatus(error instanceof Error ? `Sync paused: ${error.message}` : 'Sync paused while offline')
      setSyncReady(true)
    }
  }, [setState])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    void getSession().then((current) => {
      setSession(current)
      if (current) void syncFromCloud(current)
      else setSyncReady(true)
    })
    const { data } = supabase.auth.onAuthStateChange((_event, current) => {
      setSession(current)
      if (current) void syncFromCloud(current)
    })
    return () => data.subscription.unsubscribe()
  }, [syncFromCloud])

  useEffect(() => {
    if (!session || !syncReady) return
    const timer = window.setTimeout(() => {
      setSyncStatus('Saving...')
      void pushCloudState(session.user.id, state)
        .then(() => setSyncStatus('Progress is synced'))
        .catch(() => setSyncStatus('Saved locally. Cloud sync will retry later.'))
    }, 900)
    return () => window.clearTimeout(timer)
  }, [session, state, syncReady])

  const changeTab = (next: Tab) => {
    if (next === 'today') setLesson(dailyLesson)
    setTab(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openLesson = (nextLesson: Lesson) => {
    setLesson(nextLesson)
    setTab('today')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startChallenge = (nextLesson: Lesson) => {
    setChallengeLesson(nextLesson)
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }

  const syncNow = () => {
    if (session) void syncFromCloud(session)
  }

  return (
    <div className="app">
      {!challengeLesson && (
        <header className="app-header">
          <BrandMark />
          <button className="streak" onClick={() => changeTab('you')} aria-label={`${stats.streak} day streak`}><Flame size={17} fill="currentColor" /><span>{stats.streak}</span><small>day streak</small></button>
        </header>
      )}

      {!challengeLesson && tab === 'today' && <LessonPage lesson={lesson} date={today} progress={state.progress[lesson.id]} onBookmark={() => toggleBookmark(lesson.id)} onStartChallenge={() => startChallenge(lesson)} />}
      {!challengeLesson && tab === 'library' && <LibraryPage progress={state.progress} onOpen={openLesson} onBookmark={toggleBookmark} />}
      {!challengeLesson && tab === 'practice' && <PracticePage progress={state.progress} onPractice={startChallenge} />}
      {!challengeLesson && tab === 'you' && <ProfilePage state={state} stats={stats} session={session} syncStatus={syncStatus} onSync={syncNow} onSignOut={() => void signOut()} />}

      {!challengeLesson && <BottomNav active={tab} onChange={changeTab} />}
      {challengeLesson && <Challenge lesson={challengeLesson} onClose={() => setChallengeLesson(null)} onAnswer={(correct, confidence) => answerLesson(challengeLesson.id, correct, confidence)} />}
    </div>
  )
}
