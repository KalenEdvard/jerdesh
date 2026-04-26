import { getMetroCardData } from '@/lib/metro-lines'

const STEP = 52
const TOP_PAD = 28

function truncate(s: string, n = 20) {
  return s.length > n ? s.slice(0, n) + '…' : s
}

export default function MetroCard({
  station,
  width = 260,
  height = 300,
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

  // 5 slots: [before[0], before[1], current, after[0], after[1]]
  const slots: (string | null)[] = [...before, station, ...after]
  const ys = slots.map((_, i) => TOP_PAD + i * STEP)
  const currentIdx = 2

  // Find first and last real station indices
  const firstReal = slots.findIndex(s => s !== null)
  const lastReal = slots.length - 1 - [...slots].reverse().findIndex(s => s !== null)

  const lineTop = ys[firstReal]
  const lineBot = ys[lastReal]

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <rect width={width} height={height} fill="#f8fafc" />

      {/* Vertical line — only between real stations */}
      <line x1={lineX} y1={lineTop} x2={lineX} y2={lineBot} stroke={color} strokeWidth={4} strokeLinecap="round" />

      {/* Terminal cap at top if first real station is visible */}
      {firstReal > 0 || before[0] === null ? (
        <line
          x1={lineX - 8} y1={lineTop}
          x2={lineX + 8} y2={lineTop}
          stroke={color} strokeWidth={4} strokeLinecap="round"
        />
      ) : null}

      {/* Terminal cap at bottom if last real station is visible */}
      {lastReal < slots.length - 1 || after[1] === null ? (
        <line
          x1={lineX - 8} y1={lineBot}
          x2={lineX + 8} y2={lineBot}
          stroke={color} strokeWidth={4} strokeLinecap="round"
        />
      ) : null}

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
                <text x={lineX + 14} y={y - 4} fontSize={13} fontWeight="bold" fill="#0f172a" fontFamily="system-ui,sans-serif">
                  {truncate(name, 18)}
                </text>
                <text x={lineX + 14} y={y + 11} fontSize={9} fill={color} fontFamily="system-ui,sans-serif" fontWeight="600">
                  метро
                </text>
              </>
            ) : (
              <>
                <circle cx={lineX} cy={y} r={dotR} fill="#fff" stroke={color} strokeWidth={3} />
                <text x={lineX + 13} y={y + 4} fontSize={11} fill="#64748b" fontFamily="system-ui,sans-serif">
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
