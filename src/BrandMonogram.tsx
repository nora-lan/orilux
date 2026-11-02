import { useRef, useState } from 'react'
import BrandLogoSvg from './BrandLogoSvg'

export type BrandFocus = 'solid' | 'outline' | 'glow'
type Props = { focus: BrandFocus }
export const brandViews: { id: BrandFocus; label: string; caption: string }[] = [
  { id: 'solid', label: '立体', caption: '曜境 YAOJING · 让想法与未来相遇' },
  { id: 'outline', label: '轮廓', caption: '一笔连接灵感，一环延展可能' },
  { id: 'glow', label: '流光', caption: '让每一个想法，循光而生' },
]

export default function BrandMonogram({ focus }: Props) {
  const [hovered, setHovered] = useState(false)
  const [activated, setActivated] = useState(false)
  const pointerType = useRef('mouse')
  const raised = hovered || activated
  return <div className="brand-assembly" data-brand-focus={focus} data-raised={raised} role="group" aria-label="曜境品牌标识">
    <div className="platform platform-top brand-platform" aria-hidden="true">
      <span className="monogram-halo" />
      <span className="monogram-contact-shadow" />
      <span className="monogram-signature">YAOJING · 无限可能</span>
    </div>
    <button type="button" className="monogram-trigger" aria-label="标识立起预览" aria-pressed={raised}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }}
      onPointerLeave={event => { if (event.pointerType === 'mouse') setHovered(false) }}
      onPointerDown={event => { pointerType.current = event.pointerType; if (event.pointerType === 'mouse') setActivated(false) }}
      onPointerCancel={() => { setHovered(false); setActivated(false) }}
      onClick={event => { if (event.detail === 0 || pointerType.current !== 'mouse') setActivated(value => !value) }}
      onBlur={() => setActivated(false)}>
      <span className="monogram-stand"><span className="monogram-emblem"><BrandLogoSvg /></span></span>
    </button>
  </div>
}
