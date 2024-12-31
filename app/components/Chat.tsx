'use client'

import React from 'react'
import { useState, useRef, useEffect } from 'react'
import { useChat } from 'ai/react'
import { useAuth } from '../context/AuthContext'
import { Send, Image as ImageIcon, Paperclip } from 'lucide-react'
import type { FormEvent, ChangeEvent } from 'react'

export default function Chat() {
  const { user } = useAuth()
  const { messages, input, handleInputChange, handleSubmit: aiHandleSubmit } = useChat()
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleFileSend = () => {
    if (file) {
      console.log('Uploading file:', file.name)
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    await aiHandleSubmit(e)

    const chatHistory = JSON.parse(localStorage.getItem(`chatHistory_${user.username}`) || '[]')
    chatHistory.push({ role: 'user', content: input })
    chatHistory.push({ role: 'assistant', content: messages[messages.length - 1]?.content || '' })
    localStorage.setItem(`chatHistory_${user.username}`, JSON.stringify(chatHistory))
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={chatContainerRef} className="flex-1 p-4 overflow-auto">
        {messages.map(m => (
          <div key={m.id} className={`mb-4 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <p><strong>{m.role === 'user' ? user.username : 'AI'}:</strong> {m.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message here..."
            className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx"
            aria-label="Upload file"
          />
          <button 
            type="button" 
            className="p-2 rounded-lg border hover:bg-gray-100" 
            onClick={() => fileInputRef.current?.click()}
            aria-label="Upload file"
          >
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          {file && (
            <button 
              type="button" 
              className="p-2 rounded-lg border hover:bg-gray-100" 
              onClick={handleFileSend}
              aria-label="Send file"
            >
              <Paperclip className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <button 
            type="submit" 
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>
        {file && <p className="mt-2 text-sm text-gray-500">Selected file: {file.name}</p>}
      </div>
    </div>
  )
}

