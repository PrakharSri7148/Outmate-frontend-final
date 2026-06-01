import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const items = [
  {
    number: "97%",
    label: "Anonymous Visitors Identified",
    headline: "Reveal who’s actually researching your product.",
    description: "Outmate identifies anonymous B2B visitors at the person level — including company, role, intent signals, and buying context."
  },
  {
    number: "4.3x",
    label: "Faster GTM Response",
    headline: "Speed matters more than volume.",
    description: "Activate outbound workflows the moment intent spikes — before competitors even notice the account."
  },
  {
    number: "200M+",
    label: "Verified Contacts",
    headline: "Every visitor, matched to a 200M+ contact graph",
    description: "We resolve identified visitors against 200M+ verified B2B profiles — surfacing the right person, role, and company behind the click, with contact details ready to action"
  },
  {
    number: "18%",
    label: "Pipeline Lift Generated",
    headline: "Pipeline should be measurable.",
    description: "Track influence across meetings booked, outbound engagement, and revenue attribution."
  },
  {
    number: "12s",
    label: "Signal Detection Speed",
    headline: "Intelligence at the speed of thought.",
    description: "Detect intent signals in seconds and route them instantly to your revenue team for immediate action."
  }
];

export default function TrustPositioning() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div ref={containerRef} className="relative bg-[#f5f5f3] min-h-[350vh]">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.02),transparent_70%)]" />
        </div>

        <div className="max-w-[1700px] mx-auto w-full px-12 md:px-24 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          
          {/* Left Side: Massive Metric System */}
          <div className="relative h-[600px] flex flex-col justify-center">
            {items.map((item, index) => {
              const start = index / items.length;
              const end = (index + 1) / items.length;
              
              // Scale and Opacity logic
              /* eslint-disable react-hooks/rules-of-hooks */
              const opacity = useTransform(smoothProgress, [start - 0.1, start, end - 0.05, end], [0.1, 1, 1, 0.1]);
              const scale = useTransform(smoothProgress, [start, end], [1, 1.05]);
              const y = useTransform(smoothProgress, [start - 0.1, start, end], [20, 0, -20]);
              const blur = useTransform(smoothProgress, [start - 0.1, start, end - 0.05, end], ["blur(8px)", "blur(0px)", "blur(0px)", "blur(8px)"]);
              /* eslint-enable react-hooks/rules-of-hooks */

              return (
                <motion.div
                  key={index}
                  style={{ 
                    opacity, 
                    scale, 
                    y,
                    filter: blur,
                    zIndex: items.length - index,
                  }}
                  className="absolute inset-0 flex flex-col justify-center pointer-events-none"
                >
                  <div className="relative inline-block">
                    {/* Active Card Texture (visible when opacity is high) */}
                    <motion.div 
                      className="absolute -inset-x-12 -inset-y-8 bg-[#0b0b0b] rounded-[4px] -z-10 overflow-hidden"
                      style={{ 
                        opacity: useTransform(smoothProgress, [start, (start + end) / 2, end], [0, 1, 0])
                      }}
                    >
                      {/* Left Accent Strip */}
                      <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#7CFFCB] to-[#00D4FF]" />
                      {/* Scanline Effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(124,255,203,0.05)_50%,transparent_100%)] bg-[length:100%_4px] animate-pulse" />
                    </motion.div>

                    <h3 className="text-[140px] md:text-[180px] lg:text-[240px] font-[750] tracking-[-0.08em] leading-[0.85] text-black transition-colors duration-500">
                      <motion.span 
                        style={{ 
                          color: useTransform(smoothProgress, [start, (start + end) / 2, end], ["#000000", "#ffffff", "#000000"])
                        }}
                      >
                        {item.number}
                      </motion.span>
                    </h3>
                    
                    <motion.p 
                      className="text-[24px] font-medium tracking-[-0.03em] mt-8"
                      style={{ 
                        color: useTransform(smoothProgress, [start, (start + end) / 2, end], ["#00000033", "#ffffff", "#00000033"])
                      }}
                    >
                      {item.label}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Side: Dynamic Content */}
          <div className="relative h-[400px]">
            {/* Static Header Elements */}
            <div className="absolute -top-32 left-0 mb-12">
              <p className="text-[12px] tracking-[0.35em] uppercase font-semibold text-black/45 mb-4">
                SIGNAL INTELLIGENCE
              </p>
              <h2 className="text-[32px] md:text-[42px] font-[700] tracking-[-0.04em] text-black">
                See what your GTM team was missing.
              </h2>
            </div>

            {items.map((item, index) => {
              const start = index / items.length;
              const end = (index + 1) / items.length;
              
              /* eslint-disable react-hooks/rules-of-hooks */
              const opacity = useTransform(smoothProgress, [start - 0.05, start, end - 0.05, end], [0, 1, 1, 0]);
              const y = useTransform(smoothProgress, [start - 0.05, start, end], [20, 0, -10]);
              /* eslint-enable react-hooks/rules-of-hooks */

              return (
                <motion.div
                  key={index}
                  style={{ opacity, y }}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <h4 className="text-[52px] leading-[1] tracking-[-0.06em] font-[700] text-black max-w-[650px]">
                    {item.headline}
                  </h4>
                  <p className="text-[22px] leading-[1.7] text-black/55 max-w-[620px] mt-8 font-[430]">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
