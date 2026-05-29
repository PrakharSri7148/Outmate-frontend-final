import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SectionReveal from '../../components/SectionReveal'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    question: "How does Outmate identify anonymous visitors?",
    answer: "Outmate uses a proprietary identity graph to resolve anonymous IP addresses and device fingerprints into person-level data, including LinkedIn profiles and professional email addresses."
  },
  {
    question: "What countries does person-level identification cover?",
    answer: "We provide global coverage with high match rates across North America, Europe, and Asia-Pacific regions, leveraging a multi-source data network."
  },
  {
    question: "How is data enriched automatically?",
    answer: "Every identified visitor is immediately passed through our enrichment engine, which appends 50+ firmographic and demographic data points in real-time."
  },
  {
    question: "Does Outmate integrate with my existing CRM?",
    answer: "Yes, Outmate offers native integrations with Salesforce, HubSpot, Pipedrive, and Slack, ensuring your sales team gets leads where they already work."
  },
  {
    question: "Can I automate workflows after identification?",
    answer: "Absolutely. You can trigger automated email sequences, Slack alerts, or CRM updates the moment a high-intent visitor lands on your site."
  }
]

function FAQItem({ question, answer }: { question: string, answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] transition-all text-left group"
      >
        <span className="text-lg md:text-xl font-medium text-white/90 group-hover:text-white">{question}</span>
        <motion.div
           animate={{ rotate: isOpen ? 180 : 0 }}
           className="shrink-0 ml-4"
        >
          {isOpen ? <Minus className="w-5 h-5 text-white/50" /> : <Plus className="w-5 h-5 text-white/50" />}
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-2 text-[#B8B8B8] text-lg leading-relaxed max-w-3xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section className="bg-[#0F0F10] py-32 relative overflow-hidden">
      <div className="container-limit mx-auto px-4 md:px-6 relative z-10">
        <SectionReveal>
          <div className="flex flex-col items-center text-center space-y-4 mb-16">
             <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold text-white tracking-tight">
                Website Identification FAQs
             </h2>
          </div>
        </SectionReveal>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, i) => (
            <SectionReveal key={i} delay={i * 0.1}>
              <FAQItem {...faq} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
