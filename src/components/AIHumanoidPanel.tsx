import { useRef, useEffect, useCallback, useState } from 'react'
import { motion, useSpring, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import { Spotlight } from './ui/Spotlight'

// ─── GTM floating chip data ───────────────────────────────────────────────────
const chips = [
  { label: 'Visitor Identified', sub: 'Sarah Chen · Notion Labs', delay: 0.6 },
  { label: 'ICP Score', sub: '98 / 100 · Hot', delay: 1.1 },
  { label: 'AI Draft Generated', sub: 'Email ready · 0.3s', delay: 1.6 },
  { label: 'Workflow Routed', sub: 'Sequence triggered', delay: 2.1 },
]

// ─── Build the Three.js humanoid ──────────────────────────────────────────────
function buildHumanoid(scene: THREE.Scene) {
  const group = new THREE.Group()

  // Use MeshStandardMaterial with moderate metalness so directional lights
  // can illuminate the surfaces without needing an environment map.
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x3a3a40,
    metalness: 0.6,
    roughness: 0.25,
  })

  const accentMat = new THREE.MeshStandardMaterial({
    color: 0x505058,
    metalness: 0.5,
    roughness: 0.3,
  })

  // ── Head ──────────────────────────────────────────────────────────────────
  const headGeo = new THREE.SphereGeometry(0.38, 32, 32)
  const head = new THREE.Mesh(headGeo, bodyMat)
  head.position.y = 2.05
  group.add(head)

  // Faceplate visor
  const visorGeo = new THREE.SphereGeometry(0.22, 32, 16, 0, Math.PI * 2, 0.3, 1.2)
  const visorMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a22,
    metalness: 0.3,
    roughness: 0.05,
    transparent: true,
    opacity: 0.85,
  })
  const visor = new THREE.Mesh(visorGeo, visorMat)
  visor.position.set(0, 2.1, 0.28)
  group.add(visor)

  // Head rim glow ring
  const rimGeo = new THREE.TorusGeometry(0.4, 0.012, 16, 64)
  const rimMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 })
  const rim = new THREE.Mesh(rimGeo, rimMat)
  rim.position.y = 2.05
  rim.rotation.x = Math.PI / 2
  group.add(rim)

  // ── Neck ─────────────────────────────────────────────────────────────────
  const neckGeo = new THREE.CylinderGeometry(0.1, 0.13, 0.28, 20)
  const neck = new THREE.Mesh(neckGeo, accentMat)
  neck.position.y = 1.68
  group.add(neck)

  // ── Torso ─────────────────────────────────────────────────────────────────
  const torsoGeo = new THREE.CylinderGeometry(0.38, 0.32, 0.9, 32)
  const torso = new THREE.Mesh(torsoGeo, bodyMat)
  torso.position.y = 1.1
  group.add(torso)

  // Chest panel inset
  const chestGeo = new THREE.BoxGeometry(0.44, 0.36, 0.05)
  const chest = new THREE.Mesh(chestGeo, accentMat)
  chest.position.set(0, 1.18, 0.35)
  group.add(chest)

  // Chest glow orb (the "heart" — always visible as emissive white)
  const orbGeo = new THREE.SphereGeometry(0.07, 20, 20)
  const orbMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.65 })
  const orb = new THREE.Mesh(orbGeo, orbMat)
  orb.position.set(0, 1.18, 0.38)
  group.add(orb)

  // Orb halo
  const haloGeo = new THREE.RingGeometry(0.09, 0.13, 32)
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, side: THREE.DoubleSide })
  const halo = new THREE.Mesh(haloGeo, haloMat)
  halo.position.set(0, 1.18, 0.385)
  group.add(halo)

  // ── Shoulders ─────────────────────────────────────────────────────────────
  ;[-1, 1].forEach((side) => {
    const shGeo = new THREE.SphereGeometry(0.18, 24, 24)
    const sh = new THREE.Mesh(shGeo, bodyMat)
    sh.position.set(side * 0.54, 1.45, 0)
    group.add(sh)
  })

  // ── Upper Arms ───────────────────────────────────────────────────────────
  ;[-1, 1].forEach((side) => {
    const armGeo = new THREE.CylinderGeometry(0.1, 0.09, 0.55, 18)
    const arm = new THREE.Mesh(armGeo, bodyMat)
    arm.position.set(side * 0.54, 1.12, 0)
    arm.rotation.z = side * 0.08
    group.add(arm)
  })

  // ── Elbows ────────────────────────────────────────────────────────────────
  ;[-1, 1].forEach((side) => {
    const elGeo = new THREE.SphereGeometry(0.1, 20, 20)
    const el = new THREE.Mesh(elGeo, accentMat)
    el.position.set(side * 0.56, 0.82, 0)
    group.add(el)
  })

  // ── Forearms ─────────────────────────────────────────────────────────────
  ;[-1, 1].forEach((side) => {
    const faGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.52, 18)
    const fa = new THREE.Mesh(faGeo, bodyMat)
    fa.position.set(side * 0.58, 0.54, 0)
    group.add(fa)
  })

  // ── Hands ─────────────────────────────────────────────────────────────────
  ;[-1, 1].forEach((side) => {
    const handGeo = new THREE.SphereGeometry(0.09, 18, 18)
    const hand = new THREE.Mesh(handGeo, bodyMat)
    hand.position.set(side * 0.6, 0.27, 0)
    group.add(hand)
  })

  // ── Pelvis ────────────────────────────────────────────────────────────────
  const pelvisGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.22, 28)
  const pelvis = new THREE.Mesh(pelvisGeo, accentMat)
  pelvis.position.y = 0.6
  group.add(pelvis)

  // ── Upper Legs ───────────────────────────────────────────────────────────
  ;[-1, 1].forEach((side) => {
    const legGeo = new THREE.CylinderGeometry(0.11, 0.1, 0.55, 18)
    const leg = new THREE.Mesh(legGeo, bodyMat)
    leg.position.set(side * 0.18, 0.18, 0)
    group.add(leg)
  })

  // ── Knees ─────────────────────────────────────────────────────────────────
  ;[-1, 1].forEach((side) => {
    const kneeGeo = new THREE.SphereGeometry(0.12, 20, 20)
    const knee = new THREE.Mesh(kneeGeo, accentMat)
    knee.position.set(side * 0.18, -0.1, 0)
    group.add(knee)
  })

  // ── Lower Legs ───────────────────────────────────────────────────────────
  ;[-1, 1].forEach((side) => {
    const lGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.52, 18)
    const l = new THREE.Mesh(lGeo, bodyMat)
    l.position.set(side * 0.18, -0.39, 0)
    group.add(l)
  })

  // ── Feet ──────────────────────────────────────────────────────────────────
  ;[-1, 1].forEach((side) => {
    const fGeo = new THREE.BoxGeometry(0.14, 0.09, 0.26)
    const f = new THREE.Mesh(fGeo, bodyMat)
    f.position.set(side * 0.18, -0.68, 0.04)
    group.add(f)
  })

  // ── Subtle glow capsule behind body ──────────────────────────────────────
  const glowCylGeo = new THREE.CylinderGeometry(0.5, 0.5, 2.8, 32)
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.04,
  })
  const glowCyl = new THREE.Mesh(glowCylGeo, glowMat)
  glowCyl.position.y = 0.9
  glowCyl.position.z = -0.2
  group.add(glowCyl)

  group.position.y = -0.4
  scene.add(group)
  return group
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AIHumanoidPanel() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const frameIdRef = useRef<number>(0)

  // Spring mouse for tilt
  const rawMouseX = useSpring(0, { stiffness: 60, damping: 18 })
  const rawMouseY = useSpring(0, { stiffness: 60, damping: 18 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
      rawMouseX.set(nx)
      rawMouseY.set(ny)
    },
    [rawMouseX, rawMouseY]
  )

  const handleMouseLeave = useCallback(() => {
    rawMouseX.set(0)
    rawMouseY.set(0)
  }, [rawMouseX, rawMouseY])

  // 3D scene bootstrap
  useEffect(() => {
    const container = canvasRef.current
    if (!container) return

    // Use explicit pixel values — getBoundingClientRect is layout-accurate
    const rect = container.getBoundingClientRect()
    const w = Math.max(rect.width, 400)
    const h = Math.max(rect.height, 400)

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(38, w / h, 0.1, 100)
    camera.position.set(0, 0.5, 5.5)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(w, h)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    container.appendChild(renderer.domElement)

    // ── Lighting — strong enough for MeshStandardMaterial ────────────────
    // Ambient fill
    scene.add(new THREE.AmbientLight(0xffffff, 0.5))

    // Key light (warm white, front-left-top)
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 3.0)
    keyLight.position.set(-3, 6, 5)
    scene.add(keyLight)

    // Rim light (cold white, right-back — Apple-style edge separation)
    const rimRight = new THREE.DirectionalLight(0xe8ecff, 2.0)
    rimRight.position.set(4, 3, -2)
    scene.add(rimRight)

    // Top fill
    const topFill = new THREE.PointLight(0xffffff, 1.2, 15)
    topFill.position.set(0, 6, 3)
    scene.add(topFill)

    // Front fill (so the face isn't in shadow)
    const frontFill = new THREE.DirectionalLight(0xffffff, 1.0)
    frontFill.position.set(0, 1, 6)
    scene.add(frontFill)

    // Bottom bounce
    const bounce = new THREE.PointLight(0xdde0ff, 0.4, 10)
    bounce.position.set(0, -3, 2)
    scene.add(bounce)

    // ── Robot ─────────────────────────────────────────────────────────────
    const humanoid = buildHumanoid(scene)
    groupRef.current = humanoid

    // ── Animation loop ────────────────────────────────────────────────────
    const clock = new THREE.Clock()

    const animate = () => {
      const t = clock.getElapsedTime()
      const g = groupRef.current
      if (!g) return

      // Idle float
      g.position.y = -0.4 + Math.sin(t * 0.7) * 0.04

      // Breathing torso scale (very subtle)
      const breathScale = 1 + Math.sin(t * 1.1) * 0.006
      g.scale.set(1, breathScale, 1)

      // Slow base rotation
      g.rotation.y = Math.sin(t * 0.18) * 0.18

      // Cursor tilt overlay
      const curX = rawMouseX.get()
      const curY = rawMouseY.get()
      g.rotation.y += curX * 0.22
      g.rotation.x = curY * -0.1

      renderer.render(scene, camera)
      frameIdRef.current = requestAnimationFrame(animate)
    }
    animate()

    // Resize
    const onResize = () => {
      const r = container.getBoundingClientRect()
      const nw = Math.max(r.width, 1)
      const nh = Math.max(r.height, 1)
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frameIdRef.current)
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Visible chips state ────────────────────────────────────────────────
  const [visibleChips, setVisibleChips] = useState<number[]>([])
  useEffect(() => {
    const timers = chips.map((c, i) =>
      setTimeout(() => setVisibleChips((p) => [...p, i]), c.delay * 1000 + 800)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full"
      style={{ height: 620 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Outer glass container ── */}
      <div
        className="relative w-full rounded-[32px] overflow-hidden"
        style={{
          height: 620,
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          boxShadow: '0 0 80px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* ── Spotlight hover glow ── */}
        <Spotlight color="rgba(255,255,255,0.10)" size={450} />

        {/* ── Cinematic inner gradient ── */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background:
              'radial-gradient(ellipse 70% 60% at 50% 20%, rgba(255,255,255,0.03) 0%, transparent 70%), ' +
              'radial-gradient(ellipse 50% 70% at 50% 100%, rgba(0,0,0,0.55) 0%, transparent 60%)',
          }}
        />

        {/* ── Particle streaks ── */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: `${15 + i * 16}%`,
              top: `${10 + ((i * 23) % 70)}%`,
              width: 1,
              height: `${40 + i * 12}px`,
              background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.07), transparent)',
              borderRadius: 999,
              zIndex: 1,
            }}
            animate={{ opacity: [0, 0.7, 0], y: [0, 12, 0] }}
            transition={{
              duration: 3.5 + i * 0.6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.7,
            }}
          />
        ))}

        {/* ── Three.js canvas mount point — explicit height ── */}
        <div
          ref={canvasRef}
          className="absolute z-[2]"
          style={{ top: 0, left: 0, width: '100%', height: 620 }}
        />

        {/* ── Volumetric glow behind robot ── */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-[3] flex items-center justify-center"
          animate={{ opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div
            className="w-[45%] h-[60%]"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.04) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />
        </motion.div>

        {/* ── Floating GTM chips ── */}
        <div className="absolute inset-0 z-[10] pointer-events-none">
          <AnimatePresence>
            {visibleChips.includes(0) && (
              <motion.div
                key="chip-0"
                initial={{ opacity: 0, x: -16, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[14%] left-[6%]"
              >
                <GlassChip label={chips[0].label} sub={chips[0].sub} />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {visibleChips.includes(1) && (
              <motion.div
                key="chip-1"
                initial={{ opacity: 0, x: 16, y: 8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-[18%] right-[6%]"
              >
                <GlassChip label={chips[1].label} sub={chips[1].sub} />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {visibleChips.includes(2) && (
              <motion.div
                key="chip-2"
                initial={{ opacity: 0, x: -16, y: -8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-[18%] left-[5%]"
              >
                <GlassChip label={chips[2].label} sub={chips[2].sub} />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {visibleChips.includes(3) && (
              <motion.div
                key="chip-3"
                initial={{ opacity: 0, x: 16, y: -8 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-[14%] right-[5%]"
              >
                <GlassChip label={chips[3].label} sub={chips[3].sub} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Inner glass border highlight ── */}
        <div
          className="absolute inset-0 pointer-events-none z-[20] rounded-[32px]"
          style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(255,255,255,0.02)' }}
        />
      </div>
    </motion.div>
  )
}

// ─── Glass chip sub-component ────────────────────────────────────────────────
function GlassChip({ label, sub }: { label: string; sub: string }) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: Math.random() * 1.5 }}
      className="flex items-start gap-2.5 px-3 py-2.5 rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.045)',
        border: '1px solid rgba(255,255,255,0.10)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06)',
        minWidth: 160,
      }}
    >
      <div className="w-1.5 h-1.5 rounded-full mt-1 shrink-0 bg-white/60" />
      <div>
        <p className="text-[11px] font-medium text-white/85 leading-none mb-1 tracking-wide">{label}</p>
        <p className="text-[10px] text-white/40 leading-none font-mono tracking-wide">{sub}</p>
      </div>
    </motion.div>
  )
}
