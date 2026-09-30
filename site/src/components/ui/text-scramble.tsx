// Adapted from Motion Primitives "Text Scramble" (MIT), also listed on 21st.dev.
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Resolves `children` left to right out of random glyphs whenever `trigger` turns true, and again on hover.
 * Assistive tech gets the real text; the scrambling glyphs are hidden from it.
 */
export function TextScramble({
  children,
  as = 'span',
  duration = 0.9,
  speed = 0.035,
  trigger = true,
  className,
  id,
}: {
  children: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  duration?: number
  speed?: number
  trigger?: boolean
  className?: string
  id?: string
}) {
  const Tag = as as 'span'
  const [text, setText] = useState(children)
  const timer = useRef<number | undefined>(undefined)
  const reduce = useReducedMotion()

  const run = () => {
    if (reduce) return
    window.clearInterval(timer.current)
    const steps = duration / speed
    let step = 0
    timer.current = window.setInterval(() => {
      const progress = step / steps
      let out = ''
      for (let i = 0; i < children.length; i++) {
        const ch = children[i]
        out += ch === ' ' || progress * children.length > i ? ch : CHARS[Math.floor(Math.random() * CHARS.length)]
      }
      setText(out)
      if (++step > steps) {
        window.clearInterval(timer.current)
        setText(children)
      }
    }, speed * 1000)
  }

  useEffect(() => {
    if (trigger) run()
    return () => window.clearInterval(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger, children])

  return (
    <Tag id={id} className={className} aria-label={children} onMouseEnter={run}>
      <span aria-hidden>{text}</span>
    </Tag>
  )
}
