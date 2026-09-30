import { useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, Sparkles, Stars } from '@react-three/drei'
import { Bloom, EffectComposer, SMAA, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import { media, world } from '../state'
import { C, StoneMat } from './parts'
import { makePush, stepPush, type Push } from './push'
import { Beacon, Finance, Health, Studio, Toolkit, Travel, WeatherStation } from './islands'

type V3 = [number, number, number]

/** Island anchor points. The flight winds left and right as it heads into -z. */
const ISLANDS: { at: V3; el: () => React.JSX.Element; rot: number }[] = [
  { at: [0, 0, 0], el: Studio, rot: 0 },
  { at: [19, 2.5, -30], el: WeatherStation, rot: -0.3 },
  { at: [-8, -1, -60], el: Finance, rot: 0.4 },
  { at: [17, 1.5, -90], el: Health, rot: -0.2 },
  { at: [-10, 3, -120], el: Travel, rot: 0.3 },
  { at: [10, 0, -150], el: Toolkit, rot: -0.4 },
  { at: [0, 2, -178], el: Beacon, rot: 0 },
]

/** One camera shot per chapter: which island, where the camera sits, what it looks at. */
const SHOTS: { island: number; eye: V3; look: V3 }[] = [
  { island: 0, eye: [8.8, 5.6, 11.6], look: [-0.2, 1.7, -0.4] }, // hello
  { island: 0, eye: [-10.5, 6, 9], look: [0, 1.3, -0.6] }, // about
  { island: 1, eye: [9, 5, 10.5], look: [0, 2.4, 0] }, // imd
  { island: 2, eye: [-9, 5.5, 9.5], look: [0, 1.4, 0] }, // spendsmart
  { island: 3, eye: [8.5, 3.6, 9.5], look: [0, 2, 0] }, // vital
  { island: 4, eye: [-8.5, 4.5, 10], look: [0, 2.2, 0] }, // nomad
  { island: 5, eye: [8.5, 5.5, 10.5], look: [0, 2.3, 0] }, // toolkit
  { island: 6, eye: [-7, 4.5, 12.5], look: [0, 3, 0] }, // contact
]

const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))
const smoother = (x: number) => x * x * x * (x * (x * 6 - 15) + 10)

function buildCurves(pullBack: number) {
  const eyes: THREE.Vector3[] = []
  const looks: THREE.Vector3[] = []
  SHOTS.forEach((s, i) => {
    const base = ISLANDS[s.island].at
    const look = new THREE.Vector3(...add(base, s.look))
    const eye = new THREE.Vector3(...add(base, s.eye)).sub(look).multiplyScalar(pullBack).add(look)
    if (i > 0) {
      // Midway waypoint: lift up and out so the flight arcs over the world instead of cutting through it.
      const prevEye = eyes[eyes.length - 1]
      const prevLook = looks[looks.length - 1]
      const sameIsland = SHOTS[i - 1].island === s.island
      const mid = prevEye.clone().lerp(eye, 0.5).add(new THREE.Vector3(0, sameIsland ? 2.5 : 7, sameIsland ? 3 : 4))
      eyes.push(mid)
      looks.push(prevLook.clone().lerp(look, sameIsland ? 0.5 : 0.72))
    }
    eyes.push(eye)
    looks.push(look)
  })
  return {
    eye: new THREE.CatmullRomCurve3(eyes, false, 'centripetal'),
    look: new THREE.CatmullRomCurve3(looks, false, 'centripetal'),
  }
}

function CameraRig() {
  const { camera, size } = useThree()
  const curves = useMemo(() => buildCurves(media.compact ? 1.45 : 1), [])
  const eye = useMemo(() => new THREE.Vector3(), [])
  const look = useMemo(() => new THREE.Vector3(), [])
  const lookNow = useRef(new THREE.Vector3())
  const side = useRef(1)
  const intro = useRef(media.reducedMotion ? 1 : 0)

  useLayoutEffect(() => {
    curves.eye.getPoint(0, eye)
    curves.look.getPoint(0, lookNow.current)
    camera.position.copy(eye).add(new THREE.Vector3(0, intro.current < 1 ? 14 : 0, intro.current < 1 ? 22 : 0))
    camera.lookAt(lookNow.current)
  }, [camera, curves, eye])

  useFrame((_, dt) => {
    const n = SHOTS.length
    const s = clamp01(world.progress) * (n - 1)
    const i = Math.min(Math.floor(s), n - 2)
    // Dwell near each shot, fly in between.
    const f = smoother(clamp01((s - i - 0.12) / 0.76))
    const u = (i + f) / (n - 1)
    curves.eye.getPoint(u, eye)
    curves.look.getPoint(u, look)

    if (intro.current < 1) {
      intro.current = Math.min(1, intro.current + dt / 2.6)
      const k = 1 - smoother(intro.current)
      eye.y += 14 * k
      eye.z += 22 * k
    }
    if (!media.reducedMotion && !media.compact) {
      eye.x += world.pointerX * 0.5
      eye.y += world.pointerY * 0.35
    }

    const k = 1 - Math.exp(-dt * 3.2)
    camera.position.lerp(eye, k)
    lookNow.current.lerp(look, k)
    camera.lookAt(lookNow.current)

    // Shift the frame so the island sits opposite the copy panel (left on even chapters, right on odd).
    const cam = camera as THREE.PerspectiveCamera
    const { width: w, height: h } = size
    if (media.compact) {
      cam.setViewOffset(w, h, 0, h * 0.2, w, h)
    } else {
      const target = Math.cos(Math.PI * (i + f))
      side.current += (target - side.current) * k
      cam.setViewOffset(w, h, -side.current * w * 0.19, 0, w, h)
    }
  })
  return null
}

/** Loose rocks and cloud puffs scattered along the route. The rocks give the flight parallax and dodge the cursor. */
function Debris() {
  const count = media.compact ? 50 : 90
  const ref = useRef<THREE.InstancedMesh>(null)
  const field = useMemo(() => {
    const route = new THREE.CatmullRomCurve3(ISLANDS.map((isl) => new THREE.Vector3(...isl.at)), false, 'centripetal')
    const rand = (k: number) => {
      const x = Math.sin(k * 127.1 + 311.7) * 43758.5453
      return x - Math.floor(x)
    }
    const rocks: { at: THREE.Vector3; rot: THREE.Euler; s: number; push: Push }[] = []
    const puffs: V3[] = []
    // Keep rocks off the camera's flight path, or one fills the screen as the camera passes.
    const flight = buildCurves(media.compact ? 1.45 : 1).eye.getSpacedPoints(400)
    const nearFlight = (p: THREE.Vector3) => flight.some((f) => f.distanceTo(p) < 6)
    let k = 0
    while (rocks.length < count && k < count * 10) {
      k++
      const p = route.getPoint(rand(k))
      const a = rand(k + 0.5) * Math.PI * 2
      const r = 5 + rand(k + 0.7) * 11
      p.add(new THREE.Vector3(Math.cos(a) * r, (rand(k + 0.9) - 0.5) * 10, Math.sin(a) * r))
      if (ISLANDS.some((isl) => p.distanceTo(new THREE.Vector3(...isl.at)) < 7.5) || nearFlight(p)) continue
      rocks.push({ at: p, rot: new THREE.Euler(k, k * 2, k * 3), s: 0.12 + rand(k + 1.3) ** 2 * 0.7, push: makePush() })
    }
    for (let j = 0; j < ISLANDS.length - 1; j++) {
      const p = new THREE.Vector3(...ISLANDS[j].at).lerp(new THREE.Vector3(...ISLANDS[j + 1].at), 0.5)
      puffs.push([p.x + (j % 2 ? 5 : -5), p.y - 5, p.z])
    }
    return { rocks, puffs }
  }, [count])

  const m = useMemo(() => new THREE.Matrix4(), [])
  const q = useMemo(() => new THREE.Quaternion(), [])
  const pos = useMemo(() => new THREE.Vector3(), [])
  const scl = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ camera, size }, dt) => {
    const mesh = ref.current
    if (!mesh) return
    const aspect = size.width / size.height
    field.rocks.forEach((r, i) => {
      stepPush(r.push, r.at, camera, aspect, dt, 1 / (0.6 + r.s))
      r.rot.x += (r.push.spin.x + (media.reducedMotion ? 0 : 0.04)) * dt
      r.rot.y += (r.push.spin.y + (media.reducedMotion ? 0 : 0.06)) * dt
      mesh.setMatrixAt(i, m.compose(pos.copy(r.at).add(r.push.o), q.setFromEuler(r.rot), scl.setScalar(r.s)))
    })
    mesh.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={ref} args={[undefined, undefined, field.rocks.length]} frustumCulled={false}>
        <dodecahedronGeometry args={[1, 0]} />
        <StoneMat />
      </instancedMesh>
      {field.puffs.map((p, i) => (
        <group key={i} position={p} scale={1.6 + (i % 3) * 0.4}>
          {[
            [0, 0, 0, 1],
            [1, -0.2, 0.2, 0.7],
            [-0.9, -0.25, -0.1, 0.65],
            [0.2, 0.4, -0.3, 0.6],
          ].map(([x, y, z, s], j) => (
            <mesh key={j} position={[x, y, z]} scale={s}>
              <icosahedronGeometry args={[1, 1]} />
              <meshStandardMaterial color="#2a2c33" flatShading roughness={1} />
            </mesh>
          ))}
        </group>
      ))}
    </>
  )
}

/** A dim ringed planet far down the route: a horizon to fly toward. Ignores fog. */
function Planet() {
  return (
    <group position={[-320, -6, -240]} rotation={[0.4, 0.3, -0.3]}>
      <mesh>
        <sphereGeometry args={[24, 48, 32]} />
        <meshStandardMaterial color="#5a4c40" emissive="#2e1e10" roughness={0.95} fog={false} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[32, 47, 96]} />
        <meshBasicMaterial color={C.amber} transparent opacity={0.09} side={THREE.DoubleSide} fog={false} depthWrite={false} />
      </mesh>
      <mesh rotation-x={Math.PI / 2}>
        <ringGeometry args={[29, 29.8, 96]} />
        <meshBasicMaterial color={C.amber} transparent opacity={0.24} side={THREE.DoubleSide} fog={false} depthWrite={false} />
      </mesh>
    </group>
  )
}

function Route() {
  const pts = useMemo(() => {
    const anchors = ISLANDS.map((isl) => new THREE.Vector3(...isl.at).add(new THREE.Vector3(0, -0.8, 0)))
    return new THREE.CatmullRomCurve3(anchors, false, 'centripetal').getPoints(200)
  }, [])
  return <Line points={pts} color={C.amber} lineWidth={1} dashed dashSize={0.6} gapSize={0.9} transparent opacity={0.35} />
}

export default function World({ onReady }: { onReady: () => void }) {
  const compact = media.compact
  const calm = media.reducedMotion
  // Fixed resolution, chosen once. Changing DPR at runtime resizes the canvas, which clears it and
  // flashes a black frame, so there is deliberately no adaptive quality switching here.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
  const fx = !compact
  return (
    <Canvas
      className="world-canvas"
      dpr={dpr}
      // The composer below owns the frame, so native MSAA would only cost memory.
      gl={{ antialias: compact, powerPreference: 'high-performance', stencil: false }}
      // A near plane of 0.5 (not 0.1) keeps depth precision high enough that stacked surfaces never shimmer.
      camera={{ fov: compact ? 50 : 38, near: 0.5, far: 700 }}
      onCreated={() => requestAnimationFrame(() => onReady())}
      aria-hidden
    >
      <color attach="background" args={['#0b0b0d']} />
      <fog attach="fog" args={['#0b0b0d', 26, 80]} />
      <hemisphereLight args={['#b8c1cf', '#1c140e', 0.7]} />
      <directionalLight position={[12, 20, 10]} intensity={1.5} color="#ffe3c4" />
      <directionalLight position={[-14, 6, -18]} intensity={0.7} color="#8fa3c0" />

      <CameraRig />
      {/* speed 0: no twinkle, which read as flicker */}
      <Stars radius={160} depth={60} count={compact ? 900 : 1800} factor={3} saturation={0} fade speed={0} />
      <Planet />
      <Route />
      <Debris />

      {ISLANDS.map(({ at, el: Island, rot }, i) => (
        <group key={i} position={at} rotation-y={rot}>
          <Island />
          <Sparkles count={compact ? 12 : 22} scale={[10, 6, 10]} position={[0, 3, 0]} size={2} speed={calm ? 0 : 0.18} noise={0.4} color={C.amber} opacity={0.45} />
        </group>
      ))}

      {fx && (
        // multisampling must stay 0: MSAA render targets + bloom produced NaN pixels on Intel GPUs,
        // which the mip blur spread until the whole frame went black. SMAA handles edges instead.
        <EffectComposer multisampling={0}>
          <SMAA />
          <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.2} intensity={0.8} radius={0.7} />
          <Vignette offset={0.25} darkness={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  )
}

export const CHAPTER_COUNT = SHOTS.length
