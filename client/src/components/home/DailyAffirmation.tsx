import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { getUserProfile, incrementAffirmationUsage } from "@/lib/storage";
import { useElementTheme } from "@/lib/element-theme";
import { Skeleton } from "@/components/ui/skeleton";
import { isGoldenDawnActive, getGoldenDawnCardStyle, getGoldenDawnIconStyle, getGoldenDawnAccentColor, getGoldenDawnCardClasses, getGoldenDawnTextColors } from "@/lib/golden-dawn-styles";
import { GoldenDawnTheme } from "@/lib/golden-dawn-theme";
import { TextToSpeechButton } from "@/components/speech-buttons";
import type { AffirmationResponse } from "@shared/schema";

export function DailyAffirmation() {
  const profile = getUserProfile();
  const { element, colors } = useElementTheme();
  const [currentAffirmation, setCurrentAffirmation] = useState<string | null>(null);

  const hasAstrologyProfile = profile?.hasAstrologyProfile && profile?.sunSign && profile?.moonSign;

  const affirmationQuery = useQuery<AffirmationResponse>({
    queryKey: ['/api/affirmation', hasAstrologyProfile ? profile?.sunSign : null, hasAstrologyProfile ? profile?.moonSign : null, element],
    queryFn: async () => {
      if (!element) return { affirmation: "" };
      const params = new URLSearchParams({ element });
      if (hasAstrologyProfile && profile?.sunSign && profile?.moonSign) {
        params.append('sunSign', profile.sunSign);
        params.append('moonSign', profile.moonSign);
      }
      const res = await fetch(`/api/affirmation?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch affirmation");
      return res.json();
    },
    enabled: !!element,
  });

  const refreshMutation = useMutation({
    mutationFn: async () => {
      if (!element) return null;
      
      incrementAffirmationUsage();
      
      const body: Record<string, string> = { element };
      if (hasAstrologyProfile && profile?.sunSign && profile?.moonSign) {
        body.sunSign = profile.sunSign;
        body.moonSign = profile.moonSign;
      }
      const response = await apiRequest('POST', '/api/affirmation', body);
      return response.json();
    },
    onSuccess: (data) => {
      if (data?.affirmation) {
        setCurrentAffirmation(data.affirmation);
        queryClient.invalidateQueries({ queryKey: ['/api/affirmation'] });
      }
    },
  });

  useEffect(() => {
    if (affirmationQuery.data?.affirmation) {
      setCurrentAffirmation(affirmationQuery.data.affirmation);
    }
  }, [affirmationQuery.data]);

  const handleRefresh = () => {
    refreshMutation.mutate();
  };

  const isLoading = affirmationQuery.isLoading || refreshMutation.isPending;
  const displayAffirmation = currentAffirmation || affirmationQuery.data?.affirmation;

  const isGoldenDawn = isGoldenDawnActive(element);
  const cardClasses = getGoldenDawnCardClasses(element);
  const gdTextColors = getGoldenDawnTextColors(element);

  if (!element) {
    return (
      <Card 
        className={`p-6 md:p-8 border ${isGoldenDawn ? "border-[#FAD792]/35" : ""} ${cardClasses}`}
        style={getGoldenDawnCardStyle(colors, element)}
      >
        <div className="flex items-center gap-3 mb-4">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: colors.isDark
                ? 'radial-gradient(circle at 30% 20%, #c084fc 0%, #a855f7 60%, #581c87 100%)'
                : 'radial-gradient(circle at 30% 20%, #fcd34d 0%, #f59e0b 60%, #92400e 100%)'
            }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-sans font-semibold text-lg" style={{ color: colors.textPrimary }}>Daily Affirmation</h3>
        </div>
        <p className="text-center py-4 font-serif italic" style={{ color: colors.textMuted }}>
          Select your element above to receive your personalized affirmation
        </p>
      </Card>
    );
  }

  return (
    <Card 
      className={`p-6 md:p-8 border ${isGoldenDawn ? "border-[#FAD792]/35" : ""} ${cardClasses}`}
      style={getGoldenDawnCardStyle(colors, element)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={isGoldenDawn 
              ? { background: `linear-gradient(135deg, ${GoldenDawnTheme.primary.gold}, ${GoldenDawnTheme.primary.deepOrange})` }
              : getGoldenDawnIconStyle(colors, element)}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 
              className="font-sans font-semibold text-lg" 
              style={{ color: gdTextColors?.primary || colors.textPrimary }}
            >
              Daily Affirmation
            </h3>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRefresh}
          disabled={isLoading}
          style={{ color: isGoldenDawn ? GoldenDawnTheme.icons.tint : colors.textMuted }}
          data-testid="button-refresh-affirmation"
          aria-label="Refresh affirmation"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="relative py-4">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5 mx-auto" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <div>
                  <span 
                    className="text-3xl font-serif"
                    style={{ color: isGoldenDawn ? GoldenDawnTheme.icons.active : getGoldenDawnAccentColor(colors, element) }}
                  >&ldquo;</span>
                  <p 
                    className="font-serif text-lg md:text-xl italic leading-relaxed inline"
                    style={{ color: gdTextColors?.secondary || colors.textSecondary }}
                    data-testid="text-affirmation"
                  >
                    {displayAffirmation || "Your personalized affirmation is being created..."}
                  </p>
                  <span 
                    className="text-3xl font-serif"
                    style={{ color: isGoldenDawn ? GoldenDawnTheme.icons.active : getGoldenDawnAccentColor(colors, element) }}
                  >&rdquo;</span>
                </div>
                {displayAffirmation && (
                  <TextToSpeechButton
                    text={displayAffirmation}
                    element={element}
                    testId="button-tts-affirmation"
                  />
                )}
              </div>
            </motion.div>
          )}
        </div>
    </Card>
  );
}
