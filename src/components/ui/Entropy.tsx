import React, { useEffect, useRef, useState, useMemo } from 'react';

/**
 * Entropy Component
 * 
 * An animated background with a particle grid that transitions from "ordered" (left)
 * to "chaotic" (right).
 * 
 * Adapts to container size, respects reduced motion, and pauses when offscreen.
 */

interface Particle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  isChaotic: boolean;
  vx: number;
  vy: number;
}

const PARTICLE_COLOR = '#312E81'; // Dark purple-blue (indigo-900)
const GRID_SIZE = 45;
const PARTICLE_SIZE = 1.5;
const CONNECT_DISTANCE = 70;

export const Entropy: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particles = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const isVisible = useRef(true);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Intersection Observer to pause when offscreen
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Handle resizing
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      setDimensions({ width, height });
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(containerRef.current);
    updateSize();

    return () => resizeObserver.disconnect();
  }, []);

  // Initialize particles when dimensions change
  useEffect(() => {
    const { width, height } = dimensions;
    if (width === 0 || height === 0) return;

    const newParticles: Particle[] = [];
    const cols = Math.ceil(width / GRID_SIZE) + 1;
    const rows = Math.ceil(height / GRID_SIZE) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * GRID_SIZE;
        const y = j * GRID_SIZE;
        const isChaotic = x > width / 2;

        newParticles.push({
          x,
          y,
          originX: x,
          originY: y,
          isChaotic,
          vx: isChaotic ? (Math.random() - 0.5) * 0.4 : 0,
          vy: isChaotic ? (Math.random() - 0.5) * 0.4 : 0,
        });
      }
    }

    particles.current = newParticles;
  }, [dimensions]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = dimensions.width * dpr;
    canvas.height = dimensions.height * dpr;
    ctx.scale(dpr, dpr);

    const draw = () => {
      if (!isVisible.current && !prefersReducedMotion) {
        requestRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Draw center divider
      ctx.beginPath();
      ctx.moveTo(dimensions.width / 2, 0);
      ctx.lineTo(dimensions.width / 2, dimensions.height);
      ctx.strokeStyle = `${PARTICLE_COLOR}25`; // Increased opacity
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);

      const pArr = particles.current;
      const count = pArr.length;

      // Update and draw particles
      for (let i = 0; i < count; i++) {
        const p = pArr[i];

        if (p.isChaotic && !prefersReducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Bounce off chaotic area boundaries
          const chaosBoundary = dimensions.width / 2;
          if (p.x < chaosBoundary || p.x > dimensions.width) p.vx *= -1;
          if (p.y < 0 || p.y > dimensions.height) p.vy *= -1;
        }

        // Draw connections
        for (let j = i + 1; j < count; j++) {
          const p2 = pArr[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < CONNECT_DISTANCE * CONNECT_DISTANCE) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / CONNECT_DISTANCE) * 0.25; // Increased connectivity alpha
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${PARTICLE_COLOR}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw particle (only if chaotic / on the right side)
        if (p.isChaotic) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, PARTICLE_SIZE, 0, Math.PI * 2);
          ctx.fillStyle = `${PARTICLE_COLOR}60`; // Increased particle alpha
          ctx.fill();
        }
      }

      if (!prefersReducedMotion) {
        requestRef.current = requestAnimationFrame(draw);
      }
    };

    if (prefersReducedMotion) {
        // Draw one frame then stop
        draw();
    } else {
        requestRef.current = requestAnimationFrame(draw);
    }

    return () => cancelAnimationFrame(requestRef.current);
  }, [dimensions, prefersReducedMotion]);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 h-full w-full pointer-events-none" 
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
        className="opacity-90"
      />
    </div>
  );
};
