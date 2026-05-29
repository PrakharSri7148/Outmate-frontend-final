'use client'

/**
 * ParticleIntelligence — WebGL GPU particle cloud
 * Living AI intelligence engine for the TrustMetrics section.
 */

import React, { useRef, useMemo, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ─── Vertex Shader ────────────────────────────────────────────────────────────
const vertexShader = /* glsl */ `
  precision highp float;

  attribute float aPhase;
  attribute float aLayer;   // 0=dust 0.5=main 1=halo
  attribute vec3  aBasePos; // original position on sphere

  uniform float uTime;
  uniform vec2  uMouse;         // NDC -1..1
  uniform float uMouseStrength;
  uniform float uScrollFade;    // 0..1

  varying float vBrightness;
  varying float vLayer;
  varying float vNormDist; // 0=center 1=edge

  // ── Simplex 3D (Ashima Arts) ─────────────────────────────────────────────
  vec3 mod289v3(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec4 mod289v4(vec4 x){return x-floor(x*(1./289.))*289.;}
  vec4 permute(vec4 x){return mod289v4(((x*34.)+1.)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C=vec2(1./6.,1./3.);
    const vec4 D=vec4(0.,.5,1.,2.);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289v3(i);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.,i1.z,i2.z,1.))
      +i.y+vec4(0.,i1.y,i2.y,1.))
      +i.x+vec4(0.,i1.x,i2.x,1.));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.+1.;
    vec4 s1=floor(b1)*2.+1.;
    vec4 sh=-step(h,vec4(0.));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
    m=m*m;
    return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  // ── Curl noise ───────────────────────────────────────────────────────────
  vec3 curlNoise(vec3 p){
    float e=0.08;
    float a,b;
    float cx,cy,cz;
    a=(snoise(vec3(p.x,p.y+e,p.z))-snoise(vec3(p.x,p.y-e,p.z)))/(2.*e);
    b=(snoise(vec3(p.x,p.y,p.z+e))-snoise(vec3(p.x,p.y,p.z-e)))/(2.*e);
    cx=a-b;
    a=(snoise(vec3(p.x,p.y,p.z+e))-snoise(vec3(p.x,p.y,p.z-e)))/(2.*e);
    b=(snoise(vec3(p.x+e,p.y,p.z))-snoise(vec3(p.x-e,p.y,p.z)))/(2.*e);
    cy=a-b;
    a=(snoise(vec3(p.x+e,p.y,p.z))-snoise(vec3(p.x-e,p.y,p.z)))/(2.*e);
    b=(snoise(vec3(p.x,p.y+e,p.z))-snoise(vec3(p.x,p.y-e,p.z)))/(2.*e);
    cz=a-b;
    return vec3(cx,cy,cz);
  }

  void main(){
    float t = uTime * 0.22;

    // ── Curl deformation ─────────────────────────────────────────────────
    vec3 nc = aBasePos * 0.5 + vec3(t*0.11, t*0.08, t*0.06);
    vec3 curl = curlNoise(nc);
    float deform = mix(0.15, 0.38, aLayer);
    vec3 pos = aBasePos + curl * deform;

    // ── Slow rotation ────────────────────────────────────────────────────
    float ry = t * 0.055;
    float rx = t * 0.035;
    float cy2=cos(ry),sy2=sin(ry);
    float cx2=cos(rx),sx2=sin(rx);
    mat3 rotY=mat3(cy2,0.,sy2, 0.,1.,0., -sy2,0.,cy2);
    mat3 rotX=mat3(1.,0.,0., 0.,cx2,-sx2, 0.,sx2,cx2);
    pos = rotY * rotX * pos;

    // ── Mouse gentle bend ────────────────────────────────────────────────
    vec4 mvPos4 = modelViewMatrix * vec4(pos, 1.0);
    vec2 sp = mvPos4.xy / max(-mvPos4.z, 0.001);
    vec2 toM = sp - uMouse;
    float md = length(toM);
    float mi = smoothstep(0.5, 0.0, md) * uMouseStrength;
    if(md > 0.001) pos += vec3(normalize(toM) * mi, 0.0);

    // ── Normalized distance from center (0=center, 1=edge) ──────────────
    // aBasePos length ranges ~0.3 to ~1.7; normalize to 0..1
    float rawLen = length(aBasePos);
    vNormDist = clamp((rawLen - 0.3) / 1.4, 0.0, 1.0);

    // ── Brightness ───────────────────────────────────────────────────────
    float coreBright = 1.0 - smoothstep(0.0, 0.5, vNormDist);
    float edgeBright = 0.3 + 0.7 * (1.0 - vNormDist);
    vBrightness = mix(edgeBright, 1.0, coreBright);
    vBrightness *= 0.8 + 0.2 * sin(uTime * 1.1 + aPhase * 6.28318);
    vBrightness *= uScrollFade;

    vLayer = aLayer;

    // ── Point size ───────────────────────────────────────────────────────
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mvPos.z;
    // Bigger at center, smaller at edges
    float sz = mix(3.5, 1.5, vNormDist);
    if(aLayer < 0.15) sz = 1.0; // dust tiny
    gl_PointSize = sz * (400.0 / dist);
    gl_PointSize = clamp(gl_PointSize, 1.0, 6.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// ─── Fragment Shader ──────────────────────────────────────────────────────────
const fragmentShader = /* glsl */ `
  precision highp float;

  varying float vBrightness;
  varying float vLayer;
  varying float vNormDist;

  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv);
    if(r > 0.5) discard;

    // Soft glow falloff — bright center, fade to edge
    float core  = 1.0 - smoothstep(0.0, 0.25, r);
    float outer = 1.0 - smoothstep(0.1, 0.5, r);
    float alpha = (core * 0.7 + outer * 0.3) * vBrightness;
    alpha = clamp(alpha, 0.0, 1.0);

    // Color gradient: center=white, mid=lightPurple, edge=deepPurple
    vec3 white       = vec3(1.0,  1.0,  1.0);
    vec3 lightPurple = vec3(0.784, 0.522, 0.988); // #C084FC
    vec3 midPurple   = vec3(0.545, 0.361, 0.965); // #8B5CF6
    vec3 deepPurple  = vec3(0.427, 0.157, 0.851); // #6D28D9

    vec3 color;
    if(vNormDist < 0.2){
      color = mix(white, lightPurple, vNormDist / 0.2);
    } else if(vNormDist < 0.55){
      color = mix(lightPurple, midPurple, (vNormDist - 0.2) / 0.35);
    } else {
      color = mix(midPurple, deepPurple, (vNormDist - 0.55) / 0.45);
    }

    // Dust layer: dimmer, cooler
    if(vLayer < 0.15){
      alpha *= 0.35;
      color = mix(color, vec3(0.663, 0.329, 0.969), 0.5);
    }

    gl_FragColor = vec4(color, alpha);
  }
`

// ─── Particle geometry ────────────────────────────────────────────────────────
function buildParticles(count: number) {
  const positions  = new Float32Array(count * 3)
  const phases     = new Float32Array(count)
  const layers     = new Float32Array(count)
  const basePosArr = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    // Fibonacci sphere for even surface distribution
    const phi   = Math.acos(1 - 2 * (i + 0.5) / count)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i

    const rng = Math.random()
    let r: number
    if (rng < 0.65) {
      // Main shell — tight band around radius 1
      r = 0.85 + Math.random() * 0.35
    } else if (rng < 0.85) {
      // Inner fill — volumetric core
      r = 0.15 + Math.random() * 0.7
    } else {
      // Outer halo — sparse wisps
      r = 1.2 + Math.random() * 0.6
    }

    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)

    positions[i * 3]     = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    basePosArr[i * 3]     = x
    basePosArr[i * 3 + 1] = y
    basePosArr[i * 3 + 2] = z

    phases[i] = Math.random() * Math.PI * 2
    layers[i] = rng < 0.04 ? 0.0 : rng < 0.85 ? 0.5 : 1.0
  }

  return { positions, phases, layers, basePosArr }
}

// ─── Inner R3F component ──────────────────────────────────────────────────────
interface ParticleCloudProps {
  count: number
  scrollFade: React.MutableRefObject<number>
  mouse: React.MutableRefObject<[number, number]>
}

function ParticleCloud({ count, scrollFade, mouse }: ParticleCloudProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const { size } = useThree()

  const { geo, mat } = useMemo(() => {
    const { positions, phases, layers, basePosArr } = buildParticles(count)

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1))
    g.setAttribute('aLayer',   new THREE.BufferAttribute(layers, 1))
    g.setAttribute('aBasePos', new THREE.BufferAttribute(basePosArr, 3))

    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime:          { value: 0 },
        uMouse:         { value: new THREE.Vector2(9999, 9999) },
        uMouseStrength: { value: 0.10 },
        uScrollFade:    { value: 1.0 },  // start fully visible
      },
      transparent: true,
      depthWrite:  false,
      depthTest:   false,
      blending:    THREE.AdditiveBlending,
    })

    return { geo: g, mat: m }
  }, [count])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    const u = (pointsRef.current.material as THREE.ShaderMaterial).uniforms
    u.uTime.value       = clock.getElapsedTime()
    u.uScrollFade.value = scrollFade.current

    const mx =  (mouse.current[0] / size.width)  * 2 - 1
    const my = -(mouse.current[1] / size.height) * 2 + 1
    u.uMouse.value.set(mx * 1.2, my * 1.2)
  })

  return <points ref={pointsRef} geometry={geo} material={mat} />
}

// ─── Public component ─────────────────────────────────────────────────────────
export default function ParticleIntelligence() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const mouse         = useRef<[number, number]>([0, 0])
  const scrollFade    = useRef(1.0)   // start at 1 — always visible

  const count = useMemo(() => {
    if (typeof window === 'undefined') return 15000
    return window.innerWidth < 768 ? 6000 : 20000
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouse.current = [e.clientX, e.clientY]
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // Scroll-driven fade: 0.6 when barely visible → 1.0 when fully in view
    const io = new IntersectionObserver(
      ([entry]) => {
        scrollFade.current = 0.6 + entry.intersectionRatio * 0.4
      },
      { threshold: Array.from({ length: 21 }, (_, i) => i / 20) }
    )
    io.observe(el)
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    return () => {
      io.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [onMouseMove])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        // No opacity wrapper — let the shader control brightness
      }}
    >
      <Canvas
        dpr={[1, Math.min(window.devicePixelRatio, 1.5)]}
        camera={{ position: [0, 0, 4.2], fov: 58, near: 0.1, far: 50 }}
        gl={{
          antialias:       false,
          alpha:           true,
          powerPreference: 'high-performance',
          stencil:         false,
          depth:           false,
        }}
        style={{ background: 'transparent', width: '100%', height: '100%' }}
      >
        <ParticleCloud count={count} scrollFade={scrollFade} mouse={mouse} />
      </Canvas>
    </div>
  )
}
