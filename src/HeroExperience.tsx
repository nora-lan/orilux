import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, Cpu, Sparkles } from './icons'
import BrandMonogram, { brandViews } from './BrandMonogram'
import type { BrandFocus } from './BrandMonogram'

const slides = [
  { eyebrow: 'BUILD WHAT’S NEXT', lead: '以智能，', title: '开启业务', accent: '无限可能。', description: '融合云计算、数据与人工智能，', detail: '为企业构建面向未来的数字能力，让创新真正发生。', label: 'AI 驱动的数字未来', short: 'AI 智能', category: '人工智能' },
  { eyebrow: 'BUILT TO GROW', lead: '以云为基石，', title: '让创新', accent: '轻盈生长。', description: '从弹性计算到云原生应用，', detail: '让每一份资源与业务同行，连接想法与实现。', label: '云原生的无限延展', short: '云基础设施', category: '云基础设施' },
  { eyebrow: 'TURN DATA INTO VALUE', lead: '让数据流动，', title: '让价值', accent: '清晰可见。', description: '连接数据、洞察与每一次行动，', detail: '让团队拥有共同的业务视角，发现新的增长路径。', label: '数据连接业务价值', short: '数据智能', category: '数据智能' },
]
type Props = { motionEnabled: boolean; onContact: () => void; onExplore: (category: string) => void }
export default function HeroExperience({ motionEnabled, onContact, onExplore }: Props) {
  const [slide, setSlide] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [inView, setInView] = useState(true)
  const [visible, setVisible] = useState(!document.hidden)
  const [hotspot, setHotspot] = useState<string | null>(null)
  const [brandFocus, setBrandFocus] = useState<BrandFocus>('solid')
  const section = useRef<HTMLElement>(null)
  const active = slides[slide]
  const playing = motionEnabled && !paused && !hovered && !focused && inView && visible
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .2 })
    if (section.current) observer.observe(section.current)
    const onVisibility = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', onVisibility) }
  }, [])
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => setSlide(value => (value + 1) % slides.length), 7000)
    return () => window.clearInterval(timer)
  }, [playing, slide])
  const selectSlide = (index: number) => { setSlide(index); setPaused(true) }
  return <section ref={section} className="hero interactive-hero" id="home" data-slide={slide} data-playing={playing} data-in-view={inView}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }} onPointerLeave={event => { if (event.pointerType === 'mouse') { setHovered(false); setHotspot(null) } }} onPointerCancel={() => setHovered(false)}
    onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
    <div className="hero-ambient" aria-hidden="true"><i /><i /><i /></div>
    <div className="hero-inner"><div className="hero-copy">
      <a className="hero-news" href="#products"><span>NEW</span> 探索曜境 AI 产品与服务 <ArrowRight size={14} /></a>
      <div className="hero-slide-copy" key={slide}><p className="eyebrow">{active.eyebrow}</p><h1>{active.lead}<br />{active.title}<span>{active.accent}</span></h1><p className="hero-description">{active.description}<br />{active.detail}</p></div>
      <div className="hero-buttons"><button className="button" onClick={() => onExplore(active.category)}>探索产品与服务 <ArrowRight size={17} /></button><button className="button secondary" onClick={onContact}>获取解决方案 <ArrowUpRight size={16} /></button></div><div className="hero-footnote"><span /><span>技术连接价值 · 创新驱动增长</span></div>
    </div>
    <div className="cloud-art" data-tilt="hero"><div className="art-scene"><div className="art-orbit orbit-a" aria-hidden="true" /><div className="art-orbit orbit-b" aria-hidden="true" /><div className="art-grid" aria-hidden="true" />
      <div className="platform platform-bottom" aria-hidden="true" /><div className="platform platform-middle" aria-hidden="true" /><BrandMonogram focus={brandFocus} bannerHovered={hovered} motionEnabled={motionEnabled} sceneActive={inView && visible} />
      <div className="orbit-traveler traveler-one" aria-hidden="true"><i /></div><div className="orbit-traveler traveler-two" aria-hidden="true"><i /></div>
      <button className="glass-block block-one" aria-label="探索人工智能产品" onClick={() => onExplore('人工智能')} onPointerEnter={() => setHotspot('AI 智能 · 点击探索')} onFocus={() => setHotspot('AI 智能 · 点击探索')} onBlur={() => setHotspot(null)} onPointerLeave={() => setHotspot(null)}><Sparkles size={35} /><span>AI</span></button>
      <button className="glass-block block-two" aria-label="探索数据智能产品" onClick={() => onExplore('数据智能')} onPointerEnter={() => setHotspot('数据智能 · 点击探索')} onFocus={() => setHotspot('数据智能 · 点击探索')} onBlur={() => setHotspot(null)} onPointerLeave={() => setHotspot(null)}><svg width="28" height="28" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><ellipse cx="16" cy="7" rx="10" ry="4" /><path d="M6 7v18c0 5 20 5 20 0V7M6 16c0 5 20 5 20 0" /></svg></button>
      <button className="glass-block block-three" aria-label="探索云基础设施产品" onClick={() => onExplore('云基础设施')} onPointerEnter={() => setHotspot('弹性云服务 · 点击探索')} onFocus={() => setHotspot('弹性云服务 · 点击探索')} onBlur={() => setHotspot(null)} onPointerLeave={() => setHotspot(null)}><Cpu size={30} /></button>
      <span className="art-point point-one" aria-hidden="true" /><span className="art-point point-two" aria-hidden="true" /><span className="art-cross cross-one" aria-hidden="true">+</span><span className="art-cross cross-two" aria-hidden="true">+</span>
    </div><div className={`art-label ${hotspot ? 'hotspot-active' : ''}`}><span />{hotspot}</div>
      <div className="brand-interaction"><p className="brand-caption" aria-live="polite" aria-atomic="true">{brandViews.find(view => view.id === brandFocus)?.caption}</p><div className="brand-controls" role="group" aria-label="标识展示模式">{brandViews.map(view => <button key={view.id} type="button" aria-label={`${view.label}展示`} aria-pressed={brandFocus === view.id} onClick={() => setBrandFocus(view.id)}>{view.label}</button>)}</div><p className="brand-hint"><span className="pointer-hint">悬停首屏 · 上下浮动</span><span className="touch-hint">轻触立起 · 再次轻触放平</span></p></div>
    </div></div>
    <div className="hero-pagination"><div className="hero-slide-tabs" role="group" aria-label="首屏主题">{slides.map((item, index) => <button key={item.short} className={slide === index ? 'active' : ''} aria-pressed={slide === index} aria-label={`切换到${item.short}主题`} onClick={() => selectSlide(index)}><span>0{index + 1}</span><i /><strong>{item.short}</strong></button>)}</div><div className="hero-player"><button aria-label="上一主题" onClick={() => selectSlide((slide + 2) % 3)}>←</button><button className="autoplay-toggle" aria-label={paused ? '播放首屏主题' : '暂停首屏主题'} aria-pressed={!paused && motionEnabled} disabled={!motionEnabled} onClick={() => { setPaused(!paused); if (paused) setFocused(false) }}>{paused || !motionEnabled ? '▷' : 'Ⅱ'}</button><button aria-label="下一主题" onClick={() => selectSlide((slide + 1) % 3)}>→</button></div><a href="#products" aria-label="向下浏览产品">↓</a></div>
  </section>
}
