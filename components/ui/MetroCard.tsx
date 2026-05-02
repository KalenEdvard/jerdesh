import { getMetroCardData } from '@/lib/metro-lines'

function truncate(s: string, n = 20) {
  return s.length > n ? s.slice(0, n) + '…' : s
}

// compact=true → 3 stations, fits in 130px card thumbnail
// compact=false → 5 stations, for detail page
export default function MetroCard({
  station,
  city,
  width = 260,
  height = 300,
  compact = false,
}: {
  station: string
  city?: string
  width?: number
  height?: number
  compact?: boolean
}) {
  const data = getMetroCardData(station, city)
  if (!data) return null

  const { before, after, color } = data
  // compact: line on the left edge, text to the right with max space
  const compactLineX = 14

  if (compact) {
    const PAD = 8 // horizontal padding inside SVG
    const lx = compactLineX + PAD
    const slots: (string | null)[] = [before[1], station, after[0]]
    const STEP = 34
    const TOP = Math.round((height - STEP * 2) / 2)
    const ys = [TOP, TOP + STEP, TOP + STEP * 2]
    const firstReal = slots.findIndex(s => s !== null)
    const lastReal = slots.length - 1 - [...slots].reverse().findIndex(s => s !== null)
    const maxChars = Math.floor((width - lx - 10 - PAD) / 4.8)

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
        <rect width={width} height={height} fill="#f8fafc" rx="0" />
        <line x1={lx} y1={ys[firstReal]} x2={lx} y2={ys[lastReal]} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        {slots[0] === null && <line x1={lx - 5} y1={ys[firstReal]} x2={lx + 5} y2={ys[firstReal]} stroke={color} strokeWidth={2.5} strokeLinecap="round" />}
        {slots[2] === null && <line x1={lx - 5} y1={ys[lastReal]} x2={lx + 5} y2={ys[lastReal]} stroke={color} strokeWidth={2.5} strokeLinecap="round" />}
        {slots.map((name, i) => {
          if (!name) return null
          const y = ys[i]
          const isCurrent = i === 1
          return (
            <g key={i}>
              {isCurrent ? (
                <>
                  <circle cx={lx} cy={y} r={6} fill={color} />
                  <circle cx={lx} cy={y} r={2.5} fill="#fff" />
                  <text x={lx + 10} y={y + 4} fontSize={8} fontWeight="bold" fill="#0f172a" fontFamily="system-ui,sans-serif">{truncate(name, maxChars)}</text>
                </>
              ) : (
                <>
                  <circle cx={lx} cy={y} r={3.5} fill="#fff" stroke={color} strokeWidth={2} />
                  <text x={lx + 9} y={y + 3} fontSize={7} fill="#94a3b8" fontFamily="system-ui,sans-serif">{truncate(name, maxChars)}</text>
                </>
              )}
            </g>
          )
        })}
      </svg>
    )
  }

  // Full mode: 5 stations
  const lineX = Math.round(width * 0.25)
  const STEP = 52
  const TOP_PAD = 28
  const slots: (string | null)[] = [...before, station, ...after]
  const ys = slots.map((_, i) => TOP_PAD + i * STEP)
  const firstReal = slots.findIndex(s => s !== null)
  const lastReal = slots.length - 1 - [...slots].reverse().findIndex(s => s !== null)
  const lineTop = ys[firstReal]
  const lineBot = ys[lastReal]

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width={width} height={height} fill="#f8fafc" />
      <line x1={lineX} y1={lineTop} x2={lineX} y2={lineBot} stroke={color} strokeWidth={4} strokeLinecap="round" />
      {firstReal > 0 && <line x1={lineX - 8} y1={lineTop} x2={lineX + 8} y2={lineTop} stroke={color} strokeWidth={4} strokeLinecap="round" />}
      {lastReal < slots.length - 1 && <line x1={lineX - 8} y1={lineBot} x2={lineX + 8} y2={lineBot} stroke={color} strokeWidth={4} strokeLinecap="round" />}
      {slots[0] === null && <line x1={lineX - 8} y1={lineTop} x2={lineX + 8} y2={lineTop} stroke={color} strokeWidth={4} strokeLinecap="round" />}
      {slots[4] === null && <line x1={lineX - 8} y1={lineBot} x2={lineX + 8} y2={lineBot} stroke={color} strokeWidth={4} strokeLinecap="round" />}
      {slots.map((name, i) => {
        if (!name) return null
        const y = ys[i]
        const isCurrent = i === 2
        return (
          <g key={i}>
            {isCurrent ? (
              <>
                <circle cx={lineX} cy={y} r={8} fill={color} />
                <circle cx={lineX} cy={y} r={4} fill="#fff" />
                <text x={lineX + 14} y={y + 4} fontSize={13} fontWeight="bold" fill="#0f172a" fontFamily="system-ui,sans-serif">{truncate(name, 18)}</text>
              </>
            ) : (
              <>
                <circle cx={lineX} cy={y} r={5} fill="#fff" stroke={color} strokeWidth={3} />
                <text x={lineX + 13} y={y + 4} fontSize={11} fill="#64748b" fontFamily="system-ui,sans-serif">{truncate(name, 22)}</text>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}
