import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTextToSpeech } from "@/hooks/use-speech";
import { isGoldenDawnActive } from "@/lib/golden-dawn-styles";
import { GoldenDawnTheme } from "@/lib/golden-dawn-theme";
import type { CSSProperties } from "react";

interface TextToSpeechButtonProps {
  text: string;
  element?: string | null;
  className?: string;
  size?: "sm" | "default" | "icon";
  disabled?: boolean;
  testId?: string;
}

export function TextToSpeechButton({ 
  text, 
  element,
  className = "",
  size = "icon",
  disabled = false,
  testId = "button-text-to-speech",
}: TextToSpeechButtonProps) {
  const { isSpeaking, isSupported, toggle } = useTextToSpeech();

  if (!isSupported || !text?.trim()) return null;

  const isGoldenDawn = isGoldenDawnActive(element ?? null);
  
  const handleClick = () => {
    window.speechSynthesis.cancel();
    toggle(text);
  };

  const buttonStyle: CSSProperties = isGoldenDawn
    ? {
        background: isSpeaking 
          ? GoldenDawnTheme.buttons.primary.background
          : "rgba(244, 201, 139, 0.3)",
        color: GoldenDawnTheme.text.primary,
        borderColor: GoldenDawnTheme.borders.gold,
      }
    : {};

  return (
    <Button
      type="button"
      variant={isSpeaking ? "default" : "ghost"}
      size={size}
      onClick={handleClick}
      disabled={disabled}
      className={`${isSpeaking ? "animate-pulse" : ""} ${className}`}
      style={buttonStyle}
      data-testid={testId}
      title={isSpeaking ? "Stop reading" : "Read aloud"}
    >
      {isSpeaking ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </Button>
  );
}
