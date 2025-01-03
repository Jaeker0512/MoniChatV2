'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface MushroomIconProps {
  className?: string
}

export default function MushroomIcon({ className }: MushroomIconProps) {
  const [isAwake, setIsAwake] = useState(false)

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      onMouseEnter={() => setIsAwake(true)}
      onMouseLeave={() => setIsAwake(false)}
    >
      {/* 蘑菇帽 */}
      <motion.path
        d="M4 12C4 7.6 7.6 4 12 4s8 3.6 8 8H4z"
        fill="currentColor"
        animate={{
          scale: isAwake ? 1.05 : 1,
          originX: "50%",
          originY: "100%"
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* 蘑菇斑点 */}
      <motion.circle cx="8" cy="8" r="1.2" fill="white" opacity="0.6" />
      <motion.circle cx="12" cy="7" r="1" fill="white" opacity="0.6" />
      <motion.circle cx="16" cy="8" r="1.2" fill="white" opacity="0.6" />
      
      {/* 眼睛 */}
      <motion.circle
        cx="9"
        cy="10"
        r="0.8"
        fill="white"
        animate={{
          scaleY: isAwake ? 1 : 0.2,
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.circle
        cx="15"
        cy="10"
        r="0.8"
        fill="white"
        animate={{
          scaleY: isAwake ? 1 : 0.2,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* 蘑菇茎 */}
      <motion.path
        d="M10 12h4v8h-4z"
        fill="currentColor"
        animate={{
          scale: isAwake ? 1.02 : 1,
          originX: "50%",
          originY: "0%"
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.svg>
  )
}

