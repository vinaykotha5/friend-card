import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'motion/react'

import photoArcade from '../assets/images/photo_arcade.jpeg'
import photoOuting from '../assets/images/photo_outing.jpeg'
import photoEvent from '../assets/images/photo_event.jpeg'
import photoTogether from '../assets/images/photo_together.jpeg'
import photoCandid from '../assets/images/photo_candid.jpeg'
import photoTraditional from '../assets/images/photo_traditional.jpeg'
import photoChatting from '../assets/images/photo_chatting.jpeg'
import photoElevator from '../assets/images/photo_elevator.jpeg'

const memories = [
  { img: photoArcade, caption: 'Arcade Adventures 🎮', rotation: -8, x: '5%', y: '10%' },
  { img: photoOuting, caption: 'First Trip Together 🦋', rotation: 5, x: '35%', y: '5%' },
  { img: photoEvent, caption: 'Night to Remember ✨', rotation: -3, x: '65%', y: '15%' },
  { img: photoTogether, caption: 'Just Us Two 💕', rotation: 7, x: '10%', y: '55%' },
  { img: photoCandid, caption: 'Candid Moments 😄', rotation: -5, x: '40%', y: '50%' },
  { img: photoTraditional, caption: 'Traditional Vibes 🌺', rotation: 3, x: '65%', y: '55%' },
  { img: photoChatting, caption: 'Lost in Conversation 💬', rotation: -4, x: '15%', y: '78%' },
  { img: photoElevator, caption: 'Day Out Together 🪞', rotation: 6, x: '50%', y: '78%' },
]

const floatingFlowers = [
  { emoji: '🌸', x: '10%', y: '42%', delay: 0, size: 'text-2xl' },
  { emoji: '🌷', x: '55%', y: '35%', delay: 1.2, size: 'text-xl' },
  { emoji: '🌺', x: '82%', y: '45%', delay: 0.6, size: 'text-2xl' },
  { emoji: '🌸', x: '28%', y: '80%', delay: 1.8, size: 'text-lg' },
  { emoji: '🌷', x: '90%', y: '10%', delay: 0.4, size: 'text-xl' },
  { emoji: '🌺', x: '3%', y: '75%', delay: 1.0, size: 'text-lg' },
  { emoji: '🌸', x: '50%', y: '88%', delay: 2.0, size: 'text-xl' },
  { emoji: '🌷', x: '75%', y: '78%', delay: 1.5, size: 'text-lg' },
]

// Entrance directions for each polaroid — makes them fly in from different spots
const entranceOffsets = [
  { x: -120, y: -80 },
  { x: 40, y: -120 },
  { x: 130, y: -60 },
  { x: -100, y: 80 },
  { x: 30, y: 100 },
  { x: 140, y: 70 },
  { x: -80, y: 100 },
  { x: 100, y: 90 },
]

function PolaroidCard({ memory, index, isInView }) {
  const offset = entranceOffsets[index]

  return (
    <motion.div
      className="polaroid absolute w-[220px] cursor-pointer"
      style={{
        left: memory.x,
        top: memory.y,
        rotate: `${memory.rotation}deg`,
        zIndex: index + 1,
      }}
      initial={{
        opacity: 0,
        x: offset.x,
        y: offset.y,
        scale: 0.6,
        rotate: memory.rotation + (index % 2 === 0 ? -20 : 20),
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotate: memory.rotation,
            }
          : {
              opacity: 0,
              x: offset.x,
              y: offset.y,
              scale: 0.6,
              rotate: memory.rotation + (index % 2 === 0 ? -20 : 20),
            }
      }
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {/* Image area */}
      <div className="w-[196px] h-[196px] overflow-hidden bg-cream">
        <img
          src={memory.img}
          alt={memory.caption}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Caption */}
      <p className="font-handwritten text-lg text-warmbrown text-center mt-2 leading-tight">
        {memory.caption}
      </p>
    </motion.div>
  )
}

function FloatingFlower({ flower, isInView }) {
  return (
    <motion.span
      className={`absolute pointer-events-none select-none ${flower.size}`}
      style={{ left: flower.x, top: flower.y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={
        isInView
          ? { opacity: 0.7, scale: 1 }
          : { opacity: 0, scale: 0 }
      }
      transition={{
        duration: 0.6,
        delay: flower.delay + 0.8,
        ease: 'easeOut',
      }}
    >
      <motion.span
        className="inline-block"
        animate={{
          y: [0, -8, 0, 6, 0],
          rotate: [0, 5, -3, 4, 0],
        }}
        transition={{
          duration: 4 + flower.delay,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {flower.emoji}
      </motion.span>
    </motion.span>
  )
}

export default function PolaroidGallery() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })

  return (
    <section className="py-16 px-4">
      {/* Section Title */}
      <motion.h2
        className="font-script text-4xl md:text-5xl text-center text-warmbrown mb-12 text-shadow-glow"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        📸 Our Memories
      </motion.h2>

      {/* Gallery Container */}
      <div
        ref={containerRef}
        className="relative min-h-[900px] max-w-5xl mx-auto"
      >
        {/* Scattered Polaroids */}
        {memories.map((memory, index) => (
          <PolaroidCard
            key={index}
            memory={memory}
            index={index}
            isInView={isInView}
          />
        ))}

        {/* Floating Flower Emojis */}
        {floatingFlowers.map((flower, index) => (
          <FloatingFlower key={`flower-${index}`} flower={flower} isInView={isInView} />
        ))}
      </div>
    </section>
  )
}
