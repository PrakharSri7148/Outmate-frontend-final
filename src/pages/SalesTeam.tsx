import UseCasePage from '../sections/use-cases/UseCasePage'
import { salesTeamContent } from '../sections/use-cases/content/sales-team'
import { SalesHero, SalesDeepDive } from '../sections/use-cases/wow/sales'

export default function SalesTeam() {
  return (
    <UseCasePage
      content={salesTeamContent}
      heroVisual={<SalesHero />}
      deepDiveVisual={<SalesDeepDive />}
    />
  )
}
