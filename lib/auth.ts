import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { JWTPayload } from '../types/auth'

// 获取环境变量
const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = parseInt(process.env.JWT_EXPIRES_IN || '2592000')

// 获取有效用户列表
function getValidUsernames(): string[] {
  const usernames = process.env.VALID_USERNAMES || ''
  return usernames.split(',').map(u => u.trim())
}

// 获取加密后的密码
function getHashedPassword(): string {
  try {
    const base64Hash = process.env.HASHED_PASSWORD || ''
    return Buffer.from(base64Hash, 'base64').toString('utf-8')
  } catch (error) {
    return ''
  }
}

// 验证用户凭据
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  // 检查用户名是否有效
  const validUsers = getValidUsernames()
  if (!validUsers.includes(username)) {
    return false
  }
  
  // 验证密码
  const hashedPassword = getHashedPassword()
  return bcrypt.compare(password, hashedPassword)
}

// 生成 JWT token
export function generateToken(username: string): string {
  const payload: JWTPayload = {
    username,
    iat: Date.now() / 1000,
    exp: Date.now() / 1000 + JWT_EXPIRES_IN
  }
  
  return jwt.sign(payload, JWT_SECRET)
}

// 验证 JWT token
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch {
    return null
  }
}

// 加密密码（用于初始化用户密码）
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
} 