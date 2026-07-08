import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/user";
import { DIETARY_PRESETS } from "@eathigh/shared";
import type { DietaryGoal } from "@eathigh/shared";

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
    <div className="flex-1 flex flex-col w-full px-4 md:px-8 py-8 animate-fade-in-up">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
        <h1 className="font-heading text-3xl font-bold text-white">Your Profile</h1>

        {/* Account Section */}
        <section className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/60 rounded-3xl p-6 md:p-8 shadow-xl">
          <h2 className="font-heading text-xl font-bold text-white mb-6">Account</h2>
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="profile-name" className="text-sm font-medium text-neutral-400">
                Name
              </label>
              <input
                id="profile-name"
                type="text"
                className="w-full px-4 py-3 bg-neutral-950/50 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-primary-DEFAULT focus:ring-1 focus:ring-primary-DEFAULT transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400">Email</label>
              <p className="px-4 py-3 bg-neutral-950/30 border border-neutral-800/50 rounded-xl text-neutral-500">
                {user.email}
              </p>
            </div>
          </div>
        </section>

        {/* Dietary Goals Section */}
        <section className="bg-neutral-900/80 backdrop-blur-xl border border-neutral-800/60 rounded-3xl p-6 md:p-8 shadow-xl">
          <h2 className="font-heading text-xl font-bold text-white mb-2">Dietary Goals</h2>
          <p className="text-sm text-neutral-400 mb-6">
            Select your dietary preferences. The AI will personalize its
            analysis based on your choices.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
            {DIETARY_PRESETS.map((preset) => {
              const active = goals.some((g) => g.name === preset.name);
              return (
                <button
                  key={preset.name}
                  onClick={() => togglePreset(preset)}
                  type="button"
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                    active 
                      ? "bg-primary-DEFAULT/10 border-primary-DEFAULT shadow-[0_0_15px_rgba(52,211,153,0.1)]" 
                      : "bg-neutral-950/50 border-neutral-800 hover:border-neutral-700"
                  }`}
                >
                  <span className={`font-semibold mb-1 ${active ? "text-primary-DEFAULT" : "text-neutral-300"}`}>
                    {preset.name}
                  </span>
                  <span className="text-xs text-neutral-500 leading-relaxed">
                    {preset.description}
                  </span>
                </button>
              );
            })}
          </div>

          {goals.length > 0 && (
            <div className="pt-6 border-t border-neutral-800/60">
              <h3 className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-4">
                Active Goals ({goals.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {goals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-2 px-3 py-1.5 bg-neutral-800 text-neutral-300 rounded-lg text-sm">
                    <span>{goal.name}</span>
                    <button
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                      onClick={() => setGoals(goals.filter((g) => g.id !== goal.id))}
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
            className={`p-4 rounded-xl text-sm font-medium text-center ${
              message.includes("success") 
                ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" 
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}
          >
            {message}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-20 md:mb-0">
          <button
            className="flex-1 py-3.5 px-6 font-semibold text-neutral-950 bg-primary-DEFAULT rounded-xl hover:bg-primary-hover shadow-[0_0_20px_rgba(52,211,153,0.15)] hover:shadow-[0_0_25px_rgba(52,211,153,0.3)] hover:scale-[1.02] transition-all disabled:opacity-50"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button 
            className="py-3.5 px-6 font-semibold text-red-400 bg-transparent border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-colors"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
