import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const floatingLabels = [
  { text: 'Identity Resolution', x: '2%', y: '12%', delay: 0 },
  { text: 'Real-time Matching', x: '72%', y: '8%', delay: 0.8 },
  { text: 'Intent Signals', x: '78%', y: '82%', delay: 1.6 },
  { text: 'Buyer Graph', x: '0%', y: '78%', delay: 2.4 },
  { text: 'Person-level Detection', x: '30%', y: '92%', delay: 3.2 },
]

export default function CpuArchitecture() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="relative w-full" style={{ maxWidth: 620 }}>
      {/* Ambient glow behind */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04), transparent 70%)',
          filter: 'blur(60px)',
          transform: 'scale(1.3)',
        }}
      />

      {/* Background animated blurred gradients */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '60%',
          height: '60%',
          top: '10%',
          left: '5%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.06), transparent 70%)',
          filter: 'blur(80px)',
          borderRadius: '50%',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: '50%',
          height: '50%',
          bottom: '5%',
          right: '5%',
          background: 'radial-gradient(circle, rgba(125,211,252,0.05), transparent 70%)',
          filter: 'blur(70px)',
          borderRadius: '50%',
        }}
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Glass container */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
        style={{
          borderRadius: 32,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.06), 0 0 80px rgba(255,255,255,0.02), 0 20px 60px rgba(0,0,0,0.3)',
          padding: '32px',
          overflow: 'hidden',
        }}
      >
        {/* Subtle inner ambient light */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: '70%',
            height: '200px',
            background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.04), transparent 70%)',
          }}
        />

        {/* Main SVG Architecture */}
        <svg
          viewBox="0 0 520 420"
          className="w-full h-auto relative z-10"
          style={{ filter: 'saturate(0.85)' }}
        >
          <defs>
            {/* Titanium-toned gradients */}
            <linearGradient id="cpuGrad1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="cpuGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.95)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#71717A" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="cpuGrad3" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#3F3F46" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="cpuGradLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.5)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <linearGradient id="pathGlow1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7DD3FC" stopOpacity="0" />
              <stop offset="50%" stopColor="#7DD3FC" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7DD3FC" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="pathGlow2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A78BFA" stopOpacity="0" />
              <stop offset="50%" stopColor="#A78BFA" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#A78BFA" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="pathGlow3" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0" />
              <stop offset="50%" stopColor="#67E8F9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#67E8F9" stopOpacity="0" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
            </filter>
            <filter id="chipGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="8" />
            </filter>

            {/* Mask for animated paths */}
            <mask id="flowMask1">
              <motion.rect
                x="-80"
                y="-20"
                width="80"
                height="40"
                fill="white"
                animate={mounted ? { x: [-80, 600] } : {}}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 0 }}
              />
            </mask>
            <mask id="flowMask2">
              <motion.rect
                x="-20"
                y="-80"
                width="40"
                height="80"
                fill="white"
                animate={mounted ? { y: [-80, 500] } : {}}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 1.5 }}
              />
            </mask>
            <mask id="flowMask3">
              <motion.rect
                x="-80"
                y="-20"
                width="80"
                height="40"
                fill="white"
                animate={mounted ? { x: [600, -80] } : {}}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear', delay: 3 }}
              />
            </mask>
            <mask id="flowMask4">
              <motion.rect
                x="-20"
                y="-80"
                width="40"
                height="80"
                fill="white"
                animate={mounted ? { y: [500, -80] } : {}}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
              />
            </mask>
          </defs>

          {/* Outer frame lines */}
          <rect
            x="40"
            y="30"
            width="440"
            height="360"
            rx="24"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
          <rect
            x="60"
            y="50"
            width="400"
            height="320"
            rx="16"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="0.5"
          />

          {/* Architecture bus lines - horizontal */}
          {[100, 150, 210, 270, 320].map((y, i) => (
            <g key={`h-${i}`}>
              <line
                x1="70"
                y1={y}
                x2="450"
                y2={y}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
              {/* Animated light flow */}
              <line
                x1="70"
                y1={y}
                x2="450"
                y2={y}
                stroke={`url(#pathGlow${(i % 3) + 1})`}
                strokeWidth="1.5"
                mask={`url(#flowMask${(i % 4) + 1})`}
              />
            </g>
          ))}

          {/* Architecture bus lines - vertical */}
          {[120, 200, 260, 320, 400].map((x, i) => (
            <g key={`v-${i}`}>
              <line
                x1={x}
                y1="40"
                x2={x}
                y2="380"
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
              />
              <line
                x1={x}
                y1="40"
                x2={x}
                y2="380"
                stroke={`url(#pathGlow${(i % 3) + 1})`}
                strokeWidth="1.5"
                mask={`url(#flowMask${((i + 2) % 4) + 1})`}
              />
            </g>
          ))}

          {/* Central chip - OUTMATE */}
          <g>
            {/* Chip glow */}
            <rect
              x="170"
              y="145"
              width="180"
              height="130"
              rx="20"
              fill="rgba(167,139,250,0.08)"
              filter="url(#chipGlow)"
            />
            {/* Chip body */}
            <rect
              x="180"
              y="155"
              width="160"
              height="110"
              rx="16"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            {/* Inner border */}
            <rect
              x="188"
              y="163"
              width="144"
              height="94"
              rx="12"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
              strokeDasharray="4 4"
            />
            {/* OUTMATE text */}
            <text
              x="260"
              y="203"
              textAnchor="middle"
              fill="rgba(255,255,255,0.9)"
              fontSize="16"
              fontFamily="'Space Grotesk', sans-serif"
              fontWeight="600"
              letterSpacing="4"
            >
              OUTMATE
            </text>
            {/* Sub-label */}
            <text
              x="260"
              y="225"
              textAnchor="middle"
              fill="rgba(255,255,255,0.35)"
              fontSize="8"
              fontFamily="'Inter', sans-serif"
              fontWeight="400"
              letterSpacing="2"
            >
              IDENTITY ENGINE
            </text>

            {/* Chip connection pins - top */}
            {[205, 225, 245, 265, 275, 295, 315].map((x, i) => (
              <line
                key={`pt-${i}`}
                x1={x}
                y1="155"
                x2={x}
                y2="140"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
            {/* Chip connection pins - bottom */}
            {[205, 225, 245, 265, 275, 295, 315].map((x, i) => (
              <line
                key={`pb-${i}`}
                x1={x}
                y1="265"
                x2={x}
                y2="280"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
            {/* Chip connection pins - left */}
            {[180, 200, 220, 240].map((y, i) => (
              <line
                key={`pl-${i}`}
                x1="180"
                y1={y}
                x2="165"
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
            {/* Chip connection pins - right */}
            {[180, 200, 220, 240].map((y, i) => (
              <line
                key={`pr-${i}`}
                x1="340"
                y1={y}
                x2="355"
                y2={y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Peripheral modules */}
          {/* Top-left: IP Resolution */}
          <g>
            <rect
              x="75"
              y="55"
              width="100"
              height="50"
              rx="10"
              fill="rgba(255,255,255,0.025)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
            <text x="125" y="77" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="'Inter', sans-serif" letterSpacing="1">
              IP RESOLVE
            </text>
            <text x="125" y="92" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="'Inter', sans-serif">
              173+ Regions
            </text>
          </g>

          {/* Top-right: Device Graph */}
          <g>
            <rect
              x="345"
              y="55"
              width="100"
              height="50"
              rx="10"
              fill="rgba(255,255,255,0.025)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
            <text x="395" y="77" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="'Inter', sans-serif" letterSpacing="1">
              DEVICE GRAPH
            </text>
            <text x="395" y="92" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="'Inter', sans-serif">
              Cross-ref Engine
            </text>
          </g>

          {/* Bottom-left: Publisher Net */}
          <g>
            <rect
              x="75"
              y="315"
              width="100"
              height="50"
              rx="10"
              fill="rgba(255,255,255,0.025)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
            <text x="125" y="337" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="'Inter', sans-serif" letterSpacing="1">
              PUBLISHER NET
            </text>
            <text x="125" y="352" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="'Inter', sans-serif">
              10K+ Partners
            </text>
          </g>

          {/* Bottom-right: Signal Enrich */}
          <g>
            <rect
              x="345"
              y="315"
              width="100"
              height="50"
              rx="10"
              fill="rgba(255,255,255,0.025)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.5"
            />
            <text x="395" y="337" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="'Inter', sans-serif" letterSpacing="1">
              SIGNAL ENRICH
            </text>
            <text x="395" y="352" textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize="6" fontFamily="'Inter', sans-serif">
              Behavioral AI
            </text>
          </g>

          {/* Mid-left: Data Bus */}
          <g>
            <rect
              x="70"
              y="180"
              width="80"
              height="60"
              rx="10"
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
            <text x="110" y="207" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="'Inter', sans-serif" letterSpacing="1">
              DATA BUS
            </text>
            <text x="110" y="222" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="6" fontFamily="'Inter', sans-serif">
              64-bit Stream
            </text>
          </g>

          {/* Mid-right: Output */}
          <g>
            <rect
              x="370"
              y="180"
              width="80"
              height="60"
              rx="10"
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
            <text x="410" y="207" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="'Inter', sans-serif" letterSpacing="1">
              OUTPUT
            </text>
            <text x="410" y="222" textAnchor="middle" fill="rgba(255,255,255,0.18)" fontSize="6" fontFamily="'Inter', sans-serif">
              CRM / Slack / API
            </text>
          </g>

          {/* Animated pulse markers at intersections */}
          {[
            { cx: 200, cy: 150 },
            { cx: 320, cy: 150 },
            { cx: 120, cy: 210 },
            { cx: 400, cy: 210 },
            { cx: 200, cy: 270 },
            { cx: 320, cy: 270 },
            { cx: 260, cy: 100 },
            { cx: 260, cy: 320 },
          ].map((pt, i) => (
            <g key={`marker-${i}`}>
              <motion.circle
                cx={pt.cx}
                cy={pt.cy}
                r="3"
                fill="rgba(125,211,252,0.3)"
                filter="url(#softGlow)"
                animate={{ r: [2, 4, 2], opacity: [0.3, 0.7, 0.3] }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.5,
                }}
              />
              <circle
                cx={pt.cx}
                cy={pt.cy}
                r="1.5"
                fill="rgba(255,255,255,0.6)"
              />
            </g>
          ))}

          {/* Diagonal data flow paths */}
          <motion.path
            d="M125 105 L200 155"
            stroke="url(#pathGlow1)"
            strokeWidth="1"
            fill="none"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.path
            d="M395 105 L320 155"
            stroke="url(#pathGlow2)"
            strokeWidth="1"
            fill="none"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
          <motion.path
            d="M125 315 L200 265"
            stroke="url(#pathGlow3)"
            strokeWidth="1"
            fill="none"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          />
          <motion.path
            d="M395 315 L320 265"
            stroke="url(#pathGlow1)"
            strokeWidth="1"
            fill="none"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />

          {/* Central emanating rings */}
          <motion.circle
            cx="260"
            cy="210"
            r="50"
            fill="none"
            stroke="rgba(167,139,250,0.08)"
            strokeWidth="0.5"
            animate={{ r: [50, 70, 50], opacity: [0.08, 0.15, 0.08] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.circle
            cx="260"
            cy="210"
            r="80"
            fill="none"
            stroke="rgba(125,211,252,0.05)"
            strokeWidth="0.5"
            animate={{ r: [80, 100, 80], opacity: [0.05, 0.1, 0.05] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          />
        </svg>

        {/* Floating glass labels */}
        {floatingLabels.map((label, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left: label.x,
              top: label.y,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: [0.5, 0.8, 0.5],
              y: [0, -3, 0],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: label.delay,
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 100,
                padding: '5px 12px',
                fontSize: 10,
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              {label.text}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
