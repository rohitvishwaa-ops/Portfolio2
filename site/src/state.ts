/**
 * Mutable scroll state shared between the DOM overlay and the WebGL world.
 * Written by the Lenis scroll handler, read inside useFrame. Never put this in
 * React state: it changes every frame.
 */
export const world = {
  /** 0..1 progress of the camera flight across all chapters */
  progress: 0,
  /** pointer position, -1..1 */
  pointerX: 0,
  pointerY: 0,
  /** false until the pointer moves, and again once it leaves the window */
  pointerActive: false,
}

export const media = {
  reducedMotion:
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  compact:
    typeof window !== 'undefined' &&
    window.matchMedia('(max-width: 860px), (pointer: coarse)').matches,
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null
    // Release the probe context right away so it never counts against the browser's context limit.
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
}
