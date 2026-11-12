import { useEffect, useRef, useState, type ReactNode } from 'react'

/** How far up the screen a block must be before it counts as reached: its top is above 85% of the height. */
const REACHED = 0.85

/**
 * Starts the entrance animations (.build and .rise) inside it once the visitor scrolls down to it.
 * Until then they wait at their first frame. A block already above the screen (a fast scroll or an
 * anchor jump) counts as reached, so nothing is ever left waiting. With reduced motion the CSS skips
 * the animations and everything is simply shown.
 */
export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || visible) return

    const check = () => {
      if (element.getBoundingClientRect().top < window.innerHeight * REACHED) setVisible(true)
    }

    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [visible])

  return (
    <div ref={ref} className={visible ? 'reveal is-visible' : 'reveal'}>
      {children}
    </div>
  )
}
