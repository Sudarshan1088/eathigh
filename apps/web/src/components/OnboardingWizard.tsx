import { useState } from "react";
import { Check, Dumbbell, Apple, Target, Droplet, HeartPulse } from "lucide-react";
import type { RegisterBody } from "@eathigh/shared";

export type OnboardingData = RegisterBody;

interface OnboardingWizardProps {
  onSubmit: (data: OnboardingData) => void;
  loading: boolean;
}

export default function OnboardingWizard({ onSubmit, loading }: OnboardingWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    email: "",
    password: "",
    gender: "male", // default to prevent empty
    weight: 0,
    height: 0,
    dietaryGoal: "",
  });

  // Password Validation
  const hasMinLen = data.password.length >= 8;
  const hasNum = /\d/.test(data.password);
  const hasUpper = /[A-Z]/.test(data.password);
  const hasLower = /[a-z]/.test(data.password);
  const hasSpecial = /[@$!%*?&^#_.]/.test(data.password);
  
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const isNameValid = (data.name || "").trim().length > 0;
  const isStep1Valid = isNameValid && isEmailValid && hasMinLen && hasNum && hasUpper && hasLower && hasSpecial;
  
  const isStep2Valid = data.gender !== undefined && data.weight !== 0 && data.weight >= 20 && data.height !== 0 && data.height >= 50;
  const isStep3Valid = data.dietaryGoal !== "";

  const handleNext = () => {
    if (step === 1 && isStep1Valid) setStep(2);
    else if (step === 2 && isStep2Valid) setStep(3);
    else if (step === 3 && isStep3Valid) onSubmit(data);
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-col min-h-dvh md:min-h-[600px] w-full bg-neutral-950 text-white relative">
      {/* Top Progress Bar */}
      <div className="h-1.5 w-full bg-neutral-900 sticky top-0 z-20">
        <div 
          className="h-full bg-emerald-500 transition-all duration-500 ease-out"
          style={{ width: step === 1 ? "33.33%" : step === 2 ? "66.66%" : "100%" }}
        />
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-8 pb-32 w-full max-w-md mx-auto fade-in">
        {step === 1 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-2">Account Setup</h2>
              <p className="text-neutral-400">Secure your EatHigh profile.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400">Full Name</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => updateData({ name: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                placeholder="John Doe"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400">Email Address</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-neutral-400">Password</label>
              <input
                type="password"
                value={data.password}
                onChange={(e) => updateData({ password: e.target.value })}
                className="w-full px-4 py-3 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                placeholder="Create a strong password"
              />
              
              {/* Live Checklist */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3">
                <ValidationItem passed={hasMinLen} text="Min 8 chars" />
                <ValidationItem passed={hasNum} text="1 Number (0-9)" />
                <ValidationItem passed={hasUpper} text="1 Uppercase" />
                <ValidationItem passed={hasLower} text="1 Lowercase" />
                <ValidationItem passed={hasSpecial} text="1 Special (@$!%...)" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-2">Biometrics</h2>
              <p className="text-neutral-400">Help AI tailor your nutrition.</p>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium text-neutral-400">Biological Sex</label>
              <div className="grid grid-cols-3 gap-3">
                <GenderCard 
                  active={data.gender === "male"} 
                  onClick={() => updateData({ gender: "male" })} 
                  icon="♂️" 
                  label="Male" 
                />
                <GenderCard 
                  active={data.gender === "female"} 
                  onClick={() => updateData({ gender: "female" })} 
                  icon="♀️" 
                  label="Female" 
                />
                <GenderCard 
                  active={data.gender === "other"} 
                  onClick={() => updateData({ gender: "other" })} 
                  icon="⚪" 
                  label="Other" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-medium text-neutral-400">Weight</label>
                <div className="relative">
                  <input
                    type="number"
                    min="20"
                    value={data.weight || ""}
                    onChange={(e) => updateData({ weight: e.target.value ? Number(e.target.value) : 0 })}
                    className="w-full pl-4 pr-12 py-4 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-emerald-500 outline-none text-lg font-medium"
                    placeholder="70"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-mono font-bold">KG</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-medium text-neutral-400">Height</label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    value={data.height || ""}
                    onChange={(e) => updateData({ height: e.target.value ? Number(e.target.value) : 0 })}
                    className="w-full pl-4 pr-12 py-4 bg-neutral-900 border border-neutral-800 rounded-xl focus:border-emerald-500 outline-none text-lg font-medium"
                    placeholder="175"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 font-mono font-bold">CM</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="font-heading text-3xl font-bold mb-2">Primary Goal</h2>
              <p className="text-neutral-400">How should AI evaluate your scans?</p>
            </div>

            <div className="flex flex-col gap-3">
              <GoalCard 
                active={data.dietaryGoal === "general"} 
                onClick={() => updateData({ dietaryGoal: "general" })}
                title="General / Balanced"
                desc="A well-rounded diet avoiding extreme restrictions."
                icon={<Target className="w-6 h-6" />}
              />
              <GoalCard 
                active={data.dietaryGoal === "high_protein"} 
                onClick={() => updateData({ dietaryGoal: "high_protein" })}
                title="High Protein"
                desc="Prioritizes protein-rich foods for muscle building."
                icon={<Dumbbell className="w-6 h-6" />}
              />
              <GoalCard 
                active={data.dietaryGoal === "keto"} 
                onClick={() => updateData({ dietaryGoal: "keto" })}
                title="Keto"
                desc="Low-carb, high-fat focus for maintaining ketosis."
                icon={<Droplet className="w-6 h-6" />}
              />
              <GoalCard 
                active={data.dietaryGoal === "diabetic"} 
                onClick={() => updateData({ dietaryGoal: "diabetic" })}
                title="Low Sugar (Diabetic)"
                desc="Minimizes sugar consumption for metabolic health."
                icon={<HeartPulse className="w-6 h-6" />}
              />
              <GoalCard 
                active={data.dietaryGoal === "low_sodium"} 
                onClick={() => updateData({ dietaryGoal: "low_sodium" })}
                title="Low Sodium"
                desc="Reduces sodium intake for improved heart health."
                icon={<Apple className="w-6 h-6" />}
              />
            </div>
          </div>
        )}
      </div>

      {/* Thumb Zone Controls */}
      <div className="fixed md:absolute bottom-0 left-0 right-0 p-6 bg-neutral-950/80 backdrop-blur-xl border-t border-neutral-900 md:border-none z-30">
        <div className="max-w-md mx-auto flex gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              disabled={loading}
              className="px-6 py-4 rounded-2xl bg-neutral-900 text-white font-semibold border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              Back
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={
              loading || 
              (step === 1 && !isStep1Valid) || 
              (step === 2 && !isStep2Valid) || 
              (step === 3 && !isStep3Valid)
            }
            className="flex-1 py-4 rounded-2xl font-bold bg-emerald-500 text-neutral-950 hover:bg-emerald-400 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:shadow-[0_0_40px_rgba(16,185,129,0.3)] disabled:shadow-none"
          >
            {loading ? "Processing..." : step === 3 ? "Launch EatHigh 🚀" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ValidationItem({ passed, text }: { passed: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-xs md:text-sm transition-colors duration-300 ${passed ? "text-emerald-400 font-medium" : "text-neutral-500"}`}>
      <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-colors ${passed ? "bg-emerald-500/20 border-emerald-500/50" : "bg-neutral-900 border-neutral-800"}`}>
        {passed && <Check className="w-3 h-3 text-emerald-400" />}
      </div>
      {text}
    </div>
  );
}

function GenderCard({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 ${
        active 
          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)] scale-[1.02]" 
          : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800 hover:border-neutral-700"
      }`}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </button>
  );
}

function GoalCard({ active, onClick, title, desc, icon }: { active: boolean; onClick: () => void; title: string; desc: string; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 text-left ${
        active 
          ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.01]" 
          : "bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-700"
      }`}
    >
      <div className={`mt-0.5 p-2 rounded-xl ${active ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-400"}`}>
        {icon}
      </div>
      <div>
        <h4 className={`font-bold text-lg mb-1 ${active ? "text-emerald-400" : "text-white"}`}>{title}</h4>
        <p className="text-sm text-neutral-400 leading-relaxed">{desc}</p>
      </div>
    </button>
  );
}
