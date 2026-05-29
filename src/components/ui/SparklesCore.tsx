"use client";
import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  particleSize?: number;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export const SparklesCore = (props: ParticlesProps) => {
  const {
    id,
    className,
    background,
    minSize = 0.4,
    maxSize = 1.2,
    speed = 0.5,
    particleColor = "#ffffff",
    particleDensity = 120,
  } = props;

  const [init, setInit] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      transition: {
        duration: 1,
      },
    });
  }, [controls]);

  return (
    <motion.div animate={controls} className={`relative ${className}`}>
      <CanvasParticles
        id={id}
        background={background}
        minSize={minSize}
        maxSize={maxSize}
        speed={speed}
        particleColor={particleColor}
        particleDensity={particleDensity}
      />
    </motion.div>
  );
};

const CanvasParticles = ({
  id,
  background,
  minSize,
  maxSize,
  speed,
  particleColor,
  particleDensity,
}: any) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;
    let w = canvas.width;
    let h = canvas.height;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        w = canvas.width = parent.clientWidth;
        h = canvas.height = parent.clientHeight;
      } else {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
      }
      initParticles();
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeSpeed: number;

      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * (maxSize - minSize) + minSize;
        this.speedX = (Math.random() - 0.5) * speed;
        this.speedY = (Math.random() - 0.5) * speed;
        this.opacity = Math.random();
        this.fadeSpeed = Math.random() * 0.02 * speed;
      }

      update() {
        this.x += this.speedX;
        this.y -= this.speedY; // move upwards slightly
        this.opacity += this.fadeSpeed;

        if (this.opacity > 1 || this.opacity < 0) {
          this.fadeSpeed = -this.fadeSpeed;
        }

        if (this.x > w) this.x = 0;
        if (this.x < 0) this.x = w;
        if (this.y > h) this.y = 0;
        if (this.y < 0) this.y = h;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        // Use the passed color and append opacity
        // Assumes hex color, parsing logic
        ctx.fillStyle = `${particleColor}${Math.floor(this.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.floor((w * h) / 10000) * (particleDensity / 50);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      if (background && background !== "transparent") {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);
      }
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [maxSize, minSize, particleColor, particleDensity, speed, background]);

  return <canvas ref={canvasRef} id={id} className="absolute inset-0 w-full h-full pointer-events-none" />;
};
