import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import SiteNav from './SiteNav'
import Footer from './Footer'
import ClosingBrandSection from './ClosingBrandSection'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-[100dvh] bg-void text-text-primary">
      <SiteNav />
      {/* Clear the fixed promobar (32px) + navbar (~72px) so each page's hero
          isn't hidden behind the shared header. Matches the home page offset. */}
      <main style={{ paddingTop: 'calc(40px + 72px + clamp(12px,2.5vw,32px))' }}>
        <Outlet />
      </main>
      <Footer />
      <ClosingBrandSection />
    </div>
  )
}
