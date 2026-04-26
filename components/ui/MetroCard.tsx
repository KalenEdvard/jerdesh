import { getMetroCardData } from '@/lib/metro-lines'

const STEP = 52  // px between stations
const TOP_PAD = 24
const TOTAL_H = TOP_PAD * 2 + STEP * 4  // 5 stations

function truncate(s: string, n = 18) {
  return s.length > n ? s.slice(0, n) + '…' : s
}

export default function MetroCard({
  station,
  width = 260,
  height = TOTAL_H,
}: {
  station: string
  width?: number
  height?: number
}) {
  const data = getMetroCardData(station)
  if (!data) return null

  const { before, after, color } = data
  const lineX = Math.round(width * 0.28)
  const dotR = 5
  const currentDotR = 7

  // 5 slots: before[0], before[1], current, after[0], after[1]
  const slots = [...before, station, ...after]
  const ys = slots.map((_, i) => TOP_PAD + i * STEP)
  const currentIdx = 2

  const lineTop = ys[0]
  const lineBot = ys[ys.length - 1]

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <rect width={width} height={height} fill="#f8fafc" />

      {/* Vertical line */}
      <line x1={lineX} y1={lineTop} x2={lineX} y2={lineBot} stroke={color} strokeWidth={4} strokeLinecap="round" />

      {slots.map((name, i) => {
        if (!name) return null
        const y = ys[i]
        const isCurrent = i === currentIdx

        return (
          <g key={i}>
            {isCurrent ? (
              <>
                <circle cx={lineX} cy={y} r={currentDotR} fill={color} />
                <circle cx={lineX} cy={y} r={currentDotR - 3} fill="#fff" />
                <text x={lineX + 14} y={y - 4} fontSize={12} fontWeight="bold" fill="#0f172a" fontFamily="system-ui,sans-serif">
                  {truncate(name, 20)}
                </text>
                <text x={lineX + 14} y={y + 10} fontSize={9} fill={color} fontFamily="system-ui,sans-serif" fontWeight="600">
                  метро
                </text>
              </>
            ) : (
              <>
                <circle cx={lineX} cy={y} r={dotR} fill="#fff" stroke={color} strokeWidth={3} />
                <text x={lineX + 12} y={y + 4} fontSize={10} fill="#64748b" fontFamily="system-ui,sans-serif">
                  {truncate(name, 22)}
                </text>
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}
