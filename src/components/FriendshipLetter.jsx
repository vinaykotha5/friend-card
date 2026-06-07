import { useRef } from "react";
import { motion, useInView } from "motion/react";

const letterLines = [
  { text: "To My Forever Best Friend Rasna 🌹", className: "text-2xl md:text-3xl mb-6 font-bold" },
  { text: "I still remember the very first time I saw you.", className: "text-lg md:text-xl mb-3" },
  { text: "Among all the people around, my eyes somehow found their way to you. I remember those curly hairs dancing with the wind and those sparkling eyes that carried a thousand untold stories. At that moment, you were just another person in the crowd, and I was just another stranger passing by.", className: "text-lg md:text-xl mb-4" },
  { text: "Little did I know that one day, you would become one of the most important people in my life.", className: "text-lg md:text-xl mb-4 italic" },
  { text: "I still remember our first conversation. It wasn't anything extraordinary. There were no dramatic movie moments, no fireworks in the sky, no signs telling me that this friendship would become so special. It was just a simple conversation between two people.", className: "text-lg md:text-xl mb-3" },
  { text: "But looking back now, that simple conversation became the beginning of countless memories.", className: "text-lg md:text-xl mb-4 italic" },
  { text: "Back then, if someone had told me that we would become such close friends, I probably wouldn't have believed them. Yet here we are.", className: "text-lg md:text-xl mb-4" },
  { text: "Through random chats that turned into long conversations.", className: "text-lg md:text-xl mb-1" },
  { text: "Through laughter that made our stomachs hurt.", className: "text-lg md:text-xl mb-1" },
  { text: "Through moments when words weren't even necessary because we understood each other without speaking.", className: "text-lg md:text-xl mb-1" },
  { text: "Through good days that felt brighter because you were there and difficult days that felt lighter because I didn't have to face them alone.", className: "text-lg md:text-xl mb-4" },
  { text: "You've become a part of my favorite memories.", className: "text-lg md:text-xl mb-1" },
  { text: "A part of my comfort.", className: "text-lg md:text-xl mb-1" },
  { text: "A part of my happiness.", className: "text-lg md:text-xl mb-1" },
  { text: "And honestly, one of the best things that ever happened to me.", className: "text-lg md:text-xl mb-4 italic" },
  { text: "Life changes, people come and go, and time keeps moving forward. But some connections leave a mark so beautiful that no amount of time can erase them.", className: "text-lg md:text-xl mb-4" },
  { text: "Thank you for every laugh, every silly conversation, every piece of advice, every memory, and every moment of support.", className: "text-lg md:text-xl mb-3" },
  { text: "Thank you for being the person who turned ordinary days into unforgettable ones.", className: "text-lg md:text-xl mb-4" },
  { text: "If I could go back to that very first moment when I saw you with those curly hairs and sparkling eyes, knowing everything I know now, I would smile and think:", className: "text-lg md:text-xl mb-2" },
  { text: "\"You have no idea yet, but you're about to meet someone who will become one of your favorite people in the world.\"", className: "text-lg md:text-xl mb-4 italic" },
  { text: "And if life gives me a choice, I hope we continue creating memories together for many more years.", className: "text-lg md:text-xl mb-4" },
  { text: "Because some friendships are temporary.", className: "text-lg md:text-xl mb-1" },
  { text: "Some are seasonal.", className: "text-lg md:text-xl mb-1" },
  { text: "But a few are meant to stay.", className: "text-lg md:text-xl mb-1" },
  { text: "And I hope ours is one of them.", className: "text-lg md:text-xl mb-6 italic" },
  { text: "❤️ Will you continue being my best friend forever? ❤️", className: "text-xl md:text-2xl mb-6 font-bold" },
  { text: "With all my love,", className: "text-xl md:text-2xl" },
  { text: "Vinay ❤️", className: "text-xl md:text-2xl" },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.4,
    },
  },
};

const lineVariants = {
  hidden: {
    opacity: 0,
    x: -30,
    y: 10,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/* ─── Tiny inline SVG sub-components ─── */

function PaperClip() {
  return (
    <div className="absolute -top-4 right-8 z-20 rotate-12">
      <svg
        width="32"
        height="64"
        viewBox="0 0 32 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 4 C8 4 4 10 4 18 L4 46 C4 54 8 60 16 60 C24 60 28 54 28 46 L28 18 C28 12 24 8 18 8 C12 8 10 12 10 16 L10 44"
          stroke="#9CA3AF"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function HeartDoodle({ className = "", size = 16 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 21 C12 21 3 14 3 8.5 C3 5.5 5.5 3 8.5 3 C10 3 11.5 3.8 12 5 C12.5 3.8 14 3 15.5 3 C18.5 3 21 5.5 21 8.5 C21 14 12 21 12 21Z"
        stroke="#FFB7C5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255,183,197,0.2)"
      />
    </svg>
  );
}

export default function FriendshipLetter() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.25 });

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center px-4 py-20 md:py-28"
    >
      {/* ──────── Section Title ──────── */}
      <motion.h2
        className="font-script text-3xl md:text-4xl text-warmbrown text-center mb-10 select-none"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        💌 A Letter For You
      </motion.h2>

      {/* ──────── Letter Card ──────── */}
      <motion.div
        className="relative w-full max-w-2xl"
        initial={{ opacity: 0, y: 40, rotateZ: -1 }}
        animate={isInView ? { opacity: 1, y: 0, rotateZ: 0 } : {}}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Paper Clip */}
        <PaperClip />

        {/* Washi Tape (top-left, slightly rotated) */}
        <div
          className="washi-tape washi-tape-pink absolute -top-3 left-10 z-10"
          style={{ transform: "rotate(-6deg)", width: "110px" }}
        />

        {/* Washi Tape (top-right, different color) */}
        <div
          className="washi-tape washi-tape-lavender absolute -top-2 right-16 z-10 hidden sm:block"
          style={{ transform: "rotate(4deg)", width: "90px" }}
        />

        {/* ── Aged Paper ── */}
        <div className="aged-paper rounded-xl p-8 md:p-12 shadow-xl overflow-hidden relative">
          {/* Coffee stain decoration */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: "20px",
              right: "24px",
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139,90,43,0.06) 0%, rgba(139,90,43,0.03) 40%, transparent 70%)",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              top: "30px",
              right: "40px",
              width: "60px",
              height: "55px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139,90,43,0.08) 0%, rgba(139,90,43,0.03) 50%, transparent 75%)",
            }}
          />

          {/* Fold mark — faint diagonal line */}
          <div
            className="absolute pointer-events-none"
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(135deg, transparent 48.5%, rgba(139,90,43,0.06) 49%, rgba(139,90,43,0.06) 49.5%, transparent 50%)",
            }}
          />

          {/* Heart doodles scattered */}
          <HeartDoodle
            className="absolute top-6 left-6 opacity-40 rotate-12"
            size={18}
          />
          <HeartDoodle
            className="absolute bottom-20 left-8 opacity-30 -rotate-12"
            size={14}
          />
          <HeartDoodle
            className="absolute top-1/3 right-6 opacity-25 rotate-6"
            size={12}
          />

          {/* Small flower doodle in bottom-left corner */}
          <div className="absolute bottom-5 left-6 text-lg opacity-40 select-none pointer-events-none">
            ✿
          </div>

          {/* ── Letter Lines (staggered animation) ── */}
          <motion.div
            className="relative z-10 font-handwritten text-warmbrown leading-relaxed"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {letterLines.map((line, i) => (
              <motion.p
                key={i}
                className={line.className}
                variants={lineVariants}
              >
                {line.text}
              </motion.p>
            ))}
          </motion.div>

          {/* Pressed flower emoji — bottom right */}
          <motion.div
            className="absolute bottom-4 right-6 text-2xl select-none pointer-events-none"
            initial={{ opacity: 0, scale: 0, rotate: -45 }}
            animate={
              isInView
                ? { opacity: 0.7, scale: 1, rotate: 0 }
                : {}
            }
            transition={{ delay: 3, duration: 0.8, ease: "easeOut" }}
          >
            🌸
          </motion.div>

          {/* Extra small decorative elements */}
          <motion.div
            className="absolute bottom-5 right-20 text-sm select-none pointer-events-none"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 0.4 } : {}}
            transition={{ delay: 3.3, duration: 0.6 }}
          >
            🍂
          </motion.div>
        </div>

        {/* Subtle drop-shadow glow underneath the letter */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(255,183,197,0.25) 0%, transparent 70%)",
          }}
        />
      </motion.div>
    </section>
  );
}
