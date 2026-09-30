import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { FileArrowDown } from '@phosphor-icons/react'
import { chapters, profile } from '../data'

const NAV = [
  { label: 'About', chapter: 1 },
  { label: 'Work', chapter: 2 },
  { label: 'Toolkit', chapter: 6 },
  { label: 'Contact', chapter: 7 },
]

/** Which nav item owns the current chapter. */
function navOwner(active: number) {
  let owner = -1
  NAV.forEach((n, i) => {
    if (active >= n.chapter) owner = i
  })
  return owner
}

export function Nav({ active, go }: { active: number; go: (i: number) => void }) {
  const [open, setOpen] = useState(false)
  const owner = navOwner(active)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const jump = (i: number) => {
    setOpen(false)
    go(i)
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[var(--z-chrome)] flex justify-center px-4 pt-4 sm:pt-5">
        <nav
          aria-label="Primary"
          className="flex w-full max-w-[680px] items-center justify-between gap-2 rounded-full bg-[rgb(17_17_20/0.6)] py-1.5 pl-2 pr-1.5 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)] backdrop-blur-xl"
        >
          <button
            type="button"
            onClick={() => jump(0)}
            className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 text-[14px] font-medium tracking-[-0.01em] text-ink"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[12px] font-semibold text-accent-ink">RV</span>
            <span className="max-[340px]:hidden">Rohit Vishwa</span>
          </button>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV.map((n, i) => (
              <li key={n.label}>
                <button
                  type="button"
                  onClick={() => jump(n.chapter)}
                  aria-current={owner === i ? 'true' : undefined}
                  className={`rounded-full px-3.5 py-2 text-[14px] transition-colors duration-500 ease-soft ${
                    owner === i ? 'bg-white/[0.08] text-ink' : 'text-mute hover:text-ink'
                  }`}
                >
                  {n.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1">
            <a
              href={profile.resume}
              download
              className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-bg transition-transform duration-500 ease-soft active:scale-[0.98] sm:inline-flex"
            >
              <FileArrowDown size={16} weight="bold" />
              Resume
            </a>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            >
              <span
                className={`absolute h-px w-4 bg-ink transition-transform duration-500 ease-soft ${open ? 'rotate-45' : '-translate-y-[3px]'}`}
              />
              <span
                className={`absolute h-px w-4 bg-ink transition-transform duration-500 ease-soft ${open ? '-rotate-45' : 'translate-y-[3px]'}`}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="fixed inset-0 z-[var(--z-menu)] flex flex-col justify-center bg-[rgb(11_11_13/0.86)] px-8 backdrop-blur-2xl md:hidden"
            onClick={() => setOpen(false)}
          >
            <ul className="space-y-2">
              {[{ label: 'Home', chapter: 0 }, ...NAV].map((n, i) => (
                <motion.li
                  key={n.label}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i + 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      jump(n.chapter)
                    }}
                    className="text-5xl font-semibold tracking-[-0.04em] text-ink"
                  >
                    {n.label}
                  </button>
                </motion.li>
              ))}
            </ul>
            <motion.a
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              href={profile.resume}
              download
              className="mt-12 inline-flex w-max items-center gap-2 rounded-full bg-accent px-5 py-3 font-medium text-accent-ink"
            >
              <FileArrowDown size={18} weight="bold" />
              Resume
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/** Route rail: where you are on the flight. Desktop only. */
export function Rail({ active, go }: { active: number; go: (i: number) => void }) {
  return (
    <nav aria-label="Chapters" className="fixed right-5 top-1/2 z-[var(--z-chrome)] hidden -translate-y-1/2 min-[861px]:block">
      <ol className="flex flex-col items-end gap-1">
        {chapters.map((c, i) => {
          const on = i === active
          return (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to ${c.label}`}
                aria-current={on ? 'step' : undefined}
                className="group flex items-center gap-3 py-1.5"
              >
                <span
                  className={`font-mono text-[11px] transition-all duration-500 ease-soft ${
                    on ? 'translate-x-0 text-ink opacity-100' : 'translate-x-1 text-mute opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                  }`}
                >
                  {c.label}
                </span>
                <span
                  className={`block h-px transition-all duration-500 ease-soft ${on ? 'w-8 bg-accent' : 'w-4 bg-white/25 group-hover:w-6 group-hover:bg-white/50'}`}
                />
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export function Loader({ done }: { done: boolean }) {
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.32, 0.72, 0, 1] } }}
          className="fixed inset-0 z-[var(--z-loader)] flex items-end bg-bg p-6 sm:p-10"
          aria-live="polite"
        >
          <div className="w-full">
            <p className="text-[13px] text-mute">Building the world</p>
            <div className="mt-3 h-px w-full overflow-hidden bg-white/10">
              <motion.div
                className="h-full origin-left bg-accent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 0.9 }}
                transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
