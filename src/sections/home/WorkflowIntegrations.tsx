import { motion, useReducedMotion } from 'framer-motion'

// ──────────────────────────────────────────────────────────────────────────────
//  Integration logos — real, full-color brand marks living in
//  /public/images/integrations/*.svg
// ──────────────────────────────────────────────────────────────────────────────
const LOGOS = [
  { name: 'Outlook', src: '/images/integrations/outlook.svg' },
  { name: 'Lemlist', src: '/images/integrations/lemlist.svg' },
  { name: 'Zapier', src: '/images/integrations/zapier.svg' },
  { name: 'Intercom', src: '/images/integrations/intercom.svg' },
  { name: 'Pipedrive', src: '/images/integrations/pipedrive.svg' },
  { name: 'Salesforce', src: '/images/integrations/salesforce.svg' },
  { name: 'HubSpot', src: '/images/integrations/hubspot.svg' },
  { name: 'Apollo', src: '/images/integrations/apollo.svg' },
  { name: 'Google Analytics', src: '/images/integrations/google-analytics.svg' },
  { name: 'Slack', src: '/images/integrations/slack.svg' },
  { name: 'Gmail', src: '/images/integrations/gmail.svg' },
  { name: 'LinkedIn', src: '/images/integrations/linkedin.svg' },
  { name: 'Excel', src: '/images/integrations/excel.svg' },
]

const ease = [0.22, 1, 0.36, 1] as const

function Logo({ name, src }: { name: string; src: string }) {
  return (
    <div className="flex shrink-0 items-center justify-center px-2 transition-transform duration-300 hover:scale-110">
      <img
        src={src}
        alt={name}
        loading="lazy"
        draggable={false}
        className="h-11 w-auto select-none object-contain md:h-14"
      />
    </div>
  )
}

export default function WorkflowIntegrations() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="relative mx-auto max-w-[1280px] px-5 md:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.7, ease }}
          className="mb-12 text-left md:mb-16"
        >
          <span className="font-mono text-[11px] font-medium uppercase tracking-[0.26em] text-blue-600">
            Integrations
          </span>
          <h2
            className="mt-4 max-w-[20ch] font-display font-extrabold leading-[1.02] tracking-[-0.04em] text-black"
            style={{ fontSize: 'clamp(40px, 6vw, 80px)' }}
          >
            Push your leads into your favorite tools.
          </h2>
          <p className="mt-5 max-w-[64ch] text-[16px] leading-relaxed text-slate-600 md:text-[17px]">
            Streamline your lead generation process by pushing your leads into your CRM, Slack, Email
            &amp; LinkedIn automation tools and more.
          </p>
        </motion.div>
      </div>

      {/* ── Logo marquee · slides left → right, then reverses back ── */}
      <div
        className="relative w-full overflow-hidden py-4"
        style={{
          maskImage:
            'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
        }}
      >
        {reduceMotion ? (
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-12 gap-y-8 px-5 md:px-8">
            {LOGOS.map((logo) => (
              <Logo key={logo.name} {...logo} />
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max items-center gap-12 md:gap-20"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 26,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            {/* Rendered twice so the row stays full while sliding both directions */}
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <Logo key={`${logo.name}-${i}`} {...logo} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
