import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: 'linear-gradient(135deg, #1d4ed8, #1e3a8a)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
          fontSize: 110,
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
