'use client'

import { useTheme } from 'next-themes'
import { 
  Sun,
  MoonStar,
  CloudSnow,
  Flower2,
  CloudSun,
  CloudDrizzle
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './button'

const themes = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: MoonStar, label: 'Dark' },
  { id: 'winter', icon: CloudSnow, label: 'Winter' },
  { id: 'spring', icon: Flower2, label: 'Spring' },
  { id: 'summer', icon: CloudSun, label: 'Summer' },
  { id: 'autumn', icon: CloudDrizzle, label: 'Autumn' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.div 
      className="fixed top-4 right-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-sm z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {themes.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          variant="ghost"
          size="icon"
          className={`rounded-full ${
            theme === id ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white/80'
          }`}
          onClick={() => setTheme(id)}
          title={label}
        >
          <Icon className="h-5 w-5" />
        </Button>
      ))}
    </motion.div>
  )
} 