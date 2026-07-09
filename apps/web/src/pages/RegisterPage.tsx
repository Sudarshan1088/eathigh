import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import OnboardingWizard, { type OnboardingData } from "../components/OnboardingWizard";
import type { RegisterBody } from "@eathigh/shared";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: OnboardingData) => {
    setLoading(true);
    setError(null);

    // Cast and validate.
    const payload: RegisterBody = {
      name: data.name,
      email: data.email,
      password: data.password,
      gender: data.gender as 'male' | 'female' | 'other',
      weight: data.weight as number,
      height: data.height as number,
      dietaryGoal: data.dietaryGoal,
    };

    const err = await register(payload);

    if (err) {
      setError(err);
      setLoading(false);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-neutral-950 w-full">
      {error && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-md z-50 px-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium text-center shadow-2xl backdrop-blur-md">
            {error}
          </div>
        </div>
      )}
      <OnboardingWizard onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
