'use client'

import { useAuth } from '../context/AuthContext'
import { Button } from "../components/ui/button"
import MushroomIcon from './MushroomIcon'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Login() {
  const { loginAsTestUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    await loginAsTestUser()
    setIsLoading(false)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
      <div className="pointer-events-none absolute inset-0 bg-[url(/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="w-full max-w-md mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center space-y-4 mb-8"
          >
            <h1 className="text-5xl font-bold text-white tracking-tight">
              MoniChat
            </h1>
            <p className="text-xl text-white/80">
              Your AI-powered chat companion
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20"
          >
            <Button 
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full h-16 text-lg relative overflow-hidden group bg-white/20 hover:bg-white/30 transition-colors"
            >
              <div className={`absolute inset-0 w-full h-full transition-all duration-300 
                ${isLoading ? 'opacity-100' : 'opacity-0'}`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 animate-gradient" />
              </div>
              
              <div className={`relative flex items-center justify-center gap-3 transition-all duration-300
                ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              >
                <MushroomIcon />
                <span className="text-white font-medium">Login as Test User</span>
              </div>

              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </Button>

            <p className="text-sm text-center text-white/60">
              Experience the future of conversation
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

