import { useMemo, useRef, type ReactNode } from 'react'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'
import { media } from '../state'
import { makePush, stepPush } from './push'

type GroupProps = ThreeElements['group']

/** World palette. The UI accent is `amber`; everything else stays muted. */
export const C = {
  rock: '#19181c',
  stone: '#645e6a',
  top: '#2a282f',
  topAlt: '#35323b',
  bone: '#d9d3c9',
  metal: '#5c616b',
  dark: '#111114',
  wood: '#6e5140',
  leaf: '#4d6a55',
  slate: '#3b4758',
  amber: '#f2a65a',
  ember: '#d8634c',
  coin: '#c9974d',
}

export const still = media.reducedMotion

/** Emissive material that blooms. */
export function Glow({ color = C.amber, intensity = 3 }: { color?: string; intensity?: number }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
}

export function Mat({ color, metal = 0, rough = 0.85 }: { color: string; metal?: number; rough?: number }) {
  return <meshStandardMaterial color={color} metalness={metal} roughness={rough} flatShading />
}

/** Gently bobs its children. Static under reduced motion. */
export function Bob({
  children,
  amp = 0.15,
  speed = 1,
  phase = 0,
  spin = 0,
  ...props
}: { children: ReactNode; amp?: number; speed?: number; phase?: number; spin?: number } & GroupProps) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (still || !ref.current) return
    const t = clock.elapsedTime * speed + phase
    ref.current.position.y = Math.sin(t) * amp
    if (spin) ref.current.rotation.y = t * spin
  })
  return (
    <group {...props}>
      <group ref={ref}>{children}</group>
    </group>
  )
}

/** Spins its children around Y at `speed` rad/s. */
export function Spin({ children, speed = 0.5, axis = 'y', ...props }: { children: ReactNode; speed?: number; axis?: 'x' | 'y' | 'z' } & GroupProps) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (still || !ref.current) return
    ref.current.rotation[axis] += dt * speed
  })
  return (
    <group ref={ref} {...props}>
      {children}
    </group>
  )
}

/** A loose rock that bobs in place and gets shoved aside by the cursor. */
export function PushRock({ at, size, phase = 0 }: { at: [number, number, number]; size: number; phase?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const state = useMemo(makePush, [])
  const base = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera, size: s, clock }, dt) => {
    const m = ref.current
    if (!m?.parent) return
    const bob = still ? 0 : Math.sin(clock.elapsedTime * 0.6 + phase) * 0.22
    base.set(at[0], at[1] + bob, at[2])
    m.parent.localToWorld(base)
    stepPush(state, base, camera, s.width / s.height, dt, 1 / (0.6 + size))
    m.position.copy(base).add(state.o)
    m.parent.worldToLocal(m.position)
    m.rotation.x += (state.spin.x + (still ? 0 : 0.05)) * dt
    m.rotation.y += (state.spin.y + (still ? 0 : 0.08)) * dt
  })
  return (
    <mesh ref={ref} position={at} scale={size} rotation={[phase, phase * 2, 0]}>
      <dodecahedronGeometry args={[1, 0]} />
      <StoneMat />
    </mesh>
  )
}

/** Loose floating stone: lighter than the islands, with a faint warm self-glow so it never sinks into the dark. */
export function StoneMat() {
  return <meshStandardMaterial color={C.stone} emissive="#2a1d12" emissiveIntensity={0.9} roughness={0.75} flatShading />
}

/** A floating chunk of rock: flat top slab, tapered underside and loose shards that react to the cursor. */
export function Rock({ r = 4, depth = 3.5, seed = 1, children }: { r?: number; depth?: number; seed?: number; children?: ReactNode }) {
  const shards = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => {
        const a = seed * 1.7 + i * 0.73 * Math.PI
        const high = i % 3 === 0
        const d = r + (high ? 1.8 : 1) + ((i * 7 + seed) % 3) * 0.6
        return {
          p: [Math.cos(a) * d, high ? 0.8 + ((i + seed) % 4) * 0.9 : -0.9 - (i % 4) * 0.6, Math.sin(a) * d] as [number, number, number],
          s: 0.16 + ((i * 37 + seed * 13) % 10) / 30,
        }
      }),
    [r, seed],
  )
  return (
    <group>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[r, r * 0.97, 0.5, 9]} />
        <Mat color={C.top} />
      </mesh>
      <mesh position={[0, -0.5 - depth / 2, 0]} rotation={[0, seed, 0]}>
        <cylinderGeometry args={[r * 0.97, 0.35, depth, 9, 2]} />
        <Mat color={C.rock} />
      </mesh>
      {shards.map((s, i) => (
        <PushRock key={i} at={s.p} size={s.s} phase={i * 1.3 + seed} />
      ))}
      {children}
    </group>
  )
}

/** Simple rounded shrub from a few low-poly blobs. */
export function Shrub({ scale = 1, ...props }: { scale?: number } & GroupProps) {
  return (
    <group {...props} scale={scale}>
      <mesh position={[0, 0.35, 0]}>
        <icosahedronGeometry args={[0.45, 0]} />
        <Mat color={C.leaf} />
      </mesh>
      <mesh position={[0.3, 0.25, 0.1]}>
        <icosahedronGeometry args={[0.3, 0]} />
        <Mat color={C.leaf} />
      </mesh>
      <mesh position={[-0.25, 0.22, -0.1]}>
        <icosahedronGeometry args={[0.28, 0]} />
        <Mat color="#5d7b63" />
      </mesh>
    </group>
  )
}
