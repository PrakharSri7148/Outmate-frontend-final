import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence, type MotionValue } from 'framer-motion'
import SectionReveal from '../../components/SectionReveal'
import {
  Bot,
  Phone,
  CheckCircle,
  MessageSquare,
  ThumbsUp,
  UserPlus
} from 'lucide-react'

// ─────────────────────────────────────────────
// VISUAL ANIMATIONS
// ─────────────────────────────────────────────

function DatabaseVisual() {
  return (
    <div className="w-full h-[400px] sm:h-full relative flex items-center justify-center p-8 overflow-hidden pointer-events-none">
      <motion.div 
        className="w-full max-w-[400px] relative h-[300px] flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        {[
          { top: '20%', left: '15%', delay: 0.1, width: 'w-24' },
          { top: '65%', left: '50%', delay: 0.3, width: 'w-36' },
          { top: '35%', left: '80%', delay: 0.5, width: 'w-28' },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl shadow-lg leading-none"
            style={{ top: pos.top, left: pos.left, transform: 'translate(-50%, -50%)' }}
            variants={{
              hidden: { opacity: 0, y: 15, scale: 0.9 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { delay: pos.delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
              }
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white/[0.05] flex items-center justify-center relative shrink-0">
              <motion.div
                variants={{
                  hidden: { opacity: 0, scale: 0 },
                  visible: { opacity: 1, scale: 1, transition: { delay: pos.delay + 0.4, type: 'spring' } }
                }}
                className="absolute -bottom-1 -right-1 bg-[#0F0F10] rounded-full"
              >
                <CheckCircle className="w-4 h-4 text-white/80 fill-white/10" />
              </motion.div>
              <UserPlus className="w-4 h-4 text-white/40" />
            </div>
            <div className="flex flex-col gap-2 overflow-hidden items-start pt-[2px]">
              <div className={`h-2 rounded-full bg-white/20 ${pos.width}`} />
              <motion.div 
                className="h-2 rounded-full bg-white/50" 
                variants={{
                  hidden: { width: 0 },
                  visible: { width: '80%', transition: { delay: pos.delay + 0.6, duration: 0.8 } }
                }}
              />
            </div>
          </motion.div>
        ))}
        {/* Connecting lines between nodes */}
        <svg className="absolute inset-0 w-full h-full -z-10" style={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1.5, fill: 'none' }}>
           <motion.path 
             d="M 60 100 Q 180 180 200 160 T 320 120"
             variants={{ hidden: { pathLength: 0 }, visible: { pathLength: 1, transition: { delay: 0.6, duration: 1.5 } } }}
           />
        </svg>
      </motion.div>
    </div>
  )
}

function CoPilotVisual() {
  const text = "Hi Sarah,\nNoticed your team is scaling fast.\nLet's automate your intent signals to capture lost pipeline immediately."
  
  return (
    <div className="w-full h-[400px] sm:h-full relative flex items-center justify-center p-8 overflow-hidden pointer-events-none">
      <motion.div 
        className="w-full max-w-[360px] rounded-2xl bg-white/[0.02] border border-white/[0.08] p-6 shadow-2xl backdrop-blur-xl origin-center"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
        }}
      >
        <div className="flex gap-2 mb-6">
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.15]" />
        </div>
        <div className="font-mono text-xs leading-relaxed text-[#B8B8B8] relative min-h-[100px] text-left">
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
          >
            {text.split('').map((char, index) => (
              <motion.span
                key={index}
                variants={{
                  hidden: { opacity: 0, display: 'none' },
                  visible: { opacity: 1, display: 'inline', transition: { delay: index * 0.02 + 0.3 } }
                }}
              >
                {char === '\n' ? <br/> : char}
              </motion.span>
            ))}
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="inline-block w-2 h-3.5 bg-white/50 ml-1 rounded-[1px] align-middle"
            />
          </motion.div>
          
          <motion.div
            className="mt-6 flex items-center gap-2 border border-white/[0.08] rounded-md p-2 bg-white/[0.03] w-fit leading-none"
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1, transition: { delay: text.length * 0.02 + 0.8, duration: 0.4 } }
            }}
          >
            <Bot className="w-4 h-4 text-white/70" />
            <span className="text-[10px] text-white/50 font-medium tracking-wide uppercase pt-px">Ready</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

function SocialVisual() {
  const actions = [
    { icon: ThumbsUp, label: 'Like' },
    { icon: MessageSquare, label: 'Comment' },
    { icon: UserPlus, label: 'Connect' }
  ]
  return (
    <div className="w-full h-[400px] sm:h-full relative flex items-center justify-center p-8 overflow-hidden pointer-events-none">
      <motion.div 
        className="w-full max-w-[400px] flex justify-between items-center relative"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="absolute top-1/2 left-8 right-8 h-[1px] bg-white/[0.05] -translate-y-1/2 rounded-full overflow-hidden">
          <motion.div
            className="h-full w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent"
            variants={{
              hidden: { x: '-200%' },
              visible: { x: '300%', transition: { duration: 2, ease: 'linear', repeat: Infinity, repeatDelay: 1 } }
            }}
          />
        </div>
        
        {actions.map((action, i) => (
          <motion.div
            key={action.label}
            className="flex flex-col items-center gap-4 relative z-10"
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { delay: i * 0.4 + 0.2, duration: 0.5, ease: 'easeOut' } }
            }}
          >
            <div className="w-14 h-14 rounded-full bg-[#0F0F10] border border-white/[0.08] flex items-center justify-center relative backdrop-blur-md shadow-lg">
               <motion.div 
                 className="absolute inset-0 rounded-full border border-white/20"
                 variants={{
                   hidden: { scale: 0.8, opacity: 0 },
                   visible: { scale: [1, 1.3, 1.1], opacity: [0, 1, 0], transition: { delay: (i * 0.4) + 0.5, duration: 0.8 } }
                 }}
               />
               <action.icon className="w-5 h-5 text-white/70 relative z-10" />
               <motion.div
                 className="absolute -top-1 -right-1 bg-[#0F0F10] rounded-full border border-white/[0.08] shadow-sm leading-none"
                 variants={{
                   hidden: { opacity: 0, scale: 0 },
                   visible: { opacity: 1, scale: 1, transition: { delay: (i * 0.4) + 0.8, type: 'spring' } }
                 }}
               >
                 <CheckCircle className="w-4 h-4 text-white/50 p-px" />
               </motion.div>
            </div>
            <div className="text-xs font-medium text-white/50 tracking-wider bg-white/[0.03] px-3 py-1 rounded-md border border-white/[0.05] uppercase leading-none">{action.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function WorkflowVisual() {
  const steps = ['Identified', 'Enrich', 'Action']
  return (
    <div className="w-full h-[400px] sm:h-full relative flex items-center justify-center p-8 overflow-hidden pointer-events-none">
      <motion.div 
        className="w-full h-full flex flex-col justify-center items-center gap-6 relative max-w-[240px] mx-auto"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <div className="absolute left-[39px] top-8 bottom-8 w-[1px] bg-white/[0.05] rounded-full overflow-hidden">
          <motion.div 
            className="w-full h-1/3 bg-gradient-to-b from-transparent via-white/50 to-transparent"
            variants={{
              hidden: { y: '-200%' },
              visible: { y: '300%', transition: { duration: 2, ease: 'linear', repeat: Infinity } }
            }}
          />
        </div>

        {steps.map((step, i) => (
          <div key={step} className="flex items-center gap-5 relative z-10 w-full ml-4">
            <motion.div
              className="w-12 h-12 rounded-full bg-[#0F0F10] border border-white/[0.08] flex items-center justify-center shrink-0 shadow-lg"
              variants={{
                hidden: { scale: 0.8, borderColor: 'rgba(255,255,255,0.05)' },
                visible: { 
                  scale: 1, 
                  borderColor: 'rgba(255,255,255,0.2)',
                  transition: { delay: i * 0.4 + 0.2, duration: 0.4 } 
                }
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white/70" />
            </motion.div>
            
            <motion.div 
              className="flex-1 h-14 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center px-4 backdrop-blur-md shadow-sm w-full overflow-hidden leading-none"
              variants={{
                hidden: { opacity: 0, x: -15 },
                visible: { opacity: 1, x: 0, transition: { delay: i * 0.4 + 0.3, duration: 0.5, ease: 'easeOut' } }
              }}
            >
              <span className="text-xs text-[#B8B8B8] font-medium whitespace-nowrap pt-px">{step}</span>
              <motion.div
                className="ml-auto pl-2 shrink-0 h-4"
                variants={{
                  hidden: { opacity: 0, scale: 0 },
                  visible: { opacity: 1, scale: 1, transition: { delay: i * 0.4 + 0.6 } }
                }}
              >
                <CheckCircle className="w-4 h-4 text-white/50" />
              </motion.div>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function CRMVisual() {
  return (
    <div className="w-full h-[400px] sm:h-full relative flex items-center justify-center p-8 overflow-hidden pointer-events-none">
      <motion.div 
        className="w-full flex items-center justify-center gap-6 max-w-[400px]"
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
           className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-lg backdrop-blur-md leading-none"
           variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
           }}
        >
           <span className="text-white/60 text-sm font-semibold">SF</span>
        </motion.div>
        
        {/* Animated syncing line */}
        <div className="flex-1 h-px bg-white/[0.03] relative">
          <motion.div
            className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-y-1/2"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        <motion.div
           className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-lg backdrop-blur-md leading-none"
           variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.2 } }
           }}
        >
           <span className="text-white/60 text-sm font-semibold pt-px">Hub</span>
        </motion.div>

        <div className="flex-1 h-px bg-white/[0.03] relative">
          <motion.div
            className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-y-1/2"
            animate={{ x: ['100%', '-100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear', delay: 0.75 }}
          />
        </div>

        <motion.div
           className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center shadow-lg backdrop-blur-md"
           variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.4 } }
           }}
        >
           <MessageSquare className="w-6 h-6 text-white/50" />
        </motion.div>
      </motion.div>
    </div>
  )
}

function VoiceVisual() {
  return (
    <div className="w-full h-[400px] sm:h-full relative flex items-center justify-center p-8 overflow-hidden pointer-events-none">
      <motion.div 
        className="w-full flex flex-col items-center gap-10"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={{
          hidden: { opacity: 0, y: 15 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
        }}
      >
        <div className="relative flex items-center justify-center">
          <motion.div 
            className="absolute inset-0 rounded-full bg-white/[0.02] blur-xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex items-center justify-center z-10 shadow-lg relative">
             <Phone className="w-8 h-8 text-white/80" />
             
             {/* Call pulse ring */}
             <motion.div
               className="absolute inset-0 rounded-full border border-white/20"
               animate={{ scale: [1, 1.4], opacity: [1, 0] }}
               transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
             />
          </div>
          <div className="absolute -bottom-6 flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-4 py-1.5 rounded-full backdrop-blur-md leading-none">
            <div className="w-2 h-2 rounded-full bg-white/70 animate-pulse" />
            <span className="text-xs font-mono text-[#B8B8B8] tracking-widest uppercase pt-px">00:42 LIVE</span>
          </div>
        </div>
        
        {/* Active Waveform */}
        <div className="flex gap-1.5 items-center h-12">
          {[...Array(14)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-white/50 rounded-full"
              initial={{ height: 4 }}
              animate={{ height: ['20%', '80%', '30%', '100%', '40%'] }}
              transition={{
                duration: 1.5 + ((i % 5) * 0.2),
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: i * 0.1
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────
// DATA & STATE
// ─────────────────────────────────────────────

interface PlatformExperience {
  title: string
  description: string
  Visual: React.FC
}

const experiences: PlatformExperience[] = [
  {
    title: 'B2B Database',
    description: 'Access verified people and company records, then enrich every identified visitor with firmographic data, contact details, and buying context in one step.',
    Visual: DatabaseVisual
  },
  {
    title: 'Co-pilot',
    description: 'Generate personalized outreach, talking points, and next steps based on visitor behavior and account context — in seconds.',
    Visual: CoPilotVisual
  },
  {
    title: 'Social Warmup Agent',
    description: 'Choose from an agent library that warms up accounts before direct outreach starts.',
    Visual: SocialVisual
  },
  {
    title: 'Workflow Automation',
    description: 'Route high-intent visitors into alerts, sequences, and next best actions without manual handoff.',
    Visual: WorkflowVisual
  },
  {
    title: 'CRM Integration',
    description: 'Sync enriched leads into the tools your sales team already lives in.',
    Visual: CRMVisual
  },
  {
    title: 'GTM Voice Agent',
    description: 'Autonomous outbound calls with real-time qualification, objection handling, and CRM logging.',
    Visual: VoiceVisual
  }
]

function ProgressSegment({ index, total, progress }: { index: number, total: number, progress: MotionValue<number> }) {
  const start = index / total
  const end = (index + 1) / total
  const width = useTransform(progress, [start, end], ["0%", "100%"])
  
  return (
    <div className="w-full h-[3px] bg-white/[0.12] rounded-full overflow-hidden relative">
      <motion.div
        className="absolute top-0 left-0 h-full bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"
        style={{ width }}
      />
    </div>
  )
}

export default function PlatformSuite() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Track scroll inside the tall container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      const parts = experiences.length
      const acceleratedProgress = Math.min(v / 0.92, 1)
      // e.g. 6 items -> v mapped from 0 to 5.999
      let newIndex = Math.floor(acceleratedProgress * parts)
      if (newIndex >= parts) newIndex = parts - 1
      if (newIndex < 0) newIndex = 0
      setActiveIndex(newIndex)
    })
  }, [scrollYProgress])

  return (
    <section className="bg-[#0F0F10] relative">
      {/* 
        This div's height = number of sections * some tall vh, 
        giving the user room to scroll to advance through the states 
      */}
      <div ref={containerRef} className="relative h-[360vh] w-full">
        {/* Pinned Viewport */}
        <div className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden p-4 md:p-6 lg:p-10 box-border">
          
          {/* Main Premium Glass Panel */}
          <div 
            className="w-full h-full max-w-[1400px] mx-auto rounded-[32px] md:rounded-[40px] relative flex flex-col items-center justify-center overflow-hidden shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]"
            style={{ 
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04), 0 20px 40px -20px rgba(0,0,0,0.4)',
            }}
          >
            
            {/* Top Progress System */}
            <div className="absolute top-6 lg:top-10 left-0 w-full px-6 md:px-12 lg:px-20 flex justify-between md:justify-center items-center gap-2 md:gap-8 z-50">
              {experiences.map((_, i) => (
                <div key={i} className="flex flex-col items-start gap-2 flex-1 max-w-[100px] md:max-w-[150px]">
                  <span className={`text-[10px] md:text-xs font-medium font-mono uppercase tracking-widest transition-colors duration-500 ${activeIndex >= i ? 'text-white' : 'text-[#B8B8B8] opacity-50'}`}>
                    0{i + 1}
                  </span>
                  <ProgressSegment index={i} total={experiences.length} progress={scrollYProgress} />
                </div>
              ))}
            </div>

            <div className="container-limit w-full h-full flex flex-col md:flex-row items-center justify-center pt-24 pb-8 lg:pt-28 lg:pb-12 gap-8 px-4 md:px-8">
              
              {/* Mobile Layout (Stacked) */}
              <div className="md:hidden w-full flex flex-col h-full mt-4 px-2">
                 {/* Visual Container */}
                 <div className="flex-none relative w-full h-[45%] flex items-center justify-center bg-white/[0.02] border border-white/[0.06] rounded-3xl overflow-hidden shadow-2xl mb-8">
                    <div className="absolute inset-0 border border-white/[0.02] rounded-[24px] pointer-events-none z-20" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }} />
                    <AnimatePresence mode="wait">
                     {experiences.map((exp, i) => (
                       activeIndex === i && (
                         <motion.div
                           key={i}
                           className="absolute inset-0"
                           initial={{ opacity: 0, scale: 0.95 }}
                           animate={{ opacity: 1, scale: 1 }}
                           exit={{ opacity: 0, scale: 1.05 }}
                           transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                         >
                         <exp.Visual />
                       </motion.div>
                     )
                   ))}
                  </AnimatePresence>
               </div>
               
               {/* Text Container */}
               <div className="flex-1 w-full text-center flex flex-col items-center relative gap-4 mt-4">
                 <AnimatePresence mode="wait">
                   {experiences.map((exp, i) => (
                     activeIndex === i && (
                       <motion.div
                         key={i}
                         initial={{ opacity: 0, y: 15 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -15 }}
                         transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                         className="absolute flex flex-col items-center gap-3 w-full px-2"
                       >
                         <h3 className="text-2xl font-display font-semibold text-white mb-1 leading-tight">{exp.title}</h3>
                         <p className="text-[#B8B8B8] text-sm leading-relaxed max-w-sm mx-auto">{exp.description}</p>
                       </motion.div>
                     )
                   ))}
                 </AnimatePresence>
               </div>
            </div>

            {/* Desktop Layout (Split 40/60) */}
            <div className="hidden md:flex w-full h-full max-h-[800px] items-center justify-between gap-12 lg:gap-20">
              
              {/* LEFT: Text Content Area */}
              <div className="w-[45%] relative h-[80%] flex flex-col justify-center max-w-[500px]">
                {/* Intro Title fixed above changing text */}
                <div className="mb-12">
                  <SectionReveal>
                    <h2 className="font-display text-4xl lg:text-5xl font-semibold text-white tracking-tight leading-tight">
                      Everything you need to turn traffic into pipeline
                    </h2>
                  </SectionReveal>
                </div>

                <div className="relative h-[250px] w-full">
                  <AnimatePresence mode="wait">
                    {experiences.map((exp, i) => (
                      activeIndex === i && (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -15 }}
                          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute flex flex-col gap-5"
                        >
                          <h3 className="font-display text-3xl lg:text-4xl font-semibold text-white leading-tight">
                            {exp.title}
                          </h3>
                          <p className="text-lg lg:text-xl text-[#B8B8B8] leading-relaxed max-w-[420px]">
                            {exp.description}
                          </p>
                        </motion.div>
                      )
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* RIGHT: Visual Area */}
              <div 
                className="w-[55%] h-[75%] min-h-[450px] lg:h-[80%] lg:max-h-[650px] relative flex items-center justify-center overflow-hidden rounded-[28px] md:rounded-[32px]"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                 <AnimatePresence mode="wait">
                   {experiences.map((exp, i) => (
                     activeIndex === i && (
                       <motion.div
                         key={i}
                         className="absolute inset-0 flex items-center justify-center"
                         initial={{ opacity: 0, scale: 0.96 }}
                         animate={{ opacity: 1, scale: 1 }}
                         exit={{ opacity: 0, scale: 1.04 }}
                         transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                       >
                         {/* Subtle ambient mesh behind the active visual component */}
                         <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none">
                           <div className="w-[80%] h-[80%] rounded-full bg-white/[0.02] blur-[120px]" />
                         </div>
                         <exp.Visual />
                       </motion.div>
                     )
                   ))}
                 </AnimatePresence>
                 
                 {/* Inner glass highlight */}
                 <div className="absolute inset-0 border border-white/[0.04] rounded-[28px] md:rounded-[32px] pointer-events-none z-20" style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.02)' }} />
              </div>

            </div>
          </div>
          </div>
          
        </div>
      </div>
    </section>
  )
}
