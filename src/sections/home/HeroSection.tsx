import { useEffect, useRef, useState, type CSSProperties } from 'react'
import styles from './HeroSection.module.css'

const trustBadges = [
  { label: 'SOC 2 Type II', icon: 'shield' },
  { label: 'GDPR & CCPA', icon: 'lock' },
  { label: '100+ teams', icon: 'users' },
  { label: '4.8 Capterra', icon: 'star' },
  { label: '4.8 G2', icon: 'spark' },
]

function renderBadgeIcon(kind: string) {
  switch (kind) {
    case 'shield':
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="M8 1.5 13 3.4v4.1c0 3.2-2 5.9-5 7-3-1.1-5-3.8-5-7V3.4L8 1.5Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
          <path d="M5.8 8.2 7.1 9.5 10.2 6.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'lock':
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M4.5 7V5.3a3.5 3.5 0 1 1 7 0V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <rect x="3.5" y="7" width="9" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )
    case 'users':
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M5.2 7.2a2.1 2.1 0 1 1 4.2 0 2.1 2.1 0 0 1-4.2 0Z" stroke="currentColor" strokeWidth="1.2" />
          <path d="M2.8 13.2c.7-2 2.4-3.2 5.2-3.2s4.5 1.2 5.2 3.2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'star':
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path
            d="m8 1.8 1.6 3.3 3.6.5-2.6 2.6.6 3.7L8 10.2 4.8 11.9l.6-3.7L2.8 5.6l3.6-.5L8 1.8Z"
            stroke="currentColor"
            strokeWidth="1.1"
            strokeLinejoin="round"
          />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 16 16" fill="none" aria-hidden>
          <path d="M8 2.2 9.6 6l4 .3-3 2.6.9 3.9L8 10.7l-3.5 2.1.9-3.9-3-2.6L6.4 6 8 2.2Z" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
        </svg>
      )
  }
}

function delayStyle(delay: string): CSSProperties {
  return { ['--delay' as string]: delay } as CSSProperties
}

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = sectionRef.current

    if (!element) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.24 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className={`${styles.section} ${isVisible ? styles.visible : ''}`}>
      <div aria-hidden className={styles.ambientGlow} />
      <div aria-hidden className={styles.noise} />

      <div className={styles.inner}>
        <div className={styles.content}>
        <div className={styles.eyebrowWrap} style={delayStyle('0s')}>
          <span className={styles.eyebrow}>#1 WEBSITE VISITOR IDENTIFICATION PLATFORM</span>
        </div>

        <h1 className={styles.headline} aria-label="CONVERT VISITORS TO QUALIFIED LEADS">
          <span className={styles.headlineLine} style={delayStyle('0.05s')}>
            CONVERT VISITORS
          </span>
          <span className={styles.headlineLine} style={delayStyle('0.12s')}>
            TO QUALIFIED LEADS
          </span>
        </h1>

        <p className={styles.subheadline} style={delayStyle('0.2s')}>
          Identify anonymous website visitors, enrich contact data in real time, and trigger outbound workflows
          automatically before competitors even know the account exists.
        </p>

        <div className={styles.buttons} style={delayStyle('0.3s')}>
          <a href="/book-demo" className={styles.primaryButton}>
            Book a Demo
          </a>
          <a href="/platform" className={styles.secondaryButton}>
            <span>See Platform</span>
            <span className={styles.arrow} aria-hidden>
              →
            </span>
          </a>
        </div>

        <p className={styles.trustLine} style={delayStyle('0.42s')}>
          14-day free trial · No credit card · 5 min setup · Cancel anytime
        </p>

        <ul className={styles.badges} aria-label="Trust badges">
          {trustBadges.map((badge, index) => (
            <li key={badge.label} className={styles.badge} style={delayStyle(`${0.48 + index * 0.05}s`)}>
              <span className={styles.badgeIcon} aria-hidden>
                {renderBadgeIcon(badge.icon)}
              </span>
              <span>{badge.label}</span>
            </li>
          ))}
        </ul>
        </div>
      </div>
    </section>
  )
}
