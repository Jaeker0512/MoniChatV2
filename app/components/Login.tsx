'use client'

import { useAuth } from '../context/AuthContext'
import { Button } from "../components/ui/button"
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
          <div className="space-y-4">
            <input
              type="text"
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
          </div>

          {error && (
            <p className="text-red-300 text-sm text-center">{error}</p>
          )}

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
              <span className="text-white font-medium">登录</span>
            </div>

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </Button>

          <p className="text-sm text-center text-white/60">
            欢迎使用 MoniChat
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}

