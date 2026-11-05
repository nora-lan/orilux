import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import { ArrowRight, ArrowUpRight, Play, X } from './icons'
import ParticleLogo from './ParticleLogo'
import PhoneScene from './PhoneScene'
import AgentScene from './AgentScene'
import './hero-v2.css'

const dramaMedia = {
  background: '/media/v2/drama-background.mp4',
  feature: '/media/v2/drama-feature.mp4',
  poster: '/media/v2/drama-poster.jpg',
}

const themes = [
  { id: 'brand', label: '曜境 · 首页', eyebrow: 'ORILUX AI / INTELLIGENCE IN MOTION', title: '让想法，', accent: '成为下一种可能。', description: '连接技术与创造力，让每一份灵感，\n都能走向真实的业务与生活。', action: '探索产品与服务', secondary: '与我们聊聊', caption: '聚合每一份创造力', color: 'blue' },
  { id: 'drama', label: 'AI 漫剧', eyebrow: 'ORILUX STUDIO / STORIES COME ALIVE', title: '让想象入镜，', accent: '让故事发生。', description: '从一个灵感，到角色、分镜与画面。\n用 AI 连接创作，让好故事拥有更多表达。', action: '探索漫剧创作', secondary: '观看演示', caption: '从灵感，到下一帧', color: 'amber' },
  { id: 'agents', label: '智能体', eyebrow: 'ORILUX AGENTS / IDEAS INTO ACTION', title: '从一句需求，', accent: '到任务完成。', description: '理解目标、规划任务，连接知识与工具。\n让智能体把下一步，变成已完成。', action: '探索智能体', secondary: '咨询应用场景', caption: '目标驱动 · 知识连接 · 工具协同', color: 'violet' },
  { id: 'phone', label: 'AI 工作手机', eyebrow: 'ORILUX PHONE / CONNECTED WITH CONFIDENCE', title: '让每一次沟通，', accent: '都有迹可循。', description: 'AI 外呼、沟通留痕与智能分析，\n连接客户、团队与每一次跟进。', action: '了解 AI 工作手机', secondary: '咨询产品方案', caption: '智能沟通，高效协同', color: 'cyan' },
] as const

type Props = { motionEnabled: boolean; onContact: () => void; onExplore: (category: string) => void }

function BrandScene({ motionEnabled }: { motionEnabled: boolean }) {
  return <div className="v2-brand-scene">
    <div className="v2-brand-halo" /><span className="v2-brand-aura" />
    <div className="v2-logo-viewport" role="img" aria-label="ORILUX AI 粒子聚合 Logo">
      <ParticleLogo motionEnabled={motionEnabled} expanded />
    </div>
    <div className="v2-brand-floor" />
  </div>
}

function DramaViewer({ onClose, motionEnabled }: { onClose: () => void; motionEnabled: boolean }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    ref.current?.showModal()
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = overflow; trigger?.focus({ preventScroll: true }) }
  }, [])
  return <dialog ref={ref} className="v2-film-dialog" aria-label="AI 漫剧视觉演示" onCancel={onClose} onClick={event => { if (event.target === event.currentTarget) onClose() }}>
    <div className="v2-film-shell"><header><span>ORILUX STUDIO <i>/</i> AI 漫剧视觉演示</span><button type="button" onClick={onClose} aria-label="关闭漫剧演示" autoFocus><X size={23} /></button></header><video controls autoPlay={motionEnabled} playsInline loop poster={dramaMedia.poster}><source src={dramaMedia.feature} type="video/mp4" /></video><p>把灵感，写进下一帧。</p></div>
  </dialog>
}

export default function HeroV2({ motionEnabled, onContact, onExplore }: Props) {
  const [{ active, previous }, setSlide] = useState(() => {
    const index = Math.max(0, themes.findIndex(item => item.id === new URLSearchParams(window.location.search).get('slide')))
    return { active: index, previous: index }
  })
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(true)
  const [visible, setVisible] = useState(!document.hidden)
  const [filmOpen, setFilmOpen] = useState(false)
  const [videoBlocked, setVideoBlocked] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const pointerStart = useRef<{ id: number; x: number; y: number; width: number; dragging: boolean; lastX: number; lastTime: number; velocity: number } | null>(null)
  const suppressClickUntil = useRef(0)
  const running = motionEnabled && !paused && inView && visible && !filmOpen
  const advancing = running

  const releaseDrag = () => {
    const pointer = pointerStart.current
    pointerStart.current = null
    const stage = stageRef.current
    if (pointer?.dragging) suppressClickUntil.current = performance.now() + 350
    if (!stage) return
    stage.style.removeProperty('--v2-drag-x')
    stage.dataset.dragging = 'false'
    if (pointer && stage.hasPointerCapture(pointer.id)) stage.releasePointerCapture(pointer.id)
  }
  const choose = (index: number) => {
    releaseDrag()
    const next = (index + themes.length) % themes.length
    setSlide(current => next === current.active ? current : { active: next, previous: current.active })
  }
  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0 || (event.target as Element).closest('input,textarea,select,[contenteditable=true]')) return
    suppressClickUntil.current = 0
    pointerStart.current = { id: event.pointerId, x: event.clientX, y: event.clientY, width: event.currentTarget.clientWidth, dragging: false, lastX: event.clientX, lastTime: performance.now(), velocity: 0 }
  }
  const drag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointer = pointerStart.current
    if (!pointer || pointer.id !== event.pointerId) return
    const dx = event.clientX - pointer.x
    const dy = event.clientY - pointer.y
    if (!pointer.dragging) {
      if (Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) { releaseDrag(); return }
      if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy) * 1.2) return
      pointer.dragging = true
      event.currentTarget.setPointerCapture(event.pointerId)
      event.currentTarget.dataset.dragging = 'true'
    }
    event.preventDefault()
    const now = performance.now()
    const deltaTime = now - pointer.lastTime
    if (deltaTime > 0) pointer.velocity = (event.clientX - pointer.lastX) / deltaTime
    pointer.lastX = event.clientX
    pointer.lastTime = now
    const offset = Math.max(-pointer.width * .92, Math.min(pointer.width * .92, dx))
    event.currentTarget.style.setProperty('--v2-drag-x', `${offset}px`)
  }
  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointer = pointerStart.current
    if (!pointer || pointer.id !== event.pointerId) return
    const dx = event.clientX - pointer.x
    const distance = Math.abs(dx)
    const threshold = Math.max(48, Math.min(120, pointer.width * .16))
    const flick = performance.now() - pointer.lastTime < 100 && Math.abs(pointer.velocity) > .5 && distance > 28
    if (pointer.dragging && (distance >= threshold || flick)) choose(active + (dx < 0 ? 1 : -1))
    else releaseDrag()
  }

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .15 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    const changed = () => { setVisible(!document.hidden); if (document.hidden) releaseDrag() }
    document.addEventListener('visibilitychange', changed)
    window.addEventListener('blur', releaseDrag)
    window.addEventListener('resize', releaseDrag)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', changed); window.removeEventListener('blur', releaseDrag); window.removeEventListener('resize', releaseDrag) }
  }, [])
  useEffect(() => {
    if (!advancing) return
    const timer = window.setTimeout(() => choose(active + 1), 12000)
    return () => clearTimeout(timer)
  }, [advancing, active])
  useEffect(() => {
    if (previous === active) return
    // Reposition the recycled slide first, then restore its drag/snap transition.
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setSlide(current => current.active === active ? { ...current, previous: active } : current))
    })
    return () => cancelAnimationFrame(frame)
  }, [active, previous])
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let cancelled = false
    if (active === 1 && running) {
      video.play().then(() => { if (!cancelled) setVideoBlocked(false) }).catch(() => { if (!cancelled) setVideoBlocked(true) })
    } else video.pause()
    return () => { cancelled = true; video.pause() }
  }, [active, running])

  const explore = (index: number) => {
    if (index === 1) document.getElementById('ai-productivity')?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant' })
    else onExplore(index === 2 ? '曜境 OPC' : '精选产品')
  }
  return <section className="v2-showcase" id="home" ref={sectionRef} aria-label="曜境产品与服务 2.0" data-running={running}>
    <div className="v2-heading wrap"><div><p>ORILUX AI <span>2.0</span></p><h1>让智能，成为你的创造力。</h1></div></div>
    <div className="v2-carousel" role="region" aria-roledescription="轮播" aria-label="品牌与产品展示">
      <div className="v2-stage" ref={stageRef} data-jump={Math.abs(active - previous) === 2} onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag}
        onPointerCancel={releaseDrag} onLostPointerCapture={releaseDrag}
        onPointerLeave={() => { if (!pointerStart.current?.dragging) releaseDrag() }}
        onDragStart={event => event.preventDefault()}
        onClickCapture={event => { if (event.detail > 0 && performance.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation() } }}>
        {themes.map((theme, index) => {
          const relative = (index - active + themes.length) % themes.length
          const position = relative === 3 ? -1 : relative
          const recycled = index !== active && (index - previous + themes.length) % themes.length === 2
          return <article key={theme.id} className={`v2-slide v2-slide-${theme.id}`} data-position={position} data-recycled={recycled} data-active={active === index} aria-hidden={active !== index} inert={active !== index} aria-label={`${index + 1} / 4 · ${theme.label}`} aria-roledescription="幻灯片">
            {index === 0 && <BrandScene motionEnabled={running && active === 0} />}
            {index === 1 && <video className="v2-scene-media" ref={videoRef} muted loop playsInline preload="metadata" poster={dramaMedia.poster} aria-hidden="true"><source src={dramaMedia.background} type="video/mp4" /></video>}
            {index === 2 && <AgentScene running={running && active === 2} motionEnabled={motionEnabled} />}
            {index === 3 && <PhoneScene />}
            <div className="v2-scene-shade" aria-hidden="true" />
            <div className="v2-slide-topline"><span>{theme.eyebrow}</span><span className="v2-scene-count">0{index + 1} <i>/</i> 04</span></div>
            <div className="v2-slide-copy"><span className="v2-slide-category"><i />{['让创造力发生','AI 漫剧创作','企业智能体','企业智能通讯'][index]}</span><h2>{theme.title}<br /><span>{theme.accent}</span></h2><p>{theme.description}</p><div className="v2-slide-actions">
              {index === 3 ? <a className="v2-primary" href="https://phone1.ydcq3.com/" target="_blank" rel="noopener noreferrer">{theme.action}<ArrowUpRight size={17} /></a> : <button type="button" className="v2-primary" onClick={() => explore(index)}>{theme.action}<ArrowRight size={17} /></button>}
              <button type="button" className="v2-secondary" onClick={() => index === 1 ? setFilmOpen(true) : onContact()}>{index === 1 && <Play size={15} />}{theme.secondary}{index !== 1 && <ArrowUpRight size={15} />}</button>
            </div></div>
            <div className="v2-slide-bottom"><span>{theme.caption}</span><span>{index === 1 ? 'AI VISUAL DEMO' : 'BUILD WHAT’S NEXT'}<i /></span></div>
            {index === 1 && videoBlocked && <button className="v2-video-play" type="button" onClick={() => { videoRef.current?.play().then(() => setVideoBlocked(false)).catch(() => setFilmOpen(true)) }}><Play size={15} />播放动态画面</button>}
          </article>
        })}
      </div>
      <div className="v2-controls wrap">
        <div className="v2-theme-tabs" role="group" aria-label="选择 Banner 主题">{themes.map((theme, index) => <button type="button" key={theme.id} aria-label={`切换到${theme.label}`} aria-pressed={index === active} className={index === active ? 'is-active' : ''} onClick={() => choose(index)} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); choose(active + (event.key === 'ArrowRight' ? 1 : -1)) } }}><span className="v2-tab-number">0{index + 1}</span><span>{theme.label}</span><i><b key={`${active}-${advancing}`} className={index === active && advancing ? 'is-advancing' : ''} /></i></button>)}</div>
        <div className="v2-player"><span className="v2-player-count">0{active + 1}<i>/ 04</i></span><button type="button" aria-label="上一屏" onClick={() => choose(active - 1)}><ArrowRight size={18} className="v2-back-arrow" /></button><button type="button" aria-label={paused || !motionEnabled ? '播放 Banner' : '暂停 Banner'} aria-pressed={!paused && motionEnabled} disabled={!motionEnabled} onClick={() => setPaused(value => !value)}>{paused || !motionEnabled ? <Play size={15} /> : <svg width="15" height="15" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><rect x="5" y="4" width="3" height="12" rx="1" /><rect x="12" y="4" width="3" height="12" rx="1" /></svg>}</button><button type="button" aria-label="下一屏" onClick={() => choose(active + 1)}><ArrowRight size={18} /></button></div>
      </div>
    </div>
    {filmOpen && <DramaViewer motionEnabled={motionEnabled} onClose={() => setFilmOpen(false)} />}
  </section>
}
