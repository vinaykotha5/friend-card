import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

const justifyMap = {
  left: "justify-start",
  center: "justify-center",
  right: "justify-end",
};

// Pre-generate sparkle configs so they stay stable across renders
function generateSparkles(count = 7) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * 360 + (Math.random() * 30 - 15);
    const rad = (angle * Math.PI) / 180;
    const distance = 40 + Math.random() * 35;
    return {
      id: i,
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance - 20, // bias upward
      rotate: Math.random() * 360,
      scale: 0.6 + Math.random() * 0.6,
      delay: Math.random() * 0.15,
    };
  });
}

export default function HiddenTreasure({ message = "You're my favourite human 💛", position = "center" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sparkles = useMemo(() => generateSparkles(7), []);

  const handleClick = () => {
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className={`relative flex ${justifyMap[position] || "justify-center"} py-4 z-10`}>
      <div className="relative flex flex-col items-center">
        {/* Hover Tooltip */}
        <AnimatePresence>
          {isHovered && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-9 bg-warmbrown/80 text-cream text-xs font-body px-2.5 py-1 rounded-full whitespace-nowrap pointer-events-none select-none"
            >
              🎁 Open me!
              {/* tiny triangle */}
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-warmbrown/80" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gift Box */}
        <motion.div
          className="gift-box relative cursor-pointer select-none"
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          animate={
            !isOpen
              ? { y: [0, -8, 0] }
              : {}
          }
          transition={
            !isOpen
              ? { duration: 2, repeat: Infinity, ease: "easeInOut" }
              : {}
          }
          style={{ width: 80 }}
        >
          {/* Lid */}
          <motion.div
            className="relative z-10"
            animate={
              isOpen
                ? { y: -30, rotateX: 50, opacity: 0.7 }
                : { y: 0, rotateX: 0, opacity: 1 }
            }
            transition={{ type: "spring", stiffness: 200, damping: 18, duration: 0.5 }}
            style={{ perspective: 400 }}
          >
            {/* Lid body */}
            <div
              className="mx-auto rounded-t-lg"
              style={{
                width: 72,
                height: 16,
                background: "linear-gradient(135deg, #F7C7A3 0%, #FFD6BA 100%)",
                boxShadow: "0 -2px 6px rgba(92,64,51,0.1)",
              }}
            >
              {/* Ribbon on lid */}
              <div
                className="absolute left-1/2 -translate-x-1/2 top-0 h-full bg-blush/70"
                style={{ width: 5 }}
              />
            </div>

            {/* Bow */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-end gap-0">
              {/* Left loop */}
              <div
                className="rounded-full border-2 border-blush"
                style={{
                  width: 14,
                  height: 10,
                  borderBottomColor: "transparent",
                  transform: "rotate(-20deg)",
                  background: "rgba(255,183,197,0.25)",
                }}
              />
              {/* Center knot */}
              <div
                className="bg-blush rounded-full"
                style={{ width: 6, height: 6, margin: "0 -2px", zIndex: 1 }}
              />
              {/* Right loop */}
              <div
                className="rounded-full border-2 border-blush"
                style={{
                  width: 14,
                  height: 10,
                  borderBottomColor: "transparent",
                  transform: "rotate(20deg)",
                  background: "rgba(255,183,197,0.25)",
                }}
              />
            </div>
          </motion.div>

          {/* Box Body */}
          <div
            className="relative mx-auto rounded-b-lg overflow-hidden"
            style={{
              width: 64,
              height: 52,
              background: "linear-gradient(160deg, #F7C7A3 0%, #FFD6BA 60%, #F7C7A3 100%)",
              boxShadow: "0 6px 18px rgba(92,64,51,0.18), inset 0 -2px 4px rgba(92,64,51,0.08)",
              marginTop: -2,
            }}
          >
            {/* Vertical ribbon */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-0 h-full bg-blush/60"
              style={{ width: 5 }}
            />
            {/* Horizontal ribbon */}
            <div
              className="absolute top-1/2 -translate-y-1/2 left-0 w-full bg-blush/60"
              style={{ height: 5 }}
            />

            {/* Inner glow when open */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 rounded-b-lg"
                  style={{
                    background: "radial-gradient(ellipse at center top, rgba(255,232,154,0.5) 0%, transparent 70%)",
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Sparkle Particles */}
          <AnimatePresence>
            {isOpen &&
              sparkles.map((s) => (
                <motion.span
                  key={s.id}
                  className="absolute pointer-events-none select-none"
                  style={{
                    left: "50%",
                    top: 6,
                    fontSize: 12 * s.scale,
                    zIndex: 20,
                  }}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                  animate={{
                    x: s.x,
                    y: s.y,
                    opacity: [1, 1, 0],
                    scale: [0, 1.2, 0.6],
                    rotate: s.rotate,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: s.delay,
                    ease: "easeOut",
                  }}
                >
                  ✨
                </motion.span>
              ))}
          </AnimatePresence>
        </motion.div>

        {/* Message Speech Bubble */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="relative mt-3"
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 22,
                delay: 0.35,
              }}
            >
              {/* Triangle pointing up to the box */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0"
                style={{
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "8px solid rgba(255,248,238,0.6)",
                }}
              />

              <div className="glass-morphism rounded-xl px-4 py-3 max-w-[200px] text-center">
                <p className="font-handwritten text-lg text-warmbrown leading-snug">
                  {message}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
