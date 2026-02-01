import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, Clock, MapPin, Save, X, Loader2 } from "lucide-react";
import { getUserProfile, saveUserProfile } from "@/lib/storage";
import { fetchBirthChart, calculateSunSign } from "@/lib/astrology";
import type { UserProfile } from "@shared/schema";

interface EditBirthDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (profile: UserProfile) => void;
}

export function EditBirthDataDialog({ open, onOpenChange, onSave }: EditBirthDataDialogProps) {
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [timeOfBirth, setTimeOfBirth] = useState("");
  const [cityOfBirth, setCityOfBirth] = useState("");
  const [birthTimeKnown, setBirthTimeKnown] = useState(true);
  const [hasAstrologyProfile, setHasAstrologyProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      const profile = getUserProfile();
      if (profile) {
        setDateOfBirth(profile.dateOfBirth || "");
        setTimeOfBirth(profile.timeOfBirth || "");
        setCityOfBirth(profile.cityOfBirth || "");
        setBirthTimeKnown(profile.birthTimeKnown ?? true);
        setHasAstrologyProfile(profile.hasAstrologyProfile ?? false);
      }
    }
  }, [open]);

  const handleSave = async () => {
    const currentProfile = getUserProfile();
    if (!currentProfile) return;

    const willHaveAstrology = dateOfBirth.length > 0;

    if (!willHaveAstrology) {
      const updatedProfile: UserProfile = {
        ...currentProfile,
        hasAstrologyProfile: false,
        dateOfBirth: undefined,
        timeOfBirth: undefined,
        cityOfBirth: undefined,
        birthTimeKnown: undefined,
        sunSign: undefined,
        moonSign: undefined,
        risingSign: undefined,
      };
      saveUserProfile(updatedProfile);
      onSave?.(updatedProfile);
      onOpenChange(false);
      return;
    }

    setIsLoading(true);

    try {
      const effectiveTime = birthTimeKnown && timeOfBirth ? timeOfBirth : "12:00";
      const effectiveCity = cityOfBirth || "New York";
      
      const chart = await fetchBirthChart(dateOfBirth, effectiveTime, effectiveCity);

      const updatedProfile: UserProfile = {
        ...currentProfile,
        hasAstrologyProfile: true,
        dateOfBirth,
        timeOfBirth: birthTimeKnown ? timeOfBirth : undefined,
        cityOfBirth,
        birthTimeKnown,
        sunSign: chart.sun,
        moonSign: chart.moon,
        risingSign: birthTimeKnown && timeOfBirth ? chart.rising : undefined,
      };

      saveUserProfile(updatedProfile);
      onSave?.(updatedProfile);
      onOpenChange(false);
    } catch (error) {
      console.error("Error calculating birth chart:", error);
      const sunSign = calculateSunSign(dateOfBirth);
      
      const updatedProfile: UserProfile = {
        ...currentProfile,
        hasAstrologyProfile: true,
        dateOfBirth,
        timeOfBirth: birthTimeKnown ? timeOfBirth : undefined,
        cityOfBirth,
        birthTimeKnown,
        sunSign,
        moonSign: sunSign,
        risingSign: undefined,
      };

      saveUserProfile(updatedProfile);
      onSave?.(updatedProfile);
      onOpenChange(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearBirthData = () => {
    const currentProfile = getUserProfile();
    if (!currentProfile) return;

    const updatedProfile: UserProfile = {
      ...currentProfile,
      hasAstrologyProfile: false,
      dateOfBirth: undefined,
      timeOfBirth: undefined,
      cityOfBirth: undefined,
      birthTimeKnown: undefined,
      sunSign: undefined,
      moonSign: undefined,
      risingSign: undefined,
    };

    saveUserProfile(updatedProfile);
    onSave?.(updatedProfile);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Edit Birth Data
          </DialogTitle>
          <DialogDescription>
            Update your birth information to recalculate your astrological signs.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth" className="flex items-center gap-2 text-stone-700">
              <Calendar className="w-4 h-4" />
              Date of Birth
            </Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="bg-white"
              data-testid="input-birth-date"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="birthTimeKnown" className="flex items-center gap-2 text-stone-700">
                <Clock className="w-4 h-4" />
                I know my exact birth time
              </Label>
              <Switch
                id="birthTimeKnown"
                checked={birthTimeKnown}
                onCheckedChange={setBirthTimeKnown}
                data-testid="switch-time-known"
              />
            </div>
            
            {birthTimeKnown && (
              <Input
                type="time"
                value={timeOfBirth}
                onChange={(e) => setTimeOfBirth(e.target.value)}
                className="bg-white"
                placeholder="HH:MM"
                data-testid="input-birth-time"
              />
            )}
            {!birthTimeKnown && (
              <p className="text-xs text-stone-500">
                Without exact time, we'll use noon for moon sign calculation. Rising sign requires exact time.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cityOfBirth" className="flex items-center gap-2 text-stone-700">
              <MapPin className="w-4 h-4" />
              City of Birth
            </Label>
            <Input
              id="cityOfBirth"
              type="text"
              value={cityOfBirth}
              onChange={(e) => setCityOfBirth(e.target.value)}
              className="bg-white"
              placeholder="e.g., New York, London, Tokyo"
              data-testid="input-birth-city"
            />
            <p className="text-xs text-stone-500">
              Used to calculate your rising sign more accurately.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button 
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500"
            data-testid="button-save-birth-data"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Birth Data
              </>
            )}
          </Button>
          
          {(hasAstrologyProfile || dateOfBirth) && (
            <Button 
              variant="outline"
              onClick={handleClearBirthData}
              className="w-full text-stone-500"
              data-testid="button-clear-birth-data"
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Clear Birth Data
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
