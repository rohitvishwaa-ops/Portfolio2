// Adapted from Magic UI "Border Beam" (MIT, magicui.design), also listed on 21st.dev.
import { motion, useReducedMotion, type MotionStyle } from 'motion/react'

/** A short light that travels around its parent's rounded border. Parent needs `relative`. */
export function BorderBeam({
  size = 110,
  delay = 0,
  duration = 10,
  colorFrom = '#f2a65a',
  colorTo = '#f7d2a8',
  borderWidth = 1,
  play = true,
}: {
  size?: number
  delay?: number
  duration?: number
  colorFrom?: string
  colorTo?: string
  borderWidth?: number
  play?: boolean
}) {
  const reduce = useReducedMotion()
  if (reduce) return null
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box]"
      style={{ '--border-beam-width': `${borderWidth}px` } as React.CSSProperties}
    >
      {play && (
        <motion.div
          className="absolute aspect-square bg-linear-to-l from-(--color-from) via-(--color-to) to-transparent"
          style={
            {
              width: size,
              offsetPath: `rect(0 auto auto 0 round ${size}px)`,
              '--color-from': colorFrom,
              '--color-to': colorTo,
            } as MotionStyle
          }
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: ['0%', '100%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration, delay: -delay }}
        />
      )}
    </div>
  )
}
