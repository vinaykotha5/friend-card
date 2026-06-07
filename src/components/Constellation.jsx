import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, useInView } from 'motion/react';

/* ───────────────────────────────────────────────
   Heart constellation star positions (normalised 0-1)
   ─────────────────────────────────────────────── */
const HEART_POINTS = [
  { x: 0.50, y: 0.38 },  // top center dip
  { x: 0.35, y: 0.22 },  // left upper curve
  { x: 0.20, y: 0.28 },  // left peak
  { x: 0.18, y: 0.45 },  // left mid
  { x: 0.28, y: 0.60 },  // left lower
  { x: 0.50, y: 0.78 },  // bottom point
  { x: 0.72, y: 0.60 },  // right lower
  { x: 0.82, y: 0.45 },  // right mid
  { x: 0.80, y: 0.28 },  // right peak
  { x: 0.65, y: 0.22 },  // right upper curve
];

// Connection order to trace the heart
const HEART_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [0, 9], [9, 8], [8, 7], [7, 6], [6, 5],
];

/* ───────────────────────────────────────────────
   Background star field (canvas)
   ─────────────────────────────────────────────── */
const useStarField = (canvasRef, sectionRef, isVisible) => {
  const starsRef = useRef([]);
  const shootingStarsRef = useRef([]);
  const constellationProgressRef = useRef(0);
  const animFrameRef = useRef(null);
  const lastShootingStarRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    const resize = () => {
      const rect = section.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    };

    // Generate background stars
    const generateStars = () => {
      const stars = [];
      for (let i = 0; i < 180; i++) {
        const isLarge = i < 8;
        stars.push({
          x: Math.random() * 1.0,
          y: Math.random() * 1.0,
          radius: isLarge ? 2.5 + Math.random() * 2.5 : 0.5 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 1.2,
          baseOpacity: isLarge ? 0.7 : 0.3 + Math.random() * 0.5,
          isLarge,
          hue: isLarge ? (Math.random() > 0.5 ? 220 : 40) : 0,
        });
      }
      starsRef.current = stars;
    };

    resize();
    generateStars();
    window.addEventListener('resize', resize);

    // Shooting star creator
    const createShootingStar = () => {
      const angle = (Math.PI / 6) + Math.random() * (Math.PI / 4);
      const speed = 6 + Math.random() * 8;
      return {
        x: Math.random() * 0.8 * width,
        y: Math.random() * 0.3 * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1.0,
        decay: 0.012 + Math.random() * 0.01,
        length: 40 + Math.random() * 60,
        brightness: 0.8 + Math.random() * 0.2,
      };
    };

    // Main animation loop
    const animate = (time) => {
      ctx.clearRect(0, 0, width, height);
      const t = time * 0.001;

      // Draw background stars
      starsRef.current.forEach((star) => {
        const twinkle = 0.5 + 0.5 * Math.sin(t * star.speed + star.phase);
        const opacity = star.baseOpacity * (0.3 + 0.7 * twinkle);
        const sx = star.x * width;
        const sy = star.y * height;

        if (star.isLarge) {
          // Glow effect for large stars
          const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.radius * 4);
          const hue = star.hue;
          gradient.addColorStop(0, `hsla(${hue}, 80%, 90%, ${opacity})`);
          gradient.addColorStop(0.4, `hsla(${hue}, 60%, 80%, ${opacity * 0.4})`);
          gradient.addColorStop(1, `hsla(${hue}, 40%, 70%, 0)`);
          ctx.beginPath();
          ctx.arc(sx, sy, star.radius * 4, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fill();
      });

      // Shooting stars
      const now = Date.now();
      if (now - lastShootingStarRef.current > 3000 + Math.random() * 4000) {
        if (shootingStarsRef.current.length < 2) {
          shootingStarsRef.current.push(createShootingStar());
          lastShootingStarRef.current = now;
        }
      }

      shootingStarsRef.current = shootingStarsRef.current.filter((ss) => {
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life -= ss.decay;

        if (ss.life <= 0) return false;

        const tailX = ss.x - (ss.vx / Math.sqrt(ss.vx ** 2 + ss.vy ** 2)) * ss.length * ss.life;
        const tailY = ss.y - (ss.vy / Math.sqrt(ss.vx ** 2 + ss.vy ** 2)) * ss.length * ss.life;

        const gradient = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
        gradient.addColorStop(0.6, `rgba(200, 220, 255, ${ss.life * 0.3 * ss.brightness})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${ss.life * 0.9 * ss.brightness})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Bright head glow
        const headGlow = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${ss.life * 0.8})`);
        headGlow.addColorStop(1, `rgba(200, 220, 255, 0)`);
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = headGlow;
        ctx.fill();

        return true;
      });

      // ── Constellation drawing ──
      if (isVisible) {
        constellationProgressRef.current = Math.min(
          constellationProgressRef.current + 0.003,
          1.0
        );
      }

      const progress = constellationProgressRef.current;
      if (progress > 0) {
        // Constellation area — centered with some padding
        const cx = width * 0.5;
        const cy = height * 0.35;
        const scale = Math.min(width, height) * 0.3;

        const getStarPos = (pt) => ({
          sx: cx + (pt.x - 0.5) * scale,
          sy: cy + (pt.y - 0.5) * scale,
        });

        // Draw connection lines with sequential reveal
        const totalConnections = HEART_CONNECTIONS.length;
        const connectionsToShow = progress * totalConnections;

        HEART_CONNECTIONS.forEach(([from, to], idx) => {
          if (idx >= connectionsToShow) return;

          const lineProgress = Math.min(
            (connectionsToShow - idx) / 1.0,
            1.0
          );

          const fromPos = getStarPos(HEART_POINTS[from]);
          const toPos = getStarPos(HEART_POINTS[to]);

          const endX = fromPos.sx + (toPos.sx - fromPos.sx) * lineProgress;
          const endY = fromPos.sy + (toPos.sy - fromPos.sy) * lineProgress;

          // Line glow
          ctx.beginPath();
          ctx.moveTo(fromPos.sx, fromPos.sy);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = `rgba(255, 183, 197, ${0.15 * progress})`;
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Main line
          ctx.beginPath();
          ctx.moveTo(fromPos.sx, fromPos.sy);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = `rgba(255, 210, 220, ${0.5 * progress})`;
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        });

        // Draw constellation stars
        HEART_POINTS.forEach((pt, idx) => {
          const starProgress = Math.min(progress * 2.5 - idx * 0.08, 1.0);
          if (starProgress <= 0) return;

          const { sx, sy } = getStarPos(pt);
          const pulse = 0.8 + 0.2 * Math.sin(t * 1.5 + idx);
          const r = (5 + Math.random() * 2) * starProgress * pulse;

          // Outer glow — pink/gold
          const isGold = idx % 3 === 0;
          const glowColor = isGold
            ? `rgba(255, 215, 100, ${0.3 * starProgress})`
            : `rgba(255, 183, 197, ${0.3 * starProgress})`;
          const coreColor = isGold
            ? `rgba(255, 230, 150, ${0.9 * starProgress})`
            : `rgba(255, 200, 210, ${0.9 * starProgress})`;

          const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3);
          glow.addColorStop(0, coreColor);
          glow.addColorStop(0.5, glowColor);
          glow.addColorStop(1, 'rgba(255, 183, 197, 0)');
          ctx.beginPath();
          ctx.arc(sx, sy, r * 3, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // Core star
          ctx.beginPath();
          ctx.arc(sx, sy, r * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * starProgress})`;
          ctx.fill();
        });

        // "Our Friendship" label
        if (progress > 0.6) {
          const labelOpacity = Math.min((progress - 0.6) / 0.3, 1.0);
          const labelX = cx;
          const labelY = cy + scale * 0.32;
          ctx.save();
          ctx.font = `${Math.max(16, Math.min(24, width * 0.025))}px 'Caveat', cursive`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = `rgba(255, 210, 220, ${labelOpacity * 0.9})`;
          ctx.shadowColor = 'rgba(255, 183, 197, 0.6)';
          ctx.shadowBlur = 15;
          ctx.fillText('~ Our Friendship ~', labelX, labelY);
          ctx.restore();
        }
      }

      // Nebula clouds — very subtle colorful patches
      const drawNebula = (cx, cy, rx, ry, hue, maxOpacity) => {
        const nebula = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
        const pulse = 0.7 + 0.3 * Math.sin(t * 0.3 + hue);
        nebula.addColorStop(0, `hsla(${hue}, 60%, 40%, ${maxOpacity * pulse})`);
        nebula.addColorStop(0.5, `hsla(${hue}, 50%, 30%, ${maxOpacity * 0.3 * pulse})`);
        nebula.addColorStop(1, 'transparent');
        ctx.save();
        ctx.scale(1, ry / rx);
        ctx.beginPath();
        ctx.arc(cx, cy * (rx / ry), rx, 0, Math.PI * 2);
        ctx.fillStyle = nebula;
        ctx.fill();
        ctx.restore();
      };

      drawNebula(width * 0.15, height * 0.25, 200, 120, 270, 0.04);
      drawNebula(width * 0.85, height * 0.65, 180, 100, 330, 0.035);
      drawNebula(width * 0.5, height * 0.8, 250, 80, 210, 0.025);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [canvasRef, sectionRef, isVisible]);
};

/* ───────────────────────────────────────────────
   Poetic text lines
   ─────────────────────────────────────────────── */
const POEM_LINES = [
  'Some friendships last a season.',
  'Some become memories.',
  'Ours became a constellation.',
  '❤️',
];

/* ───────────────────────────────────────────────
   Main Constellation Component
   ─────────────────────────────────────────────── */
const Constellation = () => {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const textRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.2, once: false });
  const textInView = useInView(textRef, { amount: 0.3, once: true });

  // Drive canvas constellation animation
  useStarField(canvasRef, sectionRef, isInView);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{
        minHeight: '100vh',
        background: `linear-gradient(
          180deg,
          #0a0e27 0%,
          #10153a 20%,
          #1a1040 50%,
          #14133d 70%,
          #0d1b3e 100%
        )`,
      }}
    >
      {/* Canvas layer */}
      <canvas
        ref={canvasRef}
        className="constellation-canvas"
        style={{ pointerEvents: 'none' }}
      />

      {/* Faint horizon glow */}
      <div
        className="absolute bottom-0 left-0 w-full pointer-events-none"
        style={{
          height: '30%',
          background:
            'linear-gradient(to top, rgba(255, 183, 197, 0.06) 0%, transparent 100%)',
        }}
      />

      {/* ── Poetic Text Overlay ── */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col items-center justify-end pb-28 md:pb-32 px-6 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <div className="flex flex-col items-center gap-3 md:gap-4">
          {POEM_LINES.map((line, i) => (
            <motion.p
              key={i}
              className={`font-script text-white text-center ${
                line === '❤️'
                  ? 'text-4xl md:text-5xl'
                  : 'text-xl md:text-3xl'
              }`}
              style={{
                textShadow:
                  '0 0 20px rgba(255, 183, 197, 0.6), 0 0 60px rgba(255, 183, 197, 0.3), 0 2px 8px rgba(0,0,0,0.5)',
              }}
              initial={{ opacity: 0, y: 25 }}
              animate={
                textInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 25 }
              }
              transition={{
                delay: i * 1.0 + 0.5,
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {line}
            </motion.p>
          ))}
        </div>

        {/* Made with love credit */}
        <motion.p
          className="font-handwritten text-sm md:text-base mt-12 md:mt-16"
          style={{
            color: 'rgba(255, 210, 220, 0.45)',
            textShadow: '0 0 10px rgba(255, 183, 197, 0.15)',
          }}
          initial={{ opacity: 0 }}
          animate={
            textInView
              ? { opacity: 1 }
              : { opacity: 0 }
          }
          transition={{
            delay: POEM_LINES.length * 1.0 + 1.5,
            duration: 1.5,
            ease: 'easeOut',
          }}
        >
          Made with ❤️ for Rasna
        </motion.p>
      </div>

      {/* Top edge fade for seamless blending with section above */}
      <div
        className="absolute top-0 left-0 w-full h-24 pointer-events-none"
        style={{
          background:
            'linear-gradient(to bottom, rgba(10, 14, 39, 1) 0%, transparent 100%)',
          zIndex: 5,
        }}
      />
    </section>
  );
};

export default Constellation;
