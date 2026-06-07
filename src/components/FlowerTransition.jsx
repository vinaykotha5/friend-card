import { useRef, useMemo } from "react";
import { motion, useInView } from "motion/react";

/* ──────────────────────────────────────────
   Floating Petal – shared between variants
   ────────────────────────────────────────── */
const FloatingPetal = ({ delay, x, size = 8, color = "#FFB7C5" }) => (
  <motion.div
    className="absolute rounded-full opacity-0 pointer-events-none"
    style={{
      width: size,
      height: size * 1.3,
      background: color,
      left: `${x}%`,
      top: "50%",
      borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
    }}
    animate={{
      y: [0, -60, -120],
      x: [0, Math.random() > 0.5 ? 20 : -20, Math.random() > 0.5 ? 40 : -40],
      opacity: [0, 0.7, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 4 + Math.random() * 3,
      delay: delay + 1.5,
      repeat: Infinity,
      repeatDelay: 2 + Math.random() * 3,
      ease: "easeOut",
    }}
  />
);

/* ──────────────────────────────────────────
   Rose Petal Layer
   ────────────────────────────────────────── */
const RosePetal = ({ angle, delay, scale, color, radius = 10 }) => (
  <motion.div
    className="absolute"
    style={{
      width: radius * 2,
      height: radius * 2,
      borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
      background: color,
      top: "50%",
      left: "50%",
      transformOrigin: "center center",
    }}
    initial={{ scale: 0, x: "-50%", y: "-50%", rotate: angle, opacity: 0 }}
    animate={{
      scale: scale,
      x: `calc(-50% + ${Math.cos((angle * Math.PI) / 180) * 6}px)`,
      y: `calc(-50% + ${Math.sin((angle * Math.PI) / 180) * 6}px)`,
      rotate: angle,
      opacity: 1,
    }}
    transition={{
      duration: 0.8,
      delay,
      ease: [0.34, 1.56, 0.64, 1],
    }}
  />
);

/* ──────────────────────────────────────────
   Single Rose
   ────────────────────────────────────────── */
const Rose = ({ roseDelay, size = 40 }) => {
  const petalColors = ["#FFB7C5", "#ffc7d2", "#F7C7A3", "#FFD6BA", "#ffcedd"];
  const layers = [
    { count: 5, radius: size * 0.38, scale: 1, offset: 0 },
    { count: 4, radius: size * 0.28, scale: 0.85, offset: 0.15 },
    { count: 3, radius: size * 0.18, scale: 0.7, offset: 0.3 },
  ];

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {layers.map((layer, li) =>
        Array.from({ length: layer.count }).map((_, pi) => (
          <RosePetal
            key={`${li}-${pi}`}
            angle={(360 / layer.count) * pi + li * 20}
            delay={roseDelay + layer.offset + pi * 0.05}
            scale={layer.scale}
            color={petalColors[(li + pi) % petalColors.length]}
            radius={layer.radius}
          />
        ))
      )}
      {/* Center */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.22,
          height: size * 0.22,
          background: "radial-gradient(circle, #F7C7A3 30%, #FFB7C5 100%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: roseDelay + 0.6, duration: 0.4, ease: "easeOut" }}
      />
    </div>
  );
};

/* ──────────────────────────────────────────
   Leaf (for roses variant)
   ────────────────────────────────────────── */
const Leaf = ({ delay, flip }) => (
  <motion.div
    className="relative"
    style={{ width: 20, height: 30, alignSelf: "center" }}
    initial={{ scale: 0, rotate: flip ? -30 : 30 }}
    animate={{ scale: 1, rotate: flip ? -15 : 15 }}
    transition={{ delay, duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
  >
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #6db36d 0%, #4a9e4a 50%, #3d8b3d 100%)",
        borderRadius: "50% 0 50% 0",
        transform: flip ? "scaleX(-1)" : "none",
      }}
    />
    {/* Leaf vein */}
    <div
      style={{
        position: "absolute",
        top: "20%",
        left: "45%",
        width: 2,
        height: "60%",
        background: "rgba(255,255,255,0.3)",
        borderRadius: 1,
        transform: flip ? "scaleX(-1) rotate(5deg)" : "rotate(-5deg)",
      }}
    />
  </motion.div>
);

/* ──────────────────────────────────────────
   ROSES VARIANT
   ────────────────────────────────────────── */
const RosesVariant = ({ isInView }) => {
  const roseCount = 7;
  const petals = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        x: 8 + (i * 84) / 12,
        delay: Math.random() * 2,
        size: 5 + Math.random() * 5,
        color: ["#FFB7C5", "#FFD6BA", "#F7C7A3", "#ffc7d2"][i % 4],
      })),
    []
  );

  if (!isInView) return null;

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
      {Array.from({ length: roseCount }).map((_, i) => (
        <div key={i} className="flex items-center gap-1">
          {i > 0 && <Leaf delay={i * 0.2 + 0.1} flip={i % 2 === 0} />}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: i * 0.2,
              duration: 0.6,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            <Rose
              roseDelay={i * 0.2}
              size={i % 2 === 0 ? 44 : 36}
            />
          </motion.div>
        </div>
      ))}

      {/* Floating petals */}
      {petals.map((p, i) => (
        <FloatingPetal key={`petal-${i}`} {...p} />
      ))}
    </div>
  );
};

/* ──────────────────────────────────────────
   CHERRY VARIANT
   ────────────────────────────────────────── */
const CherryBlossom = ({ delay, x, y, size = 18 }) => {
  const petalCount = 5;
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, width: size, height: size }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    >
      {Array.from({ length: petalCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            width: size * 0.45,
            height: size * 0.65,
            background:
              i % 2 === 0
                ? "linear-gradient(135deg, #FFB7C5, #ffe0e8)"
                : "linear-gradient(135deg, #ffd4dd, #fff0f3)",
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            top: "50%",
            left: "50%",
            transformOrigin: "50% 100%",
          }}
          initial={{
            rotate: (360 / petalCount) * i,
            x: "-50%",
            y: "-100%",
            scale: 0,
          }}
          animate={{
            rotate: (360 / petalCount) * i,
            x: "-50%",
            y: "-100%",
            scale: 1,
          }}
          transition={{
            delay: delay + i * 0.08,
            duration: 0.4,
            ease: [0.34, 1.56, 0.64, 1],
          }}
        />
      ))}
      {/* Center stamen */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size * 0.25,
          height: size * 0.25,
          background: "radial-gradient(circle, #FFE89A 40%, #F7C7A3 100%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.5, duration: 0.3 }}
      />
    </motion.div>
  );
};

const CherryVariant = ({ isInView }) => {
  const blossoms = useMemo(
    () => [
      { x: "8%", y: "-14px", delay: 0.3, size: 20 },
      { x: "18%", y: "-8px", delay: 0.5, size: 16 },
      { x: "28%", y: "-16px", delay: 0.7, size: 22 },
      { x: "38%", y: "-6px", delay: 0.9, size: 14 },
      { x: "48%", y: "-18px", delay: 1.1, size: 24 },
      { x: "55%", y: "-10px", delay: 1.3, size: 18 },
      { x: "65%", y: "-14px", delay: 1.5, size: 20 },
      { x: "75%", y: "-8px", delay: 1.7, size: 16 },
      { x: "85%", y: "-16px", delay: 1.9, size: 22 },
      { x: "92%", y: "-6px", delay: 2.1, size: 15 },
    ],
    []
  );

  const petals = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        x: 5 + (i * 90) / 10,
        delay: 1 + Math.random() * 2,
        size: 4 + Math.random() * 4,
        color: ["#FFB7C5", "#ffd4dd", "#ffe0e8", "#fff0f3"][i % 4],
      })),
    []
  );

  if (!isInView) return null;

  return (
    <div className="relative w-full h-20 flex items-center justify-center">
      {/* Branch */}
      <motion.div
        className="absolute"
        style={{
          top: "50%",
          left: "5%",
          right: "5%",
          height: 4,
          background:
            "linear-gradient(90deg, transparent, #8B6914 5%, #6B4E12 50%, #8B6914 95%, transparent)",
          borderRadius: 2,
          transformOrigin: "left center",
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* Minor branches */}
      {[20, 40, 60, 80].map((pos, i) => (
        <motion.div
          key={`branch-${i}`}
          className="absolute"
          style={{
            left: `${pos}%`,
            top: "50%",
            width: 3,
            height: 20,
            background: "#8B6914",
            borderRadius: 2,
            transformOrigin: "bottom center",
            transform: `rotate(${i % 2 === 0 ? -30 : 30}deg)`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: (pos / 100) * 1.5, duration: 0.4 }}
        />
      ))}

      {/* Blossoms */}
      {blossoms.map((b, i) => (
        <CherryBlossom key={`blossom-${i}`} {...b} />
      ))}

      {/* Floating petals */}
      {petals.map((p, i) => (
        <FloatingPetal key={`petal-${i}`} {...p} />
      ))}
    </div>
  );
};

/* ──────────────────────────────────────────
   VINES VARIANT
   ────────────────────────────────────────── */
const VineLeaf = ({ cx, cy, delay, flip }) => (
  <motion.g
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    style={{ transformOrigin: `${cx}px ${cy}px` }}
  >
    <ellipse
      cx={cx}
      cy={cy - (flip ? -8 : 8)}
      rx="7"
      ry="11"
      fill="url(#leafGrad)"
      transform={`rotate(${flip ? 35 : -35} ${cx} ${cy - (flip ? -8 : 8)})`}
    />
    <line
      x1={cx}
      y1={cy}
      x2={cx}
      y2={cy - (flip ? -14 : 14)}
      stroke="#4a9e4a"
      strokeWidth="1"
      opacity="0.5"
    />
  </motion.g>
);

const VineFlower = ({ cx, cy, delay }) => (
  <motion.g
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
    style={{ transformOrigin: `${cx}px ${cy}px` }}
  >
    {Array.from({ length: 5 }).map((_, i) => {
      const angle = (360 / 5) * i - 90;
      const rad = (angle * Math.PI) / 180;
      return (
        <ellipse
          key={i}
          cx={cx + Math.cos(rad) * 5}
          cy={cy + Math.sin(rad) * 5}
          rx="3.5"
          ry="5"
          fill={i % 2 === 0 ? "#FFB7C5" : "#ffd4dd"}
          transform={`rotate(${angle} ${cx + Math.cos(rad) * 5} ${cy + Math.sin(rad) * 5})`}
        />
      );
    })}
    <circle cx={cx} cy={cy} r="2.5" fill="#FFE89A" />
  </motion.g>
);

const VinesVariant = ({ isInView }) => {
  const vinePath =
    "M 0,50 C 40,20 60,80 100,50 C 140,20 160,80 200,50 C 240,20 260,80 300,50 C 340,20 360,80 400,50 C 440,20 460,80 500,50 C 540,20 560,80 600,50";

  const leaves = useMemo(
    () => [
      { cx: 50, cy: 35, delay: 0.8, flip: false },
      { cx: 100, cy: 50, delay: 1.0, flip: true },
      { cx: 150, cy: 35, delay: 1.2, flip: false },
      { cx: 200, cy: 50, delay: 1.4, flip: true },
      { cx: 250, cy: 35, delay: 1.6, flip: false },
      { cx: 300, cy: 50, delay: 1.8, flip: true },
      { cx: 350, cy: 35, delay: 2.0, flip: false },
      { cx: 400, cy: 50, delay: 2.2, flip: true },
      { cx: 450, cy: 35, delay: 2.4, flip: false },
      { cx: 500, cy: 50, delay: 2.6, flip: true },
      { cx: 550, cy: 35, delay: 2.8, flip: false },
    ],
    []
  );

  const flowers = useMemo(
    () => [
      { cx: 130, cy: 40, delay: 1.5 },
      { cx: 300, cy: 50, delay: 2.2 },
      { cx: 470, cy: 38, delay: 2.8 },
    ],
    []
  );

  const petals = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        x: 10 + (i * 80) / 8,
        delay: 2 + Math.random() * 2,
        size: 4 + Math.random() * 4,
        color: ["#6db36d", "#FFB7C5", "#4a9e4a", "#ffd4dd"][i % 4],
      })),
    []
  );

  if (!isInView) return null;

  return (
    <div className="relative w-full flex items-center justify-center">
      <svg
        viewBox="0 0 600 100"
        className="w-full max-w-4xl"
        style={{ height: 100, overflow: "visible" }}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="vineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3d8b3d" />
            <stop offset="50%" stopColor="#4a9e4a" />
            <stop offset="100%" stopColor="#3d8b3d" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6db36d" />
            <stop offset="100%" stopColor="#3d8b3d" />
          </linearGradient>
        </defs>

        {/* Vine path with growing animation */}
        <motion.path
          d={vinePath}
          fill="none"
          stroke="url(#vineGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />

        {/* Leaves */}
        {leaves.map((leaf, i) => (
          <VineLeaf key={`leaf-${i}`} {...leaf} />
        ))}

        {/* Flowers on vine */}
        {flowers.map((flower, i) => (
          <VineFlower key={`flower-${i}`} {...flower} />
        ))}
      </svg>

      {/* Floating petals */}
      {petals.map((p, i) => (
        <FloatingPetal key={`petal-${i}`} {...p} />
      ))}
    </div>
  );
};

/* ──────────────────────────────────────────
   MAIN COMPONENT
   ────────────────────────────────────────── */
const FlowerTransition = ({ variant = "roses" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className="relative w-full py-16 overflow-hidden"
      style={{
        /* Gradient fade at edges */
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,183,197,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Render the selected variant */}
      <div className="relative z-10 px-4">
        {variant === "roses" && <RosesVariant isInView={isInView} />}
        {variant === "cherry" && <CherryVariant isInView={isInView} />}
        {variant === "vines" && <VinesVariant isInView={isInView} />}
      </div>
    </div>
  );
};

export default FlowerTransition;
