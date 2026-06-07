import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';

/* ──────────────────────────────────────
   HELPERS – generate random decorative
   elements once per mount
   ────────────────────────────────────── */

const randomBetween = (min, max) => Math.random() * (max - min) + min;

function generateHearts(count = 24) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${randomBetween(2, 98)}%`,
    size: randomBetween(14, 36),
    delay: randomBetween(0, 4),
    duration: randomBetween(4, 8),
    opacity: randomBetween(0.4, 0.9),
    hue: [0, 330, 340, 350, 10][Math.floor(Math.random() * 5)],
  }));
}

function generatePetals(count = 18) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${randomBetween(0, 100)}%`,
    size: randomBetween(10, 22),
    delay: randomBetween(0, 5),
    duration: randomBetween(5, 10),
    rotation: randomBetween(-180, 180),
    color: ['#FFB7C5', '#DCC6FF', '#FFD6BA', '#FFE89A', '#F7C7A3'][
      Math.floor(Math.random() * 5)
    ],
  }));
}

function generateSparkles(count = 22) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${randomBetween(5, 95)}%`,
    top: `${randomBetween(5, 95)}%`,
    size: randomBetween(4, 12),
    delay: randomBetween(0, 3),
    duration: randomBetween(1.2, 3),
  }));
}

function generateButterflies(count = 8) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${randomBetween(5, 90)}%`,
    size: randomBetween(20, 36),
    delay: randomBetween(0, 4),
    duration: randomBetween(6, 12),
    color: ['#DCC6FF', '#FFB7C5', '#BFE9FF', '#FFE89A'][
      Math.floor(Math.random() * 4)
    ],
  }));
}

/* ──────────────────────────────────────
   SVG mini-components
   ────────────────────────────────────── */

const HeartSVG = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const ButterflySVG = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill={color}>
    <path d="M32 8c-6 8-18 10-22 20s2 18 10 20c4 1 8-1 12-6 4 5 8 7 12 6 8-2 14-10 10-20S38 16 32 8z" opacity="0.7" />
    <ellipse cx="32" cy="36" rx="1.5" ry="12" fill="#5C4033" opacity="0.5" />
  </svg>
);

const PetalSVG = ({ size, color }) => (
  <svg width={size} height={size * 1.6} viewBox="0 0 20 32" fill={color}>
    <ellipse cx="10" cy="16" rx="8" ry="14" opacity="0.7" />
  </svg>
);

const SparkleSVG = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="#FFE89A">
    <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" />
  </svg>
);

/* ──────────────────────────────────────
   CONFETTI LAUNCHER
   ────────────────────────────────────── */

const PALETTE = ['#FFB7C5', '#DCC6FF', '#FFD6BA', '#FFE89A', '#F7C7A3', '#BFE9FF'];

function launchConfetti() {
  // Helper to make a heart shape for confetti
  const heart = confetti.shapeFromPath({
    path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  });

  const star = confetti.shapeFromPath({
    path: 'M12 0l3.09 6.26L22 7.27l-5 4.87L18.18 19 12 15.77 5.82 19 7 12.14l-5-4.87 6.91-1.01z',
  });

  const burstConfigs = [
    { delay: 0, origin: { x: 0.2, y: 0.7 }, particleCount: 90 },
    { delay: 500, origin: { x: 0.5, y: 0.5 }, particleCount: 100 },
    { delay: 1000, origin: { x: 0.8, y: 0.7 }, particleCount: 85 },
  ];

  burstConfigs.forEach(({ delay, origin, particleCount }) => {
    setTimeout(() => {
      // Confetti burst
      confetti({
        particleCount,
        spread: 80,
        origin,
        colors: PALETTE,
        shapes: ['circle', heart, star],
        scalar: 1.1,
        gravity: 0.8,
        ticks: 250,
        zIndex: 200,
      });
      // A secondary gentle shower
      confetti({
        particleCount: Math.floor(particleCount * 0.4),
        spread: 120,
        origin: { x: origin.x, y: origin.y - 0.1 },
        colors: PALETTE,
        shapes: [heart, star],
        scalar: 1.4,
        gravity: 0.5,
        ticks: 300,
        zIndex: 200,
      });
    }, delay);
  });
}

/* ──────────────────────────────────────
   CSS KEYFRAMES (injected once)
   ────────────────────────────────────── */

const STYLE_ID = 'celebration-scene-keyframes';

function injectKeyframes() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes cs-float-up {
      0%   { transform: translateY(100vh) rotate(0deg) scale(0.6); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateY(-15vh) rotate(360deg) scale(1); opacity: 0; }
    }
    @keyframes cs-drift-down {
      0%   { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
      10%  { opacity: 0.8; }
      100% { transform: translateY(110vh) translateX(60px) rotate(var(--rot, 180deg)); opacity: 0; }
    }
    @keyframes cs-twinkle {
      0%, 100% { opacity: 0.2; transform: scale(0.5) rotate(0deg); }
      50%      { opacity: 1;   transform: scale(1.3) rotate(180deg); }
    }
    @keyframes cs-flutter {
      0%   { transform: translateY(100vh) translateX(0)    rotate(0deg)   scaleX(1);  }
      25%  { transform: translateY(70vh)  translateX(40px) rotate(15deg)  scaleX(-1); }
      50%  { transform: translateY(40vh)  translateX(-20px) rotate(-10deg) scaleX(1);  }
      75%  { transform: translateY(15vh)  translateX(30px) rotate(20deg)  scaleX(-1); }
      100% { transform: translateY(-15vh) translateX(0)    rotate(0deg)   scaleX(1); opacity: 0; }
    }
    @keyframes cs-glow-text {
      0%, 100% {
        text-shadow:
          0 0 20px rgba(255,183,197,0.6),
          0 0 40px rgba(255,183,197,0.4),
          0 0 60px rgba(220,198,255,0.3);
      }
      50% {
        text-shadow:
          0 0 30px rgba(255,183,197,0.9),
          0 0 60px rgba(255,183,197,0.6),
          0 0 100px rgba(220,198,255,0.4),
          0 0 140px rgba(255,228,154,0.2);
      }
    }
  `;
  document.head.appendChild(style);
}

/* ══════════════════════════════════════
   CELEBRATION SCENE COMPONENT
   ══════════════════════════════════════ */

export default function CelebrationScene({ isActive }) {
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const fadeTimerRef = useRef(null);
  const unmountTimerRef = useRef(null);
  const hasLaunched = useRef(false);

  // Pre-generate decoration data so it doesn't re-randomise on re-render
  const hearts = useMemo(() => generateHearts(24), []);
  const petals = useMemo(() => generatePetals(18), []);
  const sparkles = useMemo(() => generateSparkles(22), []);
  const butterflies = useMemo(() => generateButterflies(8), []);

  useEffect(() => {
    injectKeyframes();
  }, []);

  /* Activate / deactivate logic */
  useEffect(() => {
    if (isActive && !visible) {
      setVisible(true);
      setFadingOut(false);
      hasLaunched.current = false;
    }
  }, [isActive]);

  /* Launch confetti + schedule fade-out once visible */
  useEffect(() => {
    if (!visible) return;

    if (!hasLaunched.current) {
      hasLaunched.current = true;
      launchConfetti();
    }

    // After 5 s, start fading
    fadeTimerRef.current = setTimeout(() => {
      setFadingOut(true);
    }, 5000);

    // After 8 s total, unmount
    unmountTimerRef.current = setTimeout(() => {
      setVisible(false);
      setFadingOut(false);
      hasLaunched.current = false;
    }, 8000);

    return () => {
      clearTimeout(fadeTimerRef.current);
      clearTimeout(unmountTimerRef.current);
    };
  }, [visible]);

  /* ── Render ──────────────────────── */

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="celebration-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: fadingOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadingOut ? 2.5 : 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 flex items-center justify-center overflow-hidden"
          style={{ zIndex: 100 }}
        >
          {/* ── Animated gradient background ── */}
          <motion.div
            className="absolute inset-0"
            initial={{
              background:
                'linear-gradient(135deg, rgba(255,183,197,0) 0%, rgba(220,198,255,0) 40%, rgba(255,214,186,0) 70%, rgba(255,232,154,0) 100%)',
            }}
            animate={{
              background: [
                'linear-gradient(135deg, rgba(255,183,197,0.85) 0%, rgba(220,198,255,0.8) 40%, rgba(255,214,186,0.75) 70%, rgba(255,232,154,0.7) 100%)',
                'linear-gradient(225deg, rgba(255,214,186,0.85) 0%, rgba(255,183,197,0.8) 40%, rgba(255,232,154,0.75) 70%, rgba(220,198,255,0.7) 100%)',
                'linear-gradient(315deg, rgba(220,198,255,0.85) 0%, rgba(255,232,154,0.8) 40%, rgba(255,183,197,0.75) 70%, rgba(255,214,186,0.7) 100%)',
                'linear-gradient(135deg, rgba(255,183,197,0.85) 0%, rgba(220,198,255,0.8) 40%, rgba(255,214,186,0.75) 70%, rgba(255,232,154,0.7) 100%)',
              ],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          />

          {/* Soft radial glow overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, transparent 70%)',
            }}
          />

          {/* ── FLOATING HEARTS ── */}
          {hearts.map((h) => (
            <div
              key={`heart-${h.id}`}
              className="absolute pointer-events-none"
              style={{
                left: h.left,
                bottom: '-30px',
                animation: `cs-float-up ${h.duration}s ease-in-out ${h.delay}s infinite`,
                opacity: 0,
              }}
            >
              <HeartSVG
                size={h.size}
                color={`hsl(${h.hue}, 80%, 72%)`}
              />
            </div>
          ))}

          {/* ── FLOWER PETALS ── */}
          {petals.map((p) => (
            <div
              key={`petal-${p.id}`}
              className="absolute pointer-events-none"
              style={{
                left: p.left,
                top: '-30px',
                '--rot': `${p.rotation}deg`,
                animation: `cs-drift-down ${p.duration}s ease-in-out ${p.delay}s infinite`,
                opacity: 0,
              }}
            >
              <PetalSVG size={p.size} color={p.color} />
            </div>
          ))}

          {/* ── SPARKLE STARS ── */}
          {sparkles.map((s) => (
            <div
              key={`sparkle-${s.id}`}
              className="absolute pointer-events-none"
              style={{
                left: s.left,
                top: s.top,
                animation: `cs-twinkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
                opacity: 0,
              }}
            >
              <SparkleSVG size={s.size} />
            </div>
          ))}

          {/* ── BUTTERFLIES ── */}
          {butterflies.map((b) => (
            <div
              key={`butterfly-${b.id}`}
              className="absolute pointer-events-none"
              style={{
                left: b.left,
                bottom: '-40px',
                animation: `cs-flutter ${b.duration}s ease-in-out ${b.delay}s infinite`,
                opacity: 0,
              }}
            >
              <ButterflySVG size={b.size} color={b.color} />
            </div>
          ))}

          {/* ── CENTER TEXT ── */}
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            {/* Main celebration title */}
            <motion.h1
              initial={{ scale: 0, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 160,
                damping: 12,
                mass: 0.8,
                delay: 0.3,
              }}
              className="font-script text-5xl md:text-7xl text-warmbrown drop-shadow-lg select-none"
              style={{
                animation: 'cs-glow-text 2.5s ease-in-out infinite',
              }}
            >
              🎉 Friendship Accepted Forever ❤️
            </motion.h1>

            {/* Sub-text */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8, ease: 'easeOut' }}
              className="font-handwritten text-2xl md:text-4xl text-warmbrown/80 mt-4 md:mt-6 select-none"
              style={{
                textShadow: '0 0 12px rgba(255,183,197,0.4)',
              }}
            >
              Rasna &amp; Me • Best Friends • ∞ Forever
            </motion.p>

            {/* Extra decorative emojis ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.8, type: 'spring', stiffness: 120, damping: 14 }}
              className="mt-6 flex gap-3 text-3xl md:text-4xl select-none"
            >
              {['🌸', '💖', '🦋', '✨', '🌷', '💜', '🌈'].map((emoji, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: 'easeInOut',
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
