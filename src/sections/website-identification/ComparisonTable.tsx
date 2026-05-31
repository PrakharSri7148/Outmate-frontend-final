import { Check, Minus } from 'lucide-react'
import SectionReveal from '../../components/SectionReveal'

const features = [
  'Person-level ID',
  'Match rate',
  'Countries',
  'Auto enrichment',
  'Workflow builder',
  'CRM sync',
  'Setup time',
  'Free trial'
]

const competitors = [
  {
    name: 'Outmate',
    isOutmate: true,
    data: [
      true,
      '40%+',
      '173+',
      true,
      true,
      true,
      '< 5 mins',
      true
    ]
  },
  {
    name: 'RB2B',
    isOutmate: false,
    data: [
      true,
      '15-20%',
      'US only',
      true,
      false,
      true,
      'Minutes',
      true
    ]
  },
  {
    name: 'Warmly',
    isOutmate: false,
    data: [
      false,
      '20-25%',
      'Global',
      true,
      false,
      true,
      'Hours',
      true
    ]
  },
  {
    name: 'Leadfeeder',
    isOutmate: false,
    data: [
      false,
      '30-40%',
      'Global',
      false,
      false,
      true,
      'Hours',
      true
    ]
  },
  {
    name: 'Common Room',
    isOutmate: false,
    data: [
      false,
      'Varies',
      'Global',
      true,
      true,
      true,
      'Days',
      false
    ]
  }
]

export default function ComparisonTable() {
  return (
    <section className="py-32 bg-void relative overflow-hidden">
      {/* Background Cinematic Glows */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-white/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="container-limit max-w-6xl relative z-10">
        <SectionReveal className="text-center mb-16">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            The only platform that<br className="hidden sm:block" /> identifies AND acts.
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
            Most tools stop at identification. Outmate identifies, enriches, scores, routes, and closes the loop — automatically.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <div className="relative rounded-[32px] bg-white/[0.02] border border-white/5 backdrop-blur-xl p-6 md:p-8 overflow-x-auto shadow-2xl">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="py-6 px-4 font-mono text-xs font-semibold tracking-widest text-white/40 uppercase border-b border-white/10 w-1/4">
                    Capabilities
                  </th>
                  {competitors.map((comp) => (
                    <th 
                      key={comp.name} 
                      className={`py-6 px-4 font-display text-lg font-bold border-b border-white/10 text-center ${comp.isOutmate ? 'text-white' : 'text-white/60'}`}
                    >
                      {comp.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={feature} className="group">
                    <td className="py-5 px-4 font-medium text-white/80 border-b border-white/5 group-hover:bg-white/[0.02] transition-colors">
                      {feature}
                    </td>
                    {competitors.map((comp) => {
                      const value = comp.data[i]
                      const isBoolean = typeof value === 'boolean'
                      
                      return (
                        <td 
                          key={`${comp.name}-${feature}`}
                          className={`py-5 px-4 text-center border-b border-white/5 transition-colors
                            ${comp.isOutmate ? 'bg-white/[0.03] group-hover:bg-white/[0.05]' : 'group-hover:bg-white/[0.02]'}
                          `}
                        >
                          <div className="flex justify-center items-center">
                            {isBoolean ? (
                              value ? (
                                <Check className={`w-5 h-5 ${comp.isOutmate ? 'text-green-400' : 'text-white/40'}`} />
                              ) : (
                                <Minus className="w-5 h-5 text-red-400/50" />
                              )
                            ) : (
                              <span className={`font-medium ${comp.isOutmate ? 'text-white' : 'text-white/60'}`}>
                                {value}
                              </span>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.4} className="mt-12">
          <div className="max-w-3xl mx-auto rounded-2xl bg-white/[0.03] border border-white/10 p-8 text-center backdrop-blur-md">
            <p className="font-mono text-sm font-semibold tracking-widest text-white/40 uppercase mb-4">The bottom line</p>
            <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium">
              RB2B gives you a name. Warmly sends a chat. <br className="hidden md:block" />
              <span className="text-white font-bold">Outmate gives you the name, the context, and closes the loop — automatically.</span>
            </p>
          </div>
        </SectionReveal>
      </div>
    </section>
  )
}
