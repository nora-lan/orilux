import { useId } from 'react'

export type BrandFocus = 'YJ' | 'Y' | 'J'
type Props = { focus: BrandFocus; onFocusChange: (focus: BrandFocus) => void }
export const brandViews: { id: BrandFocus; label: string; caption: string }[] = [
  { id: 'YJ', label: '全景', caption: '曜境 YAOJING · 让想法与未来相遇' },
  { id: 'Y', label: '曜', caption: 'Y · 曜 — 让每一个想法发光' },
  { id: 'J', label: '境', caption: 'J · 境 — 为每一种可能创造空间' },
]

const letterPaths = {
  Y: 'M8 10H32L50 44L68 10H92L62 69V110H38V69Z',
  J: 'M19 10H88V77C88 101 75 114 51 114C28 114 13 100 13 79V70H36V79C36 88 41 93 50 93C60 93 64 87 64 77V32H19Z',
}

export default function BrandMonogram({ focus, onFocusChange }: Props) {
  const gradientId = useId()
  return <div className="platform platform-top brand-platform" data-brand-focus={focus} role="group" aria-label="曜境 YJ 双字母标识">
    <span className="monogram-halo" aria-hidden="true" />
    <div className="monogram-letters">
      {(['Y', 'J'] as const).map(letter => <button
        key={letter}
        type="button"
        className={`monogram-letter letter-${letter.toLowerCase()}`}
        aria-label={`聚焦 ${letter} · ${letter === 'Y' ? '曜' : '境'}`}
        aria-pressed={focus === letter}
        onClick={() => onFocusChange(focus === letter ? 'YJ' : letter)}
      >
        <svg viewBox="0 0 105 128" aria-hidden="true">
          <defs><linearGradient id={`${gradientId}-${letter}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={letter === 'Y' ? '#639bff' : '#5ab9ff'} />
            <stop offset=".48" stopColor={letter === 'Y' ? '#377cff' : '#438cff'} />
            <stop offset="1" stopColor="#2259dc" />
          </linearGradient></defs>
          <path d={letterPaths[letter]} transform="translate(4 9)" fill="#235ccf" />
          <path d={letterPaths[letter]} transform="translate(2 4)" fill="#a8cbff" />
          <path d={letterPaths[letter]} fill={`url(#${gradientId}-${letter})`} stroke="#d2e4ff" strokeWidth=".8" />
        </svg>
      </button>)}
    </div>
    <span className="monogram-signature" aria-hidden="true">YAOJING · 无限可能</span>
  </div>
}
