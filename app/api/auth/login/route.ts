import { NextResponse } from 'next/server'
import { verifyCredentials, generateToken } from '@/lib/auth'
import type { AuthResponse } from '@/types/auth'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    console.log('收到登录请求:', { username })

    // 验证用户名和密码
    console.log('开始验证凭据')
    const isValid = await verifyCredentials(username, password)
    console.log('验证结果:', isValid)
    
    if (!isValid) {
      console.log('验证失败，返回401')
      return NextResponse.json<AuthResponse>({
        success: false,
        message: '用户名或密码错误'
      }, { status: 401 })
    }

    // 生成 JWT token
    console.log('验证成功，生成token')
    const token = generateToken(username)

    // 返回成功响应
    console.log('登录成功')
    return NextResponse.json<AuthResponse>({
      success: true,
      token,
      user: { username }
    })
  } catch (error) {
    console.error('登录过程出错:', error)
    return NextResponse.json<AuthResponse>({
      success: false,
      message: '登录失败，请稍后重试'
    }, { status: 500 })
  }
} 