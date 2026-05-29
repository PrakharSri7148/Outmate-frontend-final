import { motion } from 'framer-motion'
import { SparklesCore } from '../../components/ui/SparklesCore'

export default function BuyerSignalsHero() {
  return (
    <section className="w-full min-h-[70vh] bg-[#050505] flex flex-col items-center justify-center overflow-hidden pt-20 pb-10">

      {/* ── Badge ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 relative z-20"
      >
        <div className="w-1.5 h-1.5 rounded-full bg-purple animate-pulse" />
        <span className="text-[11px] font-mono font-medium tracking-widest text-zinc-400 uppercase">
          Live Buyer Signals
        </span>
      </motion.div>

      {/* ── Headline ── */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-center relative z-20 mb-2"
      >
        <span className="bg-gradient-to-b from-white via-white to-zinc-500 bg-clip-text text-transparent">
          Every anonymous visitor<br className="hidden md:block" /> leaves a signal.
        </span>
      </motion.h1>

      {/* ── Concentrated Sparkle Energy Field ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="w-full max-w-[40rem] h-40 relative mt-4 mb-8"
      >
        {/* Layered glowing beams (adapted for premium Apple/Linear look) */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-purple/40 to-transparent h-[2px] w-3/4 mx-auto blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-white/40 to-transparent h-px w-3/4 mx-auto" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-white/80 to-transparent h-[5px] w-1/4 mx-auto blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-white to-transparent h-px w-1/4 mx-auto" />

        {/* High-density Sparkle Core */}
        <SparklesCore
          id="outmateBuyerSignalsLine"
          background="transparent"
          minSize={0.4}
          maxSize={1.2}
          particleDensity={800}
          className="w-full h-full"
          particleColor="#ffffff"
          speed={0.4}
        />

        {/* Radial mask to fade out the particles at the bottom and edges */}
        <div className="absolute inset-0 w-full h-full bg-[#050505] [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]" />
      </motion.div>

      {/* ── Subtext ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 text-center px-4"
      >
        <p className="text-lg md:text-xl text-zinc-400 max-w-[700px] mx-auto leading-relaxed">
          Outmate captures intent signals in real time — <br className="hidden sm:block" />
          before your competitors even know they exist.
        </p>
      </motion.div>

      {/* ── Bottom Transition Fade ── */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-void to-transparent pointer-events-none" />
    </section>
  )
}
