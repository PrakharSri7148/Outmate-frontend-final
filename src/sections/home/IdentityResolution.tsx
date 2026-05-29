import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// ─── Scan frame around the face ───────────────────────────────────────────────
function ScanFrame({ scrollProgress }: { scrollProgress: ReturnType<typeof useTransform<number, number>> }) {
  const opacity = useTransform(scrollProgress, [0.1, 0.35], [0, 1])
  const scale   = useTransform(scrollProgress, [0.1, 0.35], [1.08, 1])

  return (
    <motion.div
      style={{ opacity, scale }}
      className="absolute inset-0 pointer-events-none"
    >
      {/* Main detection square — centered on face area */}
      <div
        className="absolute"
        style={{ top: '12%', left: '18%', right: '18%', bottom: '28%' }}
      >
        {/* Corner brackets */}
        {(['tl','tr','bl','br'] as const).map((corner) => (
          <div
            key={corner}
            className="absolute w-5 h-5"
            style={{
              top:    corner.startsWith('t') ? 0 : 'auto',
              bottom: corner.startsWith('b') ? 0 : 'auto',
              left:   corner.endsWith('l')   ? 0 : 'auto',
              right:  corner.endsWith('r')   ? 0 : 'auto',
              borderTop:    corner.startsWith('t') ? '1.5px solid rgba(255,255,255,0.7)' : 'none',
              borderBottom: corner.startsWith('b') ? '1.5px solid rgba(255,255,255,0.7)' : 'none',
              borderLeft:   corner.endsWith('l')   ? '1.5px solid rgba(255,255,255,0.7)' : 'none',
              borderRight:  corner.endsWith('r')   ? '1.5px solid rgba(255,255,255,0.7)' : 'none',
            }}
          />
        ))}

        {/* Pulsing border */}
        <motion.div
          className="absolute inset-0 rounded-sm border border-white/20"
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Scan line sweeping down */}
        <motion.div
          className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        {/* Center crosshair dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/60"
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

// ─── Connection lines from thumbnail to main frame ────────────────────────────
function ConnectionLines({ scrollProgress }: { scrollProgress: ReturnType<typeof useTransform<number, number>> }) {
  const opacity = useTransform(scrollProgress, [0.2, 0.45], [0, 1])

  return (
    <motion.svg
      style={{ opacity }}
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
        </linearGradient>
        <linearGradient id="lineGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
        </linearGradient>
      </defs>
      {/* Line 1: thumbnail top-right → detection frame bottom-left */}
      <motion.path
        d="M 22 72 C 35 72, 28 30, 36 28"
        fill="none"
        stroke="url(#lineGrad1)"
        strokeWidth="0.3"
        strokeDasharray="2 1.5"
        animate={{ strokeDashoffset: [0, -8] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      />
      {/* Line 2: thumbnail top-right → detection frame bottom-right */}
      <motion.path
        d="M 26 70 C 42 68, 50 40, 64 28"
        fill="none"
        stroke="url(#lineGrad2)"
        strokeWidth="0.25"
        strokeDasharray="2 2"
        animate={{ strokeDashoffset: [0, -10] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'linear' }}
      />
    </motion.svg>
  )
}

// ─── The main portrait visual ─────────────────────────────────────────────────
function PortraitVisual({ scrollProgress }: { scrollProgress: ReturnType<typeof useTransform<number, number>> }) {
  // As scroll increases: blur goes 14px → 0, pixelation resolves, opacity rises
  const blurValue  = useTransform(scrollProgress, [0, 0.6], [14, 0])
  const imgOpacity = useTransform(scrollProgress, [0, 0.25], [0.3, 1])
  const overlayOp  = useTransform(scrollProgress, [0, 0.5], [0.85, 0])

  // Combine blur into a filter string
  const filterValue = useTransform(blurValue, (b) => `blur(${b}px) saturate(${1 + (14 - b) * 0.04})`)

  return (
    <div className="relative w-full h-full flex items-center justify-center">

      {/* ── Ambient gradient backdrop — dark card, soft lavender glow ── */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {/* Soft lavender blob — reduced opacity vs original */}
        <div className="absolute -top-20 -left-10 w-[420px] h-[420px] rounded-full bg-[#7C3AED]/12 blur-[100px]" />
        {/* Subtle teal blob */}
        <div className="absolute top-1/3 -right-10 w-[300px] h-[380px] rounded-full bg-[#00C2FF]/06 blur-[90px]" />
        {/* Bottom ambient */}
        <div className="absolute -bottom-10 left-1/4 w-[350px] h-[280px] rounded-full bg-[#7C3AED]/08 blur-[80px]" />
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
          }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* ── Main portrait image ── */}
      <div className="relative z-10 w-[340px] md:w-[400px] lg:w-[440px] aspect-[3/4]">

        {/* Pixelation / blur resolve layer */}
        <motion.div
          style={{ filter: filterValue, opacity: imgOpacity }}
          className="absolute inset-0 rounded-2xl overflow-hidden"
        >
          <img
            src="/images/identity-model.jpg"
            alt="Visitor identified"
            className="w-full h-full object-cover object-[center_15%]"
            draggable={false}
          />
          {/* Subtle color grade — reduced saturation vs original */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/18 via-transparent to-[#00C2FF]/12 mix-blend-color" />
        </motion.div>

        {/* Pixelation mosaic overlay — fades out as image resolves */}
        <motion.div
          style={{ opacity: overlayOp }}
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
        >
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `url("/images/visitor-profiles.jpg")`,
              backgroundSize: 'cover',
              backgroundPosition: '15% center',
              imageRendering: 'pixelated',
              filter: 'blur(2px) contrast(1.1)',
              transform: 'scale(1.02)',
            }}
          />
          <div className="absolute inset-0 bg-[#050505]/40" />
        </motion.div>

        {/* Scan frame */}
        <ScanFrame scrollProgress={scrollProgress} />

        {/* Connection lines */}
        <ConnectionLines scrollProgress={scrollProgress} />

        {/* ── Thumbnail (lower-left) ── */}
        <motion.div
          style={{ opacity: useTransform(scrollProgress, [0.15, 0.4], [0, 1]) }}
          className="absolute -left-16 bottom-[18%] w-[72px] h-[90px] rounded-xl overflow-hidden border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <img
            src="/images/identity-model.jpg"
            alt="Identity thumbnail"
            className="w-full h-full object-cover object-[center_15%]"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/15 to-[#00C2FF]/08" />
          {/* Thumbnail label */}
          <div className="absolute bottom-0 inset-x-0 px-1.5 py-1 bg-black/60 backdrop-blur-sm">
            <span className="text-[8px] text-white/60 font-mono block text-center leading-tight">source</span>
          </div>
        </motion.div>

      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function IdentityResolution() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end 0.2'],
  })

  // Left side parallax
  const leftY = useTransform(scrollYProgress, [0, 1], [30, -20])

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden min-h-[90vh] flex items-center"
      style={{ backgroundColor: '#F6F6F4' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-12 -right-10 h-[300px] w-[320px] rounded-[28px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(163,132,214,0.22) 0%, rgba(163,132,214,0.16) 100%), repeating-linear-gradient(135deg, rgba(255,255,255,0.38) 0px, rgba(255,255,255,0.38) 2px, transparent 2px, transparent 20px)',
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 38% 100%)',
          }}
        />
        <div
          className="absolute -bottom-16 -left-16 h-[220px] w-[240px] rounded-[22px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(163,132,214,0.14) 0%, rgba(163,132,214,0.08) 100%), repeating-linear-gradient(135deg, rgba(255,255,255,0.28) 0px, rgba(255,255,255,0.28) 2px, transparent 2px, transparent 18px)',
            clipPath: 'polygon(0 0, 100% 38%, 100% 100%, 0 100%)',
          }}
        />
      </div>

      {/* ── Subtle editorial grid ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        {/* Very soft top separator */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
        {/* Very soft bottom separator */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
      </div>

      {/* ── Content grid ── */}
      <div className="container-limit relative z-10 w-full py-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── LEFT: Messaging ── */}
          <motion.div
            style={{ y: leftY }}
            className="flex flex-col gap-8"
          >
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              <span className="text-[11px] font-mono text-black/40 uppercase tracking-[0.22em]">
                Real-Time Visitor Intelligence
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black leading-[0.9] tracking-[-0.07em]"
              style={{ fontSize: 'clamp(3.2rem, 7vw, 6.5rem)', color: '#0D0D0D' }}
            >
              Turn anonymous
              <br />
              <span style={{ color: '#0D0D0D', opacity: 0.28 }}>traffic into</span>
              <br />
              identified pipeline.
            </motion.h2>

            {/* Body */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="text-xl leading-relaxed max-w-xl"
              style={{ color: '#3D3D3D' }}
            >
              Outmate identifies high-intent visitors, enriches decision-maker data,
              and activates outbound workflows before competitors even know the account exists.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-4 flex-wrap"
            >
              {/* Primary button */}
              <button
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium text-[15px] transition-all duration-200"
                style={{ backgroundColor: '#111111', color: '#ffffff' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#2a2a2a')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#111111')}
              >
                <span>See platform</span>
                <svg className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 16 16">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Secondary button */}
              <button
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-medium text-[15px] transition-all duration-200"
                style={{ border: '1px solid rgba(0,0,0,0.10)', color: '#111111', backgroundColor: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Documentation
              </button>
            </motion.div>

            {/* Social proof micro-stat */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-6 pt-2"
            >
              {[['2,400+', 'Companies identified'], ['97%', 'Match accuracy'], ['<2s', 'Resolution time']].map(([val, lbl]) => (
                <div key={lbl} className="flex flex-col gap-0.5">
                  <span className="text-xl font-bold font-mono tracking-tight" style={{ color: '#0D0D0D' }}>{val}</span>
                  <span className="text-xs" style={{ color: 'rgba(0,0,0,0.35)' }}>{lbl}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Portrait visual — stays dark for contrast ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[520px] md:h-[620px] lg:h-[680px]"
          >
            <PortraitVisual scrollProgress={scrollYProgress} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
