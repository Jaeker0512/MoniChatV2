'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from "../components/ui/button"
import { ScrollArea } from "../components/ui/scroll-area"
import { MessageCircle, LogOut } from 'lucide-react'
import Login from './Login'

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
}

interface Message {
  content: string;
}

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])

  useEffect(() => {
    if (user) {
      const storedHistory = JSON.parse(localStorage.getItem(`chatHistory_${user.username}`) || '[]')
      const formattedHistory = storedHistory.reduce((acc: ChatHistory[], message: Message, index: number) => {
        if (index % 2 === 0) {
          acc.push({
            id: `chat_${index / 2}`,
            title: `Chat ${index / 2 + 1}`,
            lastMessage: message.content.substring(0, 30) + '...'
          })
        }
        return acc
      }, [])
      setChatHistory(formattedHistory)
    }
  }, [user])

  if (!user) {
    return <Login />
  }

  return (
    <div className="w-64 bg-white border-r flex flex-col h-screen">
      <div className="p-4 flex-shrink-0">
        <h2 className="text-xl font-bold mb-4">Welcome, {user.username}</h2>
        <Button onClick={logout} variant="outline" className="w-full mb-4">
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" /> Logout
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <h3 className="font-semibold mb-2">Chat History</h3>
          <div className="space-y-2">
            {chatHistory.map((chat) => (
              <Button key={chat.id} variant="ghost" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                <div className="text-left">
                  <div className="font-medium">{chat.title}</div>
                  <div className="text-sm text-gray-500 truncate">{chat.lastMessage}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

