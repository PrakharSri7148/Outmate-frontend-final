const fs = require('fs');
const path = require('path');

const content = `import React, { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import SectionReveal from '../../components/SectionReveal'
import {
  Database,
  Bot,
  Phone,
  Share2,
  Workflow,
  CheckCircle,
  MessageSquare,
  ThumbsUp,
  UserPlus,
  Zap,
  Layers,
  Terminal,
  Activity
} from 'lucide-react'

// ─────────────────────────────────────────────
// Shared Animation Variants
// ─────────────────────────────────────────────

const fadeScale = {
  hidden: { opacity: 0, scale: 0.95, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    scale: 1, 
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { 
    opacity: 0, 
    scale: 1.02, 
    filter: 'blur(4px)',
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
  }
}

const slideFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
}

// ─────────────────────────────────────────────
// Visual Components
// ─────────────────────────────────────────────

function VisualDatabase() {
  return (
    <motion.div variants={fadeScale} initial="hidden" animate="visible" exit="exit" className="w-full h-full flex items-center justify-center relative p-8">
      <div className="w-full max-w-sm rounded-[24px] bg-white/[0.02] border border-white/[0.08] p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="h-2 w-16 bg-white/20 rounded-full mb-1.5" />
              <div className="h-1.5 w-10 bg-white/10 rounded-full" />
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/50 font-medium px-2 py-1 rounded bg-white/5 border border-white/5">
            Verified
          </div>
        </div>

        {/* Rows */}
        {[
          { name: 'Sarah Jenkins', role: 'VP Marketing @ TechCorp', delay: 0.2 },
          { name: 'Marcus Chen', role: 'Dir. Sales @ GrowthInc', delay: 0.4 },
          { name: 'Elena Rostova', role: 'CEO @ CloudScale', delay: 0.6 }
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: item.delay, duration: 0.5 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <UserPlus className="w-3.5 h-3.5 text-white/60" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-white/90 mb-1">{item.name}</div>
              <div className="text-[11px] text-[#B8B8B8]">{item.role}</div>
            </div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: item.delay + 0.3, type: "spring" }}
            >
              <CheckCircle className="w-4 h-4 text-white/80" />
            </motion.div>
          </motion.div>
        ))}

        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"
        />
      </div>
    </motion.div>
  )
}

function VisualCoPilot() {
  const text = "Hi Sarah,\nSaw CloudScale is expanding the SDR team.\nHere is how we can automate intent routing..."
  
  return (
    <motion.div variants={fadeScale} initial="hidden" animate="visible" exit="exit" className="w-full h-full flex items-center justify-center relative p-8">
      <div className="w-full max-w-sm rounded-[24px] bg-white/[0.02] border border-white/[0.08] p-6 shadow-2xl backdrop-blur-xl relative">
        <div className="flex items-center gap-2 mb-6">
          <Bot className="w-5 h-5 text-white/80" />
          <div className="h-1.5 w-24 bg-white/20 rounded-full" />
        </div>

        <div className="font-mono text-xs leading-relaxed text-[#B8B8B8] min-h-[100px]">
          {text.split('').map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 + 0.2 }}
            >
              {char === '\n' ? <br /> : char}
            </motion.span>
          ))}
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-3 bg-white/50 ml-1 rounded-[1px] align-middle"
          />
        </div>

        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: text.length * 0.03 + 0.8, duration: 0.4 }}
           className="mt-6 flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10"
        >
          <span className="text-xs text-white/70">Sequence ready</span>
          <div className="text-[10px] uppercase tracking-wide text-[#0F0F10] bg-white px-3 py-1.5 rounded-md font-medium">
            Launch
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function VisualSocialAgent() {
  const steps = [
    { icon: ThumbsUp, label: 'Auto-Like Post' },
    { icon: MessageSquare, label: 'Insightful Comment' },
    { icon: UserPlus, label: 'Connection Req' }
  ]

  return (
    <motion.div variants={fadeScale} initial="hidden" animate="visible" exit="exit" className="w-full h-full flex items-center justify-center relative p-8">
      <div className="w-full max-w-sm flex flex-col gap-4">
        {steps.map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.8 + 0.2, duration: 0.5 }}
            className="flex items-center gap-4 bg-white/[0.02] border border-white/[0.08] p-4 rounded-[20px] backdrop-blur-md relative"
          >
            {i !== steps.length - 1 && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 32 }}
                transition={{ delay: i * 0.8 + 0.6, duration: 0.4 }}
                className="absolute top-12 left-8 w-[2px] bg-white/10 -z-10"
              />
            )}
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-lg relative shrink-0">
               <step.icon className="w-4 h-4 text-white" />
               <motion.div
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.8 + 0.7, type: "spring" }}
                 className="absolute -bottom-1 -right-1 bg-surface rounded-full"
               >
                 <CheckCircle className="w-3.5 h-3.5 text-white/80 fill-black" />
               </motion.div>
            </div>
            <div className="flex-1">
               <div className="text-[10px] text-white/50 uppercase tracking-widest font-medium mb-1">Step 0{i+1}</div>
               <div className="text-sm font-medium text-white/90">{step.label}</div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ delay: i * 0.8 + 0.3, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
              className="w-1.5 h-1.5 rounded-full bg-white/40"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function VisualWorkflow() {
  const nodes = [
    { title: 'Visitor Identifed', icon: Activity },
    { title: 'Append Contact Data', icon: Database },
    { title: 'ICP + Intent Check', icon: Zap },
    { title: 'Agent Action', icon: Workflow },
  ]

  return (
    <motion.div variants={fadeScale} initial="hidden" animate="visible" exit="exit" className="w-full h-full flex items-center justify-center relative p-8">
      <div className="w-full max-w-[280px] flex flex-col items-center">
        {nodes.map((node, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: i * 0.6 + 0.2, duration: 0.5 }}
              className="w-full bg-white/[0.03] border border-white/[0.08] p-3.5 rounded-xl backdrop-blur-md flex items-center gap-3 shadow-lg z-10 relative overflow-hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shadow-inner">
                <node.icon className="w-4 h-4 text-white/90" />
              </div>
              <span className="text-sm font-medium text-white/80">{node.title}</span>
              <motion.div 
                 initial={{ x: '-100%' }}
                 animate={{ x: '200%' }}
                 transition={{ delay: i * 0.6 + 0.5, duration: 1.2, ease: "linear" }}
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
              />
            </motion.div>
            
            {i !== nodes.length - 1 && (
              <div className="h-8 w-px bg-white/10 relative my-1">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: i * 0.6 + 0.6, duration: 0.4 }}
                  className="absolute top-0 bottom-0 w-full bg-white/40 origin-top"
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  )
}

function VisualCRM() {
  return (
    <motion.div variants={fadeScale} initial="hidden" animate="visible" exit="exit" className="w-full h-full flex items-center justify-center relative p-8">
      <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
        {/* Central Core */}
        <motion.div 
           initial={{ scale: 0.8, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl flex items-center justify-center z-10 shadow-2xl relative"
        >
          <Layers className="w-8 h-8 text-white/90" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-[-1px] rounded-full border border-dashed border-white/20"
          />
        </motion.div>

        {/* Orbiting Elements */}
        {['Salesforce', 'HubSpot', 'Slack'].map((app, i) => {
          const angle = (i * 360) / 3
          return (
            <motion.div
              key={app}
              initial={{ opacity: 0, rotate: angle - 45, translateY: 100 }}
              animate={{ opacity: 1, rotate: angle, translateY: 110 }}
              transition={{ delay: i * 0.3 + 0.5, type: 'spring' }}
              className="absolute origin-center"
              style={{
                transform: \`rotate(\${angle}deg) translateY(-110px) rotate(-\${angle}deg)\`
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/[0.1] flex items-center justify-center shadow-lg backdrop-blur-md relative overflow-hidden">
                   <span className="text-white/80 font-semibold text-xs">{app.slice(0, 2).toUpperCase()}</span>
                   <motion.div 
                     animate={{ y: ['-100%', '100%'] }}
                     transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                     className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"
                   />
                </div>
                <div className="text-[10px] text-white/50 tracking-wider uppercase font-medium bg-white/5 px-2 py-0.5 rounded">{app}</div>
              </div>
            </motion.div>
          )
        })}

        {/* Sync Pulses */}
        <svg className="absolute inset-0 w-full h-full -z-10" style={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1.5, fill: 'none', strokeDasharray: '4 4' }}>
           <circle cx="50%" cy="50%" r="110" />
        </svg>
      </div>
    </motion.div>
  )
}

function VisualVoiceAgent() {
  return (
    <motion.div variants={fadeScale} initial="hidden" animate="visible" exit="exit" className="w-full h-full flex flex-col items-center justify-center relative p-8">
      <div className="w-full max-w-[280px] rounded-[24px] bg-white/[0.02] border border-white/[0.08] p-6 shadow-2xl backdrop-blur-xl flex flex-col items-center relative gap-6 overflow-hidden">
        
        {/* Glow */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-white/5 blur-3xl rounded-full"
        />

        <div className="w-16 h-16 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center relative z-10">
          <Phone className="w-6 h-6 text-white/90" />
        </div>

        <div className="flex items-center gap-1.5 z-10">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-white/70 rounded-full"
              initial={{ height: 4 }}
              animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
              transition={{ duration: 1.5 + (i % 3) * 0.2, repeat: Infinity, ease: 'easeInOut', delay: i * 0.05 }}
            />
          ))}
        </div>

        <div className="w-full bg-white/[0.03] rounded-xl p-3 border border-white/[0.05] z-10">
           <div className="flex items-center justify-between mb-2">
             <span className="text-[10px] uppercase tracking-wider text-[#B8B8B8]">Live Transcript</span>
             <span className="text-[10px] text-white/40 font-mono">01:42</span>
           </div>
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="text-xs text-white/80 leading-relaxed"
           >
             "Yes, we are currently evaluating solutions for next quarter..."
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, y: 5 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 1.5 }}
             className="mt-3 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#0F0F10] bg-white/90 px-2 py-1 rounded"
           >
             <CheckCircle className="w-3 h-3" /> Qualified
           </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const features = [
  {
    label: 'State 1',
    title: 'B2B Database',
    description: 'Access verified people and company records, then enrich every identified visitor with firmographic data, contact details, and buying context in one step.',
    Visual: VisualDatabase,
  },
  {
    label: 'State 2',
    title: 'Co-pilot',
    description: 'Generate personalized outreach, talking points, and next steps based on visitor behavior and account context — in seconds.',
    Visual: VisualCoPilot,
  },
  {
    label: 'State 3',
    title: 'Social Warmup Agent',
    description: 'Choose from an agent library that warms up accounts before direct outreach starts.',
    Visual: VisualSocialAgent,
  },
  {
    label: 'State 4',
    title: 'Workflow Automation',
    description: 'Route high-intent visitors into alerts, sequences, and next best actions without manual handoff.',
    Visual: VisualWorkflow,
  },
  {
    label: 'State 5',
    title: 'CRM Integration',
    description: 'Sync enriched leads into the tools your sales team already lives in.',
    Visual: VisualCRM,
  },
  {
    label: 'State 6',
    title: 'GTM Voice Agent',
    description: 'Autonomous outbound calls with real-time qualification, objection handling, and CRM logging.',
    Visual: VisualVoiceAgent,
  },
]

// ─────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────

export default function PlatformSuite() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // 6 features -> each feature takes 1/6th of the scroll progress
  const activeIndexRaw = useTransform(scrollYProgress, (val) => {
    return Math.min(features.length - 1, Math.floor(val * features.length))
  })

  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    return activeIndexRaw.on("change", (latest) => {
      setActiveIndex(latest)
    })
  }, [activeIndexRaw])

  return (
    <section className="bg-void relative">
      <div className="py-24 container-limit">
        <SectionReveal className="text-center">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-primary tracking-tight">
            Everything you need to turn traffic into pipeline
          </h2>
          <p className="mt-4 text-lg text-text-secondary max-w-xl mx-auto">
            Six autonomous agents. One unified system. Zero manual work.
          </p>
        </SectionReveal>
      </div>

      {/* Scroll area that dictates height */}
      <div ref={containerRef} className="relative w-full" style={{ height: \`\${features.length * 100}vh\` }}>
        
        {/* Sticky Container */}
        <div className="sticky top-0 h-screen flex flex-col md:flex-row items-center justify-center p-6 sm:p-12 overflow-hidden">
          
          {/* Background effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/[0.02] rounded-full blur-[100px]" />
          </div>

          <div className="w-full max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 lg:gap-24 relative z-10 h-full max-h-[800px]">
            
            {/* Left Box: Content */}
            <div className="w-full md:w-[45%] flex flex-col justify-center h-1/2 md:h-full relative">
              
              {/* Progress Map (Desktop Only) */}
              <div className="hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 flex-col gap-3">
                {features.map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <div className={\`w-1.5 h-1.5 rounded-full transition-colors duration-500 \${activeIndex === i ? 'bg-white' : 'bg-white/20'}\`} />
                    {i !== features.length - 1 && (
                      <div className="w-px h-6 bg-white/10 rounded-full" />
                    )}
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  variants={slideFade}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-4"
                >
                  <div className="text-[11px] font-semibold tracking-[0.2em] text-[#B8B8B8] uppercase">
                    {features[activeIndex].title}
                  </div>
                  <h3 className="text-3xl lg:text-5xl font-display font-semibold text-white tracking-tight">
                    {features[activeIndex].title}
                  </h3>
                  <p className="text-lg text-text-secondary leading-relaxed max-w-md mt-2">
                    {features[activeIndex].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Box: Visuals */}
            <div className="w-full md:w-[55%] h-1/2 md:h-full flex items-center justify-center relative bg-white/[0.02] border border-white/[0.08] rounded-[32px] overflow-hidden">
               {/* Grid Pattern inside Visual Area */}
               <div className="absolute inset-0 opacity-[0.15] mix-blend-screen pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
               <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/60 pointer-events-none" />
               
               <AnimatePresence mode="wait">
                 {React.createElement(features[activeIndex].Visual, { key: activeIndex })}
               </AnimatePresence>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
`

const targetPath = path.resolve('/Users/prakharsrivastava/Downloads/outmate-frontend/src/sections/home/PlatformSuite.tsx');
fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully wrote new PlatformSuite.tsx');
