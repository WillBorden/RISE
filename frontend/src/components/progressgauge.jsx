import './progressgauge.css'

function ProgressGauge({ label, value, total, completed }) {
  const percentage = Math.round(value)
  const circumference = 2 * Math.PI * 45
  const offset = circumference - (percentage / 100) * circumference

  // Determine color based on progress
  const getColor = () => {
    if (percentage >= 80) return '#10b981' // Green
    if (percentage >= 50) return '#3b82f6' // Blue
    if (percentage >= 30) return '#f59e0b' // Orange
    return '#ef4444' // Red
  }

  return (
    <div className="progress-gauge">
      <svg className="gauge-svg" width="120" height="120">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth="10"
        />
        {/* Progress circle */}
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke={getColor()}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        {/* Percentage text */}
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="central"
          className="gauge-percentage"
          fill="var(--text-primary)"
        >
          {percentage}%
        </text>
      </svg>
      <div className="gauge-info">
        <div className="gauge-label">{label}</div>
        <div className="gauge-count">{completed} / {total}</div>
      </div>
    </div>
  )
}

export default ProgressGauge