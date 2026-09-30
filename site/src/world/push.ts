import * as THREE from 'three'
import { media, world } from '../state'

/**
 * Cursor-repel physics for floating rocks. Each rock keeps an offset and velocity; the pointer pushes it
 * away in screen space and a soft spring pulls it home, so it drifts, wobbles and settles.
 */
export type Push = { o: THREE.Vector3; v: THREE.Vector3; spin: THREE.Vector3 }
export const makePush = (): Push => ({ o: new THREE.Vector3(), v: new THREE.Vector3(), spin: new THREE.Vector3() })

const p = new THREE.Vector3()
const ndc = new THREE.Vector3()
const right = new THREE.Vector3()
const up = new THREE.Vector3()
const force = new THREE.Vector3()

const RADIUS = 0.2 // in aspect-corrected NDC units
const STIFF = 7
const DAMP = 3.2

export function stepPush(s: Push, base: THREE.Vector3, camera: THREE.Camera, aspect: number, dt: number, weight = 1) {
  dt = Math.min(dt, 1 / 30)
  force.set(0, 0, 0)
  if (world.pointerActive && !media.reducedMotion) {
    p.copy(base).add(s.o)
    ndc.copy(p).project(camera)
    if (ndc.z > -1 && ndc.z < 1) {
      const dx = (ndc.x - world.pointerX) * aspect
      const dy = ndc.y - world.pointerY
      const d = Math.hypot(dx, dy)
      if (d < RADIUS && d > 1e-5) {
        const k = 1 - d / RADIUS
        // Scale with depth so near and far rocks visibly move the same on screen.
        const mag = k * k * camera.position.distanceTo(p) * 5.5 * weight
        right.setFromMatrixColumn(camera.matrixWorld, 0)
        up.setFromMatrixColumn(camera.matrixWorld, 1)
        force.addScaledVector(right, (dx / d) * mag).addScaledVector(up, (dy / d) * mag)
        s.spin.x += (dy / d) * k * 9 * dt
        s.spin.y -= (dx / d) * k * 9 * dt
      }
    }
  }
  // spring-damper toward home
  s.v.addScaledVector(force, dt).addScaledVector(s.o, -STIFF * dt).multiplyScalar(Math.exp(-DAMP * dt))
  s.o.addScaledVector(s.v, dt)
  s.spin.multiplyScalar(Math.exp(-1.4 * dt))
}
