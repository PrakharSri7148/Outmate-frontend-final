import { Link } from 'react-router-dom'

// A single copy of the marquee content (badge + message + CTA).
// Rendered multiple times inside the track so the loop is seamless.
// Only the first copy is exposed to assistive tech; the duplicates are
// purely visual and are hidden from the accessibility tree + tab order.
function PromoContent({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="marquee-item" aria-hidden={duplicate || undefined}>
      <span className="promo-badge">Free Trial</span>
      <span className="promo-message">
        See exactly who's visiting your site — turn anonymous traffic into qualified leads. Start free, no card required.
      </span>
      <Link
        to="/pricing"
        className="promo-cta"
        tabIndex={duplicate ? -1 : undefined}
      >
        Start free trial
        <span className="promo-arrow">→</span>
      </Link>
    </div>
  )
}

export default function PromoBar() {
  return (
    <div className="promo-bar" role="region" aria-label="Free trial promotion">
      <div className="marquee-track">
        {/* Duplicated 3x for a seamless infinite loop */}
        <PromoContent />
        <PromoContent duplicate />
        <PromoContent duplicate />
      </div>
    </div>
  )
}
