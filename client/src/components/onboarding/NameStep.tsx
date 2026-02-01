import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";

interface NameStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function NameStep({ value, onChange, onNext, onBack }: NameStepProps) {
  const [touched, setTouched] = useState(false);
  const isValid = value.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onNext();
    } else {
      setTouched(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen flex flex-col items-center justify-center px-6 bg-gradient-to-b from-amber-50/80 via-stone-50 to-amber-50/60"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-12"
        >
          <h2 
            className="font-serif text-3xl md:text-4xl font-light text-stone-800 mb-3 tracking-wide text-center"
            data-testid="text-name-title"
          >
            What shall we call you?
          </h2>
          <p className="text-stone-500 text-center font-sans">
            Your name or nickname, however you like to be known.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Input
              type="text"
              placeholder="Enter your name"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={() => setTouched(true)}
              className="h-14 text-lg text-center border-2 border-stone-200 rounded-xl bg-white/80 focus:border-amber-400 focus:ring-amber-400/20 placeholder:text-stone-400"
              data-testid="input-name"
              autoFocus
            />
            {touched && !isValid && (
              <p className="text-sm text-red-500 mt-2 text-center">Please enter your name</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-between items-center pt-4"
          >
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="text-stone-500"
              data-testid="button-back"
            >
              Back
            </Button>

            <Button
              type="submit"
              disabled={!isValid}
              className="px-8 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium shadow-md disabled:opacity-50"
              data-testid="button-next"
            >
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </form>

        <div className="flex justify-center mt-12 gap-2">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === 1 ? "bg-amber-500 w-6" : "bg-stone-300"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
