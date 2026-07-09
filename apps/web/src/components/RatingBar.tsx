interface RatingBarProps {
  score: number;
}

export default function RatingBar({ score }: RatingBarProps) {
  const isExcellent = score >= 8;
  const isModerate = score >= 5 && score < 8;
  
  const textColor = isExcellent ? "text-earth-light" : isModerate ? "text-earth-olive-dark" : "text-earth-light";
  const badgeBg = isExcellent ? "bg-earth-olive border-earth-olive" : isModerate ? "bg-earth-olive-light border-earth-olive-light" : "bg-earth-crimson border-earth-crimson";
  const label = isExcellent ? "Excellent" : isModerate ? "Moderate" : "Poor";

  // Use the exact hex colors from the earthy palette for the SVG ring
  const colorHex = isExcellent ? "#6A994E" : isModerate ? "#A7C957" : "#BC4749";

  const formattedScore = Number(score).toFixed(1);

  // SVG calculations for a circular progress ring
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 10) * circumference;

  return (
    <div className="flex flex-col gap-4 bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-earth-olive-dark/10 shadow-sm relative overflow-hidden group hover:border-earth-olive-dark/30 hover:shadow-md transition-all">
      {/* Soft background glow based on score */}
      <div 
        className={`absolute -right-8 -top-8 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none transition-opacity group-hover:opacity-30 ${
          isExcellent ? 'bg-earth-olive' : isModerate ? 'bg-earth-olive-light' : 'bg-earth-crimson'
        }`} 
      />
      
      <div className="flex flex-col sm:flex-row items-center justify-between relative z-10 gap-6 sm:gap-0 text-center sm:text-left">
        
        {/* Score Details */}
        <div className="flex flex-col items-center sm:items-start gap-1 text-earth-olive-dark">
          <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">
            Overall Health
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-5xl font-bold">{formattedScore}</span>
            <span className="font-heading text-xl font-bold opacity-40">/10</span>
          </div>
          <span className={`mt-3 inline-flex items-center justify-center px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest border shadow-sm ${badgeBg} ${textColor}`}>
            {label}
          </span>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative flex items-center justify-center drop-shadow-sm">
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              className="text-earth-olive-dark/10"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="48"
              cy="48"
            />
            <circle
              className="transition-all duration-1000 ease-out"
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke={colorHex}
              fill="transparent"
              r={radius}
              cx="48"
              cy="48"
            />
          </svg>
          {/* Icon inside the ring */}
          <div className="absolute inset-0 flex items-center justify-center text-2xl drop-shadow-md">
            {isExcellent ? '🌿' : isModerate ? '⚖️' : '⚠️'}
          </div>
        </div>

      </div>
    </div>
  );
}
