import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          fontSize: 22,
          fontWeight: 900,
          color: '#f59e0b',
        }}
      >
        М
      </div>
    ),
    { ...size }
  )
}
