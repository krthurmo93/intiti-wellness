import { useState, useEffect } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ElementThemeProvider } from "@/lib/element-theme";
import { BottomNav } from "@/components/BottomNav";
import { isOnboardingComplete, hasSeenWelcome, getUserProfile, getOnboardingData, setOnboardingComplete, ensureFullChart } from "@/lib/storage";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import MoonPage from "@/pages/moon";
import ChartPage from "@/pages/chart";
import SettingsPage from "@/pages/settings";
import EnergyWall from "@/pages/energy-wall";
import Landing from "@/pages/landing";
import SynastryBeta from "@/pages/synastry-beta";
import TransitsBeta from "@/pages/transits-beta";
import DreamJournalBeta from "@/pages/dream-journal-beta";
import SubliminalsPage from "@/pages/subliminals";
import SubliminalsHistoryPage from "@/pages/subliminals-history";
import EmotionalTimeline from "@/pages/emotional-timeline";
import MirrorWork from "@/pages/mirror-work";
import Presence from "@/pages/presence";
import PrivacyPolicy from "@/pages/privacy-policy";
import WelcomeScreen from "@/pages/welcome-screen";
import OnboardingWelcome from "@/pages/onboarding/welcome";
import OnboardingName from "@/pages/onboarding/name";
import OnboardingBirth from "@/pages/onboarding/birth";
import OnboardingIntention from "@/pages/onboarding/intention";
import OnboardingSpiritualStyle from "@/pages/onboarding/spiritual-style";
import OnboardingAccount from "@/pages/onboarding/account";
import Onboarding from "@/pages/onboarding";

function ProtectedRoute({ component: Component }: { component: () => JSX.Element }) {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [welcomeSeen, setWelcomeSeen] = useState(false);
  const [hasPendingOnboardingData, setHasPendingOnboardingData] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      const pendingData = getOnboardingData();
      const hasPending = !!pendingData?.name;
      setHasPendingOnboardingData(hasPending);

      if (isAuthenticated && user) {
        const hasProfile = user.name || user.sunSign || user.hasAstrologyProfile;
        if (hasPending) {
          setOnboardingDone(true);
        } else {
          setOnboardingDone(!!hasProfile || isOnboardingComplete());
        }
      } else {
        setOnboardingDone(isOnboardingComplete());
      }
      setWelcomeSeen(hasSeenWelcome());
      setIsChecking(false);
    }
  }, [authLoading, isAuthenticated, user]);

  if (authLoading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="text-stone-400">Loading...</div>
      </div>
    );
  }
  
  if (!onboardingDone) {
    return <Redirect to="/onboarding/welcome" />;
  }

  if (!welcomeSeen || hasPendingOnboardingData) {
    return <Redirect to="/welcome" />;
  }
  
  return <Component />;
}

function Router() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [welcomeSeen, setWelcomeSeen] = useState(false);
  const [localChecked, setLocalChecked] = useState(false);
  const [hasPendingData, setHasPendingData] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      const pendingData = getOnboardingData();
      const hasPending = !!pendingData?.name;
      setHasPendingData(hasPending);

      if (isAuthenticated && user) {
        const hasProfile = user.name || user.sunSign || user.hasAstrologyProfile;
        if (hasPending) {
          setOnboardingDone(true);
        } else {
          setOnboardingDone(!!hasProfile || isOnboardingComplete());
        }
      } else {
        setOnboardingDone(isOnboardingComplete());
      }
      setWelcomeSeen(hasSeenWelcome());
      setLocalChecked(true);
      
      // Migrate existing profiles to include full birth chart data
      // This backfills Mercury, Venus, Mars, Jupiter, Saturn, Nodes for old accounts
      const localProfile = getUserProfile();
      if (localProfile?.hasAstrologyProfile && localProfile?.dateOfBirth) {
        ensureFullChart();
      }
    }
  }, [location, authLoading, isAuthenticated, user]);

  const isOnboardingRoute = location.startsWith("/onboarding");
  const isWelcomeRoute = location === "/welcome";
  const showNav = onboardingDone && welcomeSeen && !hasPendingData && !isOnboardingRoute && !isWelcomeRoute;

  if (authLoading || !localChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-stone-100 to-stone-50">
        <div className="text-stone-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Switch>
        <Route path="/onboarding" component={Onboarding} />
        <Route path="/onboarding/welcome" component={OnboardingWelcome} />
        <Route path="/onboarding/name" component={OnboardingName} />
        <Route path="/onboarding/birth" component={OnboardingBirth} />
        <Route path="/onboarding/intention" component={OnboardingIntention} />
        <Route path="/onboarding/spiritual-style" component={OnboardingSpiritualStyle} />
        <Route path="/onboarding/account" component={OnboardingAccount} />
        <Route path="/welcome" component={WelcomeScreen} />
        <Route path="/">
          {!isAuthenticated && !onboardingDone ? (
            <Landing />
          ) : !onboardingDone ? (
            <Redirect to="/onboarding/welcome" />
          ) : (!welcomeSeen || hasPendingData) ? (
            <Redirect to="/welcome" />
          ) : (
            <ProtectedRoute component={Home} />
          )}
        </Route>
        <Route path="/moon">
          <ProtectedRoute component={MoonPage} />
        </Route>
        <Route path="/chart">
          <ProtectedRoute component={ChartPage} />
        </Route>
        <Route path="/settings">
          <ProtectedRoute component={SettingsPage} />
        </Route>
        <Route path="/energy-wall">
          <ProtectedRoute component={EnergyWall} />
        </Route>
        <Route path="/synastry-beta">
          <ProtectedRoute component={SynastryBeta} />
        </Route>
        <Route path="/transits-beta">
          <ProtectedRoute component={TransitsBeta} />
        </Route>
        <Route path="/dream-journal-beta">
          <ProtectedRoute component={DreamJournalBeta} />
        </Route>
        <Route path="/subliminals">
          <ProtectedRoute component={SubliminalsPage} />
        </Route>
        <Route path="/subliminals/history">
          <ProtectedRoute component={SubliminalsHistoryPage} />
        </Route>
        <Route path="/emotional-timeline">
          <ProtectedRoute component={EmotionalTimeline} />
        </Route>
        <Route path="/mirror-work">
          <ProtectedRoute component={MirrorWork} />
        </Route>
        <Route path="/presence">
          <ProtectedRoute component={Presence} />
        </Route>
        <Route path="/privacy-policy">
          <ProtectedRoute component={PrivacyPolicy} />
        </Route>
        <Route component={NotFound} />
      </Switch>
      {showNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ElementThemeProvider>
          <Toaster />
          <Router />
        </ElementThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
