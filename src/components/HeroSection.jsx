import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

/* ───────────────────────────────────────────────
   SVG Sub-components
   ─────────────────────────────────────────────── */

/** Cherry-blossom tree silhouette — mirrors via scaleX(-1) */
const CherryBlossomTree = ({ side = 'left' }) => {
  const isLeft = side === 'left';
  return (
    <svg
      className={`absolute bottom-0 ${isLeft ? 'left-0' : 'right-0'} w-40 sm:w-56 md:w-72 lg:w-80 h-auto opacity-30 pointer-events-none`}
      style={isLeft ? {} : { transform: 'scaleX(-1)' }}
      viewBox="0 0 320 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Trunk */}
      <path
        d="M140 600 Q130 500 120 420 Q110 360 125 300 Q130 270 120 230 Q115 200 130 170"
        stroke="#5C4033"
        strokeWidth="18"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Left main branch */}
      <path
        d="M125 350 Q80 310 50 280 Q30 260 20 230"
        stroke="#5C4033"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Right main branch */}
      <path
        d="M128 310 Q170 280 210 260 Q240 250 260 220"
        stroke="#5C4033"
        strokeWidth="10"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      />
      {/* Upper-left branch */}
      <path
        d="M125 250 Q90 210 60 180 Q40 160 30 130"
        stroke="#5C4033"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      {/* Upper-right branch */}
      <path
        d="M130 200 Q160 170 190 150 Q210 140 230 110"
        stroke="#5C4033"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      {/* Tiny top branches */}
      <path
        d="M130 170 Q110 140 95 110"
        stroke="#5C4033"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
      <path
        d="M130 170 Q150 130 165 100"
        stroke="#5C4033"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />

      {/* Blossom clusters — soft pink circles */}
      {[
        [20, 225, 22], [35, 250, 18], [10, 255, 15],
        [50, 275, 20], [65, 290, 16], [30, 290, 14],
        [255, 215, 22], [270, 235, 18], [240, 245, 16],
        [210, 255, 20], [225, 270, 14],
        [30, 125, 20], [50, 145, 18], [15, 150, 14],
        [60, 170, 16], [40, 180, 12],
        [230, 105, 20], [210, 130, 16], [245, 125, 14],
        [190, 145, 18],
        [95, 105, 18], [80, 120, 14], [105, 90, 16],
        [165, 95, 18], [155, 110, 14], [175, 80, 16],
        [130, 165, 20], [120, 150, 16], [145, 155, 14],
      ].map(([cx, cy, r], i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="#FFB7C5"
          opacity={0.35 + (i % 5) * 0.08}
        />
      ))}
    </svg>
  );
};

/** SVG rose for bottom corners */
const RoseDecoration = ({ className = '' }) => (
  <svg
    className={`w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 ${className}`}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Rose petals layered */}
    <ellipse cx="50" cy="48" rx="20" ry="18" fill="#FFB7C5" opacity="0.5" />
    <ellipse cx="44" cy="44" rx="16" ry="14" fill="#FFB7C5" opacity="0.6" transform="rotate(-30 44 44)" />
    <ellipse cx="56" cy="44" rx="16" ry="14" fill="#FFB7C5" opacity="0.6" transform="rotate(30 56 44)" />
    <ellipse cx="50" cy="40" rx="14" ry="12" fill="#ffcdd6" opacity="0.7" />
    <ellipse cx="46" cy="38" rx="10" ry="9" fill="#ffcdd6" opacity="0.8" transform="rotate(-20 46 38)" />
    <ellipse cx="54" cy="38" rx="10" ry="9" fill="#ffcdd6" opacity="0.8" transform="rotate(20 54 38)" />
    <circle cx="50" cy="42" r="6" fill="#ff9eb0" opacity="0.7" />
    <circle cx="50" cy="42" r="3" fill="#ff8da1" opacity="0.8" />
    {/* Stem */}
    <path d="M50 58 Q48 72 50 90" stroke="#6b9d5a" strokeWidth="2.5" fill="none" />
    {/* Leaves */}
    <ellipse cx="42" cy="72" rx="8" ry="4" fill="#81b56e" opacity="0.7" transform="rotate(-35 42 72)" />
    <ellipse cx="58" cy="78" rx="8" ry="4" fill="#81b56e" opacity="0.7" transform="rotate(35 58 78)" />
  </svg>
);

/* ───────────────────────────────────────────────
   Fairy-light strand
   ─────────────────────────────────────────────── */
const FairyLights = () => {
  const lights = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: `${4 + i * 4.8}%`,
        delay: `${(i * 0.35) % 3}s`,
        color:
          i % 4 === 0
            ? '#FFB7C5'
            : i % 4 === 1
            ? '#DCC6FF'
            : i % 4 === 2
            ? '#FFE89A'
            : '#BFE9FF',
        size: 4 + Math.random() * 3,
      })),
    []
  );

  return (
    <div className="absolute top-0 left-0 w-full h-32 pointer-events-none z-10 overflow-hidden">
      {/* Droopy wire */}
      <svg className="absolute top-6 left-0 w-full h-20 opacity-30" viewBox="0 0 1200 80" preserveAspectRatio="none">
        <path
          d="M0,10 Q60,60 120,20 Q180,60 240,20 Q300,60 360,20 Q420,60 480,20 Q540,60 600,20 Q660,60 720,20 Q780,60 840,20 Q900,60 960,20 Q1020,60 1080,20 Q1140,60 1200,10"
          stroke="#5C4033"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />
      </svg>
      {/* Light bulbs */}
      {lights.map((l) => (
        <div
          key={l.id}
          className="absolute animate-twinkle rounded-full"
          style={{
            left: l.left,
            top: `${18 + Math.sin(l.id * 0.9) * 10}px`,
            width: l.size,
            height: l.size,
            backgroundColor: l.color,
            boxShadow: `0 0 ${l.size * 2}px ${l.color}, 0 0 ${l.size * 4}px ${l.color}80`,
            animationDelay: l.delay,
          }}
        />
      ))}
    </div>
  );
};

/* ───────────────────────────────────────────────
   Floating petals (pure CSS animated)
   ─────────────────────────────────────────────── */
const FloatingPetals = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: 8 + Math.random() * 14,
        duration: 10 + Math.random() * 12,
        delay: Math.random() * 15,
        opacity: 0.25 + Math.random() * 0.35,
        color: ['#FFB7C5', '#ffcdd6', '#DCC6FF', '#ffd6e0', '#ffc0cb'][i % 5],
        rotate: Math.random() * 360,
      })),
    []
  );

  return (
    <>
      {petals.map((p) => (
        <div
          key={p.id}
          className="absolute pointer-events-none animate-drift"
          style={{
            left: p.left,
            top: '-20px',
            width: p.size,
            height: p.size * 0.65,
            backgroundColor: p.color,
            borderRadius: '50% 0 50% 50%',
            opacity: p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </>
  );
};

/* ───────────────────────────────────────────────
   Floating sparkle dots (extra magic)
   ─────────────────────────────────────────────── */
const Sparkles = () => {
  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        size: 2 + Math.random() * 3,
        delay: `${Math.random() * 4}s`,
      })),
    []
  );

  return (
    <>
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="absolute animate-twinkle rounded-full bg-butter pointer-events-none"
          style={{
            left: s.left,
            top: s.top,
            width: s.size,
            height: s.size,
            boxShadow: `0 0 ${s.size * 3}px #FFE89A, 0 0 ${s.size * 6}px #FFE89A60`,
            animationDelay: s.delay,
          }}
        />
      ))}
    </>
  );
};

/* ───────────────────────────────────────────────
   Main HeroSection Component
   ─────────────────────────────────────────────── */
const HeroSection = ({ onOpenScrapbook }) => {
  return (
    <section
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden"
      style={{
        background: `
          linear-gradient(
            to top,
            #6b9d5a 0%,
            #8fbc7a 5%,
            #b8d8a8 10%,
            #d4e8c4 14%,
            #f5e0d0 20%,
            #FFD6BA 28%,
            #FFB7C5 38%,
            #f0c0d0 48%,
            #e0c4e8 55%,
            #DCC6FF 64%,
            #c8d8ff 75%,
            #BFE9FF 88%,
            #a8dcf8 100%
          )
        `,
      }}
    >
      {/* Soft radial overlays for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 90%, rgba(255,183,197,0.35) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 30% 40%, rgba(220,198,255,0.2) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(191,233,255,0.15) 0%, transparent 50%)',
        }}
      />

      {/* ── Decorative layers ── */}
      <CherryBlossomTree side="left" />
      <CherryBlossomTree side="right" />
      <FairyLights />
      <FloatingPetals />
      <Sparkles />

      {/* Bottom roses */}
      <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 opacity-50 pointer-events-none">
        <RoseDecoration />
      </div>
      <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 opacity-50 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
        <RoseDecoration />
      </div>

      {/* Soft grass/garden gradient at the very bottom */}
      <div
        className="absolute bottom-0 left-0 w-full h-24 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(107,157,90,0.25) 0%, transparent 100%)',
        }}
      />

      {/* ── Center content ── */}
      <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-8 max-w-4xl">
        {/* Title */}
        <motion.h1
          className="font-script text-5xl md:text-7xl lg:text-8xl text-warmbrown text-shadow-glow leading-tight"
          initial={{ opacity: 0, scale: 0.6, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: 0.5,
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Happy National Best Friend Day{' '}
          <span className="inline-block animate-bounce-gentle">❤️</span>
        </motion.h1>

        {/* Subtitle */}
        <div className="mt-6 md:mt-8 space-y-2">
          {[
            'Some people become friends.',
            'You became my favorite memory.',
          ].map((line, i) => (
            <motion.p
              key={i}
              className="font-handwritten text-xl md:text-2xl lg:text-3xl text-warmbrown/80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.4 + i * 0.4,
                duration: 0.9,
                ease: 'easeOut',
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Dedication */}
        <motion.p
          className="mt-4 md:mt-6 font-handwritten text-lg md:text-xl text-blush"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4, duration: 0.8, ease: 'easeOut' }}
        >
          To my dearest Rasna 🌸
        </motion.p>

        {/* CTA Button */}
        <motion.button
          type="button"
          className="glow-button mt-8 md:mt-10 text-lg md:text-xl"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            delay: 3.0,
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          whileHover={{
            scale: 1.08,
            boxShadow:
              '0 8px 40px rgba(255,183,197,0.6), 0 0 80px rgba(255,183,197,0.3), 0 0 120px rgba(220,198,255,0.2)',
          }}
          whileTap={{ scale: 0.96 }}
          onClick={onOpenScrapbook}
        >
          🌸 Open Our Friendship Story 🌸
        </motion.button>

        {/* Scroll hint */}
        <motion.div
          className="mt-10 md:mt-14 flex flex-col items-center gap-1 text-warmbrown/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.8, duration: 1 }}
        >
          <span className="font-handwritten text-sm">scroll down or tap above</span>
          <motion.span
            className="text-lg"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            ↓
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
