import React, { useEffect, useRef, useState, useCallback } from 'react';
import Spline from '@splinetool/react-spline';

export default function SplineScrollBackground({
  sceneUrl,
  fadeOnScroll = true,
  overlayColor = 'transparent',
  children,
}) {
  const [opacity, setOpacity] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const wrapperRef = useRef(null);

  const handleScroll = useCallback(() => {
    if (!fadeOnScroll) return;
    const scrollY = window.scrollY;
    const vh = window.innerHeight;
    const newOpacity = Math.max(0, 1 - scrollY / (vh * 0.8));
    setOpacity(newOpacity);
  }, [fadeOnScroll]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          pointerEvents: 'none', willChange: 'opacity',
          opacity: loaded ? opacity : 0,
          transition: loaded ? 'opacity 0.05s linear' : 'opacity 0.6s ease',
        }}
        aria-hidden="true"
      >
        <Spline
          scene="https://prod.spline.design/DmLlfPc-odLWNeAQ/scene.splinecode"
          onLoad={() => setLoaded(true)}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {overlayColor !== 'transparent' && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none', background: overlayColor }} aria-hidden="true" />
      )}

      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </div>
  );
}
