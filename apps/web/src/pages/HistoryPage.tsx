import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getScanHistory } from "../api/user";
import type { ScanHistoryEntry } from "@eathigh/shared";
import { Calendar, PackageOpen } from "lucide-react";
import SEO from "../components/SEO";

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
      <SEO title="History | EatHigh" />
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8">
        <h1 className="font-heading text-3xl font-bold text-earth-olive-dark tracking-tight">Scan History</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-earth-olive-dark/20 border-t-earth-olive rounded-full animate-spin" />
            <p className="text-earth-olive-dark/60 font-medium">Loading history...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6 text-center bg-white/60 backdrop-blur-md border border-earth-olive-dark/20 rounded-3xl shadow-sm">
            <PackageOpen className="w-16 h-16 text-accent-purple/40" />
            <p className="text-earth-olive-dark/70 text-lg max-w-sm">
              No scans yet. Start scanning products to build your nutritional history!
            </p>
            <button 
              className="mt-2 py-3 px-8 font-bold text-earth-light bg-earth-olive rounded-xl hover:bg-earth-olive-light shadow-md transition-all hover:scale-105" 
              onClick={() => navigate("/")}
            >
              Start Scanning
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {entries.map((entry, i) => {
                const isExcellent = entry.healthScore >= 8;
                const isModerate = entry.healthScore >= 5 && entry.healthScore < 8;
                
                const badgeBg = isExcellent ? "bg-earth-olive text-earth-light" : isModerate ? "bg-earth-olive-light text-earth-olive-dark" : "bg-earth-crimson text-earth-light";
                const formattedScore = Number(entry.healthScore).toFixed(1);

                return (
                  <div 
                    key={`${entry.barcode}-${i}`} 
                    className="flex flex-col bg-white/60 backdrop-blur-xl border border-earth-olive-dark/20 rounded-3xl overflow-hidden hover:border-earth-olive-dark/40 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer"
                  >
                    {/* Image Area with Floating Badge */}
                    <div className="h-48 w-full bg-earth-olive-dark/5 p-6 flex items-center justify-center border-b border-earth-olive-dark/10 relative">
                      
                      {/* Floating Score Badge */}
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-full shadow-sm flex items-baseline gap-0.5 ${badgeBg}`}>
                        <span className="font-heading font-bold text-sm">{formattedScore}</span>
                        <span className="font-heading font-semibold text-[10px] opacity-80">/10</span>
                      </div>

                      {entry.imageUrl ? (
                        <img
                          src={entry.imageUrl}
                          alt={entry.productName}
                          className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-sm"
                        />
                      ) : (
                        <PackageOpen className="w-12 h-12 text-accent-purple/40" />
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="flex flex-col p-5 flex-1 justify-between gap-4">
                      <div>
                        <h3 className="font-heading font-bold text-earth-olive-dark text-lg leading-tight line-clamp-2 mb-1">
                          {entry.productName || "Unknown Product"}
                        </h3>
                        {entry.brands && (
                          <p className="text-xs font-medium text-earth-olive-dark/60 line-clamp-1">{entry.brands}</p>
                        )}
                      </div>
                      
                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-earth-olive-dark/10">
                        <div className="flex items-center gap-1.5 text-accent-purple/70">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs font-semibold tracking-wide">
                            {new Date(entry.scannedAt).toLocaleDateString(undefined, { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-10">
                <button
                  className="px-5 py-2.5 text-sm font-bold text-earth-olive-dark border-2 border-earth-olive-dark/20 rounded-xl hover:bg-earth-olive-dark hover:text-earth-light hover:border-earth-olive-dark transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-earth-olive-dark disabled:hover:border-earth-olive-dark/20"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  ← Previous
                </button>
                <span className="text-sm text-earth-olive-dark/70 font-bold tracking-wide">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="px-5 py-2.5 text-sm font-bold text-earth-olive-dark border-2 border-earth-olive-dark/20 rounded-xl hover:bg-earth-olive-dark hover:text-earth-light hover:border-earth-olive-dark transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-earth-olive-dark disabled:hover:border-earth-olive-dark/20"
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
