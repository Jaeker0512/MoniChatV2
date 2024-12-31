import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { setGlobalDispatcher, ProxyAgent } from 'undici'

// 在非生产环境下设置全局代理
if (process.env.NODE_ENV === 'development' && process.env.USE_PROXY === 'true') {
  if (!process.env.PROXY_URL) {
    console.warn('Warning: USE_PROXY is true but PROXY_URL is not set')
  } else {
    const dispatcher = new ProxyAgent({ uri: new URL(process.env.PROXY_URL).toString() })
    setGlobalDispatcher(dispatcher)
  }
}

if (!process.env.GOOGLE_API_KEY) {
  throw new Error('Missing GOOGLE_API_KEY environment variable')
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)

export class GeminiService {
  private model: GenerativeModel
  private chats: Map<string, any>

  constructor() {
    this.model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    })

    this.chats = new Map()
  }

  async chat(message: string, sessionId: string) {
    try {
      // 获取或创建新的聊天会话
      let chat = this.chats.get(sessionId)
      if (!chat) {
        chat = this.model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: "你好，请用中文回答我的问题" }],
            },
            {
              role: "model",
              parts: [{ text: "你好！我很乐意用中文回答你的问题。请问有什么我可以帮你的吗？" }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          }
        })
        this.chats.set(sessionId, chat)
      }

      // 发送消息并获取回复
      const result = await chat.sendMessage([{ text: message }])
      const response = await result.response
      const text = response.text()

      return {
        reply: text,
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw error
    }
  }

  async chatStream(message: string, sessionId: string) {
    try {
      // 获取或创建新的聊天会话
      let chat = this.chats.get(sessionId)
      if (!chat) {
        chat = this.model.startChat({
          history: [
            {
              role: "user",
              parts: [{ text: "你好，请用中文回答我的问题" }],
            },
            {
              role: "model",
              parts: [{ text: "你好！我很乐意用中文回答你的问题。请问有什么我可以帮你的吗？" }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 2048,
            temperature: 0.7,
          }
        })
        this.chats.set(sessionId, chat)
      }

      // 使用流式响应
      const result = await chat.sendMessageStream([{ text: message }])
      return result.stream
    } catch (error) {
      console.error('Gemini API error:', error)
      throw error
    }
  }

  // 获取对话历史
  getHistory(sessionId: string) {
    const chat = this.chats.get(sessionId)
    return chat?.getHistory() || []
  }

  // 清除指定用户的聊天历史
  clearHistory(sessionId: string) {
    this.chats.delete(sessionId)
  }
}

export const geminiService = new GeminiService() 