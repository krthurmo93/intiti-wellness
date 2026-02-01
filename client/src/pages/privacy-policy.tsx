import { motion } from "framer-motion";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useElementTheme } from "@/lib/element-theme";
import { getGoldenDawnBackgroundClasses } from "@/lib/golden-dawn-styles";
import { canAccessGoldenDawn } from "@/lib/storage";

export default function PrivacyPolicy() {
  const { colors, element } = useElementTheme();
  const isGoldenDawn = element === "golden_dawn" && canAccessGoldenDawn();
  const bgClasses = getGoldenDawnBackgroundClasses(element);

  return (
    <div 
      className={`min-h-screen bg-gradient-to-b ${colors.gradient} transition-colors duration-500 relative ${bgClasses}`}
      style={isGoldenDawn ? { background: `linear-gradient(to bottom, #FFE7B3, #EFA045, #E2755B)` } : {}}
    >
      <div className={`${colors.overlay} min-h-screen transition-colors duration-500 relative z-10`}>
        <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
          <div className="flex items-center justify-between mb-6">
            <Link href="/settings">
              <Button 
                variant="ghost" 
                size="icon"
                style={{ color: colors.textSecondary }}
                data-testid="button-back"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 
              className="font-serif text-2xl font-light"
              style={{ color: colors.textPrimary }}
            >
              Privacy Policy
            </h1>
            <div className="w-10" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card 
              className="p-6"
              style={{ 
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder
              }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: colors.accent }}
                >
                  <Shield className="w-5 h-5" style={{ color: colors.accentForeground }} />
                </div>
                <div>
                  <h2 
                    className="font-serif text-xl"
                    style={{ color: colors.textPrimary }}
                  >
                    Your Privacy Matters
                  </h2>
                  <p 
                    className="text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    Last updated: January 2026
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sm" style={{ color: colors.textSecondary }}>
                <section>
                  <h3 
                    className="font-semibold text-base mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Introduction
                  </h3>
                  <p>
                    Intiti ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our spiritual wellness application.
                  </p>
                </section>

                <section>
                  <h3 
                    className="font-semibold text-base mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Information We Collect
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Profile Information:</strong> Name, birth date, birth time, and birth location for calculating your energetic blueprint</li>
                    <li><strong>Wellness Data:</strong> Mood check-ins, intentions, journal entries, and affirmation preferences</li>
                    <li><strong>Camera Access:</strong> Used only for the Mirror Work feature when you choose to enable it</li>
                    <li><strong>Usage Data:</strong> App interactions and feature usage to improve your experience</li>
                  </ul>
                </section>

                <section>
                  <h3 
                    className="font-semibold text-base mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    How We Use Your Information
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>To calculate and display your personalized energetic blueprint</li>
                    <li>To provide personalized affirmations, insights, and wellness guidance</li>
                    <li>To track your emotional wellness journey over time</li>
                    <li>To generate AI-powered subliminal tracks and dream interpretations</li>
                    <li>To improve and enhance our services</li>
                  </ul>
                </section>

                <section>
                  <h3 
                    className="font-semibold text-base mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Data Storage
                  </h3>
                  <p>
                    Your data is stored securely. Profile and wellness data may be stored locally on your device or in our secure cloud database if you create an account. Mirror Work recordings are stored locally on your device and are not uploaded to our servers.
                  </p>
                </section>

                <section>
                  <h3 
                    className="font-semibold text-base mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Third-Party Services
                  </h3>
                  <p>
                    We use OpenAI to power our AI features such as dream interpretation and subliminal generation. When using these features, relevant data is processed by OpenAI in accordance with their privacy policy. We do not share your personal information with any other third parties for marketing purposes.
                  </p>
                </section>

                <section>
                  <h3 
                    className="font-semibold text-base mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Your Rights
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Access, correct, or delete your personal data</li>
                    <li>Export your data at any time</li>
                    <li>Opt out of non-essential data collection</li>
                    <li>Delete your account and all associated data</li>
                  </ul>
                </section>

                <section>
                  <h3 
                    className="font-semibold text-base mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Children's Privacy
                  </h3>
                  <p>
                    Our app is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                  </p>
                </section>

                <section>
                  <h3 
                    className="font-semibold text-base mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Changes to This Policy
                  </h3>
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h3 
                    className="font-semibold text-base mb-2"
                    style={{ color: colors.textPrimary }}
                  >
                    Contact Us
                  </h3>
                  <p>
                    If you have any questions about this Privacy Policy or our practices, please contact us through the app's settings or support channels.
                  </p>
                </section>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
