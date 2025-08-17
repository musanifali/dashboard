import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface SparklineProps {
  data: number[]
  color?: string
}

export function Sparkline({ data, color = '#10b981' }: SparklineProps) {
  const chartData = data.slice(-20).map((value, index) => ({ value, index }))
  
  return (
    <div style={{ width: '100%', height: '40px' }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}