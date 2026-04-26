import { getMetroCardData } from '@/lib/metro-lines'

export default function MetroCard({ station, width = 120, height = 130 }: { station: string; width?: number; height?: number }) {
  const data = getMetroCardData(station)
  if (!data) return null

  const { prev, next, color } = data
  const cx = width / 2
  const dotR = 6
  const lineX = cx - 28
  const topY = 28
  const midY = height / 2
  const botY = height - 28

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      {/* Background */}
      <rect width={width} height={height} fill="#f8fafc" />

      {/* Vertical metro line */}
      <line x1={lineX} y1={topY} x2={lineX} y2={botY} stroke={color} strokeWidth={4} strokeLinecap="round" />

      {/* Prev station */}
      {prev && (
        <>
          <circle cx={lineX} cy={topY} r={dotR - 1} fill="#fff" stroke={color} strokeWidth={3} />
          <text x={lineX + 12} y={topY + 4} fontSize={9} fill="#64748b" fontFamily="system-ui,sans-serif">{prev.length > 16 ? prev.slice(0, 16) + '…' : prev}</text>
        </>
      )}

      {/* Current station — highlighted */}
      <circle cx={lineX} cy={midY} r={dotR + 1} fill={color} />
      <circle cx={lineX} cy={midY} r={dotR - 2} fill="#fff" />
      <text x={lineX + 12} y={midY - 3} fontSize={10} fontWeight="bold" fill="#0f172a" fontFamily="system-ui,sans-serif">
        {station.length > 15 ? station.slice(0, 15) + '…' : station}
      </text>
      <text x={lineX + 12} y={midY + 11} fontSize={8} fill={color} fontFamily="system-ui,sans-serif" fontWeight="600">метро</text>

      {/* Next station */}
      {next && (
        <>
          <line x1={lineX} y1={midY} x2={lineX} y2={botY} stroke={color} strokeWidth={4} />
          <circle cx={lineX} cy={botY} r={dotR - 1} fill="#fff" stroke={color} strokeWidth={3} />
          <text x={lineX + 12} y={botY + 4} fontSize={9} fill="#64748b" fontFamily="system-ui,sans-serif">{next.length > 16 ? next.slice(0, 16) + '…' : next}</text>
        </>
      )}
    </svg>
  )
}
