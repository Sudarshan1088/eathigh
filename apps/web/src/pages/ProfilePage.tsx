import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/user";
import { DIETARY_PRESETS } from "@eathigh/shared";
import type { DietaryGoal } from "@eathigh/shared";
import "../styles/profile.css";

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [goals, setGoals] = useState<DietaryGoal[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setName(user.name);
    setGoals(user.dietaryGoals);
  }, [user, navigate]);

  const togglePreset = (preset: Omit<DietaryGoal, "id">) => {
    const exists = goals.find((g) => g.name === preset.name);
    if (exists) {
      setGoals(goals.filter((g) => g.name !== preset.name));
    } else {
      setGoals([
        ...goals,
        { ...preset, id: crypto.randomUUID() },
      ]);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const res = await updateProfile({ name, dietaryGoals: goals });

    if (res.success) {
      setMessage("Profile updated successfully!");
      await refreshUser();
    } else {
      setMessage(res.error || "Failed to update profile");
    }

    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null;

  return (
    <main className="profile-page">
      <div className="profile-container">
        <h1 className="profile__title">Your Profile</h1>

        <section className="profile-section">
          <h2 className="profile-section__title">Account</h2>
          <div className="form-group">
            <label htmlFor="profile-name" className="form-label">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <p className="profile__email">{user.email}</p>
          </div>
        </section>

        <section className="profile-section">
          <h2 className="profile-section__title">Dietary Goals</h2>
          <p className="profile-section__description">
            Select your dietary preferences. The AI will personalize its
            analysis based on your choices.
          </p>
          <div className="dietary-presets">
            {DIETARY_PRESETS.map((preset) => {
              const active = goals.some((g) => g.name === preset.name);
              return (
                <button
                  key={preset.name}
                  className={`preset-chip ${active ? "preset-chip--active" : ""}`}
                  onClick={() => togglePreset(preset)}
                  type="button"
                >
                  <span className="preset-chip__name">{preset.name}</span>
                  <span className="preset-chip__desc">{preset.description}</span>
                </button>
              );
            })}
          </div>

          {goals.length > 0 && (
            <div className="active-goals">
              <h3 className="active-goals__title">
                Active Goals ({goals.length})
              </h3>
              <div className="active-goals__list">
                {goals.map((goal) => (
                  <div key={goal.id} className="goal-tag">
                    {goal.name}
                    <button
                      className="goal-tag__remove"
                      onClick={() =>
                        setGoals(goals.filter((g) => g.id !== goal.id))
                      }
                      aria-label={`Remove ${goal.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {message && (
          <div
            className={`profile-message ${message.includes("success") ? "profile-message--success" : "profile-message--error"}`}
          >
            {message}
          </div>
        )}

        <div className="profile__actions">
          <button
            className="btn btn--primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button className="btn btn--danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
