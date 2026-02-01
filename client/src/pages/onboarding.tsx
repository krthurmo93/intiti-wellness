import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    setLocation("/onboarding/welcome");
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-100 to-stone-50">
      <div className="text-stone-400">Redirecting...</div>
    </div>
  );
}
