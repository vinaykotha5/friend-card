import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "motion/react";

const stats = [
  { label: "Laughs Shared", value: 99999, suffix: "+", emoji: "😂", color: "bg-blush" },
  { label: "Memes Exchanged", value: null, displayValue: "∞", emoji: "📱", color: "bg-lavender" },
  { label: "Adventures Completed", value: 127, suffix: "", emoji: "🏔️", color: "bg-skyblue" },
  { label: "Friendship Level", value: null, displayValue: "MAX ❤️", emoji: "⭐", color: "bg-butter" },
];

function AnimatedCounter({ value, suffix, displayValue, inView }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const animate = useCallback(() => {
    if (!startTimeRef.current) startTimeRef.current = performance.now();
    const elapsed = performance.now() - startTimeRef.current;
    const duration = 2000;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    setCount(Math.floor(eased * value));

    if (progress < 1) {
      rafRef.current = requestAnimationFrame(animate);
    } else {
      setCount(value);
      setDone(true);
    }
  }, [value]);

  useEffect(() => {
    if (!inView) return;
    if (value === null) {
      setDone(true);
      return;
    }
    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, value, animate]);

  // Special display value (∞, MAX ❤️)
  if (value === null) {
    return (
      <motion.span
        className="font-handwritten text-4xl font-bold text-warmbrown"
        initial={{ scale: 0, opacity: 0 }}
        animate={inView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.4 }}
      >
        {displayValue}
      </motion.span>
    );
  }

  return (
    <span className="font-handwritten text-4xl font-bold text-warmbrown">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

function StatCard({ stat, index }) {
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={cardRef}
      className={`relative rounded-2xl p-6 shadow-lg glass-morphism flex flex-col items-center justify-center gap-2 cursor-default`}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -6,
        scale: 1.04,
        transition: { duration: 0.25 },
      }}
    >
      {/* Subtle colored accent bar */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-b-full ${stat.color} opacity-70`}
      />

      {/* Emoji */}
      <motion.span
        className="text-5xl select-none"
        initial={{ scale: 0, rotate: -20 }}
        animate={inView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -20 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 15,
          delay: index * 0.15 + 0.2,
        }}
      >
        {stat.emoji}
      </motion.span>

      {/* Counter */}
      <div className="min-h-[2.8rem] flex items-center justify-center">
        <AnimatedCounter
          value={stat.value}
          suffix={stat.suffix}
          displayValue={stat.displayValue}
          inView={inView}
        />
      </div>

      {/* Label */}
      <motion.span
        className="font-handwritten text-lg text-warmbrown/80 text-center leading-tight"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, delay: index * 0.15 + 0.5 }}
      >
        {stat.label}
      </motion.span>
    </motion.div>
  );
}

export default function FriendshipStats() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      {/* Title */}
      <motion.div
        className="text-center mb-10 relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        {/* Decorative sparkles */}
        <motion.span
          className="absolute -top-2 left-1/2 -translate-x-[7rem] text-2xl select-none"
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          ✨
        </motion.span>
        <motion.span
          className="absolute top-4 left-1/2 translate-x-[5.5rem] text-xl select-none"
          animate={{ rotate: [0, -20, 20, 0], scale: [1, 1.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          💫
        </motion.span>
        <motion.span
          className="absolute -bottom-1 left-1/2 -translate-x-[5rem] text-lg select-none"
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          ⭐
        </motion.span>

        <h2 className="font-script text-4xl text-warmbrown text-shadow-glow">
          🌟 Our Friendship Stats
        </h2>
        <motion.div
          className="mx-auto mt-3 h-0.5 bg-gradient-to-r from-transparent via-rosegold to-transparent"
          initial={{ width: 0 }}
          whileInView={{ width: "60%" }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </div>
    </section>
  );
}
