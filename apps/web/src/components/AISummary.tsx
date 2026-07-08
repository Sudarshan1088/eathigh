interface AISummaryProps {
  summary: string;
  cached: boolean;
}

export default function AISummary({ summary, cached }: AISummaryProps) {
  return (
    <div className="bg-neutral-950/50 border border-neutral-800 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">✨</span>
        <h4 className="font-heading text-sm font-semibold text-white">AI Analysis</h4>
        {cached && (
          <span className="ml-auto text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400">
            Cached
          </span>
        )}
      </div>
      <p className="text-sm text-neutral-400 leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
