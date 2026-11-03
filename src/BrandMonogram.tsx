import { useRef, useState } from 'react'
import BrandLogoSvg from './BrandLogoSvg'

type Props = { bannerHovered: boolean; motionEnabled: boolean; sceneActive: boolean }

export default function BrandMonogram({ bannerHovered, motionEnabled, sceneActive }: Props) {
  const [activated, setActivated] = useState(false)
  const pointerType = useRef('mouse')
  const raised = bannerHovered || activated
  const floating = raised && motionEnabled && sceneActive

  return <div className="brand-assembly" data-brand-focus="glow" data-scene-active={sceneActive} data-raised={raised} data-floating={floating} role="group" aria-label="曜境品牌标识">
    <div className="platform platform-top brand-platform" aria-hidden="true">
      <span className="monogram-halo" />
      <span className="monogram-contact-shadow" />
      <span className="monogram-signature">YAOJING · 无限可能</span>
    </div>
    <button type="button" className="monogram-trigger" aria-label="标识浮动预览" aria-pressed={raised}
      onPointerDown={event => { pointerType.current = event.pointerType; if (event.pointerType === 'mouse') setActivated(false) }}
      onPointerCancel={() => setActivated(false)}
      onClick={event => { if (event.detail === 0 || pointerType.current !== 'mouse') setActivated(value => !value) }}
      onBlur={() => setActivated(false)}>
      <span className="monogram-stand"><span className="monogram-float">
        <span className="monogram-rear" aria-hidden="true"><BrandLogoSvg /></span>
        {[-8, -7, -6, -5, -4, -3, -2, -1].map(depth => <span key={depth} className="monogram-side" style={{ transform: `translateZ(${depth}px)` }} aria-hidden="true"><BrandLogoSvg compact /></span>)}
        <span className="monogram-emblem"><BrandLogoSvg /></span>
      </span></span>
    </button>
  </div>
}
