import "../styles/product.css";

interface AISummaryProps {
  summary: string;
  cached: boolean;
}

export default function AISummary({ summary, cached }: AISummaryProps) {
  return (
    <div className="ai-summary">
      <div className="ai-summary__header">
        <span className="ai-summary__icon">✨</span>
        <h4 className="ai-summary__title">AI Analysis</h4>
        {cached && <span className="ai-summary__badge">Cached</span>}
      </div>
      <p className="ai-summary__text">{summary}</p>
    </div>
  );
}
