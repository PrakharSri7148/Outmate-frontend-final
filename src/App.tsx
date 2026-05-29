import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import WebsiteIdentification from './pages/WebsiteIdentification'
import B2BDatabase from './pages/B2BDatabase'
import CoPilot from './pages/CoPilot'
import VoiceAIAgent from './pages/VoiceAIAgent'
import SocialAgent from './pages/SocialAgent'
import SalesTeam from './pages/SalesTeam'
import Pricing from './pages/Pricing'
import Compare from './pages/Compare'
import RB2BCompare from './pages/RB2BCompare'
import WorkflowAutomation from './pages/WorkflowAutomation'
import Labs from './pages/Labs'
import FreeTools from './pages/FreeTools'
import CompareEveryone from './pages/CompareEveryone'
import { BookDemoPage } from './pages/BookDemo'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product/website-identification" element={<WebsiteIdentification />} />
        <Route path="/product/b2b-database" element={<B2BDatabase />} />
        <Route path="/product/co-pilot" element={<CoPilot />} />
        <Route path="/product/voice-ai-agent" element={<VoiceAIAgent />} />
        <Route path="/product/social-agent" element={<SocialAgent />} />
        <Route path="/product/workflow-automation" element={<WorkflowAutomation />} />
        <Route path="/use-cases/sales-team" element={<SalesTeam />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/compare/everyone" element={<CompareEveryone />} />
        <Route path="/compare/rb2b" element={<RB2BCompare />} />
        <Route path="/labs" element={<Labs />} />
        <Route path="/labs/free-tools" element={<FreeTools />} />
        <Route path="/book-demo" element={<BookDemoPage />} />
      </Route>
    </Routes>
  )
}
