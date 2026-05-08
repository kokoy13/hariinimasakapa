import { useEffect, useState } from 'react'

function getIsStable() {
  const c = navigator?.connection
  if (!c) return true
  if (c.saveData) return false

  const effectiveType = String(c.effectiveType || '').toLowerCase()
  const downlink = Number(c.downlink || 0)

  if (effectiveType.includes('2g')) return false
  if (effectiveType.includes('3g') && downlink > 0 && downlink < 1.2) return false

  return true
}

export function useStableConnection() {
  const [stable, setStable] = useState(() => getIsStable())

  useEffect(() => {
    const c = navigator?.connection
    if (!c?.addEventListener) return
    const onChange = () => setStable(getIsStable())
    c.addEventListener('change', onChange)
    return () => c.removeEventListener('change', onChange)
  }, [])

  return stable
}

