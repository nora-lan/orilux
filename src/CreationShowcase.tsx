import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { ArrowRight, Play } from './icons'

// Public animation selected by the user from https://www.jdcloud.com/cn.
// Keep the original media intact; serve the local copy instead of hotlinking.
export default function CreationShowcase({ motionEnabled, children }: {
  motionEnabled: boolean
  children: ReactNode
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const experienceButtonRef = useRef<HTMLButtonElement>(null)
  const backButtonRef = useRef<HTMLButtonElement>(null)
  const [interactive, setInteractive] = useState(false)
  const [inView, setInView] = useState(false)
  const [hasEntered, setHasEntered] = useState(false)
  const [pageVisible, setPageVisible] = useState(!document.hidden)
  const [userPaused, setUserPaused] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [failed, setFailed] = useState(false)
  const [playAttempt, setPlayAttempt] = useState(0)

  useEffect(() => {
    const element = containerRef.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      const visible = entry.isIntersecting && entry.intersectionRatio >= .2
      setInView(visible)
      if (visible) setHasEntered(true)
    }, { threshold: [0, .2] })
    observer.observe(element)
    const visibility = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', visibility)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility) }
  }, [])

  useEffect(() => {
    if (hasEntered) videoRef.current?.load()
  }, [hasEntered])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    let active = true
    if (motionEnabled && inView && pageVisible && !interactive && !userPaused && !failed) {
      void video.play().catch(error => {
        if (active && error.name !== 'AbortError') setPlaying(false)
      })
    } else {
      video.pause()
    }
    return () => { active = false; video.pause() }
  }, [motionEnabled, inView, pageVisible, interactive, userPaused, failed, hasEntered, playAttempt])

  function togglePlayback() {
    setUserPaused(playing)
    setPlayAttempt(attempt => attempt + 1)
  }

  function replay() {
    if (videoRef.current) videoRef.current.currentTime = 0
    setUserPaused(false)
    setPlayAttempt(attempt => attempt + 1)
  }

  function changeView(next: boolean) {
    setInteractive(next)
    requestAnimationFrame(() => (next ? backButtonRef : experienceButtonRef).current?.focus({ preventScroll: true }))
  }

  return <div className="ai-creation-experience" ref={containerRef}>
    <div className="ai-preview ai-showcase" hidden={interactive}>
      <div className={`ai-showcase-media ${motionEnabled ? '' : 'is-static'}`}>
        <video ref={videoRef}
          poster="/media/ai-creation-poster.png"
          preload="none" muted loop playsInline disablePictureInPicture
          aria-label="AI 创作流程演示：提示词浮层展开，创意画面错层切换"
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onError={event => { event.currentTarget.dataset.mediaError = event.currentTarget.error?.message; setFailed(true); setPlaying(false) }}
        >
          {hasEntered && <><source src="/media/ai-creation-showcase.webm" type="video/webm" /><source src="/media/ai-creation-showcase.mp4" type="video/mp4" onError={() => { setFailed(true); setPlaying(false) }} /></>}
        </video>
        {failed && <div className="ai-showcase-fallback"><span>创作灵感，从这里开始</span><button onClick={() => changeView(true)}>进入创作体验 <ArrowRight size={14} /></button></div>}
      </div>
      <div className="ai-showcase-controls">
        <div>
          <button className="ai-showcase-play" onClick={togglePlayback} disabled={!motionEnabled || failed}
            aria-label={!motionEnabled ? '页面动效已关闭' : playing ? '暂停创作动画' : '播放创作动画'}
            aria-pressed={playing} title={!motionEnabled ? '可通过页面右侧动效开关开启' : playing ? '暂停动画' : '播放动画'}>
            {playing ? <span aria-hidden="true">Ⅱ</span> : <Play size={13} />}
          </button>
          <button className="ai-showcase-replay" onClick={replay} disabled={!motionEnabled || failed} aria-label="重播创作动画">重播</button>
        </div>
        <button className="ai-showcase-explore" ref={experienceButtonRef} onClick={() => changeView(true)}>创作体验 <ArrowRight size={13} /></button>
      </div>
    </div>
    <div className="ai-creation-interactive" hidden={!interactive}>
      {children}
      <button className="ai-showcase-back" ref={backButtonRef} onClick={() => changeView(false)}>返回动效 <Play size={10} /></button>
    </div>
  </div>
}
