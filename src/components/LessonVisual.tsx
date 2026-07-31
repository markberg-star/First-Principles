import { useState, type CSSProperties, type PointerEvent } from 'react'
import type { Lesson } from '../types'

function Topography() {
  return (
    <g className="topography" fill="none" stroke="currentColor">
      <path d="M-20 75C72 18 128 126 220 63s172 46 266-5 174 19 298-22" />
      <path d="M-22 105C64 45 133 155 230 91s174 50 266-3 177 21 296-18" />
      <path d="M-25 137C56 74 139 183 244 120s176 49 267-5 175 28 290-11" />
      <path d="M-28 171C49 106 148 210 259 149s181 44 268-8 170 36 279-4" />
      <path d="M-32 207C43 143 158 239 276 180s186 38 271-12 165 44 267 6" />
    </g>
  )
}

export function LessonVisual({ lesson, compact = false }: { lesson: Lesson; compact?: boolean }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setTilt({ x: (event.clientX - rect.left) / rect.width - 0.5, y: (event.clientY - rect.top) / rect.height - 0.5 })
  }
  const style = {
    '--visual-accent': lesson.accent,
    '--tilt-x': `${tilt.x * 10}px`,
    '--tilt-y': `${tilt.y * 8}px`,
  } as CSSProperties

  return (
    <figure className={`lesson-visual lesson-visual--${lesson.visual} ${compact ? 'lesson-visual--compact' : ''}`} style={style} onPointerMove={onPointerMove} onPointerLeave={() => setTilt({ x: 0, y: 0 })} aria-label={`Animated concept diagram showing ${lesson.visualLabels.join(', ')}`}>
      <div className="lesson-visual__glow" />
      <svg viewBox="0 0 760 430" role="img">
        <Topography />
        {lesson.visual === 'beam' && (
          <g className="visual-layer">
            <path className="visual-muted" d="M105 315h550M140 315v54M620 315v54" />
            <path className="visual-main visual-draw" d="M105 245Q380 315 655 245" />
            <path className="visual-main visual-draw delay-1" d="M105 253Q380 346 655 253" />
            <path className="visual-accent visual-pulse" d="M380 72v166m-15-20 15 20 15-20" />
            <rect x="343" y="83" width="74" height="41" rx="8" className="visual-solid" />
            <circle cx="360" cy="127" r="9" className="visual-accent-fill" />
            <circle cx="401" cy="127" r="9" className="visual-accent-fill" />
            <path className="visual-warm visual-draw delay-2" d="M180 260c65-25 118-7 200 48 83-55 139-71 203-46" />
          </g>
        )}
        {lesson.visual === 'balance' && (
          <g className="visual-layer">
            <path className="visual-muted" d="M380 105v232M322 337h116" />
            <path className="visual-main visual-draw" d="M145 204l470 34" />
            <path className="visual-accent" d="M200 208v85m-68 0h136l-42 58h-52l-42-58ZM560 234v43m-68 0h136l-42 58h-52l-42-58Z" />
            <circle cx="380" cy="221" r="27" className="visual-solid" />
            <circle cx="380" cy="221" r="7" className="visual-accent-fill visual-pulse" />
          </g>
        )}
        {lesson.visual === 'landscape' && (
          <g className="visual-layer">
            <path className="visual-muted visual-draw" d="M89 330C168 278 203 301 271 244s115-34 154-93 91-71 246-78" />
            <path className="visual-main visual-draw delay-1" d="M91 352C176 309 216 327 286 274s118-31 159-84 96-62 224-70" />
            <path className="visual-warm visual-draw delay-2" d="M98 374c99-29 145-8 211-52s111-20 165-64 101-41 190-45" />
            <circle cx="165" cy="294" r="18" className="visual-solid visual-orbit" />
            <path className="visual-accent visual-pulse" d="M166 277 363 193" />
            <circle cx="363" cy="193" r="12" className="visual-accent-fill" />
            <path className="visual-accent" d="m348 185 15 8-8 15" />
          </g>
        )}
        {lesson.visual === 'branching' && (
          <g className="visual-layer">
            <path className="visual-main visual-draw" d="M380 355V248m0 17-102-72m102 46 96-88m-198 42-87-79m87 79 2-101m96 59 79-92m-79 92 109 9" />
            {[['380','355'],['191','114'],['280','92'],['555','59'],['585','160']].map(([cx, cy], index) => <circle key={index} cx={cx} cy={cy} r={index === 0 ? 17 : 12} className={index % 2 ? 'visual-warm-fill visual-pulse' : 'visual-accent-fill visual-pulse'} />)}
            <path className="visual-muted" d="M148 365h464" />
          </g>
        )}
        {lesson.visual === 'growth' && (
          <g className="visual-layer">
            <path className="visual-muted" d="M110 336V76m0 260h546" />
            <path className="visual-main visual-draw" d="M118 319c88-1 137-8 196-30s103-61 143-113 77-76 186-94" />
            <path className="visual-accent visual-draw delay-1" d="M118 319c71-3 148-18 209-62s93-104 129-144 92-57 185-58" />
            {[167,264,367,468,582].map((cx, index) => <circle key={cx} cx={cx} cy={304-index*44} r="8" className="visual-accent-fill visual-pulse" style={{ animationDelay: `${index * 180}ms` }} />)}
          </g>
        )}
        {lesson.visual === 'flow' && (
          <g className="visual-layer">
            <path className="visual-main visual-draw" d="M100 210h130m58 0h168m58 0h145" />
            <path className="visual-accent visual-draw delay-1" d="m205 191 25 19-25 19m226-19 25 19-25 19m203-38 25 19-25 19" />
            <circle cx="100" cy="210" r="36" className="visual-solid" />
            <rect x="230" y="170" width="58" height="80" rx="9" className="visual-warm-fill" />
            <circle cx="486" cy="210" r="31" className="visual-solid visual-pulse" />
            <circle cx="659" cy="210" r="44" className="visual-accent-fill" />
            <path className="visual-muted" d="M258 155V93m228 86V75m173 91v-53" />
          </g>
        )}
      </svg>
      <figcaption>
        {lesson.visualLabels.map((label, index) => <span key={label}><b>0{index + 1}</b>{label}</span>)}
      </figcaption>
    </figure>
  )
}
