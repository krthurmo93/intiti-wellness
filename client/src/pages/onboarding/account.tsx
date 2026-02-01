import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, User, UserPlus, LogIn, Sparkles } from "lucide-react";
import { 
  getOnboardingData, 
  saveUserProfile, 
  setOnboardingComplete, 
  saveCurrentElement,
  saveIntention,
  clearOnboardingData
} from "@/lib/storage";
import { fetchBirthChart, calculateSunSign } from "@/lib/astrology";
import { useElementTheme } from "@/lib/element-theme";
import type { UserProfile, Intention } from "@shared/schema";

export default function OnboardingAccount() {
  const [, setLocation] = useLocation();
  const { setElement: setThemeElement } = useElementTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const completeAsGuest = async () => {
    setIsProcessing(true);
    const data = getOnboardingData();
    
    if (!data?.name) {
      setLocation("/onboarding/name");
      return;
    }

    let sunSign, moonSign, risingSign, mercurySign, venusSign, marsSign;
    
    try {
      if (data.dateOfBirth) {
        const effectiveTime = data.birthTimeKnown && data.timeOfBirth ? data.timeOfBirth : "12:00";
        const effectiveCity = data.cityOfBirth || "New York";
        
        const chart = await fetchBirthChart(data.dateOfBirth, effectiveTime, effectiveCity);
        
        sunSign = chart.sun;
        moonSign = chart.moon;
        risingSign = data.birthTimeKnown && data.timeOfBirth ? chart.rising : undefined;
        mercurySign = chart.mercury;
        venusSign = chart.venus;
        marsSign = chart.mars;
      }
    } catch (error) {
      console.error("Error calculating birth chart:", error);
      if (data.dateOfBirth) {
        sunSign = calculateSunSign(data.dateOfBirth);
        moonSign = sunSign;
      }
    }
    
    const newProfile: UserProfile = {
      name: data.name,
      hasAstrologyProfile: !!data.dateOfBirth,
      dateOfBirth: data.dateOfBirth,
      timeOfBirth: data.birthTimeKnown ? data.timeOfBirth : undefined,
      cityOfBirth: data.cityOfBirth,
      birthTimeKnown: data.birthTimeKnown,
      sunSign,
      moonSign,
      risingSign,
      mercurySign,
      venusSign,
      marsSign,
      currentElement: data.currentElement || undefined,
    };
    
    saveUserProfile(newProfile);
    
    if (data.intention) {
      const intention: Intention = {
        id: crypto.randomUUID(),
        text: data.intention,
        timestamp: new Date().toISOString(),
        completed: false,
      };
      saveIntention(intention);
    }
    
    if (data.currentElement) {
      saveCurrentElement(data.currentElement);
      setThemeElement(data.currentElement);
    }
    
    setOnboardingComplete(true);
    clearOnboardingData();
    setIsProcessing(false);
    setLocation("/welcome");
  };

  const handleCreateAccount = () => {
    window.location.href = "/api/login";
  };

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950"
    >
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLocation("/onboarding/spiritual-style")}
          className="mb-8 text-violet-300"
          data-testid="button-back"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
            className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/30"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>

          <h2 
            className="font-serif text-3xl font-light text-white mb-3"
            data-testid="text-account-title"
          >
            Almost there
          </h2>
          <p className="text-violet-200 font-sans">
            Create an account to save your progress across devices, or continue as a guest.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="space-y-4"
        >
          <Card 
            className="hover-elevate cursor-pointer border-violet-500/30 bg-white/5"
            onClick={handleCreateAccount}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center border border-violet-500/30">
                <UserPlus className="w-6 h-6 text-violet-400" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-white" data-testid="text-create-account">
                  Create account
                </h3>
                <p className="text-sm text-violet-300">
                  Sync across devices and unlock all features
                </p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="hover-elevate cursor-pointer border-violet-500/20 bg-white/5"
            onClick={completeAsGuest}
          >
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-12 h-12 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
                <User className="w-6 h-6 text-violet-400" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-white" data-testid="text-guest">
                  {isProcessing ? "Setting up..." : "Continue as guest"}
                </h3>
                <p className="text-sm text-violet-300">
                  Data stored locally on this device
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <button
            onClick={handleSignIn}
            className="text-violet-400 font-medium flex items-center justify-center gap-2 mx-auto hover:underline"
            data-testid="link-sign-in"
          >
            <LogIn className="w-4 h-4" />
            Already have an account? Sign in
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
