import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── SVG Heart Emblem ───────────────────────────────────────────────
const HeartEmblem = () => (
  <svg
    viewBox="0 0 100 90"
    className="w-16 h-16 mx-auto drop-shadow-lg"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="heartGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f0c896" />
        <stop offset="40%" stopColor="#d4a054" />
        <stop offset="70%" stopColor="#f5d98e" />
        <stop offset="100%" stopColor="#c9944a" />
      </linearGradient>
      <filter id="heartGlow">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    <path
      d="M50 85 C25 65, 0 45, 0 25 C0 10, 12 0, 25 0 C35 0, 45 8, 50 15 C55 8, 65 0, 75 0 C88 0, 100 10, 100 25 C100 45, 75 65, 50 85Z"
      fill="url(#heartGold)"
      filter="url(#heartGlow)"
      stroke="#c9944a"
      strokeWidth="1"
    />
    {/* Inner heart detail */}
    <path
      d="M50 75 C30 58, 12 42, 12 28 C12 18, 20 10, 28 10 C36 10, 44 16, 50 22 C56 16, 64 10, 72 10 C80 10, 88 18, 88 28 C88 42, 70 58, 50 75Z"
      fill="none"
      stroke="#f5d98e"
      strokeWidth="0.8"
      opacity="0.5"
    />
  </svg>
);

// ─── Decorative Corner Flourish ─────────────────────────────────────
const CornerFlourish = ({ position }) => {
  const rotations = {
    "top-left": "rotate(0deg)",
    "top-right": "rotate(90deg)",
    "bottom-right": "rotate(180deg)",
    "bottom-left": "rotate(270deg)",
  };
  const positions = {
    "top-left": "top-3 left-3",
    "top-right": "top-3 right-3",
    "bottom-right": "bottom-3 right-3",
    "bottom-left": "bottom-3 left-3",
  };

  return (
    <div
      className={`absolute ${positions[position]} w-12 h-12 pointer-events-none`}
      style={{ transform: rotations[position] }}
    >
      <svg viewBox="0 0 50 50" className="w-full h-full" fill="none">
        <path
          d="M2 2 C2 2, 2 20, 8 28 C14 36, 22 38, 22 38"
          stroke="#d4a054"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M2 2 C2 2, 20 2, 28 8 C36 14, 38 22, 38 22"
          stroke="#d4a054"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M5 5 C5 5, 5 15, 9 21 C13 27, 18 28, 18 28"
          stroke="#f5d98e"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M5 5 C5 5, 15 5, 21 9 C27 13, 28 18, 28 18"
          stroke="#f5d98e"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.5"
        />
        <circle cx="4" cy="4" r="2" fill="#d4a054" opacity="0.6" />
      </svg>
    </div>
  );
};

// ─── Doodle decorations for page 2 ──────────────────────────────────
const DoodleStars = () => (
  <svg
    viewBox="0 0 200 200"
    className="absolute inset-0 w-full h-full pointer-events-none"
    fill="none"
  >
    {/* Small stars scattered */}
    {[
      { x: 30, y: 30 },
      { x: 160, y: 40 },
      { x: 45, y: 150 },
      { x: 170, y: 160 },
      { x: 100, y: 25 },
      { x: 25, y: 90 },
      { x: 175, y: 100 },
    ].map((pos, i) => (
      <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
        <path
          d="M0 -6 L1.5 -2 L6 -2 L2.5 1 L4 6 L0 3 L-4 6 L-2.5 1 L-6 -2 L-1.5 -2 Z"
          fill="#d4a054"
          opacity={0.3 + (i % 3) * 0.15}
        />
      </g>
    ))}
    {/* Swirl doodles */}
    <path
      d="M20 170 C30 160, 40 175, 35 180 C30 185, 20 178, 25 172"
      stroke="#c9944a"
      strokeWidth="1"
      opacity="0.3"
    />
    <path
      d="M150 25 C160 15, 170 30, 165 35 C160 40, 150 33, 155 27"
      stroke="#c9944a"
      strokeWidth="1"
      opacity="0.3"
    />
    {/* Small hearts */}
    <path
      d="M80 170 C78 167, 73 168, 73 172 C73 175, 80 180, 80 180 C80 180, 87 175, 87 172 C87 168, 82 167, 80 170Z"
      fill="#FFB7C5"
      opacity="0.4"
    />
    <path
      d="M140 80 C138 77, 133 78, 133 82 C133 85, 140 90, 140 90 C140 90, 147 85, 147 82 C147 78, 142 77, 140 80Z"
      fill="#DCC6FF"
      opacity="0.4"
    />
  </svg>
);

// ─── Dust Particles Effect ──────────────────────────────────────────
const DustParticles = () => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background:
              "radial-gradient(circle, rgba(244,216,152,0.8) 0%, rgba(244,216,152,0) 70%)",
          }}
          animate={{
            y: [0, -30, -60],
            x: [0, Math.random() * 20 - 10],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════
//  MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════
export default function ScrapbookOpening({ isOpen, onOpenComplete }) {
  const [phase, setPhase] = useState("idle"); // idle → appear → flip → page2 → zoomOut → done

  useEffect(() => {
    if (!isOpen) {
      setPhase("idle");
      return;
    }

    setPhase("appear");

    const timers = [];

    // Phase 2: cover flips open
    timers.push(setTimeout(() => setPhase("flip"), 600));

    // Phase 3: second page slides in
    timers.push(setTimeout(() => setPhase("page2"), 1800));

    // Phase 4: zoom out / fade away
    timers.push(setTimeout(() => setPhase("zoomOut"), 3000));

    // Phase 5: done – call callback
    timers.push(
      setTimeout(() => {
        setPhase("done");
        onOpenComplete?.();
      }, 3800)
    );

    return () => timers.forEach(clearTimeout);
  }, [isOpen, onOpenComplete]);

  if (phase === "idle" || phase === "done") return null;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="scrapbook-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ perspective: "1800px" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(92,64,51,0.6) 0%, rgba(30,18,10,0.85) 100%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Dust particles */}
          <DustParticles />

          {/* ─── THE BOOK ─────────────────────────────────── */}
          <motion.div
            className="relative"
            style={{
              width: "min(480px, 90vw)",
              height: "min(600px, 80vh)",
              transformStyle: "preserve-3d",
            }}
            initial={{ scale: 0.8, opacity: 0, rotateX: 5 }}
            animate={
              phase === "zoomOut"
                ? { scale: 2.5, opacity: 0, rotateX: 0 }
                : { scale: 1, opacity: 1, rotateX: 0 }
            }
            transition={
              phase === "zoomOut"
                ? { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
                : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
            }
          >
            {/* ── Book spine shadow ──────────────────────── */}
            <div
              className="absolute inset-0 rounded-r-lg rounded-l-sm"
              style={{
                boxShadow:
                  phase === "flip" || phase === "page2" || phase === "zoomOut"
                    ? "0 25px 60px rgba(0,0,0,0.5), -8px 0 20px rgba(0,0,0,0.3), 0 0 80px rgba(92,64,51,0.3)"
                    : "0 15px 40px rgba(0,0,0,0.4), 0 0 60px rgba(92,64,51,0.2)",
                transition: "box-shadow 0.8s ease",
              }}
            />

            {/* ── BACK PAGE (visible when cover flips) ───── */}
            <div
              className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #f5e6d3 0%, #f0dcc5 25%, #ecdbc4 50%, #e8d5bb 75%, #f2e0cc 100%)",
                border: "1px solid rgba(92,64,51,0.15)",
              }}
            >
              {/* Aged paper noise overlay */}
              <div
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")`,
                }}
              />

              {/* Washi tape top */}
              <motion.div
                className="washi-tape washi-tape-pink"
                style={{
                  top: "20px",
                  left: "50%",
                  transform: "translateX(-50%) rotate(-2deg)",
                  width: "120px",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  phase === "flip" || phase === "page2" || phase === "zoomOut"
                    ? { opacity: 0.8, scale: 1 }
                    : { opacity: 0, scale: 0.5 }
                }
                transition={{ duration: 0.4, delay: 0.3 }}
              />

              {/* Washi tape corner */}
              <motion.div
                className="washi-tape washi-tape-lavender"
                style={{
                  bottom: "30px",
                  right: "20px",
                  transform: "rotate(35deg)",
                  width: "80px",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  phase === "flip" || phase === "page2" || phase === "zoomOut"
                    ? { opacity: 0.8, scale: 1 }
                    : { opacity: 0, scale: 0.5 }
                }
                transition={{ duration: 0.4, delay: 0.5 }}
              />

              {/* Washi tape left */}
              <motion.div
                className="washi-tape washi-tape-peach"
                style={{
                  top: "45%",
                  left: "10px",
                  transform: "rotate(-90deg)",
                  width: "90px",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={
                  phase === "flip" || phase === "page2" || phase === "zoomOut"
                    ? { opacity: 0.7, scale: 1 }
                    : { opacity: 0, scale: 0.5 }
                }
                transition={{ duration: 0.4, delay: 0.4 }}
              />

              {/* Main text — "For Rasna ❤️" */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={
                  phase === "flip" || phase === "page2" || phase === "zoomOut"
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <p
                  className="font-script text-warmbrown text-lg tracking-wider mb-4"
                  style={{ opacity: 0.6 }}
                >
                  ~ a little something ~
                </p>
                <h2
                  className="font-script text-5xl md:text-6xl text-warmbrown text-center leading-tight"
                  style={{
                    textShadow: "0 2px 4px rgba(92,64,51,0.15)",
                  }}
                >
                  For Rasna{" "}
                  <span className="inline-block animate-bounce-gentle">❤️</span>
                </h2>
                <div className="mt-6 flex items-center gap-3 opacity-50">
                  <div className="h-px w-12 bg-warmbrown" />
                  <span className="text-warmbrown font-handwritten text-sm">
                    with love
                  </span>
                  <div className="h-px w-12 bg-warmbrown" />
                </div>

                {/* Little flower doodles */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 opacity-40">
                  {["🌸", "✿", "🌷", "✿", "🌸"].map((f, i) => (
                    <motion.span
                      key={i}
                      className="text-lg"
                      initial={{ opacity: 0, scale: 0 }}
                      animate={
                        phase === "flip" ||
                        phase === "page2" ||
                        phase === "zoomOut"
                          ? { opacity: 1, scale: 1 }
                          : { opacity: 0, scale: 0 }
                      }
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.3 }}
                    >
                      {f}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* ── SECOND PAGE OVERLAY (phase: page2) ─────── */}
            <AnimatePresence>
              {(phase === "page2" || phase === "zoomOut") && (
                <motion.div
                  key="page2"
                  className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(160deg, #faf0e4 0%, #f5e6d3 50%, #efe0cf 100%)",
                    border: "1px solid rgba(92,64,51,0.1)",
                    transformOrigin: "left center",
                  }}
                  initial={{ rotateY: -90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  transition={{
                    duration: 0.7,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {/* Paper texture */}
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Doodle decorations */}
                  <DoodleStars />

                  {/* Page content */}
                  <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-center"
                    >
                      <p className="font-handwritten text-warmbrown/60 text-lg mb-2">
                        Chapter One
                      </p>
                      <h3
                        className="font-script text-3xl md:text-4xl text-warmbrown mb-4"
                        style={{
                          textShadow: "0 1px 3px rgba(92,64,51,0.1)",
                        }}
                      >
                        The Day We Met
                      </h3>
                      <div className="w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-warmbrown/30 to-transparent mb-6" />

                      <p className="font-handwritten text-warmbrown/50 text-base max-w-xs mx-auto leading-relaxed">
                        ...and just like that, a beautiful friendship began ✨
                      </p>
                    </motion.div>

                    {/* Mini polaroid placeholder */}
                    <motion.div
                      className="mt-6 w-28 h-32 bg-white rounded-sm shadow-lg p-1.5 pb-5"
                      style={{ transform: "rotate(-3deg)" }}
                      initial={{ opacity: 0, y: 20, rotate: -8 }}
                      animate={{ opacity: 1, y: 0, rotate: -3 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      <div
                        className="w-full h-full rounded-sm"
                        style={{
                          background:
                            "linear-gradient(135deg, #FFB7C5 0%, #DCC6FF 50%, #BFE9FF 100%)",
                        }}
                      />
                      <p className="font-handwritten text-warmbrown/40 text-xs text-center mt-0.5">
                        us! 💕
                      </p>
                    </motion.div>
                  </div>

                  {/* Washi tape accent */}
                  <div
                    className="washi-tape washi-tape-pink"
                    style={{
                      top: "15px",
                      right: "25px",
                      transform: "rotate(12deg)",
                      width: "70px",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── FRONT COVER (flips open) ────────────────── */}
            <motion.div
              className="absolute inset-0 rounded-r-lg rounded-l-sm overflow-hidden"
              style={{
                transformOrigin: "left center",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
                zIndex: 10,
              }}
              initial={{ rotateY: 0 }}
              animate={
                phase === "flip" || phase === "page2" || phase === "zoomOut"
                  ? { rotateY: -178 }
                  : { rotateY: 0 }
              }
              transition={{
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              {/* Cover front face */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{
                  background:
                    "linear-gradient(145deg, #6B4A36 0%, #5C4033 20%, #7B5B42 45%, #8B6914 70%, #6B4A36 100%)",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Leather grain texture */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.12'/%3E%3C/svg%3E")`,
                    opacity: 0.5,
                  }}
                />

                {/* Subtle stitching border */}
                <div
                  className="absolute inset-3 rounded pointer-events-none"
                  style={{
                    border: "2px dashed rgba(212,160,84,0.3)",
                    borderRadius: "4px",
                  }}
                />

                {/* Corner flourishes */}
                <CornerFlourish position="top-left" />
                <CornerFlourish position="top-right" />
                <CornerFlourish position="bottom-left" />
                <CornerFlourish position="bottom-right" />

                {/* Spine highlight */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)",
                  }}
                />

                {/* Center content */}
                <div className="relative z-10 flex flex-col items-center gap-5 px-8">
                  {/* Decorative line top */}
                  <div className="flex items-center gap-3">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600/50" />
                    <span className="text-amber-500/60 text-xs">✦</span>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600/50" />
                  </div>

                  {/* Heart emblem */}
                  <HeartEmblem />

                  {/* Title */}
                  <div className="text-center">
                    <motion.h1
                      className="font-script text-4xl md:text-5xl leading-tight"
                      style={{
                        color: "transparent",
                        backgroundImage:
                          "linear-gradient(135deg, #f0c896 0%, #d4a054 30%, #f5d98e 60%, #c9944a 100%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        textShadow: "none",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                      }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    >
                      Our
                      <br />
                      Friendship
                      <br />
                      Story
                    </motion.h1>
                  </div>

                  {/* Decorative line bottom */}
                  <div className="flex items-center gap-3">
                    <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600/50" />
                    <span className="text-amber-500/60 text-xs">✦</span>
                    <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600/50" />
                  </div>

                  {/* Subtitle */}
                  <motion.p
                    className="font-handwritten text-amber-600/50 text-lg tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    Prasanna & Me
                  </motion.p>
                </div>

                {/* Embossed texture overlay on the entire cover */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse at 60% 40%, rgba(255,255,255,0.05) 0%, transparent 60%)",
                  }}
                />
              </div>

              {/* Cover back face (inside of cover) */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(145deg, #d4c4a8 0%, #c9b896 50%, #bfae84 100%)",
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                }}
              >
                {/* Marbled endpaper pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.015' numOctaves='3' seed='2'/%3E%3CfeColorMatrix type='saturate' values='0.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23marble)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div className="absolute inset-4 border border-dashed border-warmbrown/20 rounded" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
