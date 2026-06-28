import { useEffect, useState } from 'react'

interface Props {
  viewKey: string
  children: React.ReactNode
}

export function ViewTransition({ viewKey, children }: Props) {
  const [displayKey, setDisplayKey] = useState(viewKey)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (viewKey !== displayKey) {
      setFade(false)
      const timer = setTimeout(() => {
        setDisplayKey(viewKey)
        setFade(true)
      }, 300) // PRD：300ms 淡入淡出
      return () => clearTimeout(timer)
    }
  }, [viewKey, displayKey])

  return (
    <div
      key={displayKey}
      className={`w-full h-full ${fade ? 'animate-fade-in' : 'opacity-0 transition-opacity duration-300'}`}
    >
      {children}
    </div>
  )
}
