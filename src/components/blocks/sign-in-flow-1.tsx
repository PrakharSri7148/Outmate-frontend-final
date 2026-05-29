"use client";

import React, { useState,useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import * as THREE from "three";

type Uniforms = {
  [key: string]: {
    value: number[] | number[][] | number;
    type: string;
  };
};

interface ShaderProps {
  source: string;
  uniforms: {
    [key: string]: {
      value: number[] | number[][] | number;
      type: string;
    };
  };
  maxFps?: number;
}

interface SignInPageProps {
  className?: string;
}
      
export const CanvasRevealEffect = ({
  animationSpeed = 10,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
  reverse = false, // This controls the direction
}: {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
  reverse?: boolean; // This prop determines the direction
}) => {
  return (
    <div className={cn("h-full relative w-full", containerClassName)}> {/* Removed bg-white */}
      <div className="h-full w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          // Pass reverse state and speed via string flags in the empty shader prop
          shader={`
            ${reverse ? 'u_reverse_active' : 'false'}_;
            animation_speed_factor_${animationSpeed.toFixed(1)}_;
          `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        // Adjust gradient colors if needed based on background (was bg-white, now likely uses containerClassName bg)
        // Example assuming a dark background like the SignInPage uses:
         <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      )}
    </div>
  );
};

    
interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 20,
  dotSize = 2,
  shader = "", // This shader string will now contain the animation logic
  center = ["x", "y"],
}) => {
  // ... uniforms calculation remains the same for colors, opacities, etc.
  const uniforms = React.useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }
    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
      u_reverse: {
        value: shader.includes("u_reverse_active") ? 1 : 0, // Convert boolean to number (1 or 0)
        type: "uniform1i", // Use 1i for bool in WebGL1/GLSL100, or just bool for GLSL300+ if supported
      },
    };
  }, [colors, opacities, totalSize, dotSize, shader]); // Add shader to dependencies

  return (
    <Shader
      // The main animation logic is now built *outside* the shader prop
      source={`
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        uniform int u_reverse; // Changed from bool to int

        out vec4 fragColor;

        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }

        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }

            float opacity = step(0.0, st.x);
            opacity *= step(0.0, st.y);

            vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

            float frequency = 5.0;
            float show_offset = random(st2); // Used for initial opacity random pick and color
            float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency));
            opacity *= u_opacities[int(rand * 10.0)];
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
            opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

            vec3 color = u_colors[int(show_offset * 6.0)];

            // --- Animation Timing Logic ---
            float animation_speed_factor = 0.5; // Extract speed from shader string
            vec2 center_grid = u_resolution / 2.0 / u_total_size;
            float dist_from_center = distance(center_grid, st2);

            // Calculate timing offset for Intro (from center)
            float timing_offset_intro = dist_from_center * 0.01 + (random(st2) * 0.15);

            // Calculate timing offset for Outro (from edges)
            // Max distance from center to a corner of the grid
            float max_grid_dist = distance(center_grid, vec2(0.0, 0.0));
            float timing_offset_outro = (max_grid_dist - dist_from_center) * 0.02 + (random(st2 + 42.0) * 0.2);


            float current_timing_offset;
            if (u_reverse == 1) {
                current_timing_offset = timing_offset_outro;
                 // Outro logic: opacity starts high, goes to 0 when time passes offset
                 opacity *= 1.0 - step(current_timing_offset, u_time * animation_speed_factor);
                 // Clamp for fade-out transition
                 opacity *= clamp((step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            } else {
                current_timing_offset = timing_offset_intro;
                 // Intro logic: opacity starts 0, goes to base opacity when time passes offset
                 opacity *= step(current_timing_offset, u_time * animation_speed_factor);
                 // Clamp for fade-in transition
                 opacity *= clamp((1.0 - step(current_timing_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            }


            fragColor = vec4(color, opacity);
            fragColor.rgb *= fragColor.a; // Premultiply alpha
        }`}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};


const ShaderMaterial = ({
  source,
  uniforms,
}: {
  source: string;
  hovered?: boolean;
  maxFps?: number;
  uniforms: Uniforms;
}) => {
  const { size } = useThree();
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const timestamp = clock.getElapsedTime();

    const material: any = ref.current.material;
    const timeLocation = material.uniforms.u_time;
    timeLocation.value = timestamp;
  });

  const getUniforms = () => {
    const preparedUniforms: any = {};

    for (const uniformName in uniforms) {
      const uniform: any = uniforms[uniformName];

      switch (uniform.type) {
        case "uniform1f":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1f" };
          break;
        case "uniform1i":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1i" };
          break;
        case "uniform3f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector3().fromArray(uniform.value),
            type: "3f",
          };
          break;
        case "uniform1fv":
          preparedUniforms[uniformName] = { value: uniform.value, type: "1fv" };
          break;
        case "uniform3fv":
          preparedUniforms[uniformName] = {
            value: uniform.value.map((v: number[]) =>
              new THREE.Vector3().fromArray(v)
            ),
            type: "3fv",
          };
          break;
        case "uniform2f":
          preparedUniforms[uniformName] = {
            value: new THREE.Vector2().fromArray(uniform.value),
            type: "2f",
          };
          break;
        default:
          console.error(`Invalid uniform type for '${uniformName}'.`);
          break;
      }
    }

    preparedUniforms["u_time"] = { value: 0, type: "1f" };
    preparedUniforms["u_resolution"] = {
      value: new THREE.Vector2(size.width * 2, size.height * 2),
    }; // Initialize u_resolution
    return preparedUniforms;
  };

  // Shader material
  const material = useMemo(() => {
    const materialObject = new THREE.ShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec2 coordinates;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        float x = position.x;
        float y = position.y;
        gl_Position = vec4(x, y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: getUniforms(),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
    });

    return materialObject;
  }, [size.width, size.height, source]);

  return (
    <mesh ref={ref as any}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Shader: React.FC<ShaderProps> = ({ source, uniforms, maxFps = 60 }) => {
  return (
    <Canvas className="absolute inset-0  h-full w-full">
      <ShaderMaterial source={source} uniforms={uniforms} maxFps={maxFps} />
    </Canvas>
  );
};

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const defaultTextColor = 'text-white/60';
  const hoverTextColor = 'text-white';
  const textSizeClass = 'text-sm';

  return (
    <Link to={href} className={`group relative inline-block overflow-hidden h-5 flex items-center ${textSizeClass}`}>
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className={defaultTextColor}>{children}</span>
        <span className={hoverTextColor}>{children}</span>
      </div>
    </Link>
  );
};

function MiniNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<any>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (shapeTimeoutRef.current) {
      clearTimeout(shapeTimeoutRef.current);
    }

    if (isOpen) {
      setHeaderShapeClass('rounded-xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }

    return () => {
      if (shapeTimeoutRef.current) {
        clearTimeout(shapeTimeoutRef.current);
      }
    };
  }, [isOpen]);

  const navLinksData = [
    { label: 'Product', href: '/' },
    { label: 'Use Cases', href: '/' },
    { label: 'Labs', href: '/labs' },
    { label: 'Compare', href: '/compare' },
    { label: 'Pricing', href: '/pricing' },
  ];

  const loginButtonElement = (
    <Link to="/" className="px-4 py-2 sm:px-3 text-xs sm:text-sm border border-white/20 bg-black/60 backdrop-blur-md text-white/70 rounded-full hover:border-white/50 hover:text-white transition-colors duration-200 w-full sm:w-auto">
      Get Leads Free
    </Link>
  );

  const signupButtonElement = (
    <div className="relative group w-full sm:w-auto">
       <div className="absolute inset-0 -m-2 rounded-full
                     hidden sm:block
                     bg-white
                     opacity-20 filter blur-lg pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-40 group-hover:blur-xl group-hover:-m-3"></div>
       <Link to="/book-demo" className="relative z-10 block text-center px-4 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-black bg-white rounded-full hover:bg-white/90 hover:scale-[1.02] transition-all duration-200 w-full sm:w-auto">
         Book a Demo
       </Link>
    </div>
  );

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-20
                       flex flex-col items-center
                       px-3 sm:px-4 py-2 sm:py-2 backdrop-blur-2xl
                       ${headerShapeClass}
                       border border-white/10 bg-[rgba(255,255,255,0.03)]
                       w-[calc(100%-2rem)] sm:w-auto
                       shadow-[0_8px_32px_rgba(0,0,0,0.5)]
                       transition-[border-radius] duration-300 ease-in-out`}>

      <div className="flex items-center justify-between w-full gap-x-6 sm:gap-x-10">
        

        <nav className="hidden sm:flex items-center space-x-4 sm:space-x-6 text-sm">
          {navLinksData.map((link) => (
            <AnimatedNavLink key={link.href} href={link.href}>
              {link.label}
            </AnimatedNavLink>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-2 sm:gap-3">
          {loginButtonElement}
          {signupButtonElement}
        </div>

        <button className="sm:hidden flex items-center justify-center w-8 h-8 text-gray-300 focus:outline-none" onClick={toggleMenu} aria-label={isOpen ? 'Close Menu' : 'Open Menu'}>
          {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>
      </div>

      <div className={`sm:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[1000px] opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full">
          {navLinksData.map((link) => (
            <Link key={link.href} to={link.href} className="text-white/60 hover:text-white transition-colors w-full text-center py-2">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          {loginButtonElement}
          {signupButtonElement}
        </div>
      </div>
    </header>
  );
}

export const SignInPage = ({ className }: SignInPageProps) => {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const codeInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [initialCanvasVisible, setInitialCanvasVisible] = useState(true);
  const [reverseCanvasVisible, setReverseCanvasVisible] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setStep("code");
    }
  };

  // Focus first input when code screen appears
  useEffect(() => {
    if (step === "code") {
      setTimeout(() => {
        codeInputRefs.current[0]?.focus();
      }, 500);
    }
  }, [step]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Focus next input if value is entered
      if (value && index < 5) {
        codeInputRefs.current[index + 1]?.focus();
      }
      
      // Check if code is complete
      if (index === 5 && value) {
        const isComplete = newCode.every(digit => digit.length === 1);
        if (isComplete) {
          // First show the new reverse canvas
          setReverseCanvasVisible(true);
          
          // Then hide the original canvas after a small delay
          setTimeout(() => {
            setInitialCanvasVisible(false);
          }, 50);
          
          // Transition to success screen after animation
          setTimeout(() => {
            setStep("success");
          }, 2000);
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      codeInputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    setStep("email");
    setCode(["", "", "", "", "", ""]);
    // Reset animations if going back
    setReverseCanvasVisible(false);
    setInitialCanvasVisible(true);
  };

  return (
    <div className={cn("flex w-[100%] flex-col min-h-screen bg-[#050505] relative", className)}>
      <div className="absolute inset-0 z-0">
        {/* Initial canvas (forward animation) */}
        {initialCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-[#050505]"
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              opacities={[0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.12, 0.12, 0.14, 0.18]}
              reverse={false}
            />
          </div>
        )}
        
        {/* Reverse canvas (appears when code is complete) */}
        {reverseCanvasVisible && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={4}
              containerClassName="bg-[#050505]"
              colors={[
                [255, 255, 255],
                [255, 255, 255],
              ]}
              dotSize={6}
              opacities={[0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.12, 0.12, 0.14, 0.18]}
              reverse={true}
            />
          </div>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,1)_0%,_transparent_100%)]" />
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-black to-transparent" />
      </div>
      
      {/* Content Layer */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Top navigation */}
        <MiniNavbar />

        {/* Main content container */}
        <div className="flex flex-1 flex-col lg:flex-row ">
          {/* Left side (form) */}
          <div className="flex-1 flex flex-col justify-center items-center px-6 pt-24 lg:pt-0 lg:pl-12 xl:pl-24">
            <div className="w-full mt-[50px] lg:mt-[150px] max-w-sm ml-auto mr-auto lg:mr-24">
              <AnimatePresence mode="wait">
                {step === "email" ? (
                  <motion.div 
                    key="email-step"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center lg:text-left"
                  >
                    <div className="space-y-2">
                      <h1 className="text-4xl lg:text-[3rem] font-medium leading-[1.1] tracking-tight text-white">Book your Outmate demo</h1>
                      <p className="text-lg lg:text-[1.2rem] text-white/60 font-light mt-4">See how anonymous traffic becomes qualified pipeline in minutes.</p>
                      <div className="pt-4 flex flex-col gap-2 text-sm text-white/50">
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          Identify visitors in real time
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          AI-powered enrichment
                        </div>
                        <div className="flex items-center justify-center lg:justify-start gap-2">
                          <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          CRM sync automation
                        </div>
                      </div>
                    </div>
                    
                    
                    <div className="space-y-4 pt-8">
                      <button className="backdrop-blur-md w-full flex items-center justify-center gap-3 bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-white border border-[rgba(255,255,255,0.08)] rounded-full py-3.5 px-4 transition-all duration-300">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
                        </svg>
                        <span className="font-medium">Continue with Google</span>
                      </button>
                      
                      <div className="flex items-center gap-4 py-2">
                        <div className="h-px bg-white/10 flex-1" />
                        <span className="text-white/40 text-sm font-medium">or</span>
                        <div className="h-px bg-white/10 flex-1" />
                      </div>
                      
                      <form onSubmit={handleEmailSubmit}>
                        <div className="relative group">
                          <input 
                            type="email" 
                            placeholder="Enter your work email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full backdrop-blur-md bg-[rgba(255,255,255,0.02)] text-white border border-[rgba(255,255,255,0.08)] rounded-full py-4 px-6 focus:outline-none focus:border-white/30 focus:bg-[rgba(255,255,255,0.04)] text-left transition-all duration-300 placeholder:text-white/30"
                            required
                          />
                          <button 
                            type="submit"
                            className="absolute right-2 top-2 text-black font-medium px-6 h-10 flex items-center justify-center rounded-full bg-white hover:bg-white/90 transition-colors"
                          >
                            Continue
                          </button>
                        </div>
                      </form>
                    </div>
                    
                    <p className="text-xs text-white/40 pt-6 text-center lg:text-left">
                      By signing up, you agree to the <Link to="#" className="underline text-white/40 hover:text-white/60 transition-colors">MSA</Link>, <Link to="#" className="underline text-white/40 hover:text-white/60 transition-colors">Product Terms</Link>, <Link to="#" className="underline text-white/40 hover:text-white/60 transition-colors">Policies</Link>.
                    </p>
                  </motion.div>
                ) : step === "code" ? (
                  <motion.div 
                    key="code-step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="space-y-6 text-center lg:text-left"
                  >
                    <div className="space-y-2">
                      <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-white">Verify your email</h1>
                      <p className="text-lg text-white/60 font-light mt-2">We sent a secure access code to <span className="font-medium text-white">{email}</span></p>
                    </div>
                    
                    <div className="w-full pt-6">
                      <div className="relative rounded-2xl py-6 px-6 border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md">
                        <div className="flex items-center justify-between w-full">
                          {code.map((digit, i) => (
                            <div key={i} className="flex items-center">
                              <div className="relative">
                                <input
                                  ref={(el) => {
                                    codeInputRefs.current[i] = el;
                                  }}
                                  type="text"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                  maxLength={1}
                                  value={digit}
                                  onChange={e => handleCodeChange(i, e.target.value)}
                                  onKeyDown={e => handleKeyDown(i, e)}
                                  className="w-10 md:w-12 h-14 text-center text-2xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.1)] rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 appearance-none transition-all duration-200"
                                  style={{ caretColor: 'transparent' }}
                                />
                                {!digit && (
                                  <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none">
                                    <span className="text-2xl text-white/10">-</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center lg:justify-start gap-2 pt-2">
                      <span className="text-white/40 text-sm">Didn't receive it?</span>
                      <motion.button 
                        className="text-white/70 hover:text-white transition-colors cursor-pointer text-sm font-medium"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        Click to resend
                      </motion.button>
                    </div>
                    
                    <div className="flex w-full gap-4 pt-6">
                      <motion.button 
                        onClick={handleBackClick}
                        className="rounded-full bg-[rgba(255,255,255,0.08)] text-white border border-[rgba(255,255,255,0.1)] font-medium px-8 py-3.5 hover:bg-[rgba(255,255,255,0.12)] transition-all duration-300 w-[30%]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Back
                      </motion.button>
                      <motion.button 
                        className={`flex-1 rounded-full font-medium py-3.5 transition-all duration-300 ${
                          code.every(d => d !== "") 
                          ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] cursor-pointer scale-100"
                          : "bg-[rgba(255,255,255,0.04)] text-white/30 border border-[rgba(255,255,255,0.08)] cursor-not-allowed scale-[0.98]"
                        }`}
                        disabled={!code.every(d => d !== "")}
                      >
                        Verify Code
                      </motion.button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="success-step"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="space-y-8 text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 200,
                        damping: 20,
                        delay: 0.4 
                      }}
                      className="py-6"
                    >
                      <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-20 animate-pulse" />
                        <div className="relative w-full h-full rounded-full bg-gradient-to-tr from-[#ffffff] to-[#a3a3a3] shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-black" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
                    
                    <div className="space-y-3">
                      <motion.h1 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="text-4xl font-medium leading-[1.1] tracking-tight text-white"
                      >
                        Demo request confirmed
                      </motion.h1>
                      <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                        className="text-lg text-white/60 font-light max-w-sm mx-auto"
                      >
                        Our GTM team will reach out shortly with your custom workspace.
                      </motion.p>
                    </div>
                    
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="pt-4"
                    >
                      <Link to="/">
                        <button className="w-full rounded-full bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.12)] text-white font-medium py-4 hover:bg-[rgba(255,255,255,0.12)] transition-all duration-300 flex items-center justify-center gap-2 group">
                          <span>Return to Homepage</span>
                          <svg className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </Link>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          {/* Right side (Visual Panel) */}
          <div className="hidden lg:flex flex-1 relative items-center justify-center border-l border-[rgba(255,255,255,0.05)] bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.03)_0%,_transparent_70%)]">
            <div className="w-[85%] max-w-2xl aspect-[4/3] rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,10,0.6)] backdrop-blur-xl shadow-2xl relative overflow-hidden flex flex-col">
              {/* Fake UI Header */}
              <div className="h-14 border-b border-[rgba(255,255,255,0.05)] flex items-center px-6 gap-4 shrink-0">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="text-sm font-medium text-white/40 flex-1 text-center">Live Visitor Intelligence</div>
              </div>
              
              {/* Dashboard Content */}
              <div className="flex-1 p-8 relative">
                {/* Floating Elements Background */}
                <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
                  <defs>
                    <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1" fill="rgba(255,255,255,0.3)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>

                <div className="relative z-10 h-full flex flex-col gap-4">
                  {/* Feed Item 1 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex items-center gap-4 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center bg-black/50 shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">Sarah Chen</span>
                        <span className="text-xs bg-white/10 text-white rounded-full px-2 py-0.5">Score: 94</span>
                      </div>
                      <div className="text-white/50 text-xs mt-1">Visited Pricing • VP Marketing at TechCorp</div>
                    </div>
                  </motion.div>

                  {/* Feed Item 2 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.5, duration: 0.8 }}
                    className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center bg-black/50 shrink-0">
                      <svg className="w-5 h-5 text-white/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">Stripe</span>
                        <span className="text-xs bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.2)] text-white rounded-full px-2 py-0.5">Intent Detected</span>
                      </div>
                      <div className="text-white/50 text-xs mt-1">Viewed Integrations • 4 min Session</div>
                    </div>
                  </motion.div>

                   {/* Feed Item 3 */}
                   <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 4.5, duration: 0.8 }}
                    className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-lg border border-[rgba(255,255,255,0.1)] flex items-center justify-center bg-black/50 shrink-0 relative overflow-hidden">
                       <div className="absolute inset-0 bg-white/20 animate-pulse" />
                       <div className="w-1.5 h-1.5 rounded-full bg-white relative z-10" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium text-sm">Notion</span>
                        <span className="text-xs text-white/50">Just now</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-white/40 text-xs">Comparison Page</span>
                        <svg className="w-3 h-3 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        <span className="text-white/70 text-xs">Routed to SDR workflow</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Decorative gradients */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

