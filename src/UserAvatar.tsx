import { useId } from 'react'
import { avatarOptions } from './useUserProfile'
import type { UserProfile } from './useUserProfile'

export default function UserAvatar({ profile, size = 38, className = '' }: { profile: UserProfile; size?: number; className?: string }) {
  const gradientId = `user-avatar-${useId().replace(/[^a-z0-9-]/gi, '')}`
  const colors = avatarOptions.find(option => option.id === profile.avatar) || avatarOptions[0]
  return <svg className={`user-avatar ${className}`} width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <defs><linearGradient id={gradientId} x1="8" y1="3" x2="58" y2="64" gradientUnits="userSpaceOnUse"><stop stopColor={colors.from} /><stop offset="1" stopColor={colors.to} /></linearGradient></defs>
    <circle cx="32" cy="32" r="32" fill={`url(#${gradientId})`} />
    <circle cx="48" cy="14" r="8" fill="white" fillOpacity=".2" />
    <path d="M10 61c1-15 10-23 22-23s21 8 22 23" fill="white" fillOpacity=".88" />
    <circle cx="32" cy="25" r="12" fill="#fff" />
    <path d="M23 19c2-6 7-9 13-6 3 1 5 4 5 7-7 1-12-1-14-4l-4 3Z" fill="#355384" fillOpacity=".7" />
    <circle cx="28" cy="26" r="1" fill="#355384" /><circle cx="36" cy="26" r="1" fill="#355384" />
    <path d="M29 31c2 1 4 1 6 0" stroke="#6583ac" strokeWidth="1.5" strokeLinecap="round" />
    <path d="m28 42 4 5 4-5" stroke={colors.to} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="32" cy="32" r="31.5" stroke="#fff" strokeOpacity=".6" />
  </svg>
}
