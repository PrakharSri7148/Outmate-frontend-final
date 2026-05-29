import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, Shield } from 'lucide-react';
import InteractiveSandbox from '../../components/InteractiveSandbox';


export default function AnalyticsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.95, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-white py-32 px-6 md:px-12">

      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center relative z-10">
        
        {/* Left Side: Editorial Content */}
        <div className="lg:col-span-5 flex flex-col items-start">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[12px] tracking-[0.35em] uppercase font-semibold text-[#4B5563] mb-8"
          >
            AI GTM INFRASTRUCTURE
          </motion.p>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[52px] md:text-[72px] lg:text-[96px] leading-[0.9] tracking-[-0.08em] font-[750] text-[#111111]"
          >
            Operate your entire outbound engine from one intelligence layer.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[22px] leading-[1.6] text-[#4B5563] max-w-[620px] mt-10 font-[420]"
          >
            Outmate connects visitor identification, enrichment, workflows, outbound execution, and AI agents into a single GTM operating system.
          </motion.p>

          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 group flex items-center gap-3 border border-[#E5E7EB] bg-white hover:bg-gray-50 rounded-full px-8 py-5 text-[#111111] font-medium transition-all duration-300"
          >
            Explore Platform
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </div>

        {/* Right Side: Cinematic Dashboard Window */}
        <div className="lg:col-span-7 relative w-full aspect-square md:aspect-video lg:h-[720px]">
          <motion.div 
            style={{ scale, opacity }}
            className="w-full h-full rounded-[32px] overflow-hidden border border-[#E5E7EB] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] relative group"
          >
            {/* macOS Style Header Bar */}
            <div className="h-12 bg-gray-50 border-b border-[#E5E7EB] flex items-center px-6 gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              </div>
              <div className="mx-auto text-[11px] font-medium text-[#4B5563] tracking-widest uppercase">
                outmate.os v4.2 — live
              </div>
            </div>

            {/* Main Content Area replaced with InteractiveSandbox */}
            <div className="p-4 h-full relative overflow-hidden">
              <InteractiveSandbox />
            </div>

            {/* Floatings UI Panels */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 p-6 rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_10px_30px_rgba(0,0,0,0.06)] hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#7CFFCB] flex items-center justify-center">
                  <Shield className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="text-[#111111] font-semibold">Security Level</div>
                  <div className="text-[#4B5563] text-xs">Enterprise Certified</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Background Polish for Dashboard (disabled on white background) */}
          <div className="absolute -inset-4 rounded-[40px] -z-10 opacity-0 transition-opacity" />
        </div>

      </div>
    </section>
  );
}
