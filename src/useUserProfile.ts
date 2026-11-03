import { useEffect, useState } from 'react'

export type UserProfile = { nickname: string; bio: string; avatar: string }
export const avatarOptions = [
  { id: 'blue', label: '晴空蓝', from: '#dceaff', to: '#6e9dff' },
  { id: 'violet', label: '星云紫', from: '#eee5ff', to: '#b197ed' },
  { id: 'mint', label: '薄荷绿', from: '#d6f4ed', to: '#65bbaa' },
  { id: 'peach', label: '日落橙', from: '#ffeadb', to: '#efa783' },
] as const
const profileKey = 'yaojing-user-profile'
const profileEvent = 'yaojing-profile-change'
const defaultProfile: UserProfile = { nickname: '曜境访客', bio: '', avatar: 'blue' }

function readProfile(): UserProfile {
  try {
    const value = JSON.parse(localStorage.getItem(profileKey) || 'null')
    if (!value || typeof value !== 'object') return defaultProfile
    return {
      nickname: typeof value.nickname === 'string' && value.nickname.trim() ? Array.from(value.nickname.trim()).slice(0, 24).join('') : defaultProfile.nickname,
      bio: typeof value.bio === 'string' ? Array.from(value.bio).slice(0, 120).join('') : '',
      avatar: avatarOptions.some(option => option.id === value.avatar) ? value.avatar : 'blue',
    }
  } catch { return defaultProfile }
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile>(readProfile)
  const [storageNotice, setStorageNotice] = useState('个人资料保存在当前浏览器。')
  useEffect(() => {
    const sync = () => setProfile(readProfile())
    const onStorage = (event: StorageEvent) => { if (event.key === profileKey || event.key === null) sync() }
    window.addEventListener('storage', onStorage)
    window.addEventListener(profileEvent, sync)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(profileEvent, sync) }
  }, [])
  function saveProfile(next: UserProfile) {
    const clean = { nickname: next.nickname.trim(), bio: next.bio.trim(), avatar: next.avatar }
    if (!clean.nickname || Array.from(clean.nickname).length > 24 || Array.from(clean.bio).length > 120 || !avatarOptions.some(option => option.id === clean.avatar)) return false
    try {
      localStorage.setItem(profileKey, JSON.stringify(clean))
      setProfile(clean)
      window.dispatchEvent(new Event(profileEvent))
      setStorageNotice('个人资料保存在当前浏览器。')
      return true
    } catch {
      setStorageNotice('浏览器未允许保存资料，请开启网站存储后重试。')
      return false
    }
  }
  return { profile, saveProfile, storageNotice }
}
