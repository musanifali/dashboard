interface SparklineProps {
  data: number[]
  color?: string
}

export function Sparkline({ data, color = '#10b981' }: SparklineProps) {
  const trend = data[data.length - 1] > data[0] ? 'up' : 'down'
  
  return (
    <div className="w-16 h-8 flex items-center justify-center">
      <div className={`text-xs font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trend === 'up' ? '↗' : '↘'}
      </div>
    </div>
  )
}