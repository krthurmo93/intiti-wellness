import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Settings as SettingsIcon, 
  Palette, 
  Calendar, 
  Shield, 
  FileText, 
  Trash2,
  ChevronRight,
  Edit3,
  CheckCircle,
  User as UserIcon,
  LogIn,
  LogOut,
  FlaskConical,
  Zap,
  Stars,
  Sparkles
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useElementTheme } from "@/lib/element-theme";
import { isGoldenDawnActive, getGoldenDawnCardStyle, getGoldenDawnCardClasses, getGoldenDawnBackgroundClasses } from "@/lib/golden-dawn-styles";
import { useAuth } from "@/hooks/useAuth";
import { 
  getUserProfile, 
  clearAllData, 
  setOnboardingComplete,
  getBetaFeaturesEnabled,
  setBetaFeaturesEnabled,
  getSpiritualStyle,
  saveSpiritualStyle
} from "@/lib/storage";
import { spiritualStyles, spiritualStyleLabels, spiritualStyleDescriptions, type UserProfile, type SpiritualStyle } from "@shared/schema";
import { ElementSelector } from "@/components/ElementSelector";
import { EditBirthDataDialog } from "@/components/EditBirthDataDialog";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const [, setLocation] = useLocation();
  const { colors, element } = useElementTheme();
  const isGoldenDawn = isGoldenDawnActive(element);
  const gdCardClasses = getGoldenDawnCardClasses(element);
  const { toast } = useToast();
  const { user: authUser, isAuthenticated, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditBirthData, setShowEditBirthData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [betaEnabled, setBetaEnabled] = useState(() => getBetaFeaturesEnabled());
  const [spiritualStyle, setSpiritualStyleState] = useState<SpiritualStyle>(() => getSpiritualStyle());

  useEffect(() => {
    const loadedProfile = getUserProfile();
    if (!loadedProfile) {
      setLocation("/onboarding");
      return;
    }
    setProfile(loadedProfile);
    setIsLoading(false);
    
  }, [setLocation]);

  if (isLoading || !profile) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-b ${colors.gradient}`}>
        <div style={{ color: colors.textMuted }}>Loading...</div>
      </div>
    );
  }

  const handleDeleteAccount = () => {
    clearAllData();
    setOnboardingComplete(false);
    setLocation("/onboarding");
  };

  const bgClasses = getGoldenDawnBackgroundClasses(element);

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b ${colors.gradient} transition-colors duration-500 ${bgClasses}`}
      style={isGoldenDawn ? { background: `linear-gradient(to bottom, #FFE7B3, #EFA045, #E2755B)` } : {}}
    >
      <div className={`${colors.overlay} min-h-screen transition-colors duration-500`}>
        <div className="max-w-2xl mx-auto px-4 py-8 pb-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: colors.isDark ? 'linear-gradient(to bottom right, #7c3aed, #8b5cf6)' : 'linear-gradient(to bottom right, #57534e, #44403c)' }}
            >
              <SettingsIcon className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-serif text-3xl font-light" style={{ color: colors.textPrimary }}>Settings</h1>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <Card 
                className={`p-6 backdrop-blur-sm ${gdCardClasses} ${isGoldenDawn ? "border border-[#FAD792]/35" : ""}`}
                style={getGoldenDawnCardStyle(colors, element)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <UserIcon className={colors.isDark ? "w-5 h-5 text-purple-400" : "w-5 h-5 text-purple-600"} />
                  <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>Account</h3>
                </div>
                {!authLoading && isAuthenticated && authUser ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage 
                          src={authUser.profileImageUrl || undefined} 
                          alt={authUser.firstName || profile?.name || "User"} 
                          className="object-cover"
                        />
                        <AvatarFallback style={{ backgroundColor: colors.accent }}>
                          {(authUser.firstName || profile?.name || "U")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium" style={{ color: colors.textPrimary }}>
                          {authUser.firstName && authUser.lastName 
                            ? `${authUser.firstName} ${authUser.lastName}` 
                            : profile?.name || "User"}
                        </p>
                        {authUser.email && (
                          <p className="text-sm" style={{ color: colors.textMuted }}>{authUser.email}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Your data is synced across devices</span>
                    </div>
                    <button 
                      className="w-full flex items-center justify-center gap-2 transition-colors duration-200"
                      onClick={() => window.location.href = "/api/logout"}
                      data-testid="button-logout"
                      style={{
                        background: colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                        border: colors.isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.12)',
                        borderRadius: '16px',
                        padding: '12px 20px',
                        color: colors.isDark ? '#E2D7FF' : '#4a4a6a',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = colors.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = colors.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
                      }}
                    >
                      <LogOut className="w-4 h-4" style={{ color: colors.isDark ? '#E2D7FF' : '#4a4a6a' }} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Sign in to save your progress and access your data from any device.
                    </p>
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-500"
                      onClick={() => window.location.href = "/api/login"}
                      data-testid="button-login"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </div>
                )}
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card 
                className={`p-6 backdrop-blur-sm ${gdCardClasses} ${isGoldenDawn ? "border border-[#FAD792]/35" : ""}`}
                style={getGoldenDawnCardStyle(colors, element)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Palette className={colors.isDark ? "w-5 h-5 text-amber-400" : "w-5 h-5 text-amber-600"} />
                  <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>Element Theme</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                  Choose your elemental vibe to personalize your experience.
                </p>
                <ElementSelector />
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <Card 
                className={`p-6 backdrop-blur-sm ${gdCardClasses} ${isGoldenDawn ? "border border-[#FAD792]/35" : ""}`}
                style={getGoldenDawnCardStyle(colors, element)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className={colors.isDark ? "w-5 h-5 text-fuchsia-400" : "w-5 h-5 text-fuchsia-600"} />
                  <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>Interpretation Style</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                  Choose how you receive your energy insights.
                </p>
                <div className="space-y-2">
                  {spiritualStyles.map((style) => {
                    const isSelected = spiritualStyle === style;
                    const IconComponent = style === "archetype" ? Sparkles : style === "energy" ? Zap : Stars;
                    return (
                      <button
                        key={style}
                        onClick={() => {
                          setSpiritualStyleState(style);
                          saveSpiritualStyle(style);
                          toast({
                            title: `${spiritualStyleLabels[style]} activated`,
                            description: spiritualStyleDescriptions[style],
                          });
                        }}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 border ${
                          isSelected
                            ? colors.isDark 
                              ? "bg-violet-500/20 border-violet-400" 
                              : "bg-violet-100 border-violet-400"
                            : colors.isDark
                              ? "bg-white/5 border-white/10 hover-elevate"
                              : "bg-stone-100 border-stone-200 hover-elevate"
                        }`}
                        data-testid={`button-style-${style}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isSelected 
                              ? "bg-gradient-to-br from-violet-500 to-fuchsia-500" 
                              : colors.isDark ? "bg-violet-500/20" : "bg-violet-100"
                          }`}>
                            <IconComponent className={`w-4 h-4 ${isSelected ? "text-white" : colors.isDark ? "text-violet-400" : "text-violet-600"}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${isSelected ? (colors.isDark ? "text-white" : "text-stone-900") : (colors.isDark ? "text-violet-100" : "text-stone-700")}`}>
                              {spiritualStyleLabels[style]}
                            </h4>
                            <p className="text-xs" style={{ color: colors.textMuted }}>
                              {spiritualStyleDescriptions[style]}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card 
                className={`p-6 backdrop-blur-sm ${gdCardClasses} ${isGoldenDawn ? "border border-[#FAD792]/35" : ""}`}
                style={getGoldenDawnCardStyle(colors, element)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className={colors.isDark ? "w-5 h-5 text-indigo-400" : "w-5 h-5 text-indigo-600"} />
                    <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>Birth Data</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowEditBirthData(true)}
                    data-testid="button-edit-birth-data"
                  >
                    <Edit3 className="w-4 h-4" style={{ color: colors.textMuted }} />
                  </Button>
                </div>
                {profile.hasAstrologyProfile ? (
                  <div className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
                    <p><span style={{ color: colors.textMuted }}>Date:</span> {profile.dateOfBirth || "Not set"}</p>
                    <p><span style={{ color: colors.textMuted }}>Time:</span> {profile.birthTimeKnown ? profile.timeOfBirth : "Not provided"}</p>
                    <p><span style={{ color: colors.textMuted }}>City:</span> {profile.cityOfBirth || "Not set"}</p>
                    <p className="pt-2">
                      <span style={{ color: colors.textMuted }}>Sun:</span> {profile.sunSign} | 
                      <span style={{ color: colors.textMuted }} className="ml-2">Moon:</span> {profile.moonSign}
                      {profile.risingSign && (
                        <><span style={{ color: colors.textMuted }} className="ml-2">| Rising:</span> {profile.risingSign}</>
                      )}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                    You haven't set up your birth chart yet. Add your birth info for personalized astrological insights.
                  </p>
                )}
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => setShowEditBirthData(true)}
                  style={{ 
                    color: colors.isDark ? '#a78bfa' : '#7c3aed',
                    borderColor: colors.isDark ? 'rgba(167, 139, 250, 0.4)' : 'rgba(124, 58, 237, 0.3)'
                  }}
                  data-testid="button-setup-birth-chart"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  <span>{profile.hasAstrologyProfile ? "Edit Birth Data" : "Set Up Birth Chart"}</span>
                </Button>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <Card 
                className={`p-6 backdrop-blur-sm ${gdCardClasses} ${isGoldenDawn ? "border border-[#FAD792]/35" : ""}`}
                style={getGoldenDawnCardStyle(colors, element)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <FlaskConical className={colors.isDark ? "w-5 h-5 text-purple-400" : "w-5 h-5 text-purple-600"} />
                  <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>Labs</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label 
                      htmlFor="beta-toggle" 
                      className="text-sm font-medium cursor-pointer"
                      style={{ color: colors.textSecondary }}
                    >
                      Enable beta features
                    </Label>
                    <p className="text-xs mt-1" style={{ color: colors.textMuted }}>
                      Test upcoming features before they launch
                    </p>
                  </div>
                  <Switch
                    id="beta-toggle"
                    checked={betaEnabled}
                    onCheckedChange={(checked) => {
                      setBetaEnabled(checked);
                      setBetaFeaturesEnabled(checked);
                      toast({
                        title: checked ? "Beta features enabled" : "Beta features disabled",
                        description: checked 
                          ? "You can now access beta features from the Coming Soon section." 
                          : "Beta features have been turned off.",
                      });
                    }}
                    data-testid="switch-beta-features"
                  />
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card 
                className={`p-6 backdrop-blur-sm ${gdCardClasses} ${isGoldenDawn ? "border border-[#FAD792]/35" : ""}`}
                style={getGoldenDawnCardStyle(colors, element)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className={colors.isDark ? "w-5 h-5 text-blue-400" : "w-5 h-5 text-blue-600"} />
                  <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>Legal</h3>
                </div>
                <div className="space-y-2">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between"
                    style={{ color: colors.textSecondary }}
                    onClick={() => setLocation("/privacy-policy")}
                    data-testid="button-privacy-policy"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Privacy Policy</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between"
                    style={{ color: colors.textSecondary }}
                    data-testid="button-terms"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>Terms of Service</span>
                    </div>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card 
                className={`p-6 backdrop-blur-sm ${gdCardClasses} ${isGoldenDawn ? "border border-[#FAD792]/35" : ""}`}
                style={getGoldenDawnCardStyle(colors, element)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Trash2 className={colors.isDark ? "w-5 h-5 text-red-400" : "w-5 h-5 text-red-500"} />
                  <h3 className="font-sans font-semibold" style={{ color: colors.textPrimary }}>Danger Zone</h3>
                </div>
                <p className="text-sm mb-4" style={{ color: colors.textSecondary }}>
                  Deleting your account will remove all your data permanently. This action cannot be undone.
                </p>
                {!showDeleteConfirm ? (
                  <Button 
                    variant="outline"
                    className={`w-full ${colors.isDark ? 'border-red-500/50 text-red-400' : 'border-red-200 text-red-600'}`}
                    onClick={() => setShowDeleteConfirm(true)}
                    data-testid="button-delete-account"
                  >
                    Delete Account
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <p className={`text-sm font-medium ${colors.isDark ? 'text-red-400' : 'text-red-600'}`}>Are you sure? This cannot be undone.</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1"
                        onClick={() => setShowDeleteConfirm(false)}
                        data-testid="button-cancel-delete"
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-red-600 text-white"
                        onClick={handleDeleteAccount}
                        data-testid="button-confirm-delete"
                      >
                        Yes, Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <EditBirthDataDialog 
        open={showEditBirthData} 
        onOpenChange={setShowEditBirthData}
        onSave={(updatedProfile) => setProfile(updatedProfile)}
      />
    </div>
  );
}
