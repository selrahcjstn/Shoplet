interface SparklineProps {
  values: number[]
  className?: string
}

/** A tiny trend line with a soft fill. Decorative: the numbers next to it carry the meaning. */
export default function Sparkline({ values, className }: SparklineProps) {
  const width = 100
  const height = 32
  const max = Math.max(...values, 1)
  const step = values.length > 1 ? width / (values.length - 1) : width
  // Keep a 2px margin so the line is never clipped at the top or bottom.
  const points = values.map((value, index) => [index * step, height - 2 - (value / max) * (height - 4)] as const)
  const line = points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ')
  const area = `0,${height} ${line} ${width},${height}`

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden className={className}>
      <polygon points={area} className="fill-primary-light" />
      <polyline
        points={line}
        fill="none"
        className="stroke-primary"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
