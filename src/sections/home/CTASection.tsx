import { Link } from 'react-router-dom'
import SectionReveal from '../../components/SectionReveal'

export default function CTASection() {
  return (
    <section className="py-32 lg:py-40 bg-void">
      <div className="container-limit text-center">
        <SectionReveal>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-text-primary tracking-tight">
            Ready to see who's on your site?
          </h2>
          <div className="mt-8">
            <Link to="/pricing" className="btn-primary">
              Start Free Trial
            </Link>
          </div>
          <p className="mt-4 text-sm text-text-muted">
            No credit card. 30 days. Full platform access.
          </p>
        </SectionReveal>
      </div>
    </section>
  )
}
