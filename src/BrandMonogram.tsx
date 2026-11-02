import BrandLogoSvg from './BrandLogoSvg'

export type BrandFocus = 'solid' | 'outline' | 'glow'
type Props = { focus: BrandFocus; onFocusChange: (focus: BrandFocus) => void }
export const brandViews: { id: BrandFocus; label: string; caption: string }[] = [
  { id: 'solid', label: '立体', caption: '曜境 YAOJING · 让想法与未来相遇' },
  { id: 'outline', label: '轮廓', caption: '一笔连接灵感，一环延展可能' },
  { id: 'glow', label: '流光', caption: '让每一个想法，循光而生' },
]

export default function BrandMonogram({ focus, onFocusChange }: Props) {
  const nextView = brandViews[(brandViews.findIndex(view => view.id === focus) + 1) % brandViews.length]
  return <div className="brand-assembly" data-brand-focus={focus} role="group" aria-label="曜境品牌标识">
    <div className="platform platform-top brand-platform" aria-hidden="true">
      <span className="monogram-halo" />
      <span className="monogram-contact-shadow" />
      <span className="monogram-signature">YAOJING · 无限可能</span>
    </div>
    <div className="monogram-stand">
      <button type="button" className="monogram-emblem" aria-label={`品牌标识：${brandViews.find(view => view.id === focus)?.label}，切换为${nextView.label}展示`} onClick={() => onFocusChange(nextView.id)}>
        <BrandLogoSvg />
      </button>
    </div>
  </div>
}
