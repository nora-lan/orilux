import { useEffect, useRef, useState } from 'react'
import BrandLogoSvg from './BrandLogoSvg'

export type BrandFocus = 'solid' | 'outline' | 'glow'
type Props = { focus: BrandFocus; bannerHovered: boolean; motionEnabled: boolean; sceneActive: boolean }
export const brandViews: { id: BrandFocus; label: string; caption: string }[] = [
  { id: 'solid', label: '立体', caption: '曜境 YAOJING · 让想法与未来相遇' },
  { id: 'outline', label: '轮廓', caption: '一笔连接灵感，一环延展可能' },
  { id: 'glow', label: '流光', caption: '让每一个想法，循光而生' },
]

export default function BrandMonogram({ focus, bannerHovered, motionEnabled, sceneActive }: Props) {
  const [activated, setActivated] = useState(false)
  const pointerType = useRef('mouse')
  const rotor = useRef<HTMLSpanElement>(null)
  const angle = useRef(0)
  const raised = bannerHovered || activated
  const spinning = raised && motionEnabled && sceneActive

  useEffect(() => {
    const element = rotor.current
    if (!element) return
    if (!motionEnabled) {
      angle.current = 0
      element.style.transform = 'rotateY(0deg)'
      return
    }
    // Keep the current phase while offscreen or in a background tab.
    if (!sceneActive || (!raised && angle.current === 0)) return
    let frame = 0
    let previous = performance.now()
    const started = previous
    const initial = angle.current
    const resting = Math.round(initial / 360) * 360
    const tick = (now: number) => {
      const elapsed = Math.min(now - previous, 40)
      previous = now
      const progress = Math.min((now - started) / 700, 1)
      angle.current = raised
        ? (angle.current + elapsed * .025) % 360
        : initial + (resting - initial) * (1 - (1 - progress) ** 3)
      element.style.transform = `rotateY(${angle.current}deg)`
      if (raised || progress < 1) frame = requestAnimationFrame(tick)
      else {
        angle.current = 0
        element.style.transform = 'rotateY(0deg)'
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [raised, motionEnabled, sceneActive])

  return <div className="brand-assembly" data-brand-focus={focus} data-raised={raised} data-spinning={spinning} role="group" aria-label="曜境品牌标识">
    <div className="platform platform-top brand-platform" aria-hidden="true">
      <span className="monogram-halo" />
      <span className="monogram-contact-shadow" />
      <span className="monogram-signature">YAOJING · 无限可能</span>
    </div>
    <button type="button" className="monogram-trigger" aria-label="标识旋转预览" aria-pressed={raised}
      onPointerDown={event => { pointerType.current = event.pointerType; if (event.pointerType === 'mouse') setActivated(false) }}
      onPointerCancel={() => setActivated(false)}
      onClick={event => { if (event.detail === 0 || pointerType.current !== 'mouse') setActivated(value => !value) }}
      onBlur={() => setActivated(false)}>
      <span className="monogram-stand"><span className="monogram-rotor" ref={rotor}>
        <span className="monogram-rear" aria-hidden="true"><BrandLogoSvg /></span>
        {[-8, -7, -6, -5, -4, -3, -2, -1].map(depth => <span key={depth} className="monogram-side" style={{ transform: `translateZ(${depth}px)` }} aria-hidden="true"><BrandLogoSvg compact /></span>)}
        <span className="monogram-emblem"><BrandLogoSvg /></span>
      </span></span>
    </button>
  </div>
}
