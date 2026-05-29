import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const easing = [0.22, 1, 0.36, 1] as const

const headingLines = [
  { text: 'IDENTIFY', color: '#FFFFFF' },
  { text: '70–80%', color: '#FFFFFF' },
  { text: 'OF YOUR', color: '#303030' },
  { text: 'WEBSITE', color: '#FFFFFF' },
  { text: 'TRAFFIC.', color: '#FFFFFF' },
]

function ManifestoHeading({ isInView }: { isInView: boolean }) {
  return (
    <div className="relative ml-auto flex w-fit flex-col items-end gap-0 text-right">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 100% 80% at 10% 50%, rgba(139,92,246,0.07) 0%, transparent 65%)',
          filter: 'blur(48px)',
        }}
      />
      {headingLines.map((line, i) => (
        <motion.h2
          key={i}
          initial={{ opacity: 0, y: 36, filter: 'blur(6px)' }}
          animate={
            isInView
              ? { opacity: 1, y: 0, filter: 'blur(0px)' }
              : { opacity: 0, y: 36, filter: 'blur(6px)' }
          }
          transition={{ duration: 0.9, ease: easing, delay: i * 0.09 }}
          className="relative font-black leading-[0.88] tracking-[-0.07em] select-none"
          style={{
            fontSize: 'clamp(3rem, 6.5vw, 7rem)',
            color: line.color,
            textShadow:
              line.color === '#FFFFFF'
                ? '0 1px 32px rgba(255,255,255,0.05), 0 1px 0 rgba(0,0,0,0.9)'
                : 'none',
          }}
        >
          {line.text}
        </motion.h2>
      ))}

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.8, ease: easing, delay: 0.6 }}
        className="mt-6 font-mono text-xs text-white/30 tracking-widest uppercase"
      >
        GTM Intelligence Platform
      </motion.p>
    </div>
  )
}

export default function PipelineTerminal() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-8%' })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: 'rgba(0, 0, 0, 0.55)' }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, #000000, transparent)' }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to bottom, transparent, #000000)' }}
      />

      <div
        className="
          relative z-20
          max-w-[1600px] mx-auto
          px-8 md:px-16
          py-28 md:py-36
          flex
          items-start
        "
      >
        <div className="w-full flex justify-end">
          <ManifestoHeading isInView={isInView} />
        </div>
      </div>
    </section>
  )
}
