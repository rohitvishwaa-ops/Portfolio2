import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard, RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import { Bob, C, Glow, Mat, Rock, Shrub, Spin, still } from './parts'

/* ------------------------------------------------------------------ */
/* Studio: where it starts. Desk, glowing monitor, lamp, plant, books. */
/* ------------------------------------------------------------------ */
const codeLines: [number, number, number, boolean][] = [
  [0.7, 0.34, -0.45, true],
  [1.0, 0.22, -0.3, false],
  [0.55, 0.1, -0.2, false],
  [0.9, -0.02, -0.2, true],
  [0.4, -0.14, -0.35, false],
  [1.1, -0.26, -0.1, false],
  [0.6, -0.38, -0.4, true],
]

/** Black-and-white mountain print, drawn once to a canvas. */
let poster: THREE.CanvasTexture | null = null
function posterTexture() {
  if (poster) return poster
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 336
  const g = c.getContext('2d')!
  g.fillStyle = '#e9e6e0'
  g.fillRect(0, 0, 256, 336)
  g.fillStyle = '#101012'
  g.fillRect(14, 14, 228, 250)
  const ridge = (pts: number[][], fill: string) => {
    g.beginPath()
    g.moveTo(14, 264)
    pts.forEach(([x, y]) => g.lineTo(x, y))
    g.lineTo(242, 264)
    g.closePath()
    g.fillStyle = fill
    g.fill()
  }
  ridge([[14, 170], [60, 120], [92, 150], [140, 70], [176, 130], [210, 100], [242, 150]], '#8e8c88')
  ridge([[14, 210], [70, 150], [110, 190], [150, 120], [200, 185], [242, 165]], '#d8d5cf')
  ridge([[14, 240], [90, 200], [160, 230], [242, 205]], '#2a2a2e')
  g.fillStyle = '#101012'
  g.font = '600 13px sans-serif'
  g.fillText('HIMALAYA', 14, 300)
  g.font = '10px sans-serif'
  g.fillText('27.9881 N  86.9250 E', 14, 318)
  poster = new THREE.CanvasTexture(c)
  poster.colorSpace = THREE.SRGBColorSpace
  poster.anisotropy = 4
  return poster
}

/** Glass cards floating beside the studio, each a tiny abstract of one project. Placed so they never drift behind the hero copy. */
function HoloCards() {
  const cards = [
    { a: -0.45, y: 4, bars: [0.3, 0.55, 0.42, 0.8] },
    { a: -1.35, y: 4.6, bars: [0.7, 0.35, 0.6, 0.45] },
    { a: 0.12, y: 1.9, bars: [0.4, 0.6, 0.9, 0.5] },
  ]
  return (
    <group>
      {cards.map((c, i) => {
        const { a } = c
        const r = 5.1
        return (
          <Bob key={i} position={[Math.cos(a) * r, c.y, Math.sin(a) * r]} amp={0.18} speed={0.7} phase={i * 2}>
            <Billboard lockX lockZ>
              <RoundedBox args={[1.5, 0.95, 0.04]} radius={0.06} smoothness={2}>
                <meshStandardMaterial color="#1a191e" transparent opacity={0.82} roughness={0.3} metalness={0.2} />
              </RoundedBox>
              <mesh position={[-0.4, 0.3, 0.03]}>
                <planeGeometry args={[0.5, 0.05]} />
                <Glow intensity={2} />
              </mesh>
              <mesh position={[-0.33, 0.17, 0.03]}>
                <planeGeometry args={[0.64, 0.035]} />
                <Glow color="#9aa6b6" intensity={0.9} />
              </mesh>
              {c.bars.map((h, j) => (
                <mesh key={j} position={[0.1 + j * 0.16, -0.36 + h * 0.3, 0.03]}>
                  <planeGeometry args={[0.09, h * 0.6]} />
                  {j === 3 ? <Glow intensity={1.8} /> : <meshStandardMaterial color="#3b4758" />}
                </mesh>
              ))}
              <mesh position={[-0.42, -0.2, 0.03]}>
                <ringGeometry args={[0.12, 0.17, 24]} />
                <Glow color="#9aa6b6" intensity={0.9} />
              </mesh>
            </Billboard>
          </Bob>
        )
      })}
    </group>
  )
}

export function Studio() {
  return (
    <Rock r={4.6} depth={4.2} seed={1}>
      <mesh position={[0.3, 0.02, 0.2]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[2.3, 28]} />
        <meshStandardMaterial color="#3a332d" roughness={1} />
      </mesh>

      <group position={[0.3, 0, -0.9]}>
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[3.2, 0.1, 1.3]} />
          <Mat color={C.wood} />
        </mesh>
        {[
          [-1.5, -0.55],
          [1.5, -0.55],
          [-1.5, 0.55],
          [1.5, 0.55],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.45, z]}>
            <boxGeometry args={[0.08, 0.9, 0.08]} />
            <Mat color={C.metal} metal={0.4} />
          </mesh>
        ))}

        {/* monitor */}
        <group position={[-0.1, 1.7, -0.35]}>
          <mesh>
            <boxGeometry args={[1.95, 1.15, 0.06]} />
            <Mat color={C.dark} />
          </mesh>
          <mesh position={[0, 0, 0.036]}>
            <planeGeometry args={[1.82, 1.02]} />
            <meshStandardMaterial color="#141a24" emissive="#1c2533" emissiveIntensity={1.4} />
          </mesh>
          {codeLines.map(([w, y, x, hot], i) => (
            <mesh key={i} position={[x + w / 2 - 0.2, y, 0.05]}>
              <planeGeometry args={[w, 0.045]} />
              {hot ? <Glow intensity={2.2} /> : <Glow color="#9aa6b6" intensity={1.1} />}
            </mesh>
          ))}
          <mesh position={[0, -0.72, 0.05]}>
            <boxGeometry args={[0.1, 0.35, 0.1]} />
            <Mat color={C.metal} />
          </mesh>
        </group>

        <mesh position={[0, 1.02, 0.25]}>
          <boxGeometry args={[1, 0.035, 0.32]} />
          <Mat color="#26252a" />
        </mesh>
        <mesh position={[-1.05, 1.1, 0.25]}>
          <cylinderGeometry args={[0.1, 0.09, 0.2, 10]} />
          <Mat color={C.bone} />
        </mesh>

        {/* lamp */}
        <group position={[1.25, 1, -0.3]}>
          <mesh position={[0, 0.03, 0]}>
            <cylinderGeometry args={[0.18, 0.2, 0.06, 12]} />
            <Mat color={C.dark} />
          </mesh>
          <mesh position={[0, 0.45, 0]} rotation-z={0.25}>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 6]} />
            <Mat color={C.dark} />
          </mesh>
          <group position={[-0.25, 0.9, 0.1]} rotation-z={0.9}>
            <mesh>
              <coneGeometry args={[0.22, 0.3, 14, 1, true]} />
              <meshStandardMaterial color={C.dark} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <sphereGeometry args={[0.07, 10, 8]} />
              <Glow intensity={6} />
            </mesh>
          </group>
          <pointLight position={[-0.45, 0.7, 0.2]} color={C.amber} intensity={8} distance={7} decay={1.6} />
        </group>
      </group>

      {/* back wall, like the room in the photo: warm LED shelf, trailing plant, mountain poster */}
      <group position={[0.2, 0, -2.5]}>
        <mesh position={[0, 1.75, 0]}>
          <boxGeometry args={[6.6, 3.5, 0.16]} />
          <Mat color="#141317" />
        </mesh>
        <mesh position={[0, 1.02, 0.1]}>
          <boxGeometry args={[2.6, 0.025, 0.02]} />
          <Glow intensity={1.6} />
        </mesh>

        <group position={[-1.6, 2.55, 0.25]}>
          <mesh>
            <boxGeometry args={[2.3, 0.07, 0.36]} />
            <Mat color="#1d1b1f" />
          </mesh>
          <mesh position={[0, -0.05, 0.16]}>
            <boxGeometry args={[2.2, 0.018, 0.018]} />
            <Glow intensity={2.2} />
          </mesh>
          <pointLight position={[0, -0.35, 0.35]} color={C.amber} intensity={3} distance={3} decay={1.8} />
          <mesh position={[-0.8, 0.22, 0]}>
            <boxGeometry args={[0.3, 0.38, 0.26]} />
            <Mat color="#0f0f12" />
          </mesh>
          <mesh position={[-0.8, 0.26, 0.135]}>
            <circleGeometry args={[0.08, 16]} />
            <Mat color="#2a2a30" />
          </mesh>
          <mesh position={[-0.25, 0.19, 0]}>
            <capsuleGeometry args={[0.07, 0.16, 4, 8]} />
            <Mat color="#0f0f12" />
          </mesh>
          <mesh position={[-0.25, 0.37, 0]}>
            <sphereGeometry args={[0.07, 10, 8]} />
            <Mat color="#0f0f12" />
          </mesh>
          <mesh position={[0.35, 0.14, 0]}>
            <boxGeometry args={[0.24, 0.24, 0.24]} />
            <Mat color={C.bone} />
          </mesh>
          {/* trailing vine */}
          {Array.from({ length: 9 }, (_, i) => (
            <mesh key={i} position={[0.95 + Math.sin(i * 1.3) * 0.12, -0.05 - i * 0.16, 0.12 + (i % 2) * 0.06]} rotation={[i, i * 2, 0]} scale={0.11 - i * 0.004}>
              <icosahedronGeometry args={[1, 0]} />
              <Mat color={i % 3 ? C.leaf : '#6c8a60'} />
            </mesh>
          ))}
        </group>

        <group position={[1.95, 2.05, 0.1]}>
          <mesh>
            <boxGeometry args={[1.4, 1.8, 0.04]} />
            <Mat color="#0c0c0e" />
          </mesh>
          <mesh position={[0, 0, 0.025]}>
            <planeGeometry args={[1.28, 1.68]} />
            <meshStandardMaterial map={posterTexture()} roughness={0.9} />
          </mesh>
        </group>
      </group>

      <HoloCards />

      {/* chair */}
      <group position={[0.2, 0, 0.55]} rotation-y={0.3}>
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[0.8, 0.1, 0.75]} />
          <Mat color={C.dark} />
        </mesh>
        <mesh position={[0, 1.05, 0.36]} rotation-x={-0.12}>
          <boxGeometry args={[0.8, 0.9, 0.08]} />
          <Mat color={C.dark} />
        </mesh>
        <mesh position={[0, 0.28, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.5, 6]} />
          <Mat color={C.metal} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.05, 5]} />
          <Mat color={C.metal} />
        </mesh>
      </group>

      {/* plant */}
      <group position={[-2.3, 0, -1.3]}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.35, 0.28, 0.6, 10]} />
          <Mat color={C.bone} />
        </mesh>
        <Shrub position={[0, 0.5, 0]} scale={1.5} />
        <Shrub position={[0.15, 1.15, 0.05]} scale={0.9} />
      </group>

      {/* shelf */}
      <group position={[-2.8, 0, 1]} rotation-y={0.1}>
        <mesh position={[0, 0.9, 0]}>
          <boxGeometry args={[1.6, 1.8, 0.45]} />
          <Mat color="#2f2a26" />
        </mesh>
        {[0.45, 1.25].map((y) =>
          [-0.55, -0.38, -0.2, 0.05, 0.22, 0.45].map((x, i) => (
            <mesh key={`${y}${x}`} position={[x, y + ((i * 7) % 3) * 0.03, 0.12]} rotation-z={i === 3 ? 0.25 : 0}>
              <boxGeometry args={[0.13, 0.5 - ((i * 5) % 4) * 0.05, 0.3]} />
              <Mat color={[C.bone, C.slate, C.ember, '#8b8f99', C.wood, C.bone][i]} />
            </mesh>
          )),
        )}
      </group>

      {/* floating glyphs over the desk */}
      <Bob position={[1.9, 3.1, -0.4]} amp={0.2} speed={0.8}>
        <mesh rotation={[0.3, 0.6, 0]}>
          <torusGeometry args={[0.28, 0.05, 6, 20]} />
          <Glow intensity={2.4} />
        </mesh>
      </Bob>
      <Bob position={[-1.2, 3.4, -0.9]} amp={0.18} speed={0.7} phase={2}>
        <mesh rotation={[0.2, 0.4, 0.7]}>
          <octahedronGeometry args={[0.28, 0]} />
          <Mat color={C.bone} />
        </mesh>
      </Bob>
    </Rock>
  )
}

/* ------------------------------------------------------------------ */
/* Weather station: radar dome, anemometer, clouds and rain (IMD).     */
/* ------------------------------------------------------------------ */
function Rain({ count = 70 }) {
  const ref = useRef<THREE.InstancedMesh>(null)
  const drops = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: Math.sin(i * 12.9898) * 1.9,
        z: Math.cos(i * 78.233) * 1.4,
        y: (i * 0.37) % 4.5,
        v: 3 + ((i * 17) % 7) * 0.3,
      })),
    [count],
  )
  const m = useMemo(() => new THREE.Matrix4(), [])
  useFrame((_, dt) => {
    const mesh = ref.current
    if (!mesh) return
    drops.forEach((d, i) => {
      if (!still) {
        d.y -= d.v * dt
        if (d.y < 0) d.y += 4.5
      }
      m.makeTranslation(d.x, d.y, d.z)
      mesh.setMatrixAt(i, m)
    })
    mesh.instanceMatrix.needsUpdate = true
  })
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[0.018, 0.28, 0.018]} />
      <meshBasicMaterial color="#9fb3d1" transparent opacity={0.55} />
    </instancedMesh>
  )
}

function Cloud(props: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={props.position} scale={props.scale ?? 1}>
      {[
        [0, 0, 0, 1],
        [0.9, -0.15, 0.1, 0.75],
        [-0.85, -0.2, -0.1, 0.7],
        [0.3, 0.45, -0.2, 0.7],
        [-0.3, 0.1, 0.5, 0.6],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]} scale={s}>
          <icosahedronGeometry args={[0.8, 1]} />
          <Mat color="#7d8591" />
        </mesh>
      ))}
    </group>
  )
}

export function WeatherStation() {
  return (
    <Rock r={4.2} depth={3.8} seed={2}>
      {/* radar */}
      <group position={[-1.5, 0, -0.9]}>
        <mesh position={[0, 0.6, 0]}>
          <cylinderGeometry args={[0.95, 1.05, 1.2, 10]} />
          <Mat color="#bdb7ad" />
        </mesh>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[1.05, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <Mat color={C.bone} />
        </mesh>
        <mesh position={[0, 0.5, 1.03]}>
          <boxGeometry args={[0.4, 0.7, 0.05]} />
          <Mat color={C.dark} />
        </mesh>
        <mesh position={[0.6, 0.95, 0.84]}>
          <boxGeometry args={[0.2, 0.08, 0.02]} />
          <Glow intensity={2} />
        </mesh>
      </group>

      {/* anemometer mast */}
      <group position={[1.7, 0, -0.7]}>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.05, 0.07, 4, 6]} />
          <Mat color={C.metal} metal={0.5} />
        </mesh>
        <Spin position={[0, 4.05, 0]} speed={3}>
          {[0, 1, 2].map((k) => (
            <group key={k} rotation-y={(k * Math.PI * 2) / 3}>
              <mesh position={[0.3, 0, 0]}>
                <boxGeometry args={[0.6, 0.03, 0.03]} />
                <Mat color={C.metal} />
              </mesh>
              <mesh position={[0.6, 0, 0]} rotation-z={Math.PI / 2}>
                <sphereGeometry args={[0.1, 8, 6, 0, Math.PI]} />
                <meshStandardMaterial color={C.bone} side={THREE.DoubleSide} />
              </mesh>
            </group>
          ))}
        </Spin>
        <group position={[0, 3.4, 0]} rotation-y={0.8}>
          <mesh position={[0.25, 0, 0]}>
            <boxGeometry args={[0.6, 0.03, 0.03]} />
            <Mat color={C.metal} />
          </mesh>
          <mesh position={[0.55, 0, 0]}>
            <boxGeometry args={[0.2, 0.18, 0.02]} />
            <Glow intensity={1.8} />
          </mesh>
        </group>
      </group>

      {/* stevenson screen */}
      <group position={[1.3, 0, 1.7]} rotation-y={-0.4}>
        {[
          [-0.3, -0.25],
          [0.3, -0.25],
          [-0.3, 0.25],
          [0.3, 0.25],
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.45, z]}>
            <boxGeometry args={[0.05, 0.9, 0.05]} />
            <Mat color={C.bone} />
          </mesh>
        ))}
        <mesh position={[0, 1.2, 0]}>
          <boxGeometry args={[0.8, 0.6, 0.6]} />
          <Mat color={C.bone} />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} position={[0, 1.02 + i * 0.12, 0.305]}>
            <boxGeometry args={[0.7, 0.03, 0.02]} />
            <Mat color="#a9a398" />
          </mesh>
        ))}
      </group>

      {/* decoded readout */}
      <Bob position={[-0.9, 2.9, 1.6]} amp={0.12} speed={0.9}>
        <group rotation-y={0.4}>
          <RoundedBox args={[1.5, 0.95, 0.06]} radius={0.05}>
            <meshStandardMaterial color="#17181c" />
          </RoundedBox>
          {[0.25, 0.08, -0.09, -0.26].map((y, i) => (
            <mesh key={y} position={[-0.6 + (i % 2 ? 0.55 : 0.45) / 2, y, 0.04]}>
              <planeGeometry args={[i % 2 ? 0.55 : 0.45, 0.05]} />
              {i === 0 ? <Glow intensity={2.4} /> : <Glow color="#9aa6b6" intensity={1} />}
            </mesh>
          ))}
          {[0.25, 0.08, -0.09, -0.26].map((y) => (
            <mesh key={`r${y}`} position={[0.35, y, 0.04]}>
              <planeGeometry args={[0.45, 0.05]} />
              <Glow color="#9aa6b6" intensity={0.8} />
            </mesh>
          ))}
        </group>
      </Bob>

      <Shrub position={[-2.8, 0, 1.3]} scale={1.1} />
      <Shrub position={[3, 0, 0.6]} scale={0.8} />

      {/* weather */}
      <Bob position={[0.2, 6.3, 0.1]} amp={0.25} speed={0.35}>
        <Cloud position={[0, 0, 0]} scale={1.1} />
        <group position={[0, -5.8, 0]}>
          <Rain />
        </group>
      </Bob>
      <Bob position={[3.4, 7.2, -2.5]} amp={0.3} speed={0.3} phase={1.5}>
        <Cloud position={[0, 0, 0]} scale={0.7} />
      </Bob>
    </Rock>
  )
}

/* ------------------------------------------------------------------ */
/* Finance: coin stacks, bar chart with a rising trend line, pie.      */
/* ------------------------------------------------------------------ */
const bars = [0.8, 1.3, 1.05, 1.9, 2.7]

export function Finance() {
  const trend = useMemo(() => {
    const pts = bars.map((h, i) => new THREE.Vector3(-1.6 + i * 0.75, h + 0.45, -0.5))
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.045, 6)
  }, [])
  return (
    <Rock r={4.3} depth={3.6} seed={3}>
      {bars.map((h, i) => (
        <group key={i} position={[-1.6 + i * 0.75, 0, -0.5]}>
          <mesh position={[0, h / 2, 0]}>
            <boxGeometry args={[0.5, h, 0.5]} />
            <Mat color={i === bars.length - 1 ? C.topAlt : C.slate} />
          </mesh>
          <mesh position={[0, h + 0.02, 0]}>
            <boxGeometry args={[0.52, 0.05, 0.52]} />
            {i === bars.length - 1 ? <Glow intensity={2.6} /> : <Mat color="#56657a" />}
          </mesh>
        </group>
      ))}
      <mesh geometry={trend}>
        <Glow intensity={2.4} />
      </mesh>

      {/* coin stacks */}
      {[
        [-1.2, 1.4, 5],
        [-0.45, 1.8, 8],
        [0.3, 1.5, 4],
      ].map(([x, z, n], s) => (
        <group key={s} position={[x, 0, z]}>
          {Array.from({ length: n }, (_, i) => (
            <mesh key={i} position={[((i * 7) % 3) * 0.015, 0.05 + i * 0.1, 0]}>
              <cylinderGeometry args={[0.32, 0.32, 0.09, 14]} />
              <Mat color={C.coin} metal={0.7} rough={0.35} />
            </mesh>
          ))}
        </group>
      ))}

      {/* pie chart */}
      <group position={[2.2, 0, 1.2]}>
        {[
          [0, 3.4, 0.45, C.slate],
          [3.4, 1.9, 0.3, C.bone],
          [5.3, Math.PI * 2 - 5.3, 0.6, 'glow'],
        ].map(([start, len, h, color], i) => (
          <mesh key={i} position={[0, (h as number) / 2, 0]}>
            <cylinderGeometry args={[0.9, 0.9, h as number, 24, 1, false, start as number, len as number]} />
            {color === 'glow' ? <Glow intensity={2} /> : <Mat color={color as string} />}
          </mesh>
        ))}
      </group>

      <Bob position={[1.4, 3.6, -1]} amp={0.2} speed={0.8}>
        <Spin speed={1.2}>
          <mesh rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.6, 0.6, 0.12, 20]} />
            <Mat color={C.coin} metal={0.8} rough={0.3} />
          </mesh>
          <mesh rotation-x={Math.PI / 2}>
            <torusGeometry args={[0.45, 0.03, 6, 24]} />
            <Glow intensity={2} />
          </mesh>
        </Spin>
      </Bob>
      <Shrub position={[-3, 0, 0.3]} />
    </Rock>
  )
}

/* ------------------------------------------------------------------ */
/* Health: a beating heart inside a rotating ECG ring (Vital AI).      */
/* ------------------------------------------------------------------ */
function heartGeometry() {
  const s = new THREE.Shape()
  s.moveTo(0.5, 0.5)
  s.bezierCurveTo(0.5, 0.5, 0.4, 0, 0, 0)
  s.bezierCurveTo(-0.6, 0, -0.6, 0.7, -0.6, 0.7)
  s.bezierCurveTo(-0.6, 1.1, -0.3, 1.54, 0.5, 1.9)
  s.bezierCurveTo(1.2, 1.54, 1.6, 1.1, 1.6, 0.7)
  s.bezierCurveTo(1.6, 0.7, 1.6, 0, 1, 0)
  s.bezierCurveTo(0.7, 0, 0.5, 0.5, 0.5, 0.5)
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.45, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.12, bevelThickness: 0.14, curveSegments: 10 })
  g.center()
  g.rotateZ(Math.PI)
  return g
}

function ecgRing(radius: number) {
  const path = new THREE.CurvePath<THREE.Vector3>()
  const pts: THREE.Vector3[] = []
  const n = 220
  for (let k = 0; k <= n; k++) {
    const a = (k / n) * Math.PI * 2
    const local = ((a / (Math.PI * 2)) * 3) % 1
    let y = 0
    if (local > 0.42 && local < 0.46) y = (local - 0.42) * 18
    else if (local >= 0.46 && local < 0.5) y = 0.72 - (local - 0.46) * 27
    else if (local >= 0.5 && local < 0.53) y = -0.36 + (local - 0.5) * 12
    else if (local > 0.62 && local < 0.72) y = Math.sin(((local - 0.62) / 0.1) * Math.PI) * 0.14
    pts.push(new THREE.Vector3(Math.cos(a) * radius, y, Math.sin(a) * radius))
  }
  for (let k = 0; k < pts.length - 1; k++) path.add(new THREE.LineCurve3(pts[k], pts[k + 1]))
  return new THREE.TubeGeometry(path, n, 0.03, 5, true)
}

export function Health() {
  const heart = useMemo(heartGeometry, [])
  const ring = useMemo(() => ecgRing(2.4), [])
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (still || !ref.current) return
    const t = clock.elapsedTime % 1.1
    const beat = Math.exp(-((t - 0.1) ** 2) / 0.003) * 0.09 + Math.exp(-((t - 0.32) ** 2) / 0.004) * 0.06
    ref.current.scale.setScalar(1 + beat)
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.5
  })
  return (
    <Rock r={4} depth={3.6} seed={4}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[1.1, 1.3, 0.6, 10]} />
        <Mat color={C.topAlt} />
      </mesh>
      <mesh position={[0, 0.62, 0]}>
        <torusGeometry args={[1.05, 0.04, 6, 30]} />
        <Glow intensity={2} />
      </mesh>
      <group position={[0, 2.4, 0]}>
        <mesh ref={ref} geometry={heart} scale={1}>
          <meshStandardMaterial color={C.ember} emissive="#6e2016" emissiveIntensity={0.6} roughness={0.5} flatShading />
        </mesh>
        <pointLight color={C.ember} intensity={5} distance={6} />
        <Spin speed={0.35}>
          <mesh geometry={ring}>
            <Glow intensity={2.8} />
          </mesh>
        </Spin>
      </group>

      {/* cross */}
      <group position={[-2.3, 0, 1.3]} rotation-y={0.5}>
        <mesh position={[0, 0.7, 0]}>
          <boxGeometry args={[0.35, 1.4, 0.35]} />
          <Mat color={C.bone} />
        </mesh>
        <mesh position={[0, 0.85, 0]}>
          <boxGeometry args={[1.05, 0.35, 0.35]} />
          <Mat color={C.bone} />
        </mesh>
      </group>

      {[
        [2.1, 1.4, 0.3],
        [2.6, 0.6, 1.4],
        [1.6, 2.1, 2.3],
      ].map(([x, z, r], i) => (
        <mesh key={i} position={[x, 0.16, z]} rotation={[Math.PI / 2, 0, r]}>
          <capsuleGeometry args={[0.14, 0.38, 4, 8]} />
          <Mat color={i === 1 ? C.amber : C.bone} />
        </mesh>
      ))}
      <Shrub position={[-2.6, 0, -1.4]} scale={1.2} />
    </Rock>
  )
}

/* ------------------------------------------------------------------ */
/* Travel: faceted globe with an orbiting plane, pins and a hotel.     */
/* ------------------------------------------------------------------ */
function Plane() {
  return (
    <group scale={0.55}>
      <mesh rotation-z={Math.PI / 2}>
        <capsuleGeometry args={[0.14, 0.8, 4, 8]} />
        <Mat color={C.bone} />
      </mesh>
      <mesh>
        <boxGeometry args={[0.3, 0.04, 1.3]} />
        <Mat color={C.bone} />
      </mesh>
      <mesh position={[-0.5, 0.18, 0]}>
        <boxGeometry args={[0.2, 0.3, 0.04]} />
        <Glow intensity={2} />
      </mesh>
    </group>
  )
}

function Pin({ position }: { position: [number, number, number] }) {
  return (
    <Bob position={position} amp={0.1} speed={1.4} phase={position[0]}>
      <mesh position={[0, 0.35, 0]} rotation-x={Math.PI}>
        <coneGeometry args={[0.13, 0.45, 8]} />
        <Mat color={C.bone} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.17, 12, 10]} />
        <Glow intensity={3} />
      </mesh>
    </Bob>
  )
}

export function Travel() {
  const windows = useMemo(() => {
    const w: [number, number, boolean][] = []
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) w.push([-0.3 + c * 0.3, 0.45 + r * 0.38, (r * 3 + c) % 4 !== 1])
    return w
  }, [])
  return (
    <Rock r={4.4} depth={4} seed={5}>
      <group position={[0, 0, -0.3]}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.55, 0.7, 0.3, 10]} />
          <Mat color={C.dark} />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 6]} />
          <Mat color={C.metal} />
        </mesh>
        <group position={[0, 2.8, 0]}>
          <mesh rotation-z={0.4}>
            <torusGeometry args={[1.95, 0.04, 6, 40, Math.PI]} />
            <Mat color={C.metal} metal={0.5} />
          </mesh>
          <Spin speed={0.18}>
            <mesh>
              <icosahedronGeometry args={[1.6, 2]} />
              <Mat color={C.slate} rough={0.7} />
            </mesh>
            <mesh>
              <icosahedronGeometry args={[1.63, 1]} />
              <meshBasicMaterial color={C.amber} wireframe transparent opacity={0.22} />
            </mesh>
          </Spin>
          <group rotation={[0.35, 0, 0.25]}>
            <mesh rotation-x={Math.PI / 2}>
              <torusGeometry args={[2.55, 0.01, 4, 90]} />
              <meshBasicMaterial color={C.amber} transparent opacity={0.35} />
            </mesh>
            <Spin speed={-0.7}>
              <group position={[0, 0, 2.55]} rotation-y={Math.PI}>
                <Plane />
              </group>
            </Spin>
          </group>
        </group>
      </group>

      <Pin position={[-2.2, 0, 1.4]} />
      <Pin position={[2.4, 0, 1.8]} />
      <Pin position={[-1.1, 0, 2.6]} />

      {/* hotel */}
      <group position={[2.5, 0, -1.5]} rotation-y={-0.5}>
        <mesh position={[0, 0.95, 0]}>
          <boxGeometry args={[1.1, 1.9, 1]} />
          <Mat color={C.topAlt} />
        </mesh>
        <mesh position={[0, 1.95, 0]}>
          <boxGeometry args={[1.2, 0.1, 1.1]} />
          <Mat color={C.dark} />
        </mesh>
        {windows.map(([x, y, on], i) => (
          <mesh key={i} position={[x, y, 0.515]}>
            <boxGeometry args={[0.16, 0.2, 0.02]} />
            {on ? <Glow intensity={2.2} /> : <meshStandardMaterial color="#1a1a1e" />}
          </mesh>
        ))}
      </group>

      {/* suitcase */}
      <group position={[-2.4, 0, -1]} rotation-y={0.6}>
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[0.75, 0.7, 0.3]} />
          <Mat color={C.ember} />
        </mesh>
        <mesh position={[0, 0.82, 0]}>
          <torusGeometry args={[0.12, 0.03, 6, 12, Math.PI]} />
          <Mat color={C.dark} />
        </mesh>
      </group>
      <Shrub position={[-3.1, 0, 0.6]} scale={1.1} />
      <Shrub position={[3.4, 0, 0.3]} scale={0.9} />
    </Rock>
  )
}

/* ------------------------------------------------------------------ */
/* Toolkit: a stack of layers, each turning at its own pace.           */
/* ------------------------------------------------------------------ */
function Layer({ i, w }: { i: number; w: number }) {
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (still || !ref.current) return
    ref.current.rotation.y = 0.4 + Math.sin(clock.elapsedTime * 0.45 + i * 0.9) * 0.35 * (i % 2 ? 1 : -1)
  })
  return (
    <group ref={ref} position={[0, 0.75 + i * 0.78, 0]} rotation-y={0.4}>
      <RoundedBox args={[w, 0.46, w]} radius={0.08} smoothness={2}>
        <meshStandardMaterial color={i % 2 ? C.topAlt : '#25242a'} roughness={0.7} />
      </RoundedBox>
      <mesh position={[0, 0, w / 2 + 0.015]}>
        <planeGeometry args={[w * 0.7, 0.06]} />
        <Glow intensity={i === 4 ? 3.2 : 1.6} />
      </mesh>
      <mesh position={[w / 2 + 0.015, 0, 0]} rotation-y={Math.PI / 2}>
        <planeGeometry args={[w * 0.35, 0.06]} />
        <Glow color="#9aa6b6" intensity={1} />
      </mesh>
    </group>
  )
}

export function Toolkit() {
  return (
    <Rock r={4} depth={3.6} seed={6}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.9, 2.1, 0.4, 9]} />
        <Mat color={C.dark} />
      </mesh>
      {[2.6, 2.3, 2, 1.7, 1.4].map((w, i) => (
        <Layer key={i} i={i} w={w} />
      ))}
      <Spin position={[0, 2.4, 0]} speed={0.4}>
        {Array.from({ length: 6 }, (_, k) => {
          const a = (k / 6) * Math.PI * 2
          return (
            <mesh key={k} position={[Math.cos(a) * 2.9, Math.sin(k * 2) * 0.8, Math.sin(a) * 2.9]} rotation={[k, k, 0]}>
              <boxGeometry args={[0.28, 0.28, 0.28]} />
              {k % 3 === 0 ? <Glow intensity={2.4} /> : <Mat color={C.bone} />}
            </mesh>
          )
        })}
      </Spin>
      <Shrub position={[2.8, 0, 1.6]} />
      <Shrub position={[-2.9, 0, -1.2]} scale={1.2} />
    </Rock>
  )
}

/* ------------------------------------------------------------------ */
/* Beacon: a lighthouse sweeping the dark, with a paper plane circling. */
/* ------------------------------------------------------------------ */
function PaperPlane() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const v = new Float32Array([
      0.6, 0, 0, -0.4, 0, 0.35, -0.25, 0, 0,
      0.6, 0, 0, -0.25, 0, 0, -0.4, 0, -0.35,
      0.6, 0, 0, -0.25, 0, 0, -0.35, -0.18, 0,
    ])
    g.setAttribute('position', new THREE.BufferAttribute(v, 3))
    g.computeVertexNormals()
    return g
  }, [])
  return (
    <mesh geometry={geo}>
      <meshStandardMaterial color={C.bone} side={THREE.DoubleSide} flatShading />
    </mesh>
  )
}

/** Light cone that fades from the lamp outwards (uv.y is 1 at the apex). */
const beamMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  side: THREE.DoubleSide,
  uniforms: { color: { value: new THREE.Color(C.amber) } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  // Clamp before pow: interpolation can hand the edge a tiny negative v, and on Direct3D pow(negative) is NaN.
  // A single NaN pixel gets spread by the bloom blur into a whole black frame, which read as the lighthouse flickering.
  fragmentShader: `uniform vec3 color; varying vec2 vUv; void main(){ float v = clamp(vUv.y, 0.0, 1.0); float a = v * v * sqrt(v) * 0.22; gl_FragColor = vec4(color * a, a); }`,
})

const gableRoof = (() => {
  const shape = new THREE.Shape([new THREE.Vector2(-0.78, 0), new THREE.Vector2(0.78, 0), new THREE.Vector2(0, 0.6)])
  return new THREE.ExtrudeGeometry(shape, { depth: 1.1, bevelEnabled: false })
})()

export function Beacon() {
  return (
    <Rock r={4.2} depth={4.2} seed={7}>
      <group position={[0.4, 0, -0.4]}>
        <mesh position={[0, 2, 0]}>
          <cylinderGeometry args={[0.62, 1.05, 4, 12]} />
          <Mat color={C.bone} />
        </mesh>
        {[1.1, 2.6].map((y) => (
          <mesh key={y} position={[0, y, 0]}>
            <cylinderGeometry args={[0.9 - y * 0.1, 0.94 - y * 0.1, 0.45, 12]} />
            <Mat color="#8d3f31" />
          </mesh>
        ))}
        <mesh position={[0, 4.05, 0]}>
          <cylinderGeometry args={[0.95, 0.95, 0.1, 14]} />
          <Mat color={C.dark} />
        </mesh>
        <mesh position={[0, 4.45, 0]}>
          {/* open-ended and tucked between gallery and roof, so no flat caps sit flush against them */}
          <cylinderGeometry args={[0.5, 0.5, 0.78, 12, 1, true]} />
          <Glow intensity={4} />
        </mesh>
        <mesh position={[0, 5.08, 0]}>
          <coneGeometry args={[0.7, 0.6, 12]} />
          <Mat color={C.dark} />
        </mesh>
        <pointLight position={[0, 4.5, 0]} color={C.amber} intensity={14} distance={12} decay={1.4} />
        <Spin position={[0, 4.45, 0]} speed={0.6}>
          {[0, Math.PI].map((r) => (
            <group key={r} rotation-y={r}>
              <mesh position={[4, 0, 0]} rotation-z={Math.PI / 2} material={beamMaterial}>
                <coneGeometry args={[1.1, 8, 24, 1, true]} />
              </mesh>
            </group>
          ))}
        </Spin>
      </group>

      {/* keeper's house */}
      <group position={[-2, 0, 1]} rotation-y={0.4}>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.3, 1, 1]} />
          <Mat color={C.topAlt} />
        </mesh>
        <mesh position={[0, 1, -0.55]} geometry={gableRoof}>
          <Mat color={C.dark} />
        </mesh>
        <mesh position={[0.25, 0.5, 0.52]}>
          <boxGeometry args={[0.28, 0.3, 0.03]} />
          <Glow intensity={1.8} />
        </mesh>
      </group>

      <Spin position={[0.4, 3, -0.4]} speed={0.5}>
        <Bob position={[3.2, 0, 0]} amp={0.3} speed={1.2}>
          <group rotation-y={Math.PI / 2}>
            <PaperPlane />
          </group>
        </Bob>
      </Spin>
      <Shrub position={[2.6, 0, 1.8]} scale={1.1} />
      <Shrub position={[-2.8, 0, -1.6]} />
    </Rock>
  )
}
