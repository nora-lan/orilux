import { useEffect, useRef, useState } from 'react'
import { ArrowRight, X } from './icons'

type PosterMember = { name: string; role: string; motto: string; page: number }
type Props = {
  members: PosterMember[]
  selectedIndex: number
  onSelect: (page: number) => void
  onClose: () => void
}

export default function MemberPosterDialog({ members, selectedIndex, onSelect, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const stripRef = useRef<HTMLDivElement>(null)
  const backdropPointer = useRef(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closingRef = useRef(false)
  const swipe = useRef<{ id: number; x: number; y: number; time: number } | null>(null)
  const [closing, setClosing] = useState(false)
  const [direction, setDirection] = useState<'next' | 'previous'>('next')
  const member = members[selectedIndex]
  const motionAllowed = () => document.documentElement.dataset.motion !== 'off' && !matchMedia('(prefers-reduced-motion: reduce)').matches
  const select = (index: number, nextDirection: 'next' | 'previous') => {
    if (closingRef.current || index === selectedIndex) return
    setDirection(nextDirection)
    onSelect(members[index].page)
  }
  const move = (step: number) => select((selectedIndex + step + members.length) % members.length, step > 0 ? 'next' : 'previous')
  const requestClose = () => {
    if (closingRef.current) return
    closingRef.current = true
    if (!motionAllowed()) { onClose(); return }
    setClosing(true)
    closeTimer.current = setTimeout(onClose, 200)
  }

  useEffect(() => {
    const dialog = dialogRef.current
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    const previousPadding = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) document.body.style.paddingRight = `calc(${getComputedStyle(document.body).paddingRight} + ${scrollbarWidth}px)`
    document.body.style.overflow = 'hidden'
    dialog?.showModal()
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
      dialog?.close()
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPadding
      trigger?.focus({ preventScroll: true })
    }
  }, [])

  useEffect(() => {
    const strip = stripRef.current
    const selected = strip?.querySelector<HTMLElement>('[aria-pressed=true]')
    if (!strip || !selected) return
    const rail = strip.getBoundingClientRect()
    const thumb = selected.getBoundingClientRect()
    const offset = thumb.left < rail.left + 6 ? thumb.left - rail.left - 6 : thumb.right > rail.right - 6 ? thumb.right - rail.right + 6 : 0
    if (offset) strip.scrollBy({ left: offset, behavior: motionAllowed() ? 'smooth' : 'instant' })
  }, [selectedIndex])

  return <dialog
    ref={dialogRef}
    className="poster-lightbox"
    data-closing={closing}
    aria-labelledby="poster-viewer-title"
    aria-describedby="poster-viewer-role"
    onCancel={event => { event.preventDefault(); requestClose() }}
    onPointerDown={event => { backdropPointer.current = event.target === event.currentTarget }}
    onClick={event => { if (event.target === event.currentTarget && backdropPointer.current) requestClose() }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        move(event.key === 'ArrowLeft' ? -1 : 1)
      }
    }}
  >
    <section className="poster-viewer" data-direction={direction}>
      <header className="poster-viewer-toolbar">
        <div className="poster-viewer-brand"><span className="poster-status-dot" /><span>OPC<span className="poster-toolbar-divider">/</span><span className="poster-toolbar-label">社区人物</span></span></div>
        <div className="poster-viewer-toolbar-right"><span className="poster-viewer-position">{String(selectedIndex + 1).padStart(2, '0')} <span>/ {String(members.length).padStart(2, '0')}</span></span><button type="button" className="poster-close" onClick={requestClose} aria-label="关闭个人海报" autoFocus><X size={20} /></button></div>
      </header>

      <div className="poster-viewer-content">
        <div className="poster-stage"
          onPointerDown={event => {
            if (event.pointerType !== 'touch' || (event.target instanceof Element && event.target.closest('button'))) return
            swipe.current = { id: event.pointerId, x: event.clientX, y: event.clientY, time: Date.now() }
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerUp={event => {
            const start = swipe.current
            swipe.current = null
            if (!start || start.id !== event.pointerId) return
            const dx = event.clientX - start.x
            const dy = event.clientY - start.y
            if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4 && Date.now() - start.time < 800) move(dx < 0 ? 1 : -1)
          }}
          onPointerCancel={() => { swipe.current = null }}
        >
          <span className="poster-stage-grid" aria-hidden="true" />
          <figure className="poster-image-frame" key={member.page}>
            <img src={`/media/opc-members/poster-${member.page}.jpg`} alt={`${member.name}的完整个人海报`} width="1124" height="1600" draggable={false} />
          </figure>
          <button type="button" className="poster-step poster-previous" aria-label="上一位成员" onClick={() => move(-1)} disabled={members.length < 2}><ArrowRight size={21} /></button>
          <button type="button" className="poster-step poster-next" aria-label="下一位成员" onClick={() => move(1)} disabled={members.length < 2}><ArrowRight size={21} /></button>
        </div>

        <aside className="poster-member-details" aria-live="polite" aria-atomic="true">
          <div className="poster-profile-content" key={member.page}>
          <div className="poster-profile-number" aria-hidden="true">{String(member.page).padStart(2, '0')}<span>COMMUNITY<br />CREATOR</span></div>
          <p className="poster-profile-eyebrow">ORILUX AI · OPC</p>
          <h2 id="poster-viewer-title">{member.name}</h2>
          <p className="poster-profile-role" id="poster-viewer-role"><span />{member.role}</p>
          <blockquote><span aria-hidden="true">“</span><p>{member.motto}</p></blockquote>
          <div className="poster-profile-signature"><i /><span>独立创造 · 共同成长</span><span className="poster-profile-cross" aria-hidden="true">+</span></div>
          </div>
        </aside>
      </div>

      <footer className="poster-viewer-footer">
        <div className="poster-member-strip" ref={stripRef} role="group" aria-label="选择成员海报">
          {members.map((item, index) => <button key={item.page} type="button" className={`poster-member-thumb${index === selectedIndex ? ' is-selected' : ''}`} aria-label={`查看${item.name}的海报`} aria-pressed={index === selectedIndex} onClick={() => select(index, index > selectedIndex ? 'next' : 'previous')}><img src={`/media/opc-members/poster-${item.page}.jpg`} alt="" width="30" height="40" draggable={false} /><span>{item.name}</span></button>)}
        </div>
        <p className="poster-keyboard-hint"><kbd>←</kbd><kbd>→</kbd> 切换 <span /> <kbd>Esc</kbd> 关闭</p>
      </footer>
    </section>
  </dialog>
}
