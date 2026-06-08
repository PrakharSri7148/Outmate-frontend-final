import { motion, useReducedMotion } from 'framer-motion'

// ──────────────────────────────────────────────────────────────────────────────
//  Integration logos — real, full-color brand marks living in
//  /public/images/integrations/
// ──────────────────────────────────────────────────────────────────────────────
const LOGOS = [
  { name: 'Microsoft Copilot', src: '/images/integrations/microsoft-copilot.png' },
  { name: 'Google Docs', src: '/images/integrations/google-docs.png' },
  { name: 'Google Drive', src: '/images/integrations/google-drive.png' },
  { name: 'OneDrive', src: '/images/integrations/onedrive.png' },
  { name: 'SharePoint', src: '/images/integrations/sharepoint.png' },
  { name: 'Confluence', src: '/images/integrations/confluence.png' },
  { name: 'GitHub', src: '/images/integrations/github.png' },
  { name: 'Asana', src: '/images/integrations/asana.png' },
  { name: 'Airtable', src: '/images/integrations/airtable.png' },
  { name: 'Microsoft Teams', src: '/images/integrations/microsoft-teams.png' },
  { name: 'WhatsApp', src: '/images/integrations/whatsapp.png' },
]

const ease = [0.22, 1, 0.36, 1] as const

// Split the logos across two stacked strips (recomputed from length so it stays
// correct if logos are added/removed).
const mid = Math.ceil(LOGOS.length / 2)
const topLogos = LOGOS.slice(0, mid)
const bottomLogos = LOGOS.slice(mid)

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

// One continuously-scrolling strip. Content is duplicated so the linear loop is
// gap-free; `reverse` flips the scroll direction.
function MarqueeStrip({
  logos,
  duration,
  reverse = false,
}: {
  logos: { name: string; src: string }[]
  duration: number
  reverse?: boolean
}) {
  return (
    <motion.div
      className="flex w-max items-center gap-12 md:gap-20"
      animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
      transition={{ duration, ease: 'linear', repeat: Infinity, repeatType: 'loop' }}
    >
      {[...logos, ...logos].map((logo, i) => (
        <Logo key={`${logo.name}-${i}`} {...logo} />
      ))}
    </motion.div>
  )
}

export default function WorkflowIntegrations() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-white pt-12 md:pt-16 pb-24 md:pb-32">
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
            Push your leads into
            <br />
            your favorite tools.
          </h2>
          <p className="mt-5 max-w-[64ch] text-[16px] leading-relaxed text-slate-600 md:text-[17px]">
            Streamline your lead generation process by pushing your leads into your CRM, Slack, Email
            &amp; LinkedIn automation tools and more.
          </p>
        </motion.div>
      </div>

      {/* ── Logo marquee · two strips scrolling in opposite directions ── */}
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
          <div className="flex flex-col gap-8 md:gap-10">
            {/* Top strip · first half · scrolls left */}
            <MarqueeStrip logos={topLogos} duration={28} />
            {/* Bottom strip · second half · scrolls right */}
            <MarqueeStrip logos={bottomLogos} duration={34} reverse />
          </div>
        )}
      </div>
    </section>
  )
}
