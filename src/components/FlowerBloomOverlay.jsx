import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import RoseBouquet from './RoseBouquet'

/* ═══════════════════════════════════════════════════════════
   🌹 CINEMATIC ROSE PETAL TRANSITION
   Inspired by Isabela Madrigal from Encanto
   
   Canvas-based particle system with:
   • Hundreds of realistic rose petals with 3D rotation
   • Physics-based vortex, wind, gravity & turbulence
   • Sparkle particles & volumetric bokeh lights
   • Multi-phase: Scatter → Vortex → Cover → Text → Reveal
   • Parallax depth layers
   • 60fps smooth rendering
   ═══════════════════════════════════════════════════════════ */

const PETAL_COUNT = 500
const SPARKLE_COUNT = 60
const BOKEH_COUNT = 20

const PETAL_COLORS = [
  { r: 200, g: 30, b: 50 },   { r: 220, g: 40, b: 60 },
  { r: 180, g: 25, b: 45 },   { r: 230, g: 50, b: 70 },
  { r: 190, g: 20, b: 40 },   { r: 255, g: 150, b: 170 },
  { r: 255, g: 180, b: 195 }, { r: 255, g: 130, b: 160 },
  { r: 240, g: 160, b: 180 }, { r: 255, g: 200, b: 210 },
  { r: 255, g: 210, b: 220 }, { r: 255, g: 220, b: 225 },
  { r: 255, g: 245, b: 248 }, { r: 255, g: 240, b: 242 },
  { r: 250, g: 235, b: 240 },
]

const BOKEH_COLORS = [
  [255, 183, 197], [220, 198, 255], [255, 214, 186],
  [255, 232, 154], [255, 255, 255], [191, 233, 255],
]

const rand = (min, max) => Math.random() * (max - min) + min
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
const easeOutQuart = t => 1 - Math.pow(1 - t, 4)

function noise2D(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return (n - Math.floor(n)) * 2 - 1
}

function createPetal(w, h) {
  const color = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)]
  const depth = rand(0.3, 1.0)
  const size = (12 + rand(0, 18)) * (0.5 + depth * 0.5)
  const edge = Math.floor(Math.random() * 4)
  let x, y
  switch (edge) {
    case 0: x = rand(-100, w + 100); y = -rand(20, 200); break
    case 1: x = w + rand(20, 200); y = rand(-100, h + 100); break
    case 2: x = rand(-100, w + 100); y = h + rand(20, 200); break
    default: x = -rand(20, 200); y = rand(-100, h + 100); break
  }
  return {
    x, y, vx: rand(-0.5, 0.5), vy: rand(-0.3, 0.8),
    size, depth, color,
    rotX: rand(0, Math.PI * 2), rotY: rand(0, Math.PI * 2), rotZ: rand(0, Math.PI * 2),
    rotSpeedX: rand(-0.02, 0.02), rotSpeedY: rand(-0.03, 0.03), rotSpeedZ: rand(-0.015, 0.015),
    petalType: Math.floor(rand(0, 3)),
    curlAmount: rand(0.1, 0.4),
    mass: 0.5 + rand(0, 0.5), drag: 0.98 + rand(0, 0.015),
    opacity: 0, targetOpacity: rand(0.6, 1.0),
    seed: rand(0, 1000), shadowBlur: 2 + rand(0, 4),
  }
}

function createSparkle(w, h) {
  return {
    x: rand(0, w), y: rand(0, h),
    size: rand(1, 3.5), opacity: 0,
    targetOpacity: rand(0.3, 1.0),
    twinkleSpeed: rand(0.03, 0.08),
    twinkleOffset: rand(0, Math.PI * 2),
    isGold: Math.random() > 0.5,
  }
}

function createBokeh(w, h) {
  const c = BOKEH_COLORS[Math.floor(Math.random() * BOKEH_COLORS.length)]
  return {
    x: rand(-50, w + 50), y: rand(-50, h + 50),
    size: rand(30, 120), r: c[0], g: c[1], b: c[2],
    opacity: 0, targetOpacity: rand(0.08, 0.2),
    vx: rand(-0.15, 0.15), vy: rand(-0.1, 0.1),
    pulse: rand(0, Math.PI * 2), pulseSpeed: rand(0.005, 0.02),
  }
}

// ─── DRAW PETAL ────────────────────────────────
function drawPetal(ctx, p) {
  if (p.opacity < 0.01) return
  ctx.save()
  ctx.translate(p.x, p.y)
  const scaleX = Math.abs(Math.cos(p.rotY)) * 0.3 + 0.7
  const scaleY = Math.abs(Math.cos(p.rotX)) * 0.3 + 0.7
  ctx.rotate(p.rotZ)
  ctx.scale(scaleX, scaleY)
  const frontFacing = Math.cos(p.rotX) * Math.cos(p.rotY) > 0
  const sf = frontFacing ? 1 : 0.75
  ctx.shadowColor = `rgba(${p.color.r * 0.3 | 0}, ${p.color.g * 0.2 | 0}, ${p.color.b * 0.2 | 0}, ${p.opacity * 0.3 * p.depth})`
  ctx.shadowBlur = p.shadowBlur * p.depth
  ctx.shadowOffsetX = 2 * p.depth
  ctx.shadowOffsetY = 3 * p.depth
  const grad = ctx.createRadialGradient(-p.size * 0.15, -p.size * 0.2, p.size * 0.05, 0, 0, p.size * 0.9)
  const r = p.color.r * sf | 0, g = p.color.g * sf | 0, b = p.color.b * sf | 0
  grad.addColorStop(0, `rgba(${Math.min(255, r + 40)},${Math.min(255, g + 30)},${Math.min(255, b + 30)},${p.opacity})`)
  grad.addColorStop(0.4, `rgba(${r},${g},${b},${p.opacity})`)
  grad.addColorStop(0.8, `rgba(${r * 0.85 | 0},${g * 0.8 | 0},${b * 0.85 | 0},${p.opacity})`)
  grad.addColorStop(1, `rgba(${r * 0.65 | 0},${g * 0.55 | 0},${b * 0.6 | 0},${p.opacity * 0.7})`)
  ctx.fillStyle = grad
  ctx.beginPath()
  const s = p.size
  if (p.petalType === 0) {
    ctx.moveTo(0, -s * 0.8)
    ctx.bezierCurveTo(s * 0.6, -s * 0.7, s * 0.7, -s * 0.1, s * 0.5, s * 0.4)
    ctx.bezierCurveTo(s * 0.3, s * 0.7, s * 0.1, s * 0.85, 0, s * 0.9)
    ctx.bezierCurveTo(-s * 0.1, s * 0.85, -s * 0.3, s * 0.7, -s * 0.5, s * 0.4)
    ctx.bezierCurveTo(-s * 0.7, -s * 0.1, -s * 0.6, -s * 0.7, 0, -s * 0.8)
  } else if (p.petalType === 1) {
    ctx.moveTo(0, -s * 0.9)
    ctx.bezierCurveTo(s * 0.5, -s * 0.5, s * 0.55, s * 0.1, s * 0.35, s * 0.5)
    ctx.quadraticCurveTo(s * 0.15, s * 0.8, 0, s * 0.85)
    ctx.quadraticCurveTo(-s * 0.15, s * 0.8, -s * 0.35, s * 0.5)
    ctx.bezierCurveTo(-s * 0.55, s * 0.1, -s * 0.5, -s * 0.5, 0, -s * 0.9)
  } else {
    ctx.moveTo(0, -s * 0.55)
    ctx.bezierCurveTo(s * 0.15, -s * 0.85, s * 0.6, -s * 0.7, s * 0.5, -s * 0.25)
    ctx.bezierCurveTo(s * 0.45, s * 0.15, s * 0.15, s * 0.55, 0, s * 0.85)
    ctx.bezierCurveTo(-s * 0.15, s * 0.55, -s * 0.45, s * 0.15, -s * 0.5, -s * 0.25)
    ctx.bezierCurveTo(-s * 0.6, -s * 0.7, -s * 0.15, -s * 0.85, 0, -s * 0.55)
  }
  ctx.closePath()
  ctx.fill()
  // Vein line
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.beginPath()
  ctx.moveTo(0, -s * 0.6)
  ctx.quadraticCurveTo(s * 0.03, 0, 0, s * 0.7)
  ctx.strokeStyle = `rgba(${Math.min(255, r + 60)},${Math.min(255, g + 40)},${Math.min(255, b + 40)},${p.opacity * 0.25})`
  ctx.lineWidth = 0.6
  ctx.stroke()
  ctx.restore()
}

function drawSparkle(ctx, s, time) {
  if (s.opacity < 0.01) return
  const twinkle = 0.5 + 0.5 * Math.sin(time * s.twinkleSpeed + s.twinkleOffset)
  const alpha = s.opacity * twinkle
  if (alpha < 0.01) return
  const sz = s.size * (0.6 + twinkle * 0.4)
  ctx.save()
  ctx.translate(s.x, s.y)
  ctx.globalAlpha = alpha
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, sz * 4)
  const glowColor = s.isGold ? '255,240,180' : '255,200,220'
  glow.addColorStop(0, `rgba(${glowColor},0.6)`)
  glow.addColorStop(0.5, `rgba(${glowColor},0.15)`)
  glow.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = glow
  ctx.beginPath()
  ctx.arc(0, 0, sz * 4, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = s.isGold ? '#FFF8E1' : '#FFF0F5'
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI) / 4
    const r = i % 2 === 0 ? sz : sz * 0.25
    ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
  }
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0, 0, sz * 0.4, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.fill()
  ctx.restore()
}

function drawBokeh(ctx, b, time) {
  if (b.opacity < 0.01) return
  const pulse = 0.8 + 0.2 * Math.sin(time * b.pulseSpeed + b.pulse)
  const alpha = b.opacity * pulse
  ctx.save()
  ctx.globalAlpha = alpha
  const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size)
  grad.addColorStop(0, `rgba(${b.r},${b.g},${b.b},${alpha * 0.5})`)
  grad.addColorStop(0.4, `rgba(${b.r},${b.g},${b.b},${alpha * 0.15})`)
  grad.addColorStop(0.7, `rgba(${b.r},${b.g},${b.b},${alpha * 0.04})`)
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.beginPath()
  ctx.arc(b.x, b.y, b.size * pulse, 0, Math.PI * 2)
  ctx.fillStyle = grad
  ctx.fill()
  ctx.restore()
}

// Phase timings (seconds)
const T = { SCATTER: 1.2, VORTEX: 2.4, COVER: 3.5, TEXT: 5.0, REVEAL: 5.8 }

export default function FlowerBloomOverlay({ isActive, onComplete }) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const petalsRef = useRef([])
  const sparklesRef = useRef([])
  const bokehRef = useRef([])
  const startTimeRef = useRef(null)
  const sizeRef = useRef({ w: 0, h: 0 })
  const completedRef = useRef(false)
  const textShownRef = useRef(false)
  const fadingRef = useRef(false)

  const [showText, setShowText] = useState(false)
  const [visible, setVisible] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    if (!isActive) {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      startTimeRef.current = null
      completedRef.current = false
      textShownRef.current = false
      fadingRef.current = false
      setVisible(false)
      setShowText(false)
      setFadingOut(false)
      return
    }

    setVisible(true)
    setShowText(false)
    setFadingOut(false)
    completedRef.current = false
    textShownRef.current = false
    fadingRef.current = false

    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const w = window.innerWidth
    const h = window.innerHeight
    sizeRef.current = { w, h }
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // Init particles
    petalsRef.current = Array.from({ length: PETAL_COUNT }, () => createPetal(w, h))
    sparklesRef.current = Array.from({ length: SPARKLE_COUNT }, () => createSparkle(w, h))
    bokehRef.current = Array.from({ length: BOKEH_COUNT }, () => createBokeh(w, h))

    startTimeRef.current = null

    function loop(timestamp) {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = (timestamp - startTimeRef.current) / 1000
      const { w, h } = sizeRef.current
      const cx = w / 2, cy = h / 2

      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, w, h)

      // Phase progress
      const scatterP = clamp(elapsed / T.SCATTER, 0, 1)
      const vortexP = clamp((elapsed - T.SCATTER) / (T.VORTEX - T.SCATTER), 0, 1)
      const coverP = clamp((elapsed - T.VORTEX) / (T.COVER - T.VORTEX), 0, 1)
      const revealP = clamp((elapsed - T.TEXT) / (T.REVEAL - T.TEXT), 0, 1)

      // Background
      const bgAlpha = clamp(scatterP * 0.7 + coverP * 0.3 - revealP * 0.8, 0, 1)
      if (bgAlpha > 0.01) {
        const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.7)
        bgGrad.addColorStop(0, `rgba(255,240,245,${bgAlpha * 0.95})`)
        bgGrad.addColorStop(0.3, `rgba(255,235,240,${bgAlpha * 0.9})`)
        bgGrad.addColorStop(0.6, `rgba(248,232,255,${bgAlpha * 0.85})`)
        bgGrad.addColorStop(1, `rgba(255,245,238,${bgAlpha * 0.8})`)
        ctx.fillStyle = bgGrad
        ctx.fillRect(0, 0, w, h)

        if (vortexP > 0 && revealP < 0.5) {
          const ga = easeInOutCubic(vortexP) * (1 - revealP * 2) * 0.35
          const gg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.4)
          gg.addColorStop(0, `rgba(255,200,220,${ga})`)
          gg.addColorStop(0.5, `rgba(255,180,200,${ga * 0.3})`)
          gg.addColorStop(1, 'rgba(255,180,200,0)')
          ctx.fillStyle = gg
          ctx.fillRect(0, 0, w, h)
        }
      }

      // Bokeh
      bokehRef.current.forEach(b => {
        b.opacity = lerp(b.opacity, b.targetOpacity * (1 - revealP), 0.02)
        b.x += b.vx
        b.y += b.vy
        if (b.x < -b.size) b.x = w + b.size
        if (b.x > w + b.size) b.x = -b.size
        if (b.y < -b.size) b.y = h + b.size
        if (b.y > h + b.size) b.y = -b.size
        drawBokeh(ctx, b, elapsed)
      })

      // Wind
      const windX = Math.sin(elapsed * 0.3) * 0.5 + Math.sin(elapsed * 0.7) * 0.3
      const windY = Math.cos(elapsed * 0.2) * 0.2

      // Petals
      petalsRef.current.forEach((p, i) => {
        // Opacity
        if (elapsed < T.SCATTER) {
          const fadeIn = clamp((elapsed - i * 0.003) * 2, 0, 1)
          p.opacity = lerp(p.opacity, p.targetOpacity * fadeIn, 0.05)
        } else if (elapsed < T.TEXT) {
          p.opacity = lerp(p.opacity, p.targetOpacity, 0.03)
        } else {
          p.opacity = lerp(p.opacity, 0, 0.02 + revealP * 0.05)
        }

        let fx = 0, fy = 0
        const nv = noise2D(p.x * 0.003 + elapsed * 0.5, p.y * 0.003 + p.seed)
        fx += windX * p.depth + nv * 0.8
        fy += windY * p.depth + 0.2 * p.mass

        if (elapsed < T.SCATTER) {
          fx += (cx - p.x) * 0.001
          fy += (cy - p.y) * 0.001
        }

        if (elapsed > T.SCATTER && elapsed < T.COVER) {
          const dx = cx - p.x, dy = cy - p.y
          const dist = Math.sqrt(dx * dx + dy * dy) + 1
          const vs = easeInOutCubic(vortexP) * 2.5
          const sa = Math.atan2(dy, dx) + Math.PI * 0.5
          fx += dx * vs * 0.015 * (1 - Math.min(dist / (Math.max(w, h) * 0.7), 1) * 0.5)
          fy += dy * vs * 0.015 * (1 - Math.min(dist / (Math.max(w, h) * 0.7), 1) * 0.5)
          const ts = vs * (0.8 + p.depth * 0.5) * Math.min(1, dist / 200)
          fx += Math.cos(sa) * ts
          fy += Math.sin(sa) * ts
          fx += nv * vs * 0.4
        }

        if (elapsed > T.VORTEX && elapsed < T.TEXT) {
          fx += noise2D(p.seed + elapsed * 0.3, p.y * 0.01) * 1.5
          fy += noise2D(p.x * 0.01, p.seed + elapsed * 0.3) * 1.5
          p.vx *= 0.96
          p.vy *= 0.96
        }

        if (elapsed > T.TEXT) {
          const re = easeOutQuart(revealP)
          fx += Math.cos(p.seed * 0.01) * re * 8
          fy += (-3 - rand(0, 5)) * re
          fx += Math.sin(elapsed * 2 + p.seed) * re * 3
        }

        p.vx = (p.vx + fx * 0.1) * p.drag
        p.vy = (p.vy + fy * 0.1) * p.drag
        p.x += p.vx * p.depth
        p.y += p.vy * p.depth

        const rm = elapsed > T.TEXT ? 1 + revealP * 3 : 1
        p.rotX += p.rotSpeedX * rm
        p.rotY += p.rotSpeedY * rm
        p.rotZ += p.rotSpeedZ * rm

        if (elapsed < T.TEXT) {
          const margin = 80
          if (p.x < -margin) p.x = w + margin
          if (p.x > w + margin) p.x = -margin
          if (p.y < -margin) p.y = h + margin
          if (p.y > h + margin) p.y = -margin
        }

        drawPetal(ctx, p)
      })

      // Sparkles
      sparklesRef.current.forEach((s, i) => {
        const appear = clamp(elapsed - 1.5 - i * 0.02, 0, 1)
        s.opacity = lerp(s.opacity, s.targetOpacity * appear * (1 - revealP), 0.03)
        s.x += noise2D(s.x * 0.01 + elapsed, s.y * 0.01) * 0.3
        s.y += noise2D(s.y * 0.01, s.x * 0.01 + elapsed) * 0.2
        drawSparkle(ctx, s, elapsed)
      })

      // State transitions (using refs to avoid stale closures)
      if (elapsed > T.COVER + 0.3 && !textShownRef.current) {
        textShownRef.current = true
        setShowText(true)
      }
      if (elapsed > T.TEXT && !fadingRef.current) {
        fadingRef.current = true
        setFadingOut(true)
      }
      if (elapsed > T.REVEAL + 0.5 && !completedRef.current) {
        completedRef.current = true
        setVisible(false)
        onComplete?.()
        return
      }

      animRef.current = requestAnimationFrame(loop)
    }

    animRef.current = requestAnimationFrame(loop)

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isActive, onComplete])

  if (!visible) return null

  return (
    <>
      {/* Canvas layer */}
      <motion.div
        className="fixed inset-0 z-[60]"
        initial={{ opacity: 0 }}
        animate={{ opacity: fadingOut ? 0 : 1 }}
        transition={{ duration: fadingOut ? 2 : 0.5 }}
        style={{ pointerEvents: 'none' }}
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </motion.div>

      {/* Text & Bouquet overlay */}
      <AnimatePresence>
        {showText && !fadingOut && (
          <motion.div
            key="celebration"
            className="fixed inset-0 z-[65] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="flex flex-col items-center text-center px-8 py-10 rounded-3xl max-w-md mx-4"
              style={{
                background: 'rgba(255,248,250,0.35)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,200,210,0.3)',
                boxShadow: '0 20px 80px rgba(255,183,197,0.25), 0 0 120px rgba(220,198,255,0.15), inset 0 1px 0 rgba(255,255,255,0.5)',
              }}
              initial={{ scale: 0.6, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 150, damping: 18, delay: 0.2 }}
            >
              <motion.div className="mb-4"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.4 }}
              >
                <RoseBouquet size={200} />
              </motion.div>

              <motion.h1
                className="font-script text-4xl md:text-5xl text-warmbrown"
                style={{ textShadow: '0 0 40px rgba(255,183,197,0.7), 0 0 80px rgba(255,183,197,0.3), 0 4px 12px rgba(92,64,51,0.15)' }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                🌹 Friendship Accepted! 🌹
              </motion.h1>

              <motion.p
                className="font-handwritten text-xl md:text-2xl text-warmbrown/75 mt-3"
                style={{ textShadow: '0 0 20px rgba(255,183,197,0.4)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                Rasna & Vinay • Best Friends Forever ❤️
              </motion.p>

              <motion.div className="flex gap-2 mt-4 text-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                {['🌸', '✨', '💖', '🦋', '✨', '🌸'].map((e, i) => (
                  <motion.span key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
                  >{e}</motion.span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
