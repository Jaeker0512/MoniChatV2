'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/button'
import { MushroomIcon } from '../icons/mushroom'

export default function LoginCard() {
  const { loginAsTestUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  async function handleLogin() {
    try {
      setIsLoading(true)
      await loginAsTestUser()
    } catch (error) {
      console.error('Login failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="w-full"
    >
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col space-y-6">
          <Button
            onClick={handleLogin}
            disabled={isLoading}
            size="lg"
            className="h-16 w-full gap-2 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-lg font-medium text-white shadow-lg transition-all hover:shadow-xl hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  ease: "linear",
                  repeat: Infinity,
                }}
                className="h-5 w-5 rounded-full border-2 border-white border-t-transparent"
              />
            ) : (
              <>
                <MushroomIcon className="h-6 w-6" />
                <span>Login as Test User</span>
              </>
            )}
          </Button>
          <p className="text-center text-sm text-white/60">
            No account needed, just click and start chatting
          </p>
        </div>
      </div>
    </motion.div>
  )
} 