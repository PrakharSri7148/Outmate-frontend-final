import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowRight } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Website Identification', path: '#' },
        { label: 'B2B Database', path: '#' },
        { label: 'Co-Pilot', path: '#' },
        { label: 'Voice AI Agent', path: '#' },
        { label: 'Social Agent', path: '#' },
        { label: 'Workflow Automation', path: '#' }
      ]
    },
    {
      title: 'Use Cases',
      links: [
        { label: 'Sales Teams', path: '#' },
        { label: 'Marketing Teams', path: '#' },
        { label: 'RevOps', path: '#' },
        { label: 'Agencies', path: '#' },
        { label: 'Founder-Led GTM', path: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', path: '#' },
        { label: 'API Docs', path: '#' },
        { label: 'Integrations', path: '#' },
        { label: 'Compare', path: '#' },
        { label: 'Labs', path: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About', path: '#' },
        { label: 'Careers', path: '#' },
        { label: 'Pricing', path: '#' },
        { label: 'Contact', path: '#' }
      ]
    }
  ]

  return (
    <footer className="bg-[#0B0B0C] py-24 md:py-32 border-t border-white/[0.08] relative overflow-hidden antialiased selection:bg-white/10" style={{ fontFamily: '"Inter", "SF Pro Display", "Neue Haas Grotesk Display", sans-serif', textRendering: 'optimizeLegibility' }}>
      <div className="container-limit mx-auto px-4 md:px-6 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 mb-24">
          
          {/* Left Column: Brand & Logo area */}
          <div className="lg:col-span-5 flex flex-col items-start px-0">
            <h2 className="text-[44px] md:text-[58px] lg:text-[102px] leading-[0.80] tracking-[-0.1em] lg:-ml-56 uppercase font-[900] text-white/96 max-w-[1050px] transition-all duration-500 hover:text-white" style={{ textRendering: 'optimizeLegibility' }}>
              THE AI GTM PLATFORM TURNING ANONYMOUS TRAFFIC INTO QUALIFIED PIPELINE
            </h2>

            <div className="mt-20 hidden lg:block lg:-ml-56">
               <div className="text-white/38 text-[15px] mb-3">© Outmate {currentYear}</div>
               <div className="flex gap-8">
                 {['Privacy Policy', 'Terms', 'Contact'].map(link => (
                   <Link key={link} to="#" className="text-[15px] text-white/38 hover:text-white/70 transition-colors duration-300 tracking-wide">{link}</Link>
                 ))}
               </div>
            </div>
          </div>

          {/* Right Columns: Links & AI Assistant */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 md:gap-12">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col">
                <h4 className="text-[12px] tracking-[0.22em] uppercase font-semibold text-white/85 mb-8">{section.title}</h4>
                <ul className="flex flex-col space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        to={link.path} 
                        className="text-[17px] leading-[1.7] font-[450] text-white/58 transition-all duration-300 hover:text-white inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* AI Assistant Card Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 min-w-[240px] flex flex-col gap-12">
              <motion.div 
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-2xl relative group overflow-hidden"
              >
                {/* Subtle Glow */}
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />
                
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[12px] tracking-[0.1em] uppercase font-semibold text-white/85">Ask AI</span>
                </div>
                
                <h5 className="text-[26px] font-medium tracking-[-0.03em] text-white mb-2">Ask AI about Outmate</h5>
                <p className="text-[16px] leading-[1.7] text-white/50 font-[430] mb-8">
                  Get answers about GTM workflows, visitor identification, and outbound automation.
                </p>
                
                <button className="w-full h-12 rounded-lg bg-white text-black text-[15px] font-medium tracking-[-0.01em] flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors">
                  Open AI Assistant
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>

              {/* Brand Logo moved below card */}
              <div className="flex items-center gap-3 px-2">
                <img 
                  src="/images/logo.jpeg" 
                  alt="Outmate" 
                  className="w-10 h-10 rounded-xl object-cover" 
                />
                <span className="text-[24px] font-semibold tracking-[-0.05em] text-white">OUTMATE</span>
              </div>
            </div>
          </div>

          {/* Mobile Footer Bottom */}
          <div className="lg:hidden col-span-1 border-t border-white/5 pt-10">
             <div className="text-[15px] text-white/38 mb-4">© Outmate {currentYear}</div>
             <div className="flex flex-wrap gap-x-8 gap-y-2">
               {['Privacy Policy', 'Terms', 'Contact'].map(link => (
                 <Link key={link} to="#" className="text-[15px] text-white/38 hover:text-white/70 transition-colors duration-300">{link}</Link>
               ))}
             </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
