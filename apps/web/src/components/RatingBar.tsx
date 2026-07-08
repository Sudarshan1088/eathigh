interface RatingBarProps {
  score: number;
}

export default function RatingBar({ score }: RatingBarProps) {
  const percentage = (score / 10) * 100;
  
  // Tailwind color classes based on score
  const colorClass = 
    score >= 8 ? "bg-emerald-500 text-emerald-500" : 
    score >= 5 ? "bg-yellow-400 text-yellow-400" : 
    "bg-red-500 text-red-500";
    
  const label = score >= 8 ? "Excellent" : score >= 5 ? "Moderate" : "Poor";

  return (
    <div className="flex flex-col gap-2">
      <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass.split(' ')[0]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="font-heading text-xl font-bold text-white">{score}/10</span>
        <span className={`text-sm font-semibold uppercase tracking-wider ${colorClass.split(' ')[1]}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
