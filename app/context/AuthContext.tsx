'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface User {
  username: string;
  isTestAccount: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => void;
  logout: () => void;
  loginAsTestUser: () => void;
  clearChatHistory: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (username: string, password: string) => {
    const user = { username, isTestAccount: false }
    setUser(user)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const loginAsTestUser = () => {
    const testUser = { username: 'TestUser', isTestAccount: true }
    setUser(testUser)
    localStorage.setItem('user', JSON.stringify(testUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const clearChatHistory = () => {
    if (user) {
      localStorage.removeItem(`chatHistory_${user.username}`)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loginAsTestUser, clearChatHistory }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

