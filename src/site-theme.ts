export type SiteTheme = 'warm' | 'blue'
export const themeStorageKey = 'orilux-site-theme-v3'

export function parseSiteTheme(value: string | null): SiteTheme {
  return value === 'warm' ? 'warm' : 'blue'
}

export function readSiteTheme(): SiteTheme {
  const requested = new URLSearchParams(window.location.search).get('style')
  if (requested !== null) return parseSiteTheme(requested)
  try { return parseSiteTheme(localStorage.getItem(themeStorageKey) ?? localStorage.getItem('orilux-site-theme-v2')) }
  catch { return 'blue' }
}

export function applySiteTheme(theme: SiteTheme) {
  document.documentElement.dataset.siteTheme = theme
}
