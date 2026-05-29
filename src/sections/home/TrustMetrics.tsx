import SectionReveal from '../../components/SectionReveal'
import AnimatedCounter from '../../components/AnimatedCounter'
import LampGlow from '../../components/LampGlow'

const metrics = [
  { value: 3, suffix: 'x', label: 'Pipeline generation', description: 'More qualified pipeline from the same traffic' },
  { value: 45, suffix: '%', label: 'Increase in win rate', description: 'Better targeting with intent data' },
  { value: 1, prefix: '<', suffix: 'm', label: 'Lead response time', description: 'Instant engagement when intent is hot' },
]

export default function TrustMetrics() {
  return (
    <>
      {/* Cinematic lamp glow transition + heading */}
      <LampGlow />

      {/* Metrics grid */}
      <section className="section-padding bg-[#050505]">
        <div className="container-limit">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {metrics.map((metric, i) => (
              <SectionReveal key={i} delay={i * 0.15}>
                <div className="glass-card p-10 text-center glass-card-hover">
                  <div className="font-display text-5xl lg:text-6xl font-bold text-purple tracking-tight">
                    {metric.prefix && <span>{metric.prefix}</span>}
                    <AnimatedCounter value={metric.value} />
                    <span>{metric.suffix}</span>
                  </div>
                  <div className="mt-3 font-display text-lg font-semibold text-text-primary">
                    {metric.label}
                  </div>
                  <p className="mt-2 text-sm text-text-muted">
                    {metric.description}
                  </p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
