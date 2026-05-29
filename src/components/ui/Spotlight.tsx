import { useRef, useState, useCallback } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface SpotlightProps {
  className?: string
  /** Glow color – defaults to soft white */
  color?: string
  /** Glow radius in px */
  size?: number
}

export function Spotlight({
  className = '',
  color = 'rgba(255,255,255,0.12)',
  size = 400,
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Spring-physics mouse tracking
  const mouseX = useSpring(0, { stiffness: 120, damping: 24, mass: 0.8 })
  const mouseY = useSpring(0, { stiffness: 120, damping: 24, mass: 0.8 })

  const opacity = useSpring(0, { stiffness: 100, damping: 20 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  const handleMouseEnter = () => {
    setIsHovered(true)
    opacity.set(1)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    opacity.set(0)
  }

  // Build the radial gradient position from spring values
  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]: number[]) =>
      `radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 70%)`
  )

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute inset-0 overflow-hidden pointer-events-auto ${className}`}
      style={{ zIndex: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ background, opacity }}
      />
    </div>
  )
}
