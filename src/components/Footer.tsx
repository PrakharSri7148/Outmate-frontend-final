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
    <footer className="bg-[#0B0B0C] pt-20 pb-12 md:pt-24 md:pb-16 border-t border-white/[0.08] relative overflow-hidden antialiased selection:bg-white/10" style={{ fontFamily: '"Inter", "SF Pro Display", "Neue Haas Grotesk Display", sans-serif', textRendering: 'optimizeLegibility' }}>
      <div className="container-limit mx-auto px-4 md:px-6 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-12 lg:mb-16">

          {/* Left Column: Brand & Logo area */}
          <div className="lg:col-span-5 flex flex-col items-start px-0">
            <h2 className="text-[35px] md:text-[46px] lg:text-[82px] leading-[0.80] tracking-[-0.1em] lg:-ml-16 uppercase font-[900] text-white/96 max-w-[1050px] transition-all duration-500 hover:text-white" style={{ textRendering: 'optimizeLegibility' }}>
              THE AI GTM PLATFORM TURNING ANONYMOUS TRAFFIC INTO QUALIFIED PIPELINE
            </h2>

            <div className="mt-16 hidden lg:block lg:-ml-16 lg:w-full lg:text-center">
               <div className="text-white/38 text-[12px] mb-2.5">© Outmate {currentYear}</div>
               <div className="flex gap-6 lg:justify-center">
                 {['Privacy Policy', 'Terms', 'Contact'].map(link => (
                   <Link key={link} to="#" className="text-[12px] text-white/38 hover:text-white/70 transition-colors duration-300 tracking-wide">{link}</Link>
                 ))}
               </div>
               <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-center">
                 <span className="text-[14px] font-medium text-white">Sign up to our newsletter</span>
                 <a
                   href="https://www.linkedin.com/company/outmateai/posts/?feedView=all"
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.04] px-4 text-[12px] font-medium text-white transition-colors hover:border-white/25 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0C]"
                 >
                   Follow on LinkedIn
                   <ArrowRight className="h-3.5 w-3.5" />
                 </a>
               </div>
            </div>
          </div>

          {/* Right Columns: Links & AI Assistant */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 md:gap-10">
            {footerSections.map((section) => (
              <div key={section.title} className="flex flex-col">
                <h4 className="text-[10px] tracking-[0.22em] uppercase font-semibold text-white/85 mb-6">{section.title}</h4>
                <ul className="flex flex-col space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="text-[14px] leading-[1.7] font-[450] text-white/58 transition-all duration-300 hover:text-white inline-block"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* AI Assistant Card Column */}
            <div className="col-span-2 md:col-span-4 lg:col-span-1 min-w-[192px] flex flex-col gap-10">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] shadow-2xl relative group overflow-hidden"
              >
                {/* Subtle Glow */}
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors" />

                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] tracking-[0.1em] uppercase font-semibold text-white/85">Ask AI</span>
                </div>

                <h5 className="text-[21px] font-medium tracking-[-0.03em] text-white mb-2">Ask AI about Outmate</h5>
                <p className="text-[13px] leading-[1.7] text-white/50 font-[430] mb-6">
                  Get answers about GTM workflows, visitor identification, and outbound automation.
                </p>

                <button className="w-full h-10 rounded-lg bg-white text-black text-[12px] font-medium tracking-[-0.01em] flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors">
                  Open AI Assistant
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>

              {/* Brand Logo moved below card */}
              <div className="flex items-center gap-2.5 px-2">
                <img
                  src="/images/logo.jpeg"
                  alt="Outmate"
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <span className="text-[19px] font-semibold tracking-[-0.05em] text-white">OUTMATE</span>
              </div>
            </div>
          </div>

          {/* Mobile Footer Bottom */}
          <div className="lg:hidden col-span-1 border-t border-white/5 pt-6">
             <div className="text-[12px] text-white/38 mb-3">© Outmate {currentYear}</div>
             <div className="flex flex-wrap gap-x-6 gap-y-2">
               {['Privacy Policy', 'Terms', 'Contact'].map(link => (
                 <Link key={link} to="#" className="text-[12px] text-white/38 hover:text-white/70 transition-colors duration-300">{link}</Link>
               ))}
             </div>
             <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-center">
               <span className="text-[14px] font-medium text-white">Sign up to our newsletter</span>
               <a
                 href="https://www.linkedin.com/company/outmateai/posts/?feedView=all"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/[0.15] bg-white/[0.04] px-4 text-[12px] font-medium text-white transition-colors hover:border-white/25 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0C]"
               >
                 Follow on LinkedIn
                 <ArrowRight className="h-3.5 w-3.5" />
               </a>
             </div>
          </div>

        </div>
      </div>
    </footer>
  )
}
