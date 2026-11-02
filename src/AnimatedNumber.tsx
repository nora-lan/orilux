import { useLayoutEffect, useRef } from 'react'
export default function AnimatedNumber({ value, decimals, enabled }: { value: number; decimals: number; enabled: boolean }) {
  const element = useRef<HTMLSpanElement>(null)
  const current = useRef(value)
  useLayoutEffect(() => {
    if (!element.current) return
    let frame = 0
    const from = current.current
    element.current.textContent = from.toFixed(decimals)
    const start = performance.now()
    const tick = (now: number) => {
      const progress = enabled ? Math.min(1, (now - start) / 550) : 1
      current.current = from + (value - from) * (1 - (1 - progress) ** 3)
      if (element.current) element.current.textContent = current.current.toFixed(decimals)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, decimals, enabled])
  return <span ref={element} aria-label={value.toFixed(decimals)}>{value.toFixed(decimals)}</span>
}
