import { useId } from 'react'

export type BrandFocus = 'solid' | 'outline' | 'glow'
type Props = { focus: BrandFocus; onFocusChange: (focus: BrandFocus) => void }
export const brandViews: { id: BrandFocus; label: string; caption: string }[] = [
  { id: 'solid', label: '立体', caption: '曜境 YAOJING · 让想法与未来相遇' },
  { id: 'outline', label: '轮廓', caption: '一笔连接灵感，一环延展可能' },
  { id: 'glow', label: '流光', caption: '让每一个想法，循光而生' },
]

// The reference's open ring, rising stem and rightward foot share one silhouette.
const ringPath = 'M846 60C949 105 1027 187 1027 318V603C1027 857 855 1065 623 1065C365 1065 149 890 149 637C149 396 373 191 600 191C688 191 761 211 815 248V567C784 443 704 358 576 358C432 358 326 473 326 624C326 773 437 880 589 880C750 880 840 756 840 566V70Q840 56 846 60Z'
const footPath = 'M1027 580V887L1135 885C1254 883 1312 922 1328 1048Q1329 1057 1321 1057H742C913 965 1005 807 1027 580Z'
const ringFace = 'M853 68C920 127 941 220 941 344V568C941 825 812 1038 612 1041C365 1045 212 875 212 628C212 407 391 221 605 218C692 217 761 228 807 253V280C739 254 673 247 606 250C435 256 324 422 324 624C324 795 434 917 590 917C773 917 853 741 853 566Z'

export default function BrandMonogram({ focus, onFocusChange }: Props) {
  const id = useId()
  const nextView = brandViews[(brandViews.findIndex(view => view.id === focus) + 1) % brandViews.length]
  return <div className="platform platform-top brand-platform" data-brand-focus={focus} role="group" aria-label="曜境品牌标识">
    <span className="monogram-halo" aria-hidden="true" />
    <button type="button" className="monogram-emblem" aria-label={`品牌标识：${brandViews.find(view => view.id === focus)?.label}，切换为${nextView.label}展示`} onClick={() => onFocusChange(nextView.id)}>
      <svg viewBox="115 30 1260 1090" aria-hidden="true">
        <defs>
          <path id={`${id}-ring`} d={ringPath} />
          <path id={`${id}-foot`} d={footPath} />
          <linearGradient id={`${id}-metal`} x1="0" y1="0" x2=".9" y2="1">
            <stop offset="0" stopColor="#acd7ff" /><stop offset=".23" stopColor="#6aa5ff" /><stop offset=".48" stopColor="#3978f4" /><stop offset=".72" stopColor="#174cc5" /><stop offset="1" stopColor="#488aff" />
          </linearGradient>
          <linearGradient id={`${id}-face`} x1="0" y1="0" x2=".6" y2="1">
            <stop offset="0" stopColor="#d3edff" /><stop offset=".22" stopColor="#6aafff" /><stop offset=".44" stopColor="#367ff5" /><stop offset=".59" stopColor="#afd9ff" /><stop offset=".73" stopColor="#4d92ff" /><stop offset="1" stopColor="#2d6fe9" />
          </linearGradient>
          <linearGradient id={`${id}-edge`} x1="0" y1="0" x2=".8" y2="1">
            <stop offset="0" stopColor="#f1fbff" /><stop offset=".48" stopColor="#87c1ff" /><stop offset="1" stopColor="#badfff" />
          </linearGradient>
          <linearGradient id={`${id}-shine`}><stop stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".72" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <clipPath id={`${id}-clip`}><use href={`#${id}-foot`} /><use href={`#${id}-ring`} /></clipPath>
        </defs>
        <g className="emblem-depth" fill="#1a50bf" transform="translate(5 15)"><use href={`#${id}-foot`} /><use href={`#${id}-ring`} /></g>
        <g className="emblem-surface" stroke={`url(#${id}-edge)`} strokeWidth="4" strokeLinejoin="round">
          <use href={`#${id}-foot`} fill={`url(#${id}-metal)`} />
          <path d="M1021 805V895H1138C1244 895 1299 933 1320 1038C1268 988 1202 970 1132 970H875C943 925 987 871 1021 805Z" fill={`url(#${id}-face)`} />
          <use href={`#${id}-ring`} fill={`url(#${id}-metal)`} />
          <path d={ringFace} fill={`url(#${id}-face)`} />
          <path d="M158 634C163 837 342 1002 581 1001C808 1000 975 831 1016 628M327 620C321 463 429 358 576 358C704 358 784 443 815 567M840 70V563" fill="none" stroke="#174cb3" strokeWidth="8" opacity=".6" />
          <path d="M165 595C190 372 397 200 600 200C680 200 754 219 805 247M857 72C920 133 942 220 942 344V568C942 825 812 1037 612 1040M878 971H1132C1210 971 1271 991 1318 1038" fill="none" stroke="#e2f4ff" strokeWidth="6" strokeLinecap="round" />
        </g>
        <g className="emblem-outline" fill="none" stroke="#377cf3" strokeWidth="14" strokeLinejoin="round"><use href={`#${id}-foot`} /><use href={`#${id}-ring`} /><path d={ringFace} strokeWidth="5" opacity=".5" /></g>
        <g clipPath={`url(#${id}-clip)`}><rect className="emblem-shine" x="-500" y="-200" width="390" height="1600" fill={`url(#${id}-shine)`} transform="rotate(-18 650 550)" /></g>
      </svg>
    </button>
    <span className="monogram-signature" aria-hidden="true">YAOJING · 无限可能</span>
  </div>
}
