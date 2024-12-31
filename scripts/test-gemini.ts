import { config } from 'dotenv'
import { resolve } from 'path'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { setGlobalDispatcher, ProxyAgent } from 'undici'

// 加载环境变量
const envFile = resolve(process.cwd(), '.env.local')
config({ path: envFile })

// 设置全局代理
if (!process.env.PROXY_URL) {
  throw new Error('PROXY_URL environment variable is required')
}
const dispatcher = new ProxyAgent({ uri: new URL(process.env.PROXY_URL).toString() })
setGlobalDispatcher(dispatcher)

async function testGemini() {
  try {
    console.log('开始测试...')
    console.log('环境变量:', {
      NODE_ENV: process.env.NODE_ENV,
      USE_PROXY: process.env.USE_PROXY,
    })

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      }
    })

    console.log('开始对话...')
    const chat = model.startChat({
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
    })

    const result = await chat.sendMessage("web3有什么特点？")
    console.log('回复:', result.response.text())

  } catch (error) {
    console.error('测试出错:', error)
    if (error instanceof Error) {
      console.error('错误信息:', error.message)
      console.error('堆栈:', error.stack)
    }
  }
}

testGemini() 