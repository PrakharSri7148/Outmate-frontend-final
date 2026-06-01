import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import PromoBar from './PromoBar'
import Navbar from './Navbar'
import Footer from './Footer'
import ClosingBrandSection from './ClosingBrandSection'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-[100dvh] bg-void text-text-primary">
      <PromoBar />
      <Navbar />
      {/* Offset content by the promo bar height so the pushed-down navbar
          keeps its original clearance over each page's hero (40px mobile / 44px). */}
      <main className="pt-10 sm:pt-11">
        <Outlet />
      </main>
      <Footer />
      <ClosingBrandSection />
    </div>
  )
}
