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
    <div className="relative min-h-[100dvh] bg-void text-text-primary">
      <PromoBar />
      <Navbar />
      
      {/* 
        CURTAIN EFFECT:
        The content (main + Footer) is a relative container with z-10 and a solid background.
        The ClosingBrandSection is pinned behind it (z-0, sticky bottom).
        As the user scrolls to the end, the Footer slides off the viewport, revealing the section beneath.
      */}
      <div className="relative z-10 bg-void shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <main className="pt-10 sm:pt-11">
          <Outlet />
        </main>
        <Footer />
        {/* Spacer that creates the scroll depth to reveal the fixed section beneath */}
        <div className="h-[70vh] pointer-events-none" aria-hidden="true" />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-0 h-[70vh]">
        <ClosingBrandSection />
      </div>
    </div>
  )
}
