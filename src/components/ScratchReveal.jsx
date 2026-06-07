import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const cardData = [
  {
    message: "You're not just my best friend...\nYou're my favorite person! ❤️",
    color: '#FFB7C5',
  },
  {
    message: 'Remember when we...\nLaughed so hard we cried? 😂',
    color: '#DCC6FF',
  },
  {
    message: 'Dear Rasna,\nYou make everything better! 🌟',
    color: '#BFE9FF',
  },
];

function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lighten(hex, amount = 40) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return `rgb(${r}, ${g}, ${b})`;
}

function ScratchCard({ message, color, index }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const [revealed, setRevealed] = useState(false);
  const [scratchStarted, setScratchStarted] = useState(false);
  const revealedRef = useRef(false);

  const BRUSH_RADIUS = 22;
  const REVEAL_THRESHOLD = 0.40;

  // Draw the initial scratch overlay
  const drawOverlay = useCallback((canvas) => {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;

    // Shimmery gradient background
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.3, lighten(color, 30));
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(0.7, lighten(color, 50));
    gradient.addColorStop(1, color);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Sparkle dots pattern
    const sparkleCount = 60;
    for (let i = 0; i < sparkleCount; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const radius = Math.random() * 2.5 + 0.5;
      const alpha = Math.random() * 0.6 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // Star sparkle shapes
    for (let i = 0; i < 12; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const size = Math.random() * 6 + 3;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI);
      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.3})`;
      ctx.lineWidth = 1;
      // Cross sparkle
      ctx.beginPath();
      ctx.moveTo(-size, 0);
      ctx.lineTo(size, 0);
      ctx.moveTo(0, -size);
      ctx.lineTo(0, size);
      ctx.stroke();
      ctx.restore();
    }

    // "Scratch Me!" text
    ctx.save();
    ctx.font = 'bold 18px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Text shadow for depth
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillText('✨ Scratch Me! ✨', w / 2 + 1, h / 2 + 1);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText('✨ Scratch Me! ✨', w / 2, h / 2);
    ctx.restore();
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use higher res for retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    drawOverlay(canvas);
  }, [drawOverlay]);

  const getPosition = useCallback((e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const scratch = useCallback((pos) => {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current) return;

    const ctx = canvas.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';

    if (lastPoint.current) {
      // Draw along the path for smooth scratching
      const dx = pos.x - lastPoint.current.x;
      const dy = pos.y - lastPoint.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.floor(dist / 4));

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = lastPoint.current.x + dx * t;
        const y = lastPoint.current.y + dy * t;
        ctx.beginPath();
        ctx.arc(x, y, BRUSH_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, BRUSH_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPoint.current = pos;
  }, []);

  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current) return;

    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;
    let totalSampled = 0;

    // Sample every 100th pixel for performance
    for (let i = 3; i < pixels.length; i += 400) {
      totalSampled++;
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const percentage = transparentCount / totalSampled;
    if (percentage >= REVEAL_THRESHOLD) {
      revealedRef.current = true;
      setRevealed(true);
    }
  }, []);

  const handleStart = useCallback((e) => {
    e.preventDefault();
    isDrawing.current = true;
    lastPoint.current = null;
    setScratchStarted(true);
    const pos = getPosition(e, canvasRef.current);
    scratch(pos);
  }, [getPosition, scratch]);

  const handleMove = useCallback((e) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const pos = getPosition(e, canvasRef.current);
    scratch(pos);
  }, [getPosition, scratch]);

  const handleEnd = useCallback(() => {
    isDrawing.current = false;
    lastPoint.current = null;
    checkScratchPercentage();
  }, [checkScratchPercentage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use passive: false for touch events to allow preventDefault
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);

    return () => {
      canvas.removeEventListener('touchstart', handleStart);
      canvas.removeEventListener('touchmove', handleMove);
      canvas.removeEventListener('touchend', handleEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  // Background gradient for the hidden message
  const bgGradient = `linear-gradient(135deg, ${hexToRgba(color, 0.3)}, ${hexToRgba(color, 0.15)}, ${hexToRgba(color, 0.25)})`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ scale: 1.03, y: -4 }}
      className="relative"
    >
      <div
        className="w-72 h-48 rounded-2xl overflow-hidden relative shadow-lg"
        style={{
          boxShadow: `0 8px 30px ${hexToRgba(color, 0.3)}, 0 4px 12px rgba(92, 64, 51, 0.1)`,
        }}
      >
        {/* Hidden content layer */}
        <div
          className="absolute inset-0 flex items-center justify-center p-6"
          style={{ background: bgGradient }}
        >
          <div className="text-center">
            {message.split('\n').map((line, i) => (
              <p
                key={i}
                className="font-handwritten text-xl text-warmbrown leading-relaxed"
              >
                {line}
              </p>
            ))}
          </div>

          {/* Reveal celebration effect */}
          <AnimatePresence>
            {revealed && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.span
                    key={`sparkle-${i}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1.5, 0],
                      x: Math.cos((i / 8) * Math.PI * 2) * 80,
                      y: Math.sin((i / 8) * Math.PI * 2) * 60,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.06,
                      ease: 'easeOut',
                    }}
                    className="absolute text-lg pointer-events-none"
                    style={{ left: '50%', top: '50%' }}
                  >
                    ✨
                  </motion.span>
                ))}
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Scratch overlay canvas */}
        <motion.canvas
          ref={canvasRef}
          className="scratch-canvas absolute inset-0 w-full h-full rounded-2xl"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          animate={
            revealed
              ? { opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }
              : { opacity: 1 }
          }
          style={{ pointerEvents: revealed ? 'none' : 'auto' }}
        />
      </div>

      {/* Status indicator */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + index * 0.15 }}
        className="text-center mt-3 font-handwritten text-sm text-warmbrown/60"
      >
        {revealed
          ? '💖 Revealed!'
          : scratchStarted
          ? '🔍 Keep scratching...'
          : '👆 Scratch the card!'}
      </motion.p>
    </motion.div>
  );
}

export default function ScratchReveal() {
  return (
    <section className="py-20 px-4">
      {/* Section title */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="text-center mb-14"
      >
        <h2 className="font-script text-4xl md:text-5xl text-warmbrown text-shadow-glow mb-3">
          ✨ Scratch to Reveal Secrets
        </h2>
        <p className="font-handwritten text-lg text-warmbrown/70">
          Use your finger or mouse to scratch!
        </p>
      </motion.div>

      {/* Scratch cards */}
      <div className="flex flex-wrap justify-center gap-8">
        {cardData.map((card, index) => (
          <ScratchCard
            key={index}
            message={card.message}
            color={card.color}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
