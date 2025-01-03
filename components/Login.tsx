'use client'

import { useAuth } from '@/context/AuthContext'
import { Button } from "@/components/ui/button"
import MushroomIcon from './MushroomIcon'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!username || !password) {
      setError('请输入用户名和密码')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const success = await login(username, password)
      if (success) {
        router.push('/chat')
      } else {
        setError('用户名或密码错误')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('登录失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
          className="text-center space-y-6 mb-12 w-full"
        >
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -left-8 -top-8 w-16 h-16"
            >
              <div className="absolute inset-0 bg-[#9373FF] rounded-full blur-xl opacity-30 animate-pulse" />
              <div className="relative z-10">
                <MushroomIcon className="w-16 h-16 text-[#9373FF]" />
              </div>
            </motion.div>
            <motion.h1 
              className="text-5xl font-bold text-white tracking-tight sm:text-6xl md:text-7xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] via-[#9373FF] to-[#4F46E5] px-8"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.3,
                ease: [0, 0.71, 0.2, 1.01]
              }}
            >
              MoniChat
            </motion.h1>
          </div>
          <motion.p 
            className="text-xl text-[#7d8590] max-w-[42rem] mx-auto sm:text-2xl font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Your AI-powered chat companion. Experience the future of conversation.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-[#161b22]/50 backdrop-blur-xl rounded-xl shadow-2xl p-8 space-y-6 border border-[#30363d] w-full"
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder:text-[#7d8590] focus:outline-none focus:ring-2 focus:ring-[#9373FF]/50 focus:border-[#9373FF]"
            />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0d1117] border border-[#30363d] rounded-lg text-white placeholder:text-[#7d8590] focus:outline-none focus:ring-2 focus:ring-[#9373FF]/50 focus:border-[#9373FF]"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-14 text-base relative overflow-hidden group bg-[#9373FF] hover:bg-[#7C3AED] transition-colors text-white font-medium rounded-lg"
          >
            <div className={`absolute inset-0 w-full h-full transition-all duration-300 
              ${isLoading ? 'opacity-100' : 'opacity-0'}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#9373FF] to-[#7C3AED] animate-gradient" />
            </div>
            
            <div className={`relative flex items-center justify-center gap-4 transition-all duration-300
              ${isLoading ? 'opacity-0' : 'opacity-100'}`}
            >
              <MushroomIcon className="w-7 h-7 animate-bounce" />
              <span className="text-lg">登录</span>
            </div>

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </Button>

          <p className="text-sm text-center text-[#7d8590]">
            欢迎使用 MoniChat
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

