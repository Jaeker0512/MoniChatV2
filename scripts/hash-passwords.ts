import { config } from 'dotenv'
import { hashPassword as hashPwd } from '../lib/auth'

// 加载环境变量
config({ path: '.env.local' })

async function generateHash() {
  try {
    const plainPassword = process.env.PLAIN_PASSWORD
    if (!plainPassword) {
      console.error('请在 .env.local 文件中设置 PLAIN_PASSWORD 变量')
      return
    }

    // 生成密码哈希并进行 Base64 编码
    const hashedPassword = await hashPwd(plainPassword)
    const base64Hash = Buffer.from(hashedPassword).toString('base64')
    
    console.log('请将以下内容复制到 HASHED_PASSWORD：')
    console.log(base64Hash)
    
  } catch (error) {
    console.error('密码加密失败:', error)
  }
}

// 运行脚本
generateHash() 