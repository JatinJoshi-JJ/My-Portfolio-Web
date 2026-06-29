import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const size = {
  width: 64,
  height: 64,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 36,
          background: 'linear-gradient(135deg, #ea580c 0%, #a855f7 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          borderRadius: '25%',
          fontWeight: 900,
          fontFamily: 'system-ui',
        }}
      >
        JJ
      </div>
    ),
    {
      ...size,
    }
  )
}
