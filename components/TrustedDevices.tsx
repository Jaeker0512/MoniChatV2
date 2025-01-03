'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

interface Device {
  id: string;
  name: string;
  lastUsed: string;
}

export default function TrustedDevices() {
  const { user } = useAuth()
  const [devices, setDevices] = useState<Device[]>([])

  useEffect(() => {
    if (user) {
      // In a real app, you would fetch this data from your backend
      setDevices([
        { id: '1', name: 'Chrome on Windows', lastUsed: '2023-06-01' },
        { id: '2', name: 'Safari on iPhone', lastUsed: '2023-05-30' },
      ])
    }
  }, [user])

  if (!user) {
    return null
  }

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Trusted Devices</h2>
      <ul>
        {devices.map(device => (
          <li key={device.id} className="mb-2">
            <strong>{device.name}</strong> - Last used: {device.lastUsed}
            <button 
              onClick={() => {/* Remove device logic */}}
              className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-sm"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

