import { Sparkles } from "lucide-react";

interface AISummaryProps {
  summary: string;
  cached: boolean;
}

export default function AISummary({ summary, cached }: AISummaryProps) {
  return (
    <div className="bg-white/40 backdrop-blur-md border border-earth-olive-dark/20 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-earth-olive-dark" />
        <h4 className="font-heading text-sm font-bold text-earth-olive-dark">AI Analysis</h4>
        {cached && (
          <span className="ml-auto text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-earth-olive-dark/10 border border-earth-olive-dark/20 text-earth-olive-dark">
            Cached
          </span>
        )}
      </div>
      <p className="text-sm text-earth-olive-dark/80 leading-relaxed text-left">
        {summary}
      </p>
    </div>
  );
}
