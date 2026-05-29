import { motion } from 'framer-motion';

export default function ClosingBrandSection() {
  return (
    <section className="relative overflow-hidden bg-black min-h-[70vh] flex items-center justify-center transform-gpu will-change-transform">
      {/* Background Line Effect with Tapering/Fading Gradient */}
      <div className="absolute inset-0 pointer-events-none">
        {/* The Repeating Lines */}
        <motion.div 
          className="absolute inset-0 opacity-[0.25]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.7) 1px, transparent 1px)`,
            backgroundSize: '8px 100%',
            maskImage: `linear-gradient(to bottom, 
              transparent 0%, 
              white 20%, 
              white 50%, 
              rgba(255,255,255,0.3) 80%, 
              transparent 100%
            )`
          }}
          animate={{
            backgroundPosition: ["0px 0px", "8px 0px"],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        {/* Depth & Tapering Overlay - simulated via multiple masks or gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60" />
      </div>

      {/* Subtle Glowing Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.12),transparent_60%)]" />
      </div>

      {/* Apple-like Glow behind text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[80%] h-[60%] bg-gradient-to-br from-purple-500/15 via-blue-500/15 to-transparent blur-[160px] opacity-40 animate-pulse transition-all duration-1000" />
      </div>

      {/* Huge Brand Typography */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6">
        <motion.h2 
          initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-[clamp(6rem,22vw,22rem)] font-black tracking-[-0.08em] leading-none uppercase text-white select-none pointer-events-none mix-blend-difference"
        >
          OUTMATE
        </motion.h2>
      </div>

      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
    </section>
  );
}
