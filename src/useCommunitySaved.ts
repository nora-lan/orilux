import { useEffect, useState } from 'react'
import { communityPosts } from './communityPosts'

const storageKey = 'yaojing-community-saved'
function readSaved(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(saved) ? [...new Set(saved.filter((id): id is string => typeof id === 'string' && communityPosts.some(post => post.id === id)))] : []
  } catch { return [] }
}

export function useCommunitySaved() {
  const [saved, setSaved] = useState(readSaved)
  const [storageNotice, setStorageNotice] = useState('收藏仅保存在此浏览器。')
  useEffect(() => {
    const sync = (event: StorageEvent) => { if (event.key === storageKey || event.key === null) setSaved(readSaved()) }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])
  function toggleSaved(id: string) {
    const next = saved.includes(id) ? saved.filter(value => value !== id) : [...saved, id]
    setSaved(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) }
    catch { setStorageNotice('浏览器未允许保存，收藏仅在当前页面保留。') }
  }
  return { saved, toggleSaved, storageNotice }
}
