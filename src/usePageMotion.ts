import { useEffect, useRef, useState } from 'react'

export function usePageMotion() {
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [userPaused, setUserPaused] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const progressRef = useRef<HTMLDivElement>(null)
  const enabled = !systemReduced && !userPaused

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'on' : 'off'
    const targets = [...document.querySelectorAll<HTMLElement>('.section-heading, .quick-links, .product-grid, .ai-app-grid, .solution-shell, .resource-grid, .about-section, .cta-section .wrap')]
    if (!enabled) { targets.forEach(target => target.classList.add('is-visible')); return }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target) }
    }), { threshold: .08, rootMargin: '0px 0px -30px 0px' })
    targets.forEach(target => { target.classList.add('reveal-target'); if (target.getBoundingClientRect().top < window.innerHeight - 30) target.classList.add('is-visible'); else observer.observe(target) })
    const revealFocused = (event: FocusEvent) => {
      const element = event.target as HTMLElement
      element.closest('.reveal-target')?.classList.add('is-visible')
    }
    document.addEventListener('focusin', revealFocused)
    return () => { observer.disconnect(); document.removeEventListener('focusin', revealFocused); targets.forEach(target => target.classList.remove('reveal-target')) }
  }, [enabled])

  useEffect(() => {
    let frame = 0
    const sections = [...document.querySelectorAll<HTMLElement>('main section[id]')]
    const header = document.querySelector('header')
    const update = () => {
      frame = 0
      const height = document.documentElement.scrollHeight - window.innerHeight
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0})`
      header?.classList.toggle('is-scrolled', window.scrollY > 20)
      let current = 'home'
      sections.forEach(section => { if (section.getBoundingClientRect().top <= window.innerHeight * .36) current = section.id })
      setActiveSection(current)
    }
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update) }
    const resizeObserver = new ResizeObserver(schedule)
    resizeObserver.observe(document.body)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    update()
    return () => { cancelAnimationFrame(frame); resizeObserver.disconnect(); window.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule) }
  }, [])

  useEffect(() => {
    if (!enabled || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let frame = 0
    let current: HTMLElement | null = null
    const reset = () => { if (current) { current.style.removeProperty('--tilt-x'); current.style.removeProperty('--tilt-y'); current.style.removeProperty('--pointer-x'); current.style.removeProperty('--pointer-y'); current = null }; cancelAnimationFrame(frame); frame = 0 }
    const move = (event: PointerEvent) => {
      const target = (event.target as Element).closest<HTMLElement>('[data-tilt], .product-card, .resource-card')
      if (!target) { reset(); return }
      if (current !== target) { reset(); current = target }
      const { clientX, clientY } = event
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = target.getBoundingClientRect()
        const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
        const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
        target.style.setProperty('--pointer-x', `${x * 100}%`)
        target.style.setProperty('--pointer-y', `${y * 100}%`)
        target.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`)
        target.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`)
        frame = 0
      })
    }
    document.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerleave', reset)
    window.addEventListener('blur', reset)
    return () => { reset(); document.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', reset); window.removeEventListener('blur', reset) }
  }, [enabled])
  return { enabled, systemReduced, userPaused, toggleMotion: () => setUserPaused(value => !value), activeSection, progressRef }
}
