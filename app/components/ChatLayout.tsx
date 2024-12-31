'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Chat } from './Chat'
import { Button } from './ui/button'
import { ScrollArea } from './ui/scroll-area'
import { LogOut, MessageCircle, MessageSquare, Settings, Moon, Sun, Menu, Plus, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { motion } from 'framer-motion'
import type { ChatMessage } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ChatHistory {
  id: string
  title: string
  messages: ChatMessage[]
}

interface Message {
  content: string
}

export function ChatLayout() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // 加载聊天历史
  useEffect(() => {
    if (user) {
      const storedHistory = localStorage.getItem(`chatHistory_${user.username}`)
      if (storedHistory) {
        try {
          const history = JSON.parse(storedHistory)
          setChatHistory(history)
        } catch (error) {
          console.error('Error loading chat history:', error)
        }
      }
    }
  }, [user])

  // 更新聊天历史
  const updateChatHistory = (chatId: string, messages: ChatMessage[]) => {
    if (!messages.length) return

    setChatHistory(prev => {
      const updatedHistory = prev.map(chat => {
        if (chat.id === chatId) {
          // 只在第一条消息时设置标题
          const title = chat.title === '新对话' && messages.length > 0
            ? messages[0].content.substring(0, 20) + (messages[0].content.length > 20 ? '...' : '')
            : chat.title

          // 只有当消息内容真正发生变化时才更新
          if (JSON.stringify(messages) !== JSON.stringify(chat.messages)) {
            return {
              ...chat,
              title,
              messages
            }
          }
        }
        return chat
      })

      return JSON.stringify(updatedHistory) !== JSON.stringify(prev) ? updatedHistory : prev
    })
  }

  // 删除聊天
  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId))
    if (selectedChat === chatId) {
      setSelectedChat(null)
    }
  }

  // 创建新聊天
  const handleNewChat = () => {
    const newChatId = `chat_${Date.now()}`
    const newChat: ChatHistory = {
      id: newChatId,
      title: '新对话',
      messages: []
    }
    setChatHistory(prev => [newChat, ...prev])
    setSelectedChat(newChatId)
  }

  // 切换聊天
  const handleChatSelect = (chatId: string) => {
    if (selectedChat === chatId) return
    setSelectedChat(chatId)
  }

  // 保存聊天历史到 localStorage
  useEffect(() => {
    if (user && chatHistory.length > 0) {
      localStorage.setItem(`chatHistory_${user.username}`, JSON.stringify(chatHistory))
    }
  }, [chatHistory, user])

  if (!user) {
    return null
  }

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <motion.div 
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className={`${isSidebarCollapsed ? 'w-16' : 'w-64'} bg-gray-100 dark:bg-gray-900 flex flex-col transition-all duration-300 relative z-50 border-r shadow-lg`}
      >
        {/* 顶部按钮区域 */}
        <div className="flex items-center p-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* New Chat 按钮 */}
        <div className="px-2 pb-4">
          <Button 
            variant="secondary" 
            className="w-full justify-start gap-2 bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 shadow-sm text-gray-800 dark:text-gray-200" 
            onClick={handleNewChat}
          >
            <Plus className="h-4 w-4" />
            {!isSidebarCollapsed && "New chat"}
          </Button>
        </div>
        
        {/* 历史记录列表 */}
        {!isSidebarCollapsed && (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="px-4 py-2">
              <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Recent</div>
            </div>
            <div className="flex-1 overflow-y-auto px-2">
              <div className="space-y-1">
                {chatHistory.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "flex items-center w-full rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 group relative",
                      selectedChat === chat.id ? 'bg-gray-200 dark:bg-gray-800' : ''
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center flex-1 px-4 py-3 text-gray-800 dark:text-gray-200 cursor-pointer"
                      )}
                      onClick={() => handleChatSelect(chat.id)}
                    >
                      <MessageCircle className="mr-2 h-4 w-4 flex-shrink-0" />
                      <div className="flex-1 text-left">
                        <div className="font-medium truncate">{chat.title}</div>
                      </div>
                    </div>
                    <div className="absolute right-2 flex items-center">
                      <button
                        type="button"
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/20"
                        title="删除对话"
                        aria-label="删除对话"
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 设置按钮 */}
        <div className="p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100"
            onClick={() => setShowSettings(prev => !prev)}
          >
            <Settings className="mr-2 h-4 w-4" />
            {!isSidebarCollapsed && "Settings"}
          </Button>
          {showSettings && !isSidebarCollapsed && (
            <div className="mt-2 p-2 rounded-lg bg-white/50 dark:bg-gray-800/50">
              <Button
                variant="ghost"
                className="w-full justify-between text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-gray-100"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <span className="text-sm">Dark mode</span>
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col bg-amber-50/30 dark:bg-gray-950 overflow-hidden relative z-0">
        {/* 顶部栏 */}
        <div className="h-14 flex items-center justify-between px-4 flex-shrink-0 border-b">
          <div className="font-medium text-gray-900 dark:text-gray-100">MoniChat</div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 p-0">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="text-red-600 dark:text-red-400 cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* 聊天区域 */}
        <div className="flex-1 overflow-hidden">
          <Chat 
            key={selectedChat || 'new'} 
            onClear={handleNewChat}
            chatId={selectedChat}
            messages={chatHistory.find(chat => chat.id === selectedChat)?.messages || []}
            onMessagesChange={(messages) => {
              if (selectedChat) {
                updateChatHistory(selectedChat, messages)
              }
            }}
          />
        </div>
      </div>
    </div>
  )
} 