import UseCasePage from '../sections/use-cases/UseCasePage'
import { enrichRouteLeadsContent } from '../sections/use-cases/content/enrich-route-leads'
import { EnrichHero, EnrichDeepDive } from '../sections/use-cases/wow/enrich'

export default function EnrichRouteLeads() {
  return (
    <UseCasePage
      content={enrichRouteLeadsContent}
      heroVisual={<EnrichHero />}
      deepDiveVisual={<EnrichDeepDive />}
    />
  )
}
