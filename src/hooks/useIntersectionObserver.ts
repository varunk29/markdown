import { useEffect, useRef, useState, type RefObject } from 'react'

export function useIntersectionObserver(
  options: IntersectionObserverInit = {},
): [RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setIsIntersecting(entry.isIntersecting)
      },
      { rootMargin: '200px', ...options },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [options.root, options.rootMargin, options.threshold])

  return [ref, isIntersecting]
}
