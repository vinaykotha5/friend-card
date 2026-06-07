import { useState } from "react";
import { motion } from "motion/react";

const memories = [
  {
    front: "📸 First Meeting",
    back: "The day we met and instantly knew this was going to be a beautiful friendship.",
    emoji: "🌟",
    color: "from-blush to-peach",
    bgBack: "bg-blush/30",
    tape: "washi-tape-pink",
    tapeRotate: "-rotate-12",
  },
  {
    front: "📸 Midnight Talks",
    back: "The night we talked until 4 AM and forgot the whole world existed.",
    emoji: "🌙",
    color: "from-lavender to-skyblue",
    bgBack: "bg-lavender/30",
    tape: "washi-tape-lavender",
    tapeRotate: "rotate-12",
  },
  {
    front: "📸 Ugly Selfies",
    back: "Our collection of the most gloriously unflattering selfies ever taken. 🤣",
    emoji: "🤳",
    color: "from-butter to-peach",
    bgBack: "bg-butter/30",
    tape: "washi-tape-peach",
    tapeRotate: "-rotate-6",
  },
  {
    front: "📸 Inside Jokes",
    back: "Things only we understand. If someone overheard us, they'd think we're absolutely insane.",
    emoji: "🤫",
    color: "from-peach to-rosegold",
    bgBack: "bg-peach/30",
    tape: "washi-tape-pink",
    tapeRotate: "rotate-6",
  },
];

function MemoryCard({ memory, index }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <div
        className={`flip-card h-64 ${flipped ? "flipped" : ""}`}
        onClick={() => setFlipped((prev) => !prev)}
      >
        <div className="flip-card-inner">
          {/* Front Side */}
          <div
            className={`flip-card-front bg-gradient-to-br ${memory.color} flex flex-col items-center justify-center shadow-lg`}
          >
            {/* Washi tape decoration */}
            <div
              className={`washi-tape ${memory.tape} ${memory.tapeRotate} -top-2 -left-4 z-10`}
            />

            {/* Decorative corner dots */}
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-white/40" />
            <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-white/40" />

            {/* Content */}
            <span className="text-6xl mb-4 drop-shadow-md">{memory.emoji}</span>
            <h3 className="font-handwritten text-2xl text-warmbrown/90 text-center px-4">
              {memory.front}
            </h3>

            {/* Subtle shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 rounded-2xl pointer-events-none" />
          </div>

          {/* Back Side */}
          <div
            className={`flip-card-back ${memory.bgBack} flex flex-col items-center justify-center p-6 shadow-lg border border-white/40`}
          >
            {/* Decorative sparkles */}
            <span className="absolute top-4 left-4 text-lg opacity-50">✨</span>
            <span className="absolute bottom-4 right-4 text-lg opacity-50">✨</span>
            <span className="absolute top-4 right-4 text-sm opacity-30">💫</span>

            {/* Memory text */}
            <p className="font-handwritten text-xl text-warmbrown text-center leading-relaxed">
              {memory.back}
            </p>

            {/* Decorative line */}
            <div className="mt-4 w-16 h-0.5 bg-warmbrown/20 rounded-full" />

            {/* Little heart */}
            <span className="mt-2 text-sm opacity-60">💕</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function MemoryCards() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="font-script text-4xl text-warmbrown mb-3">
            🌴 Memory Cards
          </h2>
          <p className="font-handwritten text-lg text-warmbrown/70">
            Hover to reveal our favorite moments
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {memories.map((memory, index) => (
            <MemoryCard key={index} memory={memory} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
