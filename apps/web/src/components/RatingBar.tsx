import "../styles/product.css";

interface RatingBarProps {
  score: number;
}

export default function RatingBar({ score }: RatingBarProps) {
  const percentage = (score / 10) * 100;
  const color =
    score >= 8 ? "var(--color-success)" : score >= 5 ? "var(--color-warning)" : "var(--color-danger)";
  const label = score >= 8 ? "Excellent" : score >= 5 ? "Moderate" : "Poor";

  return (
    <div className="rating-bar">
      <div className="rating-bar__track">
        <div
          className="rating-bar__fill"
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
      <div className="rating-bar__info">
        <span className="rating-bar__score">{score}/10</span>
        <span className="rating-bar__label" style={{ color }}>
          {label}
        </span>
      </div>
    </div>
  );
}
