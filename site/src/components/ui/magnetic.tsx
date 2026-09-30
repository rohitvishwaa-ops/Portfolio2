// Adapted from Motion Primitives "Magnetic" by ibelick (MIT), also listed on 21st.dev.
import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, type SpringOptions } from 'motion/react'

const SPRING: SpringOptions = { stiffness: 170, damping: 14, mass: 0.3 }

/** Pulls its child toward the cursor while hovered, then springs back. */
export function Magnetic({ children, intensity = 0.3, className }: { children: ReactNode; intensity?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, SPRING)
  const sy = useSpring(y, SPRING)

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * intensity)
    y.set((e.clientY - (r.top + r.height / 2)) * intensity)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.span ref={ref} className={className ?? 'inline-flex'} onPointerMove={onMove} onPointerLeave={reset} style={{ x: sx, y: sy }}>
      {children}
    </motion.span>
  )
}
