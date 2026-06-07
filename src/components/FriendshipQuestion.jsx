import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';

const NO_MESSAGES = [
  'Are you sure? 🥺',
  'Really sure? 😭',
  'Friendship Error Detected 🚨',
  'System requires friendship ❤️',
  'Nice try 😎',
  'The Yes button seems better ✨',
];

const DECORATIVE_FLOWERS = [
  { emoji: '🌸', top: '5%', left: '3%', size: 'text-3xl', delay: 0 },
  { emoji: '💐', top: '12%', right: '5%', size: 'text-4xl', delay: 0.3 },
  { emoji: '🌺', bottom: '8%', left: '6%', size: 'text-3xl', delay: 0.6 },
  { emoji: '💕', top: '20%', left: '8%', size: 'text-2xl', delay: 0.9 },
  { emoji: '🌷', bottom: '15%', right: '4%', size: 'text-3xl', delay: 1.2 },
  { emoji: '💖', top: '40%', right: '3%', size: 'text-2xl', delay: 0.4 },
  { emoji: '🌼', bottom: '25%', left: '2%', size: 'text-4xl', delay: 0.7 },
  { emoji: '💗', top: '60%', left: '4%', size: 'text-xl', delay: 1.0 },
  { emoji: '🌻', bottom: '5%', right: '8%', size: 'text-3xl', delay: 0.2 },
  { emoji: '💝', top: '75%', right: '6%', size: 'text-2xl', delay: 0.5 },
  { emoji: '🌹', top: '85%', left: '10%', size: 'text-2xl', delay: 0.8 },
  { emoji: '✨', top: '30%', left: '1%', size: 'text-xl', delay: 1.1 },
];

export default function FriendshipQuestion({ onYesClick }) {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.4 });

  const [noClickCount, setNoClickCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [noRotation, setNoRotation] = useState(0);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageKey, setMessageKey] = useState(0);
  const [yesScale, setYesScale] = useState(1);

  const handleNoClick = useCallback(() => {
    const newCount = noClickCount + 1;
    setNoClickCount(newCount);

    // Set the floating message
    const msgIndex = (newCount - 1) % NO_MESSAGES.length;
    setCurrentMessage(NO_MESSAGES[msgIndex]);
    setMessageKey((prev) => prev + 1);

    if (newCount >= 6) {
      // After 6 clicks, make No tiny and Yes huge
      setNoScale(0.1);
      setYesScale(3);
      setNoPosition({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 100,
      });
      return;
    }

    // Random position within bounds
    const xRange = 250;
    const yRange = 120;
    setNoPosition({
      x: (Math.random() - 0.5) * xRange * 2,
      y: (Math.random() - 0.5) * yRange * 2,
    });

    // Shrink
    setNoScale((prev) => prev * 0.85);

    // Random rotation
    setNoRotation(Math.random() * 60 - 30);

    // Grow Yes button progressively
    setYesScale((prev) => prev + 0.15);
  }, [noClickCount]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #FFF8EE 0%, #f3eaff 50%, #DCC6FF 100%)',
      }}
    >
      {/* Decorative flowers & hearts */}
      {DECORATIVE_FLOWERS.map((item, i) => (
        <motion.div
          key={i}
          className={`absolute ${item.size} pointer-events-none select-none`}
          style={{
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={
            isInView
              ? { opacity: 0.7, scale: 1 }
              : { opacity: 0, scale: 0 }
          }
          transition={{
            delay: item.delay + 1.5,
            duration: 0.8,
            type: 'spring',
            stiffness: 200,
          }}
        >
          <motion.span
            className="inline-block"
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {item.emoji}
          </motion.span>
        </motion.div>
      ))}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center px-4" ref={containerRef}>
        {/* Envelope */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div
            className="relative mx-auto"
            style={{
              width: '360px',
              maxWidth: '90vw',
              perspective: '800px',
            }}
          >
            {/* Envelope body */}
            <div
              className="relative rounded-lg overflow-visible"
              style={{
                width: '100%',
                height: '260px',
                background: 'linear-gradient(135deg, #FFF8EE, #FFD6BA)',
                boxShadow: '0 10px 40px rgba(92, 64, 51, 0.2)',
              }}
            >
              {/* Envelope inner V pattern */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, transparent 38%, rgba(92,64,51,0.05) 40%, transparent 42%)',
                }}
              />
              <div
                className="absolute bottom-0 left-0 w-full h-full opacity-20"
                style={{
                  clipPath: 'polygon(0 100%, 50% 40%, 100% 100%)',
                  background: 'linear-gradient(to top, rgba(92,64,51,0.1), transparent)',
                }}
              />

              {/* Letter sliding out */}
              <motion.div
                className="absolute left-1/2 w-[90%] rounded-md"
                style={{
                  x: '-50%',
                  background: 'linear-gradient(135deg, #fff, #fefaf5)',
                  boxShadow: '0 2px 15px rgba(92,64,51,0.1)',
                }}
                initial={{ y: 20, height: '85%', top: '10%' }}
                animate={
                  isInView
                    ? { y: -180, height: '320px', top: '0%' }
                    : { y: 20, height: '85%', top: '10%' }
                }
                transition={{ delay: 1.2, duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                {/* Letter content */}
                <motion.div
                  className="p-6 pt-8 flex flex-col items-center justify-center h-full"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 2, duration: 0.8 }}
                >
                  {/* Decorative line */}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blush to-transparent mb-4" />

                  <p className="font-handwritten text-2xl text-center text-warmbrown leading-relaxed">
                    Thank you for being my best friend, Rasna.
                  </p>
                  <p className="font-handwritten text-2xl text-center text-warmbrown leading-relaxed mt-4">
                    Would you like to continue this friendship forever?
                  </p>

                  {/* Decorative line */}
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-lavender to-transparent mt-4" />
                </motion.div>
              </motion.div>

              {/* Envelope flap */}
              <motion.div
                className="absolute top-0 left-0 w-full z-20"
                style={{
                  height: '55%',
                  background: 'linear-gradient(180deg, #FFD6BA, #FFF8EE)',
                  clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
                initial={{ rotateX: 0 }}
                animate={isInView ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ delay: 0.6, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              />

              {/* Envelope flap backside */}
              <motion.div
                className="absolute top-0 left-0 w-full z-10"
                style={{
                  height: '55%',
                  background: 'linear-gradient(180deg, #f5e1cc, #edd5bf)',
                  clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                  transformOrigin: 'top center',
                  transformStyle: 'preserve-3d',
                  rotateX: 180,
                }}
                initial={{ rotateX: -180 }}
                animate={isInView ? { rotateX: 0 } : { rotateX: -180 }}
                transition={{ delay: 0.6, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>
          </div>
        </motion.div>

        {/* Floating message from No clicks */}
        <div className="h-16 flex items-center justify-center mb-4 relative w-full">
          <AnimatePresence mode="wait">
            {currentMessage && (
              <motion.div
                key={messageKey}
                className="absolute px-6 py-3 rounded-full font-handwritten text-xl text-warmbrown"
                style={{
                  background: 'rgba(255, 248, 238, 0.95)',
                  boxShadow: '0 4px 20px rgba(255, 183, 197, 0.3), 0 0 40px rgba(220, 198, 255, 0.2)',
                  border: '2px solid rgba(255, 183, 197, 0.4)',
                }}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.6 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {currentMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Buttons area */}
        <motion.div
          className="relative flex flex-col items-center gap-6 w-full"
          style={{ minHeight: '160px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ delay: 2.5, duration: 0.8 }}
        >
          {/* YES Button */}
          <motion.button
            type="button"
            className="glow-button font-handwritten text-2xl relative z-10"
            onClick={onYesClick}
            animate={{
              scale: yesScale,
            }}
            whileHover={{ scale: yesScale * 1.08 }}
            whileTap={{ scale: yesScale * 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            style={{
              minWidth: noClickCount >= 6 ? '80vw' : undefined,
              maxWidth: '90vw',
            }}
          >
            <span className="relative z-10">❤️ Yes, Forever!</span>
            {noClickCount >= 6 && (
              <motion.span
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(255,183,197,0.5)',
                    '0 0 60px rgba(255,183,197,0.8), 0 0 100px rgba(220,198,255,0.4)',
                    '0 0 20px rgba(255,183,197,0.5)',
                  ],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            )}
          </motion.button>

          {/* NO Button */}
          <motion.button
            type="button"
            className="relative z-10 px-6 py-2 rounded-full font-handwritten text-lg bg-gray-200 text-gray-500 hover:bg-gray-300 transition-colors"
            style={{ cursor: noClickCount >= 6 ? 'not-allowed' : 'pointer' }}
            onClick={handleNoClick}
            disabled={noClickCount >= 6}
            animate={{
              x: noPosition.x,
              y: noPosition.y,
              scale: noScale,
              rotate: noRotation,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 15,
              mass: 0.8,
            }}
            whileHover={
              noClickCount < 6
                ? {
                    x: noPosition.x + (Math.random() - 0.5) * 100,
                    y: noPosition.y + (Math.random() - 0.5) * 60,
                  }
                : {}
            }
          >
            🙈 No
          </motion.button>
        </motion.div>

        {/* Sparkle burst after 6 clicks */}
        <AnimatePresence>
          {noClickCount >= 6 && (
            <>
              {[...Array(12)].map((_, i) => (
                <motion.span
                  key={`sparkle-${i}`}
                  className="absolute text-2xl pointer-events-none"
                  initial={{ opacity: 1, scale: 0 }}
                  animate={{
                    opacity: [1, 1, 0],
                    scale: [0, 1.5, 0],
                    x: Math.cos((i * Math.PI * 2) / 12) * 120,
                    y: Math.sin((i * Math.PI * 2) / 12) * 120,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: i * 0.05,
                    ease: 'easeOut',
                  }}
                  style={{
                    top: '60%',
                    left: '50%',
                  }}
                >
                  {['✨', '💖', '🌸', '💕', '⭐', '🦋'][i % 6]}
                </motion.span>
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Subtle footer text */}
        <motion.p
          className="mt-12 font-handwritten text-warmbrown/40 text-sm text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 3.2, duration: 1 }}
        >
          {noClickCount >= 6
            ? '( The universe has spoken — friendship is forever! 🌟 )'
            : '( Choose wisely… or not 😉 )'}
        </motion.p>
      </div>
    </section>
  );
}
