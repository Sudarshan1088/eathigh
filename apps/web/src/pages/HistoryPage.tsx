import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getScanHistory } from "../api/user";
import type { ScanHistoryEntry } from "@eathigh/shared";

export default function HistoryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<ScanHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    getScanHistory(page, 12).then((res) => {
      if (res.success && res.data) {
        setEntries(res.data.items);
        setTotalPages(res.data.totalPages);
      }
      setLoading(false);
    });
  }, [user, page, navigate]);

  if (!user) return null;

  return (
    <div className="flex-1 flex flex-col w-full px-4 md:px-8 py-8 animate-fade-in-up pb-24 md:pb-8">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
        <h1 className="font-heading text-3xl font-bold text-white">Scan History</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-neutral-800 border-t-primary-DEFAULT rounded-full animate-spin" />
            <p className="text-neutral-400">Loading history...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-6 text-center bg-neutral-900/50 border border-neutral-800/60 rounded-3xl">
            <p className="text-neutral-400">
              No scans yet. Start scanning to build your history!
            </p>
            <button 
              className="py-3 px-6 font-semibold text-neutral-950 bg-primary-DEFAULT rounded-xl hover:bg-primary-hover transition-colors" 
              onClick={() => navigate("/")}
            >
              Start Scanning
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {entries.map((entry, i) => (
                <div 
                  key={`${entry.barcode}-${i}`} 
                  className="flex flex-col bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/60 rounded-2xl overflow-hidden hover:border-neutral-600 transition-colors group cursor-pointer"
                >
                  <div className="h-48 w-full bg-neutral-950/50 p-4 flex items-center justify-center border-b border-neutral-800/60">
                    {entry.imageUrl ? (
                      <img
                        src={entry.imageUrl}
                        alt={entry.productName}
                        className="max-h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-4xl">📦</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-4">
                    <div className="flex-1">
                      <h3 className="font-heading font-bold text-white line-clamp-1">{entry.productName}</h3>
                      {entry.brands && (
                        <p className="text-xs text-neutral-400 line-clamp-1">{entry.brands}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-2 pt-3 border-t border-neutral-800/60">
                      <span
                        className="font-heading font-bold text-lg"
                        style={{
                          color:
                            entry.healthScore >= 8
                              ? "var(--color-success, #22c55e)"
                              : entry.healthScore >= 5
                                ? "var(--color-warning, #facc15)"
                                : "var(--color-danger, #ef4444)",
                        }}
                      >
                        {entry.healthScore}/10
                      </span>
                      <span className="text-xs text-neutral-500 font-medium">
                        {new Date(entry.scannedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button
                  className="px-4 py-2 text-sm font-medium text-neutral-400 border border-neutral-800 rounded-lg hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  ← Previous
                </button>
                <span className="text-sm text-neutral-500 font-medium">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="px-4 py-2 text-sm font-medium text-neutral-400 border border-neutral-800 rounded-lg hover:bg-neutral-900 hover:text-white transition-all disabled:opacity-50 disabled:hover:bg-transparent"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
