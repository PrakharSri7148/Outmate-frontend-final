import UseCasePage from '../sections/use-cases/UseCasePage'
import { aiOutboundContent } from '../sections/use-cases/content/ai-outbound'
import { AIOutboundHero, AIOutboundDeepDive, DeliverabilityBlock } from '../sections/use-cases/wow/ai-outbound'

export default function AIOutbound() {
  return (
    <UseCasePage
      content={aiOutboundContent}
      heroVisual={<AIOutboundHero />}
      deepDiveVisual={<AIOutboundDeepDive />}
      deliverability={<DeliverabilityBlock />}
    />
  )
}
