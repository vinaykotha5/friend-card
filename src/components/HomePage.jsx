import { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'

/* ═══════════════════════════════════════════
   SAD / HAPPY CHARACTER  (pure CSS animation)
   No motion on SVG elements - only on div wrappers
   ═══════════════════════════════════════════ */

const Character = ({ mood = 'neutral' }) => {
  const isSad = mood !== 'neutral'
  const isCrying = mood === 'crying' || mood === 'devastated'
  const isDevastated = mood === 'devastated'

  return (
    <motion.div
      className="relative"
      animate={
        isDevastated
          ? { y: [0, -3, 0], rotate: [-2, 2, -2] }
          : isSad
          ? { y: [0, -2, 0] }
          : {}
      }
      transition={{
        duration: isDevastated ? 0.4 : 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <svg
        width="180"
        height="200"
        viewBox="0 0 180 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Body */}
        <ellipse cx="90" cy="155" rx="45" ry="40" fill={isDevastated ? '#e8d8c8' : '#FFD6BA'} />

        {/* Head */}
        <circle cx="90" cy="80" r="55" fill={isDevastated ? '#f0dcc5' : '#FFE4C9'} />

        {/* Blush cheeks */}
        <circle cx="55" cy="92" r="10" fill="#FFB7C5" opacity={isSad ? 0.2 : 0.5} />
        <circle cx="125" cy="92" r="10" fill="#FFB7C5" opacity={isSad ? 0.2 : 0.5} />

        {/* Eyes */}
        {isSad ? (
          <>
            <path d="M65 75 Q70 82 78 78" stroke="#5C4033" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M102 78 Q110 82 115 75" stroke="#5C4033" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Sad eyebrows */}
            <path d={isDevastated ? 'M58 62 Q70 57 80 65' : 'M60 65 Q70 60 80 65'} stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d={isDevastated ? 'M100 65 Q110 57 122 62' : 'M100 65 Q110 60 120 65'} stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="72" cy="75" r="5" fill="#5C4033" />
            <circle cx="108" cy="75" r="5" fill="#5C4033" />
            <circle cx="74" cy="73" r="1.5" fill="white" />
            <circle cx="110" cy="73" r="1.5" fill="white" />
          </>
        )}

        {/* Mouth */}
        {isDevastated ? (
          <path d="M72 102 Q80 94 90 96 Q100 94 108 102" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : isSad ? (
          <path d="M72 102 Q82 94 90 95 Q98 94 108 102" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M72 95 Q90 112 108 95" stroke="#5C4033" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        )}

        {/* Tear drops - CSS animated via className */}
        {isCrying && (
          <>
            <ellipse cx="65" cy="88" rx="3" ry="5" fill="#BFE9FF" opacity="0.7" className="animate-tear-left" />
            <ellipse cx="115" cy="88" rx="3" ry="5" fill="#BFE9FF" opacity="0.7" className="animate-tear-right" />
          </>
        )}

        {/* Arms */}
        {isDevastated ? (
          <>
            <path d="M50 135 Q35 110 55 85" stroke="#e8d8c8" strokeWidth="14" strokeLinecap="round" fill="none" />
            <path d="M130 135 Q145 110 125 85" stroke="#e8d8c8" strokeWidth="14" strokeLinecap="round" fill="none" />
          </>
        ) : isSad ? (
          <>
            <path d="M50 140 Q38 155 42 175" stroke="#FFD6BA" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M130 140 Q142 155 138 175" stroke="#FFD6BA" strokeWidth="12" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <path d="M50 140 Q30 145 28 155" stroke="#FFD6BA" strokeWidth="12" strokeLinecap="round" fill="none" />
            <path d="M130 140 Q150 145 152 155" stroke="#FFD6BA" strokeWidth="12" strokeLinecap="round" fill="none" />
          </>
        )}

        {/* Flower on head when happy */}
        {!isSad && (
          <g transform="translate(115, 35)">
            {[0, 72, 144, 216, 288].map((angle, i) => (
              <ellipse
                key={i}
                cx={Math.cos((angle * Math.PI) / 180) * 6}
                cy={Math.sin((angle * Math.PI) / 180) * 6}
                rx="4" ry="6" fill="#FFB7C5" opacity="0.8"
                transform={`rotate(${angle} ${Math.cos((angle * Math.PI) / 180) * 6} ${Math.sin((angle * Math.PI) / 180) * 6})`}
              />
            ))}
            <circle cx="0" cy="0" r="3" fill="#FFE89A" />
          </g>
        )}

        {/* Rain cloud when devastated */}
        {isDevastated && (
          <g opacity="0.5">
            <ellipse cx="90" cy="18" rx="30" ry="14" fill="#9CA3AF" />
            <ellipse cx="70" cy="20" rx="18" ry="12" fill="#9CA3AF" />
            <ellipse cx="110" cy="20" rx="18" ry="12" fill="#9CA3AF" />
            {[75, 85, 95, 105].map((x, i) => (
              <line key={i} x1={x} y1="30" x2={x - 2} y2="40" stroke="#BFE9FF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
            ))}
          </g>
        )}
      </svg>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════
   NO-CLICK MESSAGES
   ═══════════════════════════════════════════ */
const NO_MESSAGES = [
  { text: "Wait... really? 🥺", mood: "sad" },
  { text: "Are you sure about that? 😢", mood: "sad" },
  { text: "Don't do this to me... 😭", mood: "crying" },
  { text: "My heart can't take this! 💔", mood: "crying" },
  { text: "I'm literally falling apart! 😭😭", mood: "devastated" },
  { text: "PLEASE! I'll be the best friend ever! 😭💔", mood: "devastated" },
]

/* ═══════════════════════════════════════════
   FLOATING HEARTS BACKGROUND
   ═══════════════════════════════════════════ */
const FloatingHearts = () => {
  const hearts = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: 12 + Math.random() * 20,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 8,
        opacity: 0.15 + Math.random() * 0.25,
        color: ['#FFB7C5', '#DCC6FF', '#FFD6BA', '#BFE9FF'][i % 4],
      })),
    []
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="absolute"
          style={{ left: h.left, bottom: -30 }}
          animate={{
            y: [0, -900],
            x: [0, Math.sin(h.id) * 40],
            rotate: [0, 360],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg width={h.size} height={h.size} viewBox="0 0 24 24" fill={h.color} opacity={h.opacity}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN HOME PAGE
   ═══════════════════════════════════════════ */
export default function HomePage({ onYesClick }) {
  const [noClickCount, setNoClickCount] = useState(0)
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
  const [noScale, setNoScale] = useState(1)
  const [yesScale, setYesScale] = useState(1)
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageKey, setMessageKey] = useState(0)
  const [characterMood, setCharacterMood] = useState('neutral')

  const handleNoClick = useCallback(() => {
    if (noClickCount >= NO_MESSAGES.length) return

    const newCount = noClickCount + 1
    setNoClickCount(newCount)

    const idx = Math.min(newCount - 1, NO_MESSAGES.length - 1)
    setCurrentMessage(NO_MESSAGES[idx].text)
    setCharacterMood(NO_MESSAGES[idx].mood)
    setMessageKey((prev) => prev + 1)

    if (newCount >= NO_MESSAGES.length) {
      setNoScale(0.05)
      setYesScale(2.5)
      setNoPosition({
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 150,
      })
      return
    }

    setNoPosition({
      x: (Math.random() - 0.5) * 400,
      y: (Math.random() - 0.5) * 200,
    })
    setNoScale((prev) => prev * 0.8)
    setYesScale((prev) => prev + 0.18)
  }, [noClickCount])

  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, #FFF8EE 0%, #fff0f5 20%, #f8e8ff 40%, #ffe8f0 60%, #fff5e6 80%, #FFF8EE 100%)`,
      }}
    >
      <FloatingHearts />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,183,197,0.2) 0%, transparent 60%)' }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 70%, rgba(220,198,255,0.15) 0%, transparent 50%)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-lg">
        {/* Character */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <Character mood={characterMood} />
        </motion.div>

        {/* Question */}
        <motion.h1
          className="font-script text-4xl md:text-6xl text-warmbrown leading-tight mb-2"
          style={{ textShadow: '0 2px 10px rgba(255,183,197,0.4)' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Will you be my{' '}
          <span className="text-blush">best friend</span>{' '}
          forever?
        </motion.h1>

        <motion.p
          className="font-handwritten text-xl text-warmbrown/60 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          — Vinay 💕
        </motion.p>

        {/* Message from No clicks */}
        <div className="h-14 flex items-center justify-center mb-4 relative w-full">
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.div
                key={messageKey}
                className="absolute px-6 py-3 rounded-full font-handwritten text-xl text-warmbrown"
                style={{
                  background: 'rgba(255, 248, 238, 0.95)',
                  boxShadow: '0 4px 20px rgba(255, 183, 197, 0.3), 0 0 40px rgba(220, 198, 255, 0.2)',
                  border: '2px solid rgba(255, 183, 197, 0.4)',
                }}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {currentMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons */}
        <div className="relative flex flex-col items-center gap-6 w-full" style={{ minHeight: '140px' }}>
          {/* YES Button */}
          <motion.button
            type="button"
            id="yes-button"
            className="glow-button font-handwritten text-2xl relative z-20"
            onClick={onYesClick}
            animate={{ scale: yesScale }}
            whileHover={{ scale: yesScale * 1.08 }}
            whileTap={{ scale: yesScale * 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            style={{
              minWidth: noClickCount >= NO_MESSAGES.length ? '80vw' : undefined,
              maxWidth: '90vw',
            }}
          >
            <span className="relative z-10">🌸 Yes, Forever! 🌸</span>
          </motion.button>

          {/* NO Button */}
          <motion.button
            type="button"
            id="no-button"
            className="relative z-20 px-6 py-2 rounded-full font-handwritten text-lg bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
            style={{ cursor: noClickCount >= NO_MESSAGES.length ? 'not-allowed' : 'pointer' }}
            onClick={handleNoClick}
            disabled={noClickCount >= NO_MESSAGES.length}
            animate={{
              x: noPosition.x,
              y: noPosition.y,
              scale: noScale,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 15,
              mass: 0.8,
            }}
          >
            😢 No
          </motion.button>
        </div>

        {/* Footer text */}
        <motion.p
          className="mt-10 font-handwritten text-warmbrown/30 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
        >
          {noClickCount >= NO_MESSAGES.length
            ? '( The universe says yes! 🌟 )'
            : '( Choose wisely… or not 😉 )'}
        </motion.p>
      </div>
    </section>
  )
}
