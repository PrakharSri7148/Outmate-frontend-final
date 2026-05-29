'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))
import { useRef, useEffect } from 'react'
import type { Application } from '@splinetool/runtime'

type SplineApp = Application & {
  scene?: {
    rotation: {
      x: number
      y: number
      z: number
      set: (x: number, y: number, z: number) => void
    }
  }
  setWatermark?: (value: unknown) => void
}

interface SplineSceneProps {
  scene: string
  className?: string
  autoReplayMs?: number
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full flex items-center justify-center">
          {/* Premium minimal loader */}
          <div className="relative w-10 h-10">
            <div
              className="absolute inset-0 rounded-full border border-white/20 animate-spin"
              style={{ borderTopColor: 'rgba(255,255,255,0.7)', animationDuration: '1s' }}
            />
            <div className="absolute inset-[6px] rounded-full bg-white/[0.03] border border-white/[0.06]" />
          </div>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}

// Note: We intentionally keep a lightweight custom wrapper below to control
// rotation/interaction behavior for Spline scenes used as premium product
// showcases. Consumers can use `SplineSceneFixed` when they want the model to
// rotate in place with subtle mouse micro-interactions.

export function SplineSceneFixed({ scene, className, autoReplayMs = 18000 }: SplineSceneProps) {
  const splineRef = useRef<SplineApp | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let raf = 0
    let replayTimer = 0
    let baseRotation = 0
    let currentY = 0
    let currentX = 0

    // buffered pointer coordinates (avoid layout reads on every pointermove)
    let lastPointerX = NaN
    let lastPointerY = NaN
    let rect: DOMRect | null = null

    const maxY = (8 * Math.PI) / 180 // ~8 degrees
    const maxX = (6 * Math.PI) / 180 // ~6 degrees

    // responsiveness: reduce work and influence on lower-power devices
    const isCoarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1024
    const deviceMode: 'desktop' | 'tablet' | 'mobile' = vw < 768 ? 'mobile' : vw < 1024 ? 'tablet' : 'desktop'
    const speedMultiplier = deviceMode === 'mobile' ? 0.5 : deviceMode === 'tablet' ? 0.85 : 1

    // time based rotation so rotation speed stays consistent across frame-rates
    let lastTime = performance.now()
    function animate(now = performance.now()) {
      const s = splineRef.current
      const dt = Math.min(64, now - lastTime) // cap delta to avoid big jumps
      lastTime = now

      // rotate according to elapsed time (ms)
      baseRotation += dt * 0.00006 * speedMultiplier // tuned for slow, premium rotation

      // derive pointer-based offsets from buffered coords and cached rect
      let targetOffsetY = 0
      let targetOffsetX = 0
      if (!Number.isNaN(lastPointerX) && rect && !isCoarse) {
        const x = (lastPointerX - (rect.left + rect.width / 2)) / (rect.width / 2)
        const y = (lastPointerY - (rect.top + rect.height / 2)) / (rect.height / 2)
        const cx = Math.max(-1, Math.min(1, x))
        const cy = Math.max(-1, Math.min(1, y))
        // reduce pointer influence on smaller devices
        const influence = deviceMode === 'mobile' ? 0.25 : deviceMode === 'tablet' ? 0.45 : 0.6
        targetOffsetY = cx * maxY * influence
        targetOffsetX = -cy * maxX * (influence * 0.75)
      }

      const desiredY = baseRotation + targetOffsetY
      const desiredX = targetOffsetX

      // smooth using exponential lerp that's framerate-independent
      const t = 1 - Math.pow(1 - 0.06, dt / 16.6667)
      currentY += (desiredY - currentY) * t
      currentX += (desiredX - currentX) * t

      if (s && s.scene && s.scene.rotation && typeof s.scene.rotation.set === 'function') {
        s.scene.rotation.set(currentX, currentY, 0)
      } else if (s && s.scene && s.scene.rotation) {
        // fallback when `set` is not available
        s.scene.rotation.x = currentX
        s.scene.rotation.y = currentY
      }

      raf = requestAnimationFrame(animate)
    }

    raf = requestAnimationFrame(animate)

    // pointer handlers only write to buffered vars (no DOM reads)
    const handlePointerMove = (e: PointerEvent) => {
      lastPointerX = e.clientX
      lastPointerY = e.clientY
    }
    const handlePointerLeave = () => {
      lastPointerX = NaN
      lastPointerY = NaN
    }

    const el = containerRef.current
    el?.addEventListener('pointermove', handlePointerMove, { passive: true })
    el?.addEventListener('pointerleave', handlePointerLeave)

    // cache bounding rect via ResizeObserver and on mount
    const ro = new ResizeObserver(() => {
      if (containerRef.current) rect = containerRef.current.getBoundingClientRect()
    })
    if (el) {
      rect = el.getBoundingClientRect()
      ro.observe(el)
    }

    // avoid heavy scene reloads during auto-replay; just reset rotation and base
    if (autoReplayMs > 0) {
      replayTimer = window.setInterval(() => {
        const app = splineRef.current
        if (!app || !app.scene) return
        baseRotation = 0
        currentX = 0
        currentY = 0
        try {
          app.scene.rotation.set(0, 0, 0)
          app.setWatermark?.(null)
        } catch {}
      }, autoReplayMs)
    }

    return () => {
      cancelAnimationFrame(raf)
      window.clearInterval(replayTimer)
      el?.removeEventListener('pointermove', handlePointerMove)
      el?.removeEventListener('pointerleave', handlePointerLeave)
      ro.disconnect()
    }
  }, [autoReplayMs, scene])

  const handleLoad = (s: Application) => {
    // store reference to spline runtime which exposes `scene`
    splineRef.current = s as SplineApp
    // ensure scene starts from zero rotation
    try {
      const loaded = splineRef.current
      if (loaded?.scene) {
        loaded.scene.rotation.set(0, 0, 0)
      }
      loaded?.setWatermark?.(null)
    } catch {
      // Ignore if the scene has not finished initializing yet.
    }
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', transform: 'translateZ(0)', willChange: 'transform' }}
    >
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="relative w-10 h-10">
              <div
                className="absolute inset-0 rounded-full border border-white/20 animate-spin"
                style={{ borderTopColor: 'rgba(255,255,255,0.7)', animationDuration: '1s' }}
              />
              <div className="absolute inset-[6px] rounded-full bg-white/[0.03] border border-white/[0.06]" />
            </div>
          </div>
        }
      >
        <Spline scene={scene} onLoad={handleLoad} />
      </Suspense>
    </div>
  )
}
