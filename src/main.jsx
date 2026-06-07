import React, { useState, useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// ─── Components ────────────────────────────────
import HomePage from './components/HomePage'
import FlowerBloomOverlay from './components/FlowerBloomOverlay'
import FlowerTransition from './components/FlowerTransition'
import Certificate from './components/Certificate'
import PolaroidGallery from './components/PolaroidGallery'
import FriendshipLetter from './components/FriendshipLetter'

// ─── Divider Component ─────────────────────────
function SectionDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-8 select-none">
      <span className="text-blush/40 text-lg">✿</span>
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-blush/30 to-transparent" />
      <span className="text-lavender/40 text-lg">✿</span>
      <div className="h-px w-16 bg-gradient-to-r from-transparent via-lavender/30 to-transparent" />
      <span className="text-blush/40 text-lg">✿</span>
    </div>
  )
}

// ─── Main App ──────────────────────────────────
function App() {
  const [showFlowerBloom, setShowFlowerBloom] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const handleYesClick = useCallback(() => {
    setShowFlowerBloom(true)
  }, [])

  const handleFlowerComplete = useCallback(() => {
    setShowFlowerBloom(false)
    setShowContent(true)
    // Scroll to top after content appears
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
  }, [])

  useEffect(() => {
    if (!showFlowerBloom || showContent) return

    const fallbackTimer = window.setTimeout(() => {
      setShowFlowerBloom(false)
      setShowContent(true)
    }, 8000)

    return () => window.clearTimeout(fallbackTimer)
  }, [showFlowerBloom, showContent])

  return (
    <div className="relative min-h-screen">
      {/* Flower bloom overlay – covers screen when Yes is clicked */}
      <FlowerBloomOverlay
        isActive={showFlowerBloom}
        onComplete={handleFlowerComplete}
      />

      {/* Show either the Home Page or the Scrapbook Content */}
      {!showContent ? (
        /* ── HOME PAGE: Will you be my best friend forever? ── */
        <HomePage onYesClick={handleYesClick} />
      ) : (
        /* ── SCRAPBOOK CONTENT ── */
        <main
          style={{
            background: 'linear-gradient(180deg, #f0e6ff 0%, #FFF8EE 8%, #FFF8EE 92%, #fff0f5 100%)',
          }}
        >
          {/* 🏆 Certificate – first thing revealed */}
          <Certificate />

          {/* 🌸 Flower Transition */}
          <FlowerTransition variant="cherry" />

          <SectionDivider />

          {/* 📸 Polaroid Gallery – with real photos */}
          <PolaroidGallery />

          {/* 🌹 Flower Transition */}
          <FlowerTransition variant="roses" />

          <SectionDivider />

          {/* 💌 Friendship Letter */}
          <FriendshipLetter />

          {/* Footer */}
          <footer className="py-16 text-center">
            <p className="font-handwritten text-warmbrown/40 text-lg">
              Made with ❤️ by Vinay for Rasna
            </p>
            <p className="font-handwritten text-warmbrown/30 text-sm mt-2">
              Happy National Best Friend Day 2026 🌸
            </p>
          </footer>
        </main>
      )}
    </div>
  )
}

// ─── Mount ─────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
