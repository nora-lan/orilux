import type { ReactNode, SVGProps } from 'react'
type IconProps = SVGProps<SVGSVGElement> & { size?: number }
function icon(content: ReactNode) {
  return function Icon({ size = 24, ...props }: IconProps) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{content}</svg>
  }
}
export const ArrowUpRight = icon(<path d="M7 17 17 7M7 7h10v10" />)
export const ArrowRight = icon(<path d="M4 12h16m-6-6 6 6-6 6" />)
export const Plus = icon(<path d="M5 12h14M12 5v14" />)
export const X = icon(<path d="m6 6 12 12M6 18 18 6" />)
export const Menu = icon(<path d="M4 6h16M4 12h16M4 18h16" />)
export const ShoppingBag = icon(<><path d="M5 7h14l1 14H4L5 7Z" /><path d="M9 8V5a3 3 0 0 1 6 0v3" /></>)
export const Cpu = icon(<><rect x="5" y="5" width="14" height="14" rx="2" /><rect x="9" y="9" width="6" height="6" rx="1" /><path d="M9 2v3m6-3v3M9 19v3m6-3v3M2 9h3m-3 6h3m14-6h3m-3 6h3" /></>)
export const Aperture = icon(<><circle cx="12" cy="12" r="9" /><path d="m12 3 4 7m4-3-4 7m5 2h-8m1 5-4-7m-6 3 4-7M3 8h8" /></>)
export const BatteryCharging = icon(<><path d="M8 6H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4m8-12h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2m7-8v4M13 4l-4 8h6l-4 8" /></>)
export const Sparkles = icon(<><path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4L12 3Z" /><path d="M20 2v4m-2-2h4" /></>)
export const Play = icon(<path d="m8 5 11 7-11 7V5Z" />)
export const Check = icon(<path d="m5 12 4 4L19 6" />)
