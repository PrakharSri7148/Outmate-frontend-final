import { motion } from 'framer-motion'

export default function CustomerProofSection() {
  return (
    <section className="py-28 md:py-36" style={{ background: '#FFFFFF' }}>
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">

        {/* Top label */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs tracking-[0.25em] uppercase font-medium mb-5"
          style={{ color: 'rgba(0,0,0,0.45)' }}
        >
          Customer Stories
        </motion.p>

        {/* Main heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="uppercase font-black mb-16"
          style={{
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            lineHeight: 0.9,
            letterSpacing: '-0.06em',
            color: '#0D0D0D',
          }}
        >
          How Outmate Helps<br />Revenue Teams Win
        </motion.h2>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">

          {/* ── LEFT: Testimonial card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.1 }}
            whileHover={{ y: -8 }}
            className="rounded-[28px] p-8 md:p-10 flex flex-col justify-between transition-all duration-500 cursor-default"
            style={{
              background: '#10110D',
              minHeight: '360px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
            }}
          >
            {/* Company brand */}
            <div className="mb-7">
              <span
                className="text-2xl font-semibold tracking-tight"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                REVOPS AI
              </span>
            </div>

            {/* Quote body */}
            <div className="flex-1">
              {/* Oversized quote mark */}
              <div
                className="text-5xl leading-none mb-3 select-none"
                style={{ color: 'rgba(180,108,255,0.9)', fontFamily: 'Georgia, serif' }}
              >
                &ldquo;
              </div>

              <p
                className="font-medium max-w-[1000px]"
                style={{
                  fontSize: 'clamp(1.1rem, 1.8vw, 1.75rem)',
                  lineHeight: 1.3,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                }}
              >
                Outmate quickly felt like part of our sales team. It helped us reach the right people faster, so our reps stopped guessing who to call and spent their time in real conversations that actually moved deals forward.
              </p>
            </div>

            {/* Profile */}
            <div className="flex items-center gap-3 mt-10">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)',
                  border: '2px solid rgba(255,255,255,0.15)',
                }}
              >
                MW
              </div>
              <div>
                <div className="text-base font-semibold text-white">Mark White</div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  Founder at RevScale
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── RIGHT: Metric card ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="rounded-[28px] p-8 relative overflow-hidden flex flex-col transition-all duration-500 cursor-default"
            style={{
              background: '#ECECE8',
              minHeight: '360px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
            }}
          >
            {/* Diagonal stripe pattern — top-right corner */}
            <div
              className="absolute top-0 right-0 w-[260px] h-[260px] pointer-events-none"
              style={{ opacity: 0.6 }}
              aria-hidden="true"
            >
              <svg
                width="260"
                height="260"
                viewBox="0 0 260 260"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="stripeGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#A855F7" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="#818CF8" stopOpacity="0.15" />
                  </linearGradient>
                </defs>
                {/* Diagonal stripes */}
                {[0, 22, 44, 66, 88, 110, 132, 154, 176, 198, 220, 242].map((offset, i) => (
                  <line
                    key={i}
                    x1={offset}
                    y1="0"
                    x2={offset + 260}
                    y2="260"
                    stroke="url(#stripeGrad)"
                    strokeWidth="14"
                  />
                ))}
              </svg>
            </div>

            {/* Metric number */}
            <div className="relative z-10 mt-4">
              <span
                className="font-black block"
                style={{
                  fontSize: 'clamp(3rem, 6vw, 4.5rem)',
                  lineHeight: 1,
                  letterSpacing: '-0.08em',
                  color: '#0D0D0D',
                }}
              >
                +312%
              </span>
            </div>

            {/* Metric description — pinned to bottom */}
            <div className="absolute bottom-8 left-8 right-8 z-10">
              <p
                className="font-medium leading-tight"
                style={{
                  fontSize: 'clamp(1.1rem, 1.5vw, 1.4rem)',
                  color: '#111111',
                }}
              >
                Increase in qualified pipeline
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
