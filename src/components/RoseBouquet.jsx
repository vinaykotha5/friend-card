import { motion } from 'motion/react'

/* ═══════════════════════════════════════════
   RED ROSE BOUQUET SVG COMPONENT
   Styled after a luxury wrapped bouquet with
   red roses, cream wrapping paper, and ribbon
   ═══════════════════════════════════════════ */

// Single rose with layered petals (no motion on SVG elements)
const Rose = ({ cx, cy, size = 14 }) => {
  const layers = [
    { petals: 5, radius: size, color: '#c0392b', opacity: 0.95 },
    { petals: 5, radius: size * 0.72, color: '#e74c3c', opacity: 0.9 },
    { petals: 4, radius: size * 0.45, color: '#ff6b6b', opacity: 0.85 },
  ]

  return (
    <g>
      {layers.map((layer, li) =>
        Array.from({ length: layer.petals }).map((_, pi) => {
          const angle = (360 / layer.petals) * pi + li * 18
          const rad = (angle * Math.PI) / 180
          const px = cx + Math.cos(rad) * layer.radius * 0.35
          const py = cy + Math.sin(rad) * layer.radius * 0.35
          return (
            <ellipse
              key={`${li}-${pi}`}
              cx={px}
              cy={py}
              rx={layer.radius * 0.42}
              ry={layer.radius * 0.58}
              fill={layer.color}
              opacity={layer.opacity}
              transform={`rotate(${angle} ${px} ${py})`}
            />
          )
        })
      )}
      <circle cx={cx} cy={cy} r={size * 0.15} fill="#a93226" />
      <circle cx={cx - 1} cy={cy - 1} r={size * 0.08} fill="#922b21" />
    </g>
  )
}

const Rosebud = ({ cx, cy, size = 8 }) => (
  <g>
    <ellipse cx={cx - 2} cy={cy} rx={size * 0.3} ry={size * 0.5} fill="#c0392b" opacity={0.9}
      transform={`rotate(-15 ${cx - 2} ${cy})`} />
    <ellipse cx={cx + 2} cy={cy} rx={size * 0.3} ry={size * 0.5} fill="#e74c3c" opacity={0.85}
      transform={`rotate(15 ${cx + 2} ${cy})`} />
    <ellipse cx={cx} cy={cy + 2} rx={size * 0.2} ry={size * 0.35} fill="#a93226" opacity={0.7} />
    <path d={`M${cx - 3} ${cy + size * 0.4} Q${cx} ${cy + size * 0.2} ${cx + 3} ${cy + size * 0.4}`}
      fill="#2d6a2e" opacity={0.6} />
  </g>
)

const LeafShape = ({ cx, cy, angle = 0, size = 1 }) => (
  <g>
    <ellipse
      cx={cx} cy={cy}
      rx={8 * size} ry={14 * size}
      fill="url(#bouquetLeafGrad)"
      opacity={0.7}
      transform={`rotate(${angle} ${cx} ${cy})`}
    />
    <line
      x1={cx} y1={cy - 10 * size}
      x2={cx} y2={cy + 10 * size}
      stroke="rgba(255,255,255,0.2)"
      strokeWidth={0.8}
      transform={`rotate(${angle} ${cx} ${cy})`}
    />
  </g>
)

export default function RoseBouquet({ size = 320 }) {
  const w = size
  const h = size * 1.35
  const cx = w / 2

  const roses = [
    { cx: cx, cy: h * 0.18, size: 16 },
    { cx: cx - 30, cy: h * 0.15, size: 14 },
    { cx: cx + 30, cy: h * 0.15, size: 14 },
    { cx: cx - 50, cy: h * 0.22, size: 15 },
    { cx: cx + 50, cy: h * 0.22, size: 15 },
    { cx: cx - 15, cy: h * 0.25, size: 16 },
    { cx: cx + 15, cy: h * 0.25, size: 16 },
    { cx: cx - 60, cy: h * 0.30, size: 13 },
    { cx: cx + 60, cy: h * 0.30, size: 13 },
    { cx: cx - 30, cy: h * 0.32, size: 15 },
    { cx: cx + 30, cy: h * 0.32, size: 15 },
    { cx: cx, cy: h * 0.33, size: 14 },
    { cx: cx - 45, cy: h * 0.38, size: 12 },
    { cx: cx + 45, cy: h * 0.38, size: 12 },
    { cx: cx - 10, cy: h * 0.40, size: 14 },
    { cx: cx + 18, cy: h * 0.39, size: 13 },
    { cx: cx - 68, cy: h * 0.26, size: 10 },
    { cx: cx + 68, cy: h * 0.26, size: 10 },
  ]

  const buds = [
    { cx: cx - 42, cy: h * 0.17, size: 7 },
    { cx: cx + 42, cy: h * 0.18, size: 6 },
    { cx: cx - 70, cy: h * 0.34, size: 7 },
    { cx: cx + 70, cy: h * 0.34, size: 7 },
    { cx: cx, cy: h * 0.12, size: 8 },
    { cx: cx - 20, cy: h * 0.10, size: 6 },
    { cx: cx + 20, cy: h * 0.11, size: 6 },
  ]

  const leaves = [
    { cx: cx - 75, cy: h * 0.22, angle: -40, size: 0.9 },
    { cx: cx + 75, cy: h * 0.22, angle: 40, size: 0.9 },
    { cx: cx - 55, cy: h * 0.14, angle: -25, size: 0.7 },
    { cx: cx + 55, cy: h * 0.14, angle: 25, size: 0.7 },
    { cx: cx - 78, cy: h * 0.33, angle: -50, size: 1 },
    { cx: cx + 78, cy: h * 0.33, angle: 50, size: 1 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="wrapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f0eb" />
            <stop offset="30%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f0ebe5" />
            <stop offset="100%" stopColor="#e8e0d8" />
          </linearGradient>
          <linearGradient id="innerWrapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ede5dc" />
            <stop offset="50%" stopColor="#f5f0eb" />
            <stop offset="100%" stopColor="#e0d8cf" />
          </linearGradient>
          <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c0392b" />
            <stop offset="50%" stopColor="#e74c3c" />
            <stop offset="100%" stopColor="#c0392b" />
          </linearGradient>
          <linearGradient id="bouquetLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d8b3d" />
            <stop offset="100%" stopColor="#2d6a2e" />
          </linearGradient>
          <filter id="bouquetShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="3" dy="8" stdDeviation="12" floodColor="rgba(92,64,51,0.2)" />
          </filter>
        </defs>

        {/* Wrapping paper */}
        <g filter="url(#bouquetShadow)">
          <path
            d={`M${cx - 85} ${h * 0.42} Q${cx - 90} ${h * 0.38} ${cx - 75} ${h * 0.35} L${cx - 8} ${h * 0.88} Q${cx} ${h * 0.92} ${cx + 8} ${h * 0.88} L${cx + 75} ${h * 0.35} Q${cx + 90} ${h * 0.38} ${cx + 85} ${h * 0.42} L${cx + 12} ${h * 0.92} Q${cx} ${h * 0.96} ${cx - 12} ${h * 0.92} Z`}
            fill="url(#innerWrapGrad)" opacity={0.6}
          />
          <path
            d={`M${cx - 80} ${h * 0.40} Q${cx - 95} ${h * 0.35} ${cx - 80} ${h * 0.28} L${cx - 30} ${h * 0.10} Q${cx - 10} ${h * 0.06} ${cx} ${h * 0.42} L${cx - 5} ${h * 0.90} Q${cx - 3} ${h * 0.93} ${cx - 8} ${h * 0.90} Z`}
            fill="url(#wrapGrad)" opacity={0.92}
          />
          <path
            d={`M${cx + 80} ${h * 0.40} Q${cx + 95} ${h * 0.35} ${cx + 80} ${h * 0.28} L${cx + 30} ${h * 0.10} Q${cx + 10} ${h * 0.06} ${cx} ${h * 0.42} L${cx + 5} ${h * 0.90} Q${cx + 3} ${h * 0.93} ${cx + 8} ${h * 0.90} Z`}
            fill="url(#wrapGrad)" opacity={0.92}
          />
          <line x1={cx - 60} y1={h * 0.35} x2={cx - 6} y2={h * 0.88} stroke="rgba(92,64,51,0.06)" strokeWidth="1.5" />
          <line x1={cx + 60} y1={h * 0.35} x2={cx + 6} y2={h * 0.88} stroke="rgba(92,64,51,0.06)" strokeWidth="1.5" />
          <path d={`M${cx - 70} ${h * 0.36} L${cx - 4} ${h * 0.86}`} stroke="rgba(180,160,140,0.2)" strokeWidth="3" strokeDasharray="8 4" fill="none" />
          <path d={`M${cx + 70} ${h * 0.36} L${cx + 4} ${h * 0.86}`} stroke="rgba(180,160,140,0.2)" strokeWidth="3" strokeDasharray="8 4" fill="none" />
        </g>

        {/* Ribbon & Bow */}
        <rect x={cx - 22} y={h * 0.72} width={44} height={10} rx={3} fill="url(#ribbonGrad)" opacity={0.9} />
        <path d={`M${cx - 12} ${h * 0.82} Q${cx - 18} ${h * 0.88} ${cx - 22} ${h * 0.94} Q${cx - 20} ${h * 0.90} ${cx - 8} ${h * 0.82}`} fill="#c0392b" opacity={0.8} />
        <path d={`M${cx + 12} ${h * 0.82} Q${cx + 18} ${h * 0.88} ${cx + 22} ${h * 0.94} Q${cx + 20} ${h * 0.90} ${cx + 8} ${h * 0.82}`} fill="#e74c3c" opacity={0.8} />
        <ellipse cx={cx - 16} cy={h * 0.73} rx={14} ry={8} fill="#e74c3c" opacity={0.85} transform={`rotate(-25 ${cx - 16} ${h * 0.73})`} />
        <ellipse cx={cx + 16} cy={h * 0.73} rx={14} ry={8} fill="#c0392b" opacity={0.85} transform={`rotate(25 ${cx + 16} ${h * 0.73})`} />
        <circle cx={cx} cy={h * 0.74} r={5} fill="#a93226" />

        {/* Leaves */}
        {leaves.map((leaf, i) => <LeafShape key={`leaf-${i}`} {...leaf} />)}

        {/* Roses */}
        {roses.map((rose, i) => <Rose key={`rose-${i}`} {...rose} />)}

        {/* Rosebuds */}
        {buds.map((bud, i) => <Rosebud key={`bud-${i}`} {...bud} />)}

        {/* Dew sparkles */}
        {[
          { cx: cx - 20, cy: h * 0.20 },
          { cx: cx + 35, cy: h * 0.25 },
          { cx: cx - 40, cy: h * 0.30 },
          { cx: cx + 10, cy: h * 0.15 },
          { cx: cx + 55, cy: h * 0.32 },
        ].map((dew, i) => (
          <circle key={`dew-${i}`} cx={dew.cx} cy={dew.cy} r={2} fill="white" opacity={0.6} />
        ))}
      </svg>
    </motion.div>
  )
}
