import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Sun, Heart } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-violet-950 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-violet-400">
              <Sun className="w-5 h-5" />
              <Moon className="w-5 h-5" />
              <Sparkles className="w-5 h-5" />
            </div>
            
            <h1 className="font-serif text-4xl text-white leading-tight">
              Welcome to Intiti
            </h1>
            
            <p className="text-violet-200 text-lg leading-relaxed">
              Your personalized sanctuary for daily wellness, mindful reflection, and cosmic guidance.
            </p>
          </div>

          <div className="space-y-4 py-6">
            <div className="flex items-center gap-3 text-violet-200">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Sun className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-left">Daily affirmations tailored to your energy</span>
            </div>
            
            <div className="flex items-center gap-3 text-violet-200">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Moon className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-left">Moon phase insights and guidance</span>
            </div>
            
            <div className="flex items-center gap-3 text-violet-200">
              <div className="w-10 h-10 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center">
                <Heart className="w-5 h-5 text-violet-400" />
              </div>
              <span className="text-left">Mood tracking and breathwork exercises</span>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Button
              data-testid="link-start-setup"
              onClick={() => window.location.href = "/onboarding/welcome"}
              className="w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white py-6 text-lg font-medium shadow-md shadow-violet-500/30"
            >
              Get Started
            </Button>
            
            <Button
              data-testid="button-login"
              onClick={() => window.location.href = "/api/login"}
              variant="outline"
              className="w-full py-6 text-lg font-medium border-violet-500/30 text-violet-200 bg-white/5"
            >
              I already have an account
            </Button>
            
            <p className="text-violet-400/70 text-sm pt-2">
              Create a free account or sign in to save your progress across devices.
            </p>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-violet-400/50 text-sm">
        <p>Created with intention and care</p>
      </footer>
    </div>
  );
}
