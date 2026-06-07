import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useInView } from 'motion/react'
import html2canvas from 'html2canvas'

// Decorative floral SVG corner component
const FloralCorner = ({ className = '' }) => (
  <svg
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main flower */}
    <ellipse cx="18" cy="18" rx="8" ry="4" fill="#FFB7C5" opacity="0.7" transform="rotate(0 18 18)" />
    <ellipse cx="18" cy="18" rx="8" ry="4" fill="#FFB7C5" opacity="0.7" transform="rotate(60 18 18)" />
    <ellipse cx="18" cy="18" rx="8" ry="4" fill="#FFB7C5" opacity="0.7" transform="rotate(120 18 18)" />
    <circle cx="18" cy="18" r="3.5" fill="#f0c896" />
    {/* Small accent flower */}
    <ellipse cx="38" cy="10" rx="5" ry="2.5" fill="#DCC6FF" opacity="0.6" transform="rotate(0 38 10)" />
    <ellipse cx="38" cy="10" rx="5" ry="2.5" fill="#DCC6FF" opacity="0.6" transform="rotate(72 38 10)" />
    <ellipse cx="38" cy="10" rx="5" ry="2.5" fill="#DCC6FF" opacity="0.6" transform="rotate(144 38 10)" />
    <ellipse cx="38" cy="10" rx="5" ry="2.5" fill="#DCC6FF" opacity="0.6" transform="rotate(216 38 10)" />
    <ellipse cx="38" cy="10" rx="5" ry="2.5" fill="#DCC6FF" opacity="0.6" transform="rotate(288 38 10)" />
    <circle cx="38" cy="10" r="2" fill="#FFE89A" />
    {/* Another accent flower */}
    <ellipse cx="10" cy="38" rx="5" ry="2.5" fill="#FFD6BA" opacity="0.6" transform="rotate(0 10 38)" />
    <ellipse cx="10" cy="38" rx="5" ry="2.5" fill="#FFD6BA" opacity="0.6" transform="rotate(72 10 38)" />
    <ellipse cx="10" cy="38" rx="5" ry="2.5" fill="#FFD6BA" opacity="0.6" transform="rotate(144 10 38)" />
    <ellipse cx="10" cy="38" rx="5" ry="2.5" fill="#FFD6BA" opacity="0.6" transform="rotate(216 10 38)" />
    <ellipse cx="10" cy="38" rx="5" ry="2.5" fill="#FFD6BA" opacity="0.6" transform="rotate(288 10 38)" />
    <circle cx="10" cy="38" r="2" fill="#FFE89A" />
    {/* Vine / stem curves */}
    <path d="M18 26 Q24 40 10 50" stroke="#8db580" strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M26 18 Q40 24 50 10" stroke="#8db580" strokeWidth="1.5" fill="none" opacity="0.5" />
    <path d="M18 26 Q30 35 38 50" stroke="#8db580" strokeWidth="1" fill="none" opacity="0.3" />
    {/* Tiny leaves */}
    <ellipse cx="28" cy="32" rx="4" ry="2" fill="#8db580" opacity="0.4" transform="rotate(-30 28 32)" />
    <ellipse cx="32" cy="22" rx="4" ry="2" fill="#8db580" opacity="0.4" transform="rotate(20 32 22)" />
    {/* Tiny buds */}
    <circle cx="50" cy="5" r="2" fill="#FFB7C5" opacity="0.3" />
    <circle cx="5" cy="50" r="2" fill="#DCC6FF" opacity="0.3" />
  </svg>
)

// Sparkle / glitter particle component
const GlitterParticle = ({ style, delay }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={style}
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0.6, 1, 0],
      scale: [0, 1.2, 0.8, 1, 0],
      rotate: [0, 90, 180, 270, 360],
    }}
    transition={{
      duration: 2.5 + Math.random() * 2,
      delay: delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 3,
      ease: 'easeInOut',
    }}
  >
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z"
        fill="url(#sparkleGrad)"
      />
      <defs>
        <linearGradient id="sparkleGrad" x1="0" y1="0" x2="12" y2="12">
          <stop offset="0%" stopColor="#FFE89A" />
          <stop offset="100%" stopColor="#f0c896" />
        </linearGradient>
      </defs>
    </svg>
  </motion.div>
)

// Wax seal component
const WaxSeal = () => (
  <div className="relative mx-auto w-20 h-20">
    {/* Outer wavy seal edge */}
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background: 'radial-gradient(circle at 35% 35%, #e84040, #c0392b 40%, #a0302a 70%, #8b2020 100%)',
        boxShadow: '0 4px 12px rgba(139, 32, 32, 0.4), inset 0 -2px 4px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,200,200,0.3)',
      }}
    />
    {/* Inner circle border */}
    <div
      className="absolute rounded-full"
      style={{
        top: '6px',
        left: '6px',
        right: '6px',
        bottom: '6px',
        border: '1.5px solid rgba(240, 200, 150, 0.5)',
      }}
    />
    {/* Center monogram / emblem */}
    <div
      className="absolute inset-0 flex items-center justify-center"
    >
      <span
        className="font-script text-lg leading-none"
        style={{
          color: 'rgba(240, 200, 150, 0.85)',
          textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        }}
      >
        BFF
      </span>
    </div>
    {/* Inner decorative ring pattern */}
    <div
      className="absolute rounded-full"
      style={{
        top: '12px',
        left: '12px',
        right: '12px',
        bottom: '12px',
        border: '1px dashed rgba(240, 200, 150, 0.35)',
      }}
    />
  </div>
)

// Generate glitter positions
const generateGlitterParticles = (count) => {
  const particles = []
  for (let i = 0; i < count; i++) {
    particles.push({
      id: i,
      style: {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      },
      delay: Math.random() * 4,
    })
  }
  return particles
}

const Certificate = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [friendName, setFriendName] = useState('Prasanna')
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const glitterParticles = useRef(generateGlitterParticles(20)).current

  const handleDownload = useCallback(async () => {
    setIsDownloading(true)
    try {
      const certificateEl = document.getElementById('certificate')
      if (!certificateEl) return
      const canvas = await html2canvas(certificateEl, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        logging: false,
      })
      const link = document.createElement('a')
      link.download = `best-friend-certificate-${friendName.toLowerCase()}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (err) {
      console.error('Error generating certificate:', err)
    } finally {
      setIsDownloading(false)
    }
  }, [friendName])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 px-4 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #DCC6FF 0%, #f0e6ff 30%, #FFF8EE 60%, #FFF8EE 100%)',
      }}
    >
      {/* Section Title */}
      <motion.h2
        className="font-script text-4xl md:text-5xl text-center text-warmbrown mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        🏆 Official Certificate
      </motion.h2>

      {/* Certificate Card */}
      <motion.div
        className="max-w-2xl mx-auto relative"
        initial={{ opacity: 0, scale: 0.85, y: 50 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Glitter particles around certificate */}
        <div className="absolute -inset-8 pointer-events-none">
          {glitterParticles.map((p) => (
            <GlitterParticle key={p.id} style={p.style} delay={p.delay} />
          ))}
        </div>

        {/* Certificate border wrapper */}
        <div className="certificate-border" id="certificate">
          <div
            className="relative rounded-md p-8 sm:p-12"
            style={{
              background: 'linear-gradient(145deg, #fffdf9, #FFF8EE, #fdf5ec)',
            }}
          >
            {/* Floral SVG Corners */}
            <div className="absolute top-2 left-2">
              <FloralCorner />
            </div>
            <div className="absolute top-2 right-2" style={{ transform: 'scaleX(-1)' }}>
              <FloralCorner />
            </div>
            <div className="absolute bottom-2 left-2" style={{ transform: 'scaleY(-1)' }}>
              <FloralCorner />
            </div>
            <div className="absolute bottom-2 right-2" style={{ transform: 'scale(-1, -1)' }}>
              <FloralCorner />
            </div>

            {/* Certificate content */}
            <div className="text-center relative z-10 pt-4">
              {/* Title */}
              <h3
                className="font-script text-2xl sm:text-3xl mb-3"
                style={{
                  color: '#8B6914',
                  textShadow: '0 1px 2px rgba(139, 105, 20, 0.15)',
                }}
              >
                Certificate of Lifelong Best Friendship
              </h3>

              {/* Decorative gradient line */}
              <div className="mx-auto mb-6 mt-2" style={{ maxWidth: '320px' }}>
                <div
                  className="h-0.5 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #d4a574, #f0c896, #d4a574, transparent)',
                  }}
                />
                <div className="flex items-center justify-center -mt-1.5">
                  <span className="text-xs px-2" style={{ color: '#d4a574', background: '#FFF8EE' }}>✦</span>
                </div>
              </div>

              {/* This certifies that */}
              <p className="font-body text-lg text-warmbrown/80 mb-2">
                This certifies that
              </p>

              {/* Friend name - editable */}
              <div className="mb-1">
                <input
                  type="text"
                  value={friendName}
                  onChange={(e) => setFriendName(e.target.value)}
                  className="font-script text-4xl sm:text-5xl text-blush text-center bg-transparent border-none outline-none w-full cursor-text"
                  style={{
                    textShadow: '0 2px 4px rgba(255, 183, 197, 0.3)',
                    caretColor: '#FFB7C5',
                  }}
                  spellCheck={false}
                />
              </div>

              {/* Also known as */}
              <p className="font-handwritten text-lg text-warmbrown/60 mb-4">
                also lovingly known as <span className="text-blush/80">Rasna</span>
              </p>

              {/* Is officially recognized as */}
              <p className="font-body text-warmbrown/80 mb-2">
                is officially recognized as
              </p>

              {/* Best Friend Forever */}
              <p
                className="font-script text-2xl sm:text-3xl text-shadow-glow mb-4"
                style={{
                  color: '#8B6914',
                  textShadow: '0 0 20px rgba(255, 183, 197, 0.5), 0 0 40px rgba(255, 183, 197, 0.3), 0 1px 2px rgba(139, 105, 20, 0.15)',
                }}
              >
                ✨ My Best Friend Forever ✨
              </p>

              {/* Second separator */}
              <div className="mx-auto mb-5" style={{ maxWidth: '260px' }}>
                <div
                  className="h-px rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #d4a574, #f0c896, #d4a574, transparent)',
                  }}
                />
              </div>

              {/* Valid until */}
              <p className="font-handwritten text-xl text-warmbrown/70 mb-1">
                Valid Until: ∞ Forever ∞
              </p>

              {/* Issued on */}
              <p className="font-body text-sm text-warmbrown/50 mb-6">
                Issued on: National Best Friend Day 2026
              </p>

              {/* Wax seal */}
              <div className="mb-5">
                <WaxSeal />
              </div>

              {/* Signature line */}
              <div className="mx-auto" style={{ maxWidth: '200px' }}>
                <div
                  className="h-px mb-1"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #5C4033, transparent)',
                    opacity: 0.3,
                  }}
                />
                <p
                  className="font-script text-sm"
                  style={{ color: '#5C4033', opacity: 0.5 }}
                >
                  Vinay — Your Best Friend Always
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Download Button */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className="glow-button disabled:opacity-60 disabled:cursor-wait"
        >
          {isDownloading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </span>
          ) : (
            '💾 Download Certificate'
          )}
        </button>
      </motion.div>
    </section>
  )
}

export default Certificate
