import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";

interface TimeOfBirthStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: (birthTimeKnown: boolean) => void;
  onBack: () => void;
}

export function TimeOfBirthStep({ value, onChange, onNext, onBack }: TimeOfBirthStepProps) {
  const [notSure, setNotSure] = useState(false);
  
  const isValid = value.length > 0 || notSure;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (notSure) {
      onChange("");
      onNext(false);
    } else if (value.length > 0) {
      onNext(true);
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
            className="font-serif text-3xl md:text-4xl font-light text-stone-800 tracking-wide text-center mb-3"
            data-testid="text-time-title"
          >
            What time were you born?
          </h2>
          <p className="text-stone-500 text-center font-sans">
            Optional, but gives you the most accurate reading.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Input
              type="time"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              disabled={notSure}
              className={`h-14 text-lg text-center border-2 border-stone-200 rounded-xl bg-white/80 focus:border-amber-400 focus:ring-amber-400/20 ${notSure ? 'opacity-50' : ''}`}
              data-testid="input-time-of-birth"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center justify-center gap-2"
          >
            <Checkbox
              id="not-sure"
              checked={notSure}
              onCheckedChange={(checked) => setNotSure(checked === true)}
              data-testid="checkbox-not-sure"
            />
            <label 
              htmlFor="not-sure" 
              className="text-stone-500 text-sm cursor-pointer"
            >
              I&apos;m not sure
            </label>
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
                i === 4 ? "bg-amber-500 w-6" : "bg-stone-300"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
