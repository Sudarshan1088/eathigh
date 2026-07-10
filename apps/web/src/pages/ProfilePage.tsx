import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/user";
import { DIETARY_PRESETS } from "@eathigh/shared";
import type { DietaryGoal } from "@eathigh/shared";
import { User, Mail, Activity, Ruler, ChevronDown, CheckCircle2, Save, LogOut } from "lucide-react";
import SEO from "../components/SEO";

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [weight, setWeight] = useState(0);
  const [height, setHeight] = useState(0);
  const [goals, setGoals] = useState<DietaryGoal[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    setName(user.name);
    setGender(user.gender || 'male');
    setWeight(user.weight || 0);
    setHeight(user.height || 0);
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

    const res = await updateProfile({ name, dietaryGoals: goals, gender, weight, height });

    if (res.success) {
      setMessage({ type: 'success', text: "Profile updated successfully!" });
      await refreshUser();
    } else {
      setMessage({ type: 'error', text: res.error || "Failed to update profile" });
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
      <SEO title="Profile | EatHigh" />
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-earth-olive-dark tracking-tight">Your Profile</h1>
            <p className="text-earth-olive-dark/70 mt-1">Manage your account details and dietary preferences.</p>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
                className="flex items-center justify-center gap-2 py-2.5 px-4 font-bold text-earth-olive-dark/70 bg-earth-olive-dark/10 border border-earth-olive-dark/20 rounded-xl hover:bg-earth-olive-dark/20 hover:text-earth-olive-dark transition-all shadow-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
          </div>
        </div>

        {/* Account Section */}
        <section className="bg-white/60 backdrop-blur-xl border border-earth-olive-dark/20 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-earth-olive/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
          
          <h2 className="font-heading text-xl font-bold text-earth-olive-dark mb-8 flex items-center gap-2 relative z-10">
            <User className="w-5 h-5 text-earth-olive-dark" />
            Account Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 relative z-10">
            
            <div className="flex flex-col gap-2 md:col-span-2">
              <label htmlFor="profile-name" className="text-sm font-bold text-earth-olive-dark/80 ml-1">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-accent-purple/70" />
                </div>
                <input
                  id="profile-name"
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-earth-olive-dark/20 rounded-2xl text-earth-olive-dark placeholder-earth-olive-dark/40 focus:outline-none focus:border-earth-olive-dark focus:ring-1 focus:ring-earth-olive-dark transition-all shadow-inner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-earth-olive-dark/80 ml-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-accent-purple/70" />
                </div>
                <div className="w-full pl-11 pr-4 py-3 bg-white/30 border border-earth-olive-dark/10 rounded-2xl text-earth-olive-dark/60 flex items-center h-[50px] shadow-inner cursor-not-allowed">
                  {user.email}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="profile-gender" className="text-sm font-bold text-earth-olive-dark/80 ml-1">Gender</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-earth-olive-dark/50" />
                </div>
                <select
                  id="profile-gender"
                  className="w-full pl-11 pr-10 py-3 bg-white/50 border border-earth-olive-dark/20 rounded-2xl text-earth-olive-dark appearance-none focus:outline-none focus:border-earth-olive-dark focus:ring-1 focus:ring-earth-olive-dark transition-all shadow-inner cursor-pointer"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-earth-olive-dark/50" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="profile-weight" className="text-sm font-bold text-earth-olive-dark/80 ml-1">Weight <span className="text-earth-olive-dark/50 font-normal">(kg)</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Activity className="w-4 h-4 text-accent-purple/70" />
                </div>
                <input
                  id="profile-weight"
                  type="number"
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-earth-olive-dark/20 rounded-2xl text-earth-olive-dark focus:outline-none focus:border-earth-olive-dark focus:ring-1 focus:ring-earth-olive-dark transition-all shadow-inner"
                  value={weight || ""}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  placeholder="e.g. 70"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="profile-height" className="text-sm font-bold text-earth-olive-dark/80 ml-1">Height <span className="text-earth-olive-dark/50 font-normal">(cm)</span></label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Ruler className="w-4 h-4 text-accent-purple/70" />
                </div>
                <input
                  id="profile-height"
                  type="number"
                  className="w-full pl-11 pr-4 py-3 bg-white/50 border border-earth-olive-dark/20 rounded-2xl text-earth-olive-dark focus:outline-none focus:border-earth-olive-dark focus:ring-1 focus:ring-earth-olive-dark transition-all shadow-inner"
                  value={height || ""}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  placeholder="e.g. 175"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Dietary Goals Section */}
        <section className="bg-white/60 backdrop-blur-xl border border-earth-olive-dark/20 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-earth-olive/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="font-heading text-xl font-bold text-earth-olive-dark mb-2">Dietary Goals</h2>
            <p className="text-sm text-earth-olive-dark/70 mb-8 max-w-2xl">
              Select your dietary preferences. The AI will personalize its nutritional analysis and scoring based on your specific health objectives.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {DIETARY_PRESETS.map((preset) => {
                const active = goals.some((g) => g.name === preset.name);
                return (
                  <button
                    key={preset.name}
                    onClick={() => togglePreset(preset)}
                    type="button"
                    className={`relative flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-300 ${
                      active 
                        ? "bg-earth-olive/20 border-earth-olive/40 shadow-[0_4px_20px_rgba(106,153,78,0.2)] -translate-y-1" 
                        : "bg-white/50 border-earth-olive-dark/20 hover:border-earth-olive-dark/50 hover:bg-white hover:-translate-y-0.5"
                    }`}
                  >
                    {active && (
                      <div className="absolute top-4 right-4 animate-scale-in">
                        <CheckCircle2 className="w-5 h-5 text-accent-purple" />
                      </div>
                    )}
                    <span className={`font-bold mb-2 text-earth-olive-dark`}>
                      {preset.name}
                    </span>
                    <span className="text-xs text-earth-olive-dark/70 leading-relaxed pr-6">
                      {preset.description}
                    </span>
                  </button>
                );
              })}
            </div>

            {goals.length > 0 && (
              <div className="pt-6 border-t border-earth-olive-dark/20 animate-fade-in">
                <h3 className="text-xs font-bold text-earth-olive-dark/50 uppercase tracking-widest mb-4">
                  Active Goals ({goals.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {goals.map((goal) => (
                    <div key={goal.id} className="flex items-center gap-2 px-3 py-1.5 bg-earth-olive-dark/10 border border-earth-olive-dark/20 text-earth-olive-dark rounded-xl text-sm shadow-sm animate-scale-in">
                      <span className="font-bold">{goal.name}</span>
                      <button
                        className="text-earth-olive-dark/50 hover:text-earth-crimson transition-colors p-0.5"
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
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex flex-col gap-4">
          {message && (
            <div
              className={`p-4 rounded-2xl text-sm font-bold text-center animate-fade-in flex items-center justify-center gap-2 ${
                message.type === 'success'
                  ? "bg-earth-olive border border-earth-olive text-earth-light shadow-sm" 
                  : "bg-earth-crimson border border-earth-crimson text-earth-light shadow-sm"
              }`}
            >
              {message.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {message.text}
            </div>
          )}
  
          <div className="flex justify-end mb-20 md:mb-10">
            <button
              className="w-full sm:w-auto flex items-center justify-center gap-2 py-3.5 px-8 font-bold text-earth-light bg-earth-olive rounded-2xl hover:bg-earth-olive-light shadow-[0_0_20px_rgba(106,153,78,0.4)] hover:shadow-[0_0_25px_rgba(167,201,87,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
              onClick={handleSave}
              disabled={saving}
            >
              <Save className="w-5 h-5" />
              {saving ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
