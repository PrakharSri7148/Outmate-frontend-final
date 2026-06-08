import { motion } from 'framer-motion';

export default function ClosingBrandSection() {
  return (
    <section
      style={{ background: 'linear-gradient(180deg,#0f1720 0%, #0b0b0c 100%)' }}
      className="relative overflow-hidden min-h-[70vh] flex items-center justify-center transform-gpu will-change-transform text-white"
    >
      {/* Background Line Effect with subtle tapering */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          className="absolute inset-0 opacity-[0.06] z-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.6) 1px, transparent 1px)`,
            backgroundSize: '10px 100%',
            maskImage: `linear-gradient(to bottom, transparent 0%, white 22%, white 50%, rgba(255,255,255,0.18) 78%, transparent 100%)`,
          }}
          animate={{ backgroundPosition: ['0px 0px', '10px 0px'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        />

        {/* Very light depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-08 z-0" />
      </div>

      {/* Subtle Glowing Radials */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.28),transparent_70%)] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.26),transparent_60%)] z-0" />
      </div>

      {/* Gentle glow behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-[80%] h-[60%] bg-gradient-to-br from-purple-500/30 via-blue-500/28 to-transparent blur-[140px] opacity-80 animate-pulse transition-all duration-1000 z-10" />
      </div>

      {/* Huge Brand Typography */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-6">
        <motion.h2
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(20px)' }}
          whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(6rem,22vw,22rem)] font-black tracking-[-0.08em] leading-none uppercase text-white select-none pointer-events-none mix-blend-difference"
        >
          OUTMATE
        </motion.h2>
      </div>

      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-30" />
    </section>
  );
}
