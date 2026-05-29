'use client'

import React, { Suspense } from 'react'
import { motion } from 'framer-motion'

const ParticleIntelligence = React.lazy(() => import('./ParticleIntelligence'))

const ease = [0.22, 1, 0.36, 1] as const

export default function LampGlow() {
  return (
    <div className="relative w-full min-h-[45vh] flex flex-col items-center justify-center overflow-hidden bg-[#050505]">

      {/* ── LAYER 1 — Faint grid (10% opacity) ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(168,85,247,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.10) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      {/* ── Grain texture ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
        }}
      />

      {/* ── LAYER 2 — WebGL particle intelligence cloud ──
           No opacity wrapper — brightness is controlled by the shader itself.
           The shader uses additive blending so it composites naturally. ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
      >
        <Suspense fallback={null}>
          <ParticleIntelligence />
        </Suspense>
      </div>

      {/* ── Lamp beam assembly ── */}
      <div className="absolute inset-0 flex items-start justify-center z-[5]">

        {/* Ambient bloom */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.4 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.6, ease, delay: 0.1 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          aria-hidden
          className="absolute top-0 rounded-full"
          style={{
            width: '680px',
            height: '280px',
            marginTop: '-60px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.18) 0%, transparent 70%)',
            filter: 'blur(32px)',
          }}
        />

        {/* Left conic wedge */}
        <motion.div
          initial={{ opacity: 0, width: '80px' }}
          whileInView={{ opacity: 1, width: '420px' }}
          transition={{ duration: 1.4, ease, delay: 0.15 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          aria-hidden
          className="absolute top-0 right-1/2"
          style={{
            height: '340px',
            background: 'conic-gradient(from 70deg at 100% 0%, #7C3AED 0deg, transparent 40deg)',
            maskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)',
            opacity: 0.55,
          }}
        />

        {/* Right conic wedge */}
        <motion.div
          initial={{ opacity: 0, width: '80px' }}
          whileInView={{ opacity: 1, width: '420px' }}
          transition={{ duration: 1.4, ease, delay: 0.15 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          aria-hidden
          className="absolute top-0 left-1/2"
          style={{
            height: '340px',
            background: 'conic-gradient(from 290deg at 0% 0%, transparent 0deg, #7C3AED 40deg, transparent 80deg)',
            maskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)',
            opacity: 0.55,
          }}
        />

        {/* Tight inner glow */}
        <motion.div
          initial={{ opacity: 0, width: '60px' }}
          whileInView={{ opacity: 1, width: '220px' }}
          transition={{ duration: 1.4, ease, delay: 0.2 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          aria-hidden
          className="absolute rounded-full"
          style={{
            top: '2px',
            height: '120px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.55) 0%, transparent 70%)',
            filter: 'blur(18px)',
          }}
        />

        {/* Fog pool */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.3 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.8, ease, delay: 0.25 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          aria-hidden
          className="absolute rounded-full"
          style={{
            top: '260px',
            width: '560px',
            height: '80px',
            background: 'rgba(139,92,246,0.18)',
            filter: 'blur(36px)',
          }}
        />

        {/* Lamp bar */}
        <motion.div
          initial={{ opacity: 0, width: '60px' }}
          whileInView={{ opacity: 1, width: '320px' }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
          viewport={{ once: true, margin: '-5% 0px' }}
          aria-hidden
          className="absolute top-0 z-20"
          style={{
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #A855F7, transparent)',
            boxShadow: '0 0 12px 2px rgba(168,85,247,0.6)',
          }}
        />
      </div>

      {/* ── Vignette — pulls edges back to black ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[6]"
        style={{
          background: 'radial-gradient(ellipse 100% 80% at 50% 120%, transparent 30%, #050505 85%)',
        }}
      />

      {/* ── Heading — above everything ── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease, delay: 0.4 }}
        viewport={{ once: true, margin: '-5% 0px' }}
        className="relative z-[10] flex flex-col items-center gap-4 px-6 pt-24 pb-14 text-center"
      >
        <h2 className="text-white font-black tracking-[-0.05em] text-5xl md:text-7xl leading-[0.9]">
          Trusted by sales teams scaling fast
        </h2>
        <p className="text-white/50 text-lg md:text-xl max-w-2xl text-center mt-3">
          Outmate powers signal-driven GTM workflows for modern revenue teams.
        </p>
      </motion.div>
    </div>
  )
}
