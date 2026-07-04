import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getScanHistory } from "../api/user";
import type { ScanHistoryEntry } from "@eathigh/shared";
import "../styles/profile.css";

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
    <main className="profile-page">
      <div className="profile-container">
        <h1 className="profile__title">Scan History</h1>

        {loading ? (
          <div className="home__loading">
            <div className="spinner" />
            <p>Loading history...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="history-empty">
            <p className="history-empty__text">
              No scans yet. Start scanning to build your history!
            </p>
            <button className="btn btn--primary" onClick={() => navigate("/")}>
              Start Scanning
            </button>
          </div>
        ) : (
          <>
            <div className="history-grid">
              {entries.map((entry, i) => (
                <div key={`${entry.barcode}-${i}`} className="history-card">
                  {entry.imageUrl ? (
                    <img
                      src={entry.imageUrl}
                      alt={entry.productName}
                      className="history-card__image"
                    />
                  ) : (
                    <div className="history-card__placeholder">📦</div>
                  )}
                  <div className="history-card__info">
                    <h3 className="history-card__name">{entry.productName}</h3>
                    {entry.brands && (
                      <p className="history-card__brand">{entry.brands}</p>
                    )}
                    <div className="history-card__meta">
                      <span
                        className="history-card__score"
                        style={{
                          color:
                            entry.healthScore >= 8
                              ? "var(--color-success)"
                              : entry.healthScore >= 5
                                ? "var(--color-warning)"
                                : "var(--color-danger)",
                        }}
                      >
                        {entry.healthScore}/10
                      </span>
                      <span className="history-card__date">
                        {new Date(entry.scannedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="btn btn--ghost"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  ← Previous
                </button>
                <span className="pagination__info">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn btn--ghost"
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
    </main>
  );
}
