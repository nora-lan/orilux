import { useEffect, useRef } from 'react'
import BrandLogoSvg from './BrandLogoSvg'
import { footPath, ringPath } from './brandShape'

type Particle = { x: number; y: number; dx: number; dy: number; vx: number; vy: number; seed: number; edge: boolean }

export default function ParticleLogo({ motionEnabled, expanded = false }: { motionEnabled: boolean; expanded?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const host = hostRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!host || !canvas || !ctx) return
    ctx.setTransform(1, 0, 0, 1, 0, 0)

    const shape = new Path2D(ringPath)
    shape.addPath(new Path2D(footPath))
    const particles: Particle[] = []
    const inside = (x: number, y: number) => ctx.isPointInPath(shape, x, y)
    for (let y = 60; y < 1070; y += 15) {
      for (let x = 148; x < 1330; x += 15) {
        if (!inside(x, y)) continue
        const seed = (Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1
        const edge = !inside(x - 18, y) || !inside(x + 18, y) || !inside(x, y - 18) || !inside(x, y + 18)
        particles.push({ x, y, dx: 0, dy: 0, vx: 0, vy: 0, seed: Math.abs(seed), edge })
      }
    }
    let width = 0
    let height = 0
    let frame = 0
    let visible = false
    let elapsed = 0
    let lastTime = 0
    let previousDraw = 0
    const pointer = { x: -1000, y: -1000 }
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)')
    const animated = () => motionEnabled && !reduceMotion.matches

    const draw = () => {
      const moving = animated()
      const t = moving ? elapsed / 1000 : 10
      const scale = Math.min(width * (expanded ? .86 : .67) / 1260, height * (expanded ? .82 : .73) / 1090)
      const left = (width - 1260 * scale) / 2 - 115 * scale
      const top = (height - 1090 * scale) / 2 - 30 * scale
      const float = moving ? Math.sin(t * .8) * 4 : 0
      const arrival = moving ? Math.max(0, 1 - t / 1.6) ** 3 : 0
      ctx.clearRect(0, 0, width, height)

      // Quiet background dust gives the mark depth without obscuring its silhouette.
      for (let i = 0; i < 66; i++) {
        const x = ((i * 127.37) % width)
        const y = ((i * 53.91 + t * (i % 2 ? 2 : -2)) % height + height) % height
        ctx.fillStyle = `rgba(111,179,255,${.09 + (i % 5) * .045})`
        ctx.beginPath()
        ctx.arc(x, y, i % 7 === 0 ? 1.25 : .65, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const p of particles) {
        const baseX = p.x * scale + left
        const baseY = p.y * scale + top + float
        if (moving) {
          const diffX = baseX + p.dx - pointer.x
          const diffY = baseY + p.dy - pointer.y
          const distance = Math.hypot(diffX, diffY)
          if (distance < 85 && distance > .1) {
            const force = (1 - distance / 85) * 2.1
            p.vx += diffX / distance * force
            p.vy += diffY / distance * force
          }
          p.vx = (p.vx - p.dx * .045) * .86
          p.vy = (p.vy - p.dy * .045) * .86
          p.dx += p.vx
          p.dy += p.vy
        } else { p.dx = 0; p.dy = 0 }

        const angle = p.seed * Math.PI * 2
        const spread = arrival * (40 + p.seed * 130)
        const x = baseX + p.dx + Math.cos(angle) * spread
        const y = baseY + p.dy + Math.sin(angle) * spread
        const wave = Math.max(0, Math.sin(p.x * .004 - p.y * .002 - t * .9)) ** 9
        const sparkle = (expanded ? .9 : .72) + Math.sin(t * 1.1 + p.seed * 30) * (expanded ? .1 : .18)
        const brightness = expanded ? (p.edge ? 1 : .62 + p.seed * .3) : (p.edge ? .88 : .35 + p.seed * .35)
        const alpha = Math.min(1, brightness * sparkle + wave * .48)
        const radius = (p.edge ? 1.45 : .8 + p.seed * .65) * Math.min(1.1, Math.max(.72, width / 620)) * (expanded ? 1.1 : 1)

        if (p.edge) {
          ctx.fillStyle = 'rgba(53,104,230,.22)'
          ctx.beginPath(); ctx.arc(x + 4, y + 7, radius, 0, Math.PI * 2); ctx.fill()
        }
        // Keep the larger homepage mark luminous while retaining distinct particle cores.
        if (expanded && (p.edge || p.seed > .78)) {
          ctx.fillStyle = `rgba(95,183,255,${alpha * .1})`
          ctx.beginPath(); ctx.arc(x, y, radius * 2.5, 0, Math.PI * 2); ctx.fill()
        }
        ctx.fillStyle = p.edge || wave > .55
          ? `rgba(${expanded ? '222,245,255' : '194,233,255'},${alpha})`
          : `rgba(${(expanded ? 119 : 75) + Math.round(p.seed * 48)},${(expanded ? 184 : 142) + Math.round(p.seed * 45)},255,${alpha})`
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill()
        if (wave > .85 && p.seed > .88) {
          ctx.fillStyle = expanded ? 'rgba(155,221,255,.22)' : 'rgba(113,201,255,.13)'
          ctx.beginPath(); ctx.arc(x, y, radius * 3.5, 0, Math.PI * 2); ctx.fill()
        }
      }
    }

    const tick = (now: number) => {
      frame = 0
      if (!visible || document.hidden || !animated()) return
      if (now - previousDraw >= 30) {
        elapsed += lastTime ? Math.min(now - lastTime, 60) : 0
        lastTime = now
        previousDraw = now
        draw()
      }
      frame = requestAnimationFrame(tick)
    }
    const sync = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = 0
      lastTime = 0
      if (!animated()) draw()
      else if (visible && !document.hidden) frame = requestAnimationFrame(tick)
    }
    const resize = () => {
      width = host.clientWidth
      height = host.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
      host.dataset.ready = 'true'
    }
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const bounds = canvas.getBoundingClientRect()
      pointer.x = event.clientX - bounds.left
      pointer.y = event.clientY - bounds.top
    }
    const onPointerLeave = () => { pointer.x = -1000; pointer.y = -1000 }
    const resizer = new ResizeObserver(resize)
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() }, { threshold: .05 })
    resizer.observe(host)
    observer.observe(host)
    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)
    document.addEventListener('visibilitychange', sync)
    reduceMotion.addEventListener('change', sync)
    resize()
    return () => {
      cancelAnimationFrame(frame)
      resizer.disconnect()
      observer.disconnect()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      document.removeEventListener('visibilitychange', sync)
      reduceMotion.removeEventListener('change', sync)
    }
  }, [motionEnabled, expanded])

  return <div className="join-particle-art" ref={hostRef} aria-hidden="true">
    <div className="join-particle-fallback"><BrandLogoSvg compact /></div>
    <span className="join-particle-orbit" /><span className="join-particle-orbit orbit-secondary" />
    <canvas ref={canvasRef} />
    <div className="join-particle-caption"><span>ORILUX AI</span><i /><span>每一份热爱，都在闪光</span></div>
  </div>
}
