'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function MushroomIcon() {
  const [isAwake, setIsAwake] = useState(false)

  return (
    <motion.svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setIsAwake(true)}
      onMouseLeave={() => setIsAwake(false)}
    >
      {/* Mushroom cap */}
      <path d="M5 20C5 11.7157 11.7157 5 20 5C28.2843 5 35 11.7157 35 20H5Z" fill="#FF6B6B" />
      
      {/* Mushroom stem */}
      <rect x="15" y="20" width="10" height="15" fill="#FFF3E0" />
      
      {/* Left eye */}
      <motion.circle
        cx="15"
        cy="15"
        r="2"
        fill="#333"
        animate={{ scaleY: isAwake ? 1 : 0.1 }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Right eye */}
      <motion.circle
        cx="25"
        cy="15"
        r="2"
        fill="#333"
        animate={{ scaleY: isAwake ? 1 : 0.1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.svg>
  )
}

