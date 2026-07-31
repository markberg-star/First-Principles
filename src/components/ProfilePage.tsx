import type { Session } from '@supabase/supabase-js'
import { CalendarPlus, Cloud, Download, LogOut, Mail, Smartphone } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { AtlasState } from '../lib/progress'
import { isSupabaseConfigured, sendMagicLink } from '../lib/supabase'

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function downloadFile(name: string, body: string, type: string) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(new Blob([body], { type }))
  link.download = name
  link.click()
  URL.revokeObjectURL(link.href)
}

function addCalendarReminder() {
  const url = `${window.location.origin}${window.location.pathname}`
  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Atlas of Why//Daily Lesson//EN',
    'BEGIN:VEVENT',
    'UID:daily-atlas-of-why@local',
    'DTSTART:20260801T090000',
    'DURATION:PT10M',
    'RRULE:FREQ=DAILY',
    'SUMMARY:Open today\'s Atlas of Why lesson',
    `DESCRIPTION:One useful idea rebuilt from first principles. ${url}`,
    `URL:${url}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')
  downloadFile('atlas-of-why-daily.ics', body, 'text/calendar')
}

export function ProfilePage({ state, stats, session, syncStatus, onSync, onSignOut }: { state: AtlasState; stats: { completed: number; bookmarked: number; mastery: number; streak: number }; session: Session | null; syncStatus: string; onSync: () => void; onSignOut: () => void }) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (installPrompt) {
      await installPrompt.prompt()
      const result = await installPrompt.userChoice
      setMessage(result.outcome === 'accepted' ? 'Atlas is being added to your phone.' : 'Installation canceled.')
      if (result.outcome === 'accepted') setInstallPrompt(null)
    } else {
      setMessage('On iPhone, tap Share, then Add to Home Screen. On Android, open the browser menu and choose Install app.')
    }
  }

  const signIn = async () => {
    if (!email.trim()) return
    setMessage('Sending a private sign-in link...')
    try {
      await sendMagicLink(email.trim())
      setMessage('Check your email and open the sign-in link on this device.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not send the sign-in link.')
    }
  }

  return (
    <main className="page-shell profile-page">
      <header className="page-intro"><h1>Your practice</h1><p>Private by default. Everything works on this device without an account.</p></header>
      <section className="profile-score">
        <div className="score-ring" style={{ '--score': `${stats.mastery * 3.6}deg` } as React.CSSProperties}><span><b>{stats.mastery}%</b>mastery</span></div>
        <div><p><b>{stats.streak}</b><span>day streak</span></p><p><b>{stats.completed}</b><span>lessons</span></p><p><b>{stats.bookmarked}</b><span>saved</span></p></div>
      </section>

      <section className="settings-section">
        <h2>Make it yours</h2>
        <button className="setting-row" onClick={install}><Smartphone /><span><b>Install on this phone</b><small>Launch full screen from your home screen</small></span></button>
        <button className="setting-row" onClick={addCalendarReminder}><CalendarPlus /><span><b>Add a free daily reminder</b><small>A 9:00 AM repeating calendar reminder</small></span></button>
        <button className="setting-row" onClick={() => downloadFile('atlas-of-why-progress.json', JSON.stringify(state, null, 2), 'application/json')}><Download /><span><b>Export my progress</b><small>Keep a portable copy of your learning history</small></span></button>
      </section>

      <section className="settings-section cloud-section">
        <h2>Private cloud sync</h2>
        {!isSupabaseConfigured ? (
          <div className="cloud-note"><Cloud /><p><b>Local mode is active</b><span>Supabase is optional. Add the two free project settings when you want progress shared across devices.</span></p></div>
        ) : session ? (
          <>
            <div className="cloud-note cloud-note--connected"><Cloud /><p><b>Signed in as {session.user.email}</b><span>{syncStatus}</span></p></div>
            <button className="secondary-button" onClick={onSync}><Cloud size={18} /> Sync now</button>
            <button className="text-button" onClick={onSignOut}><LogOut size={17} /> Sign out</button>
          </>
        ) : (
          <div className="sign-in-box">
            <p>Send yourself a secure sign-in link. No password is stored in the app.</p>
            <label><Mail size={18} /><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /></label>
            <button className="secondary-button" onClick={signIn}>Send sign-in link</button>
          </div>
        )}
      </section>
      {message && <p className="profile-message" role="status">{message}</p>}
      <footer className="local-promise"><span>Free forever on your device</span><p>No ads. No paid AI calls. No subscription. Your lesson library and local progress remain usable offline.</p></footer>
    </main>
  )
}
