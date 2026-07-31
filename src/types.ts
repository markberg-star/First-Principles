export type VisualKind = 'beam' | 'balance' | 'landscape' | 'branching' | 'growth' | 'flow'

export interface LessonStep {
  title: string
  detail: string
}

export interface QuizChoice {
  label: string
  detail?: string
}

export interface LessonQuiz {
  scenario: string
  question: string
  choices: QuizChoice[]
  answer: number
  explanation: string
}

export interface Lesson {
  id: string
  category: string
  title: string
  subtitle: string
  minutes: number
  accent: string
  visual: VisualKind
  visualLabels: [string, string, string]
  premise: string
  foundations: string[]
  steps: LessonStep[]
  workedExample: string
  conventionalFailure: string
  uncertainty?: string
  action: string
  quiz: LessonQuiz
}

export interface ProgressRecord {
  lessonId: string
  completed: boolean
  score: number
  confidence: number
  attempts: number
  bookmarked: boolean
  lastReviewed: string | null
  nextReview: string | null
}
