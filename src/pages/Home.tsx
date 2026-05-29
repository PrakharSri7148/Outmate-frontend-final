import HeroSection from '../sections/home/HeroSection'
import PlatformSandbox from '../sections/home/PlatformSandbox'
import TrafficIdentificationSection from '../sections/home/TrafficIdentificationSection'
import IdentityResolution from '../sections/home/IdentityResolution'
import HowItWorks from '../sections/home/HowItWorks'
import WorkflowIntegrations from '../sections/home/WorkflowIntegrations'
import FeatureShowcase from '../sections/home/FeatureShowcase'
import TrustMetrics from '../sections/home/TrustMetrics'
import PlatformSuite from '../sections/home/PlatformSuite'
import CustomerProofSection from '../sections/home/CustomerProofSection'
import UseCasesSection from '../sections/home/UseCasesSection'
import TrustPositioning from '../sections/home/TrustPositioning'
import TestimonialSection from '../sections/home/TestimonialSection'
import AnalyticsSection from '../sections/home/AnalyticsSection'
import SignalEngineCTA from '../sections/home/SignalEngineCTA'
import { DynamicIslandNav } from '../components/DynamicIslandNav'

export default function Home() {
  return (
    <div className="relative z-[2]">
      <div id="hero" className="relative z-[2]">
        <HeroSection />
      </div>
      <div className="relative z-[2]">
        <TrafficIdentificationSection />
      </div>
      <div id="platform-sandbox" className="relative z-[2] bg-white">
        <PlatformSandbox />
      </div>
      <div id="identity-resolution">
        <IdentityResolution />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="integrations">
        <WorkflowIntegrations />
      </div>
      <FeatureShowcase />
      <TrustMetrics />
      {/* PlatformSuite removed per request */}
      <CustomerProofSection />
      <div id="use-cases">
        <UseCasesSection />
      </div>
      <TrustPositioning />
      <TestimonialSection />
      <div id="analytics">
        <AnalyticsSection />
      </div>
      <SignalEngineCTA />
      <div id="footer" className="h-10" />
      <DynamicIslandNav />
    </div>
  )
}
