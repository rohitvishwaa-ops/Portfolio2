import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'
import type Lenis from 'lenis'
import { chapters } from './data'
import { hasWebGL, media, world } from './state'
import Chapters from './ui/Chapters'
import { Loader, Nav, Rail } from './ui/Chrome'

const World = lazy(() => import('./world/World'))

const N = chapters.length
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

/** Geometry of the scroll track: each chapter section is H tall; its panel peaks when the viewport is centred on it. */
function trackMetrics() {
  const first = document.querySelector<HTMLElement>('.chapter')
  const H = first?.offsetHeight ?? window.innerHeight * 1.8
  const vh = window.innerHeight
  return { H, y0: (H - vh) / 2 }
}

function ScrollDriver({ panels, onActive }: { panels: React.RefObject<(HTMLDivElement | null)[]>; onActive: (i: number) => void }) {
  const metrics = useRef(trackMetrics())
  const active = useRef(0)

  const update = useCallback(
    (y: number) => {
      const { H, y0 } = metrics.current
      world.progress = Math.min(1, Math.max(0, (y - y0) / ((N - 1) * H)))
      panels.current.forEach((el, i) => {
        if (!el) return
        let d = (y - (i * H + y0)) / H
        if (i === 0 && d < 0) d = 0
        if (i === N - 1 && d > 0) d = 0
        const o = 1 - smoothstep(0.18, 0.4, Math.abs(d))
        el.style.opacity = o.toFixed(3)
        el.style.transform = `translate3d(0, ${(-d * 110).toFixed(1)}px, 0)`
        el.style.visibility = o < 0.01 ? 'hidden' : 'visible'
      })
      const a = Math.min(N - 1, Math.max(0, Math.round((y - y0) / H)))
      if (a !== active.current) {
        active.current = a
        onActive(a)
      }
    },
    [panels, onActive],
  )

  const lenis = useLenis(({ scroll }) => update(scroll))

  useEffect(() => {
    let lastW = window.innerWidth
    const onResize = () => {
      // Ignore height-only resizes on touch devices (URL bar show/hide).
      if (media.compact && window.innerWidth === lastW) return
      lastW = window.innerWidth
      metrics.current = trackMetrics()
      update(window.scrollY)
    }
    metrics.current = trackMetrics()
    update(window.scrollY)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [update, lenis])

  return null
}

function useGoTo() {
  const lenis = useLenis()
  return useCallback(
    (i: number) => {
      const { H, y0 } = trackMetrics()
      const target = i === 0 ? 0 : i * H + y0
      const dist = Math.abs(target - window.scrollY) / H
      if (!lenis || media.reducedMotion) {
        window.scrollTo({ top: target })
        return
      }
      lenis.scrollTo(target, { duration: Math.min(4.5, 1.4 + dist * 0.45), easing: (t: number) => 1 - Math.pow(1 - t, 3.2) })
    },
    [lenis],
  )
}

function Site() {
  const panels = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [ready, setReady] = useState(false)
  const [webgl] = useState(hasWebGL)
  const go = useGoTo()
  const lenis = useLenis()

  const panelRef = useCallback((i: number) => (el: HTMLDivElement | null) => void (panels.current[i] = el), [])

  // Hold scrolling until the world has painted, with a fallback so content is never locked away.
  useEffect(() => {
    if (!webgl) setReady(true)
    const t = window.setTimeout(() => setReady(true), 5000)
    return () => window.clearTimeout(t)
  }, [webgl])
  useEffect(() => {
    if (!lenis) return
    if (ready) lenis.start()
    else lenis.stop()
  }, [lenis, ready])

  // Deep links: /#spendsmart opens straight on that chapter.
  useEffect(() => {
    const i = chapters.findIndex((c) => `#${c.id}` === window.location.hash)
    if (i <= 0) return
    const { H, y0 } = trackMetrics()
    lenis?.scrollTo(i * H + y0, { immediate: true, force: true })
  }, [lenis])

  // Pointer drives the camera parallax (desktop) and pushes the floating rocks (everywhere).
  useEffect(() => {
    if (media.reducedMotion) return
    const onMove = (e: PointerEvent) => {
      world.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      world.pointerY = -((e.clientY / window.innerHeight) * 2 - 1)
      world.pointerActive = true
    }
    const onLeave = () => void (world.pointerActive = false)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [])

  return (
    <>
      {webgl ? (
        <Suspense fallback={null}>
          <World onReady={() => window.setTimeout(() => setReady(true), 350)} />
        </Suspense>
      ) : (
        <div className="world-fallback" aria-hidden />
      )}
      <div className="grain" aria-hidden />
      <ScrollDriver panels={panels} onActive={setActive} />
      <Nav active={active} go={go} />
      <Rail active={active} go={go} />
      <Chapters panelRef={panelRef} active={active} started={ready} onWork={() => go(2)} />
      <Loader done={ready} />
    </>
  )
}

export default function App() {
  const options: ConstructorParameters<typeof Lenis>[0] = media.reducedMotion
    ? { smoothWheel: false }
    : { lerp: 0.085, wheelMultiplier: 1, touchMultiplier: 1.2, smoothWheel: true }
  return (
    <ReactLenis root options={options}>
      <Site />
    </ReactLenis>
  )
}
