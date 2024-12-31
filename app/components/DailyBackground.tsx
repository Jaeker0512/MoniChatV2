'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function DailyBackground() {
  const [backgroundUrl, setBackgroundUrl] = useState('')

  useEffect(() => {
    const fetchDailyImage = async () => {
      try {
        const response = await fetch('/api/daily-image')
        const data = await response.json()
        if (data.imageUrl) {
          setBackgroundUrl(data.imageUrl)
        }
      } catch (error) {
        console.error('Error fetching daily image:', error)
      }
    }

    fetchDailyImage()
  }, [])

  if (!backgroundUrl) {
    return null
  }

  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-black/30" />
      <Image
        src={backgroundUrl}
        alt="Daily background"
        fill
        className="object-cover"
        quality={100}
        priority
      />
    </div>
  )
}

