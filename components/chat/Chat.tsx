'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { Send } from 'lucide-react'
import { nanoid } from 'nanoid'
import type { ChatMessage, ChatState } from '@/types/chat'
import { cn } from '@/lib/utils'

interface ChatProps {
  onClear: () => void
  chatId?: string | null
  messages?: ChatMessage[]
  onMessagesChange?: (messages: ChatMessage[]) => void
}

export function Chat({ onClear, chatId, messages: initialMessages = [], onMessagesChange }: ChatProps) {
  const { user } = useAuth()
  const [input, setInput] = useState('')
  const [state, setState] = useState<ChatState>({
    messages: initialMessages,
    isLoading: false,
    error: null,
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // 监听外部消息变化
  useEffect(() => {
    // 只在初始化或切换对话时更新消息
    if (state.messages.length === 0 || initialMessages.length === 0) {
      setState(prev => ({
        ...prev,
        messages: initialMessages,
        isLoading: false,
        error: null,
      }))
      setInput('')
    }
  }, [initialMessages])

  // 自动滚动到底部
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [state.messages])

  // 组件卸载时中止所有请求
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!input.trim() || state.isLoading || !user) return

    // 中止之前的请求
    abortControllerRef.current?.abort()
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    const newMessages = [...state.messages, userMessage]
    
    // 创建助手消息占位符
    const assistantMessage: ChatMessage = {
      id: nanoid(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    const updatedMessages = [...newMessages, assistantMessage]
    
    // 一次性更新状态
    setState(prev => ({
      ...prev,
      messages: updatedMessages,
      isLoading: true,
      error: null,
    }))
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: chatId || user.username,
          stream: true,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) throw new Error('请求失败')
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('无法读取响应')

      let fullContent = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        fullContent += text
        
        // 更新消息时保留完整的消息历史
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: fullContent }
              : msg
          ),
        }))
      }

      // 完成后的最终更新
      setState(prev => {
        const finalMessages = prev.messages.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, content: fullContent }
            : msg
        )
        return {
          ...prev,
          messages: finalMessages,
          isLoading: false,
        }
      })

      // 通知父组件消息更新
      onMessagesChange?.(updatedMessages.map(msg =>
        msg.id === assistantMessage.id
          ? { ...msg, content: fullContent }
          : msg
      ))
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return
      }
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: '发送消息失败，请重试',
        messages: prev.messages.filter(msg => msg.id !== assistantMessage.id),
      }))
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="space-y-4 max-w-3xl mx-auto relative">
            {state.messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                开始新的对话...
              </div>
            ) : (
              state.messages.map((message) => (
                <Card
                  key={message.id}
                  className={cn(
                    "overflow-hidden relative",
                    message.role === 'user'
                      ? 'ml-12 bg-primary text-primary-foreground'
                      : 'mr-12 bg-muted'
                  )}
                  style={{ maxWidth: 'calc(100% - 3rem)', zIndex: 0 }}
                >
                  <CardHeader className="py-3 px-4">
                    <div className="font-medium text-sm">
                      {message.role === 'user' ? user.username : 'AI助手'}
                    </div>
                  </CardHeader>
                  <CardContent className="py-3 px-4 pt-0">
                    <div className="whitespace-pre-wrap">
                      {message.content || (message.role === 'assistant' && state.isLoading && '▋')}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {state.error && (
              <div className="text-destructive text-center">{state.error}</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-8 flex-shrink-0 relative">
        <form onSubmit={sendMessage} className="flex gap-3 max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(0,0,0,0.3)] p-3 relative">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="向 AI 助手提问..."
            disabled={state.isLoading}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base py-3 min-h-[24px] shadow-none"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
          <div className="flex items-center gap-2">
            <Button 
              type="submit" 
              disabled={state.isLoading} 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

