export function ProgressSample() {
  const size = 168;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const value = 0.72;
  const offset = circumference * (1 - value);

  return (
    <div
      className="gl-ring"
      style={{ width: size, height: size }}
      role="img"
      aria-label="Sample day, 72 percent of the move goal"
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          className="gl-ring-edge"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
        />
        <circle
          className="gl-ring-arc"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="gl-ring-mid">
        <span className="gl-ring-value" style={{ fontSize: 44, lineHeight: "44px" }}>
          72
        </span>
        <span className="gl-ring-label">Move</span>
      </div>
    </div>
  );
}
