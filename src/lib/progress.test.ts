import { describe, expect, it } from 'vitest'
import { calculateStreak, mergeStates, type AtlasState } from './progress'

describe('progress helpers', () => {
  it('counts a streak that includes today', () => {
    expect(calculateStreak(['2026-07-28', '2026-07-29', '2026-07-30', '2026-07-31'], new Date(2026, 6, 31))).toBe(4)
  })

  it('allows a streak to continue from yesterday', () => {
    expect(calculateStreak(['2026-07-29', '2026-07-30'], new Date(2026, 6, 31))).toBe(2)
  })

  it('merges local and remote activity without duplicates', () => {
    const local: AtlasState = { progress: {}, activityDates: ['2026-07-30'] }
    const remote: AtlasState = { progress: {}, activityDates: ['2026-07-29', '2026-07-30'] }
    expect(mergeStates(local, remote).activityDates).toEqual(['2026-07-29', '2026-07-30'])
  })
})
