import { useEffect, useRef, useState, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number      // ms before reveal starts
  className?: string
  /** If true, element fades back out when scrolled away. Default false. */
  rePlay?: boolean
  /** Vertical offset to apply when hidden. Default 24px. */
  offset?: number
  /** Direction of slide animation: up | left | right | none. Default 'up'. */
  direction?: 'up' | 'left' | 'right' | 'none'
}

export default function Reveal({
  children,
  delay = 0,
  className = '',
  rePlay = true,
  offset = 24,
  direction = 'up',
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Respect reduced-motion
    if (typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (!rePlay) observer.unobserve(node)
        } else if (rePlay) {
          setVisible(false)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [rePlay])

  const hiddenTransform =
    direction === 'left'  ? `translate3d(-${offset}px, 0, 0)` :
    direction === 'right' ? `translate3d(${offset}px, 0, 0)`  :
    direction === 'none'  ? 'none' :
                            `translate3d(0, ${offset}px, 0)`

  const style: React.CSSProperties = {
    transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
    opacity: visible ? 1 : 0,
    transform: visible ? 'translate3d(0, 0, 0)' : hiddenTransform,
    willChange: 'opacity, transform',
  }

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  )
}
