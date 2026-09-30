// Adapted from Motion Primitives "Text Effect" (MIT), fade-in-blur preset, also listed on 21st.dev.
// Stays mounted and toggles hidden/visible, so headings keep their layout and ids.
import { motion, useReducedMotion, type Variants } from 'motion/react'

const container: Variants = {
  hidden: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
}
const item: Variants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p }

export function TextEffect({
  children,
  as = 'p',
  show = true,
  className,
  id,
}: {
  children: string
  as?: keyof typeof tags
  show?: boolean
  className?: string
  id?: string
}) {
  const reduce = useReducedMotion()
  const Tag = tags[as]
  const words = children.split(/(\s+)/)
  return (
    <Tag id={id} className={className} initial={false} animate={show || reduce ? 'visible' : 'hidden'} variants={container}>
      <span className="sr-only">{children}</span>
      {words.map((w, i) =>
        /^\s+$/.test(w) ? (
          w
        ) : (
          <motion.span key={i} aria-hidden variants={item} className="inline-block whitespace-pre">
            {w}
          </motion.span>
        ),
      )}
    </Tag>
  )
}
