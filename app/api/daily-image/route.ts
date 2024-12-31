import { NextResponse } from 'next/server'

export const revalidate = 3600 // 每小时重新验证一次

export async function GET() {
  try {
    const response = await fetch(
      'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US',
      {
        next: { revalidate: 3600 }, // 缓存1小时
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch Bing wallpaper')
    }

    const data = await response.json()
    
    if (!data.images?.[0]?.url) {
      throw new Error('Invalid response format from Bing API')
    }

    const imageUrl = `https://www.bing.com${data.images[0].url}`
    const copyright = data.images[0].copyright || ''
    
    return NextResponse.json({ 
      imageUrl,
      copyright,
      success: true 
    })
  } catch (error) {
    console.error('Error fetching Bing wallpaper:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch daily image',
        success: false
      }, 
      { status: 500 }
    )
  }
}

