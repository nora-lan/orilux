import { useId } from 'react'
import { footPath, ringPath } from './brandShape'

type Props = { compact?: boolean }
// The reference's open ring, rising stem and rightward foot share one silhouette.
const ringFace = 'M853 68C920 127 941 220 941 344V568C941 825 812 1038 612 1041C365 1045 212 875 212 628C212 407 391 221 605 218C692 217 761 228 807 253V280C739 254 673 247 606 250C435 256 324 422 324 624C324 795 434 917 590 917C773 917 853 741 853 566Z'
export default function BrandLogoSvg({ compact = false }: Props) {
  const id = useId()
  if (compact) return <svg viewBox="115 30 1260 1090" aria-hidden="true" focusable="false">
    <defs><linearGradient id={`${id}-compact`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#559aff" /><stop offset=".55" stopColor="#2864f4" /><stop offset="1" stopColor="#194ccb" /></linearGradient></defs>
    <g fill={`url(#${id}-compact)`}><path d={footPath} /><path d={ringPath} /></g>
  </svg>
  return (<svg viewBox="115 30 1260 1090" aria-hidden="true">
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
  )
}
