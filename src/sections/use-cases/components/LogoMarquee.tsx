import { motion, useReducedMotion } from 'framer-motion'

// Real, full-color brand marks living in /public/images/integrations/
export const INTEGRATION_LOGOS = [
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

type LogoItem = { name: string; src: string }

function Logo({ name, src }: LogoItem) {
  return (
    <div className="flex shrink-0 items-center justify-center px-2 transition-transform duration-300 hover:scale-110">
      <img
        src={src}
        alt={name}
        loading="lazy"
        draggable={false}
        className="h-9 w-auto select-none object-contain md:h-11"
      />
    </div>
  )
}

function Strip({ logos, duration, reverse = false }: { logos: LogoItem[]; duration: number; reverse?: boolean }) {
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

// Single-row infinite logo marquee with edge fade. Reused for the hero logo wall
// and the lower "fits your stack" integrations band.
export default function LogoMarquee({
  logos = INTEGRATION_LOGOS,
  duration = 32,
  className = '',
}: {
  logos?: LogoItem[]
  duration?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  return (
    <div
      className={`relative w-full overflow-hidden py-3 ${className}`}
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
      }}
    >
      {reduceMotion ? (
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-center gap-x-12 gap-y-6 px-5">
          {logos.map((logo) => (
            <Logo key={logo.name} {...logo} />
          ))}
        </div>
      ) : (
        <Strip logos={logos} duration={duration} />
      )}
    </div>
  )
}
