'use client'

import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { Card } from '@/app/components/ui/card'
import { Send } from 'lucide-react'
import { nanoid } from 'nanoid'
import type { ChatMessage, ChatState } from '@/types/chat'

export function Chat() {
  const { user } = useAuth()
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  })
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  
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

  // 发送消息
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

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }))
    setInput('')

    // 创建助手消息占位符
    const assistantMessage: ChatMessage = {
      id: nanoid(),
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
    }

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
    }))

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          sessionId: user.username,
          stream: true,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) throw new Error('请求失败')
      
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('无法读取响应')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value)
        setState(prev => ({
          ...prev,
          messages: prev.messages.map(msg =>
            msg.id === assistantMessage.id
              ? { ...msg, content: msg.content + text }
              : msg
          ),
        }))
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
      }))
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto p-4">
      <ScrollArea ref={scrollRef} className="flex-1 pr-4">
        <div className="space-y-4 mb-4">
          {state.messages.map((message) => (
            <Card
              key={message.id}
              className={`p-4 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground ml-12'
                  : 'bg-muted mr-12'
              }`}
            >
              <div className="font-medium mb-1">
                {message.role === 'user' ? user.username : 'AI助手'}
              </div>
              <div className="whitespace-pre-wrap">
                {message.content || (message.role === 'assistant' && state.isLoading && '▋')}
              </div>
            </Card>
          ))}
          {state.error && (
            <div className="text-destructive text-center">{state.error}</div>
          )}
        </div>
      </ScrollArea>
      
      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          placeholder="输入消息..."
          disabled={state.isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={state.isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

