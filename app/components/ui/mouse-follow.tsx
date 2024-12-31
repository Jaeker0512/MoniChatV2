'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

export function MouseFollow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { theme } = useTheme()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const getGradientColor = () => {
    switch (theme) {
      case 'light':
        return 'rgba(59, 130, 246, 0.2)'
      case 'dark':
        return 'rgba(147, 51, 234, 0.2)'
      case 'winter':
        return 'rgba(59, 130, 246, 0.2)'
      case 'spring':
        return 'rgba(34, 197, 94, 0.2)'
      case 'summer':
        return 'rgba(234, 179, 8, 0.2)'
      case 'autumn':
        return 'rgba(249, 115, 22, 0.2)'
      default:
        return 'rgba(59, 130, 246, 0.2)'
    }
  }

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-10 transition-colors"
      animate={{
        background: `radial-gradient(800px at ${mousePosition.x}px ${mousePosition.y}px, ${getGradientColor()}, transparent 70%)`
      }}
    />
  )
} 