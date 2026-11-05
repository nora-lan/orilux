import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Check, ChevronDown, Palette } from 'lucide-react'
import { applySiteTheme, parseSiteTheme, readSiteTheme, themeStorageKey } from './site-theme'
import type { SiteTheme } from './site-theme'

const themes: { id: SiteTheme; name: string; description: string }[] = [
  { id: 'blue', name: '经典蓝白', description: '浅蓝底色 · 品牌蓝点缀' },
  { id: 'warm', name: '暖白墨色', description: '暖白底色 · 墨黑文字' },
]

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState<SiteTheme>(readSiteTheme)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const options = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()
  const current = themes.find(item => item.id === theme)!

  useEffect(() => {
    applySiteTheme(theme)
    try { localStorage.setItem(themeStorageKey, theme) } catch { /* Keep the selection for this page when storage is unavailable. */ }
  }, [theme])

  useEffect(() => {
    const syncTheme = (event: StorageEvent) => {
      if (event.key === themeStorageKey) setTheme(parseSiteTheme(event.newValue))
    }
    window.addEventListener('storage', syncTheme)
    return () => window.removeEventListener('storage', syncTheme)
  }, [])

  useEffect(() => {
    if (!open) return
    options.current[themes.findIndex(item => item.id === theme)]?.focus()
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [open, theme])

  function choose(next: SiteTheme) {
    const url = new URL(window.location.href)
    if (url.searchParams.has('style')) {
      url.searchParams.set('style', next)
      window.history.replaceState(window.history.state, '', url)
    }
    setTheme(next)
    setOpen(false)
    trigger.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape' && open) {
      event.stopPropagation()
      setOpen(false)
      trigger.current?.focus()
      return
    }
    if (!open) return
    const index = options.current.findIndex(item => item === document.activeElement)
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? themes.length - 1 : event.key === 'ArrowDown' ? (index + 1) % themes.length : event.key === 'ArrowUp' ? (index + themes.length - 1) % themes.length : -1
    if (next >= 0) { event.preventDefault(); options.current[next]?.focus() }
  }

  return <div className="theme-switcher" ref={root} onKeyDown={onKeyDown} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}>
    <button ref={trigger} type="button" className="theme-switcher-trigger" aria-label={`切换页面样式，当前${current.name}`} aria-expanded={open} aria-controls={menuId} aria-haspopup="menu" onClick={() => setOpen(value => !value)} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true) } }}>
      <Palette size={16} aria-hidden="true" /><span>{current.name}</span><ChevronDown size={12} className="theme-switcher-chevron" aria-hidden="true" />
    </button>
    {open && <div className="theme-switcher-panel" id={menuId}>
      <p className="theme-switcher-label">页面样式<span>STYLE</span></p>
      <div role="menu" aria-label="选择页面样式">
        {themes.map((item, index) => <button key={item.id} ref={el => { options.current[index] = el }} type="button" role="menuitemradio" aria-checked={theme === item.id} tabIndex={-1} onClick={() => choose(item.id)} className={`theme-option${theme === item.id ? ' is-selected' : ''}`}>
          <span className={`theme-palette theme-palette-${item.id}`} aria-hidden="true"><i /><i /><i /></span>
          <span className="theme-option-copy"><strong>{item.name}</strong><small>{item.description}</small></span>
          {theme === item.id && <Check size={16} aria-hidden="true" />}
        </button>)}
      </div>
    </div>}
  </div>
}
