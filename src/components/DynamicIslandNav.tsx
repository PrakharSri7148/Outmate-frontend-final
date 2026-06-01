import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  label: string;
  shortLabel?: string;
  status?: string;
}

const SECTIONS: Section[] = [
  { id: "hero", label: "Hero", shortLabel: "Outmate" },
  { id: "how-it-works", label: "How Outmate Works", shortLabel: "Process" },
  // platform-suite removed
  { id: "use-cases", label: "Signal Intelligence", shortLabel: "Signals", status: "Live Signals" },
  { id: "analytics", label: "Real-time Insights", shortLabel: "Insights", status: "Analyzing Data" },
  { id: "compare", label: "Why Teams Switch to Outmate", shortLabel: "Compare", status: "Outmate vs Others" },
  { id: "faqs", label: "Website Identification FAQs", shortLabel: "FAQs", status: "Common Questions" },
  { id: "footer", label: "Footer", shortLabel: "Connect" },
];

export const DynamicIslandNav = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight - windowHeight;
      const progress = Math.min(100, Math.max(0, (scrollY / fullHeight) * 100));
      setScrollProgress(progress);

      // Section detection
      for (const section of [...SECTIONS].reverse()) {
        const element = document.getElementById(section.id);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= windowHeight / 3) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeLabel = useMemo(() => {
    const label = activeSection.shortLabel || activeSection.label;
    // Normalize to Title Case
    return label
      .toLowerCase()
      .split(' ')
      .map(word => {
        // Special case for FAQs
        if (word === 'faqs') return 'FAQs';
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(' ');
  }, [activeSection]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsExpanded(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-[9998] bg-black/40 backdrop-blur-sm transition-all duration-500"
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 inset-x-0 z-[9999] pointer-events-none flex justify-center">
        <motion.div
          layout
          initial={false}
          animate={{
            width: isExpanded ? 320 : "auto",
            minWidth: isExpanded ? 320 : 160,
            height: isExpanded ? 480 : 44,
            borderRadius: isExpanded ? 32 : 22,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }}
          className={cn(
            "pointer-events-auto overflow-hidden",
            "bg-[rgba(10,10,10,0.78)] border border-[rgba(255,255,255,0.08)] backdrop-blur-xl shadow-2xl",
            "flex flex-col relative"
          )}
          onMouseEnter={() => !isExpanded && setIsExpanded(false)}
          onClick={(e) => {
            e.stopPropagation();
            if (!isExpanded) setIsExpanded(true);
          }}
        >
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col relative">
            <AnimatePresence mode="wait">
              {!isExpanded ? (
                <motion.div
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center gap-2.5 px-5 h-11 whitespace-nowrap cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <CircleProgress progress={scrollProgress} />
                  <div className="relative h-5 flex items-center overflow-hidden -translate-y-px">
                    <AnimatePresence mode="wait">
                      <motion.span 
                        key={activeLabel}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="text-[14px] font-medium leading-none tracking-tight text-white whitespace-nowrap overflow-hidden text-ellipsis block origin-center"
                        style={{ letterSpacing: '-0.01em' }}
                      >
                        {activeLabel}
                      </motion.span>
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex flex-col h-full p-6"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                      Outmate Navigation
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">
                        Live
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-1 overflow-y-auto no-scrollbar">
                    {SECTIONS.map((section) => {
                      const isActive = activeSection.id === section.id;
                      return (
                        <motion.button
                          key={section.id}
                          onClick={() => scrollToSection(section.id)}
                          whileHover={{ x: 4, backgroundColor: "rgba(255,255,255,0.04)" }}
                          className={cn(
                            "group flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-300 text-left w-full",
                            isActive ? "bg-white/[0.06]" : "hover:bg-white/[0.02]"
                          )}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className={cn(
                              "text-sm font-medium transition-colors",
                              isActive ? "text-white" : "text-white/50 group-hover:text-white/80"
                            )}>
                              {section.label}
                            </span>
                            {isActive && section.status && (
                              <motion.span
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[10px] text-white/40 font-light"
                              >
                                {section.status}
                              </motion.span>
                            )}
                          </div>
                          {isActive && (
                            <motion.div 
                              layoutId="active-dot"
                              className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]" 
                            />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-white/30 uppercase">Scroll Position</span>
                        <span className="text-xs font-mono text-white/60">{Math.round(scrollProgress)}%</span>
                    </div>
                    <button 
                      onClick={() => setIsExpanded(false)}
                      className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
                    >
                      <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Micro-glow effect */}
          <div className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-50" />
            <div className="absolute -top-[100%] left-0 right-0 h-full bg-white/[0.03] blur-xl" />
          </div>
        </motion.div>
      </div>
    </>
  );
};

const CircleProgress = ({ progress }: { progress: number }) => {
  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
      <svg className="w-full h-full -rotate-90">
        <circle
          cx="10"
          cy="10"
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="2"
          fill="transparent"
        />
        <motion.circle
          cx="10"
          cy="10"
          r={radius}
          stroke="white"
          strokeWidth="2"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
          strokeLinecap="round"
          fill="transparent"
          className="drop-shadow-[0_0_2px_rgba(255,255,255,0.5)]"
        />
      </svg>
    </div>
  );
};
