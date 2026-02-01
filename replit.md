# Intiti Wellness App

## Overview

Intiti is a spiritual wellness web application that integrates energy work, mindfulness, and daily wellness practices. It guides users through an onboarding process to create their Energetic Blueprint (birth chart), then provides personalized daily affirmations, Emotional Weather tracking (mood check-ins), intention setting, and breathwork exercises. The app's interface dynamically adjusts its color scheme based on the user's selected elemental state, aiming to create a personalized and calming digital experience. The project envisions a comprehensive platform for spiritual growth with advanced AI-powered features for guidance and personalized rituals.

## Rebranding (December 2024)

The app is transitioning from astrology-heavy terminology to spiritual wellness language:
- "My Chart" → "Energetic Blueprint"
- "Moon" page → "Today's Energy"  
- "Mood Check-In" → "Emotional Weather"
- "Relationship Synastry" → "Connection Energy Reading"
- Sun/Moon/Rising → Core Self/Emotional Landscape/Outer Expression
- "Astrology insights" → "Energy insights"
- Technical astrological terms replaced with intuitive, healing-focused language

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend uses React 18+ with TypeScript, built with Vite. Wouter handles client-side routing, including protected routes for onboarding. State management combines React hooks for local state, TanStack Query for server state, custom React Context for global themes, and LocalStorage for persistent user data. Shadcn/ui, built on Radix UI and styled with Tailwind CSS, provides accessible UI components. The design system features typography with Cormorant Garamond and Inter, dynamic elemental color schemes (fire, water, air, earth, cosmic dark mode) with gradients and accent colors, a mobile-first layout, and animations powered by Framer Motion.

**Theme System**: Cosmic (dark purple/violet) is the global default theme. New users start with Cosmic regardless of their sun sign. The onboarding flow always uses Cosmic theme styling with proper dark mode contrast for inputs (text-white, [color-scheme:dark] for date/time pickers). Users can change themes via the ElementSelector in Settings after onboarding is complete. Available themes: Fire, Water, Air, Earth, Cosmic, and Golden Dawn (now available to everyone).

### Backend Architecture

The backend is built with Express.js and TypeScript, providing RESTful APIs for affirmations, dream journaling, and meditation script generation, leveraging OpenAI. It uses a hybrid storage strategy with PostgreSQL for authenticated user data and LocalStorage for unauthenticated users, ensuring data sync upon login. Security measures include Zod schema validation, whitelisted fields for storage sync, server-side userId enforcement, UUID validation, and payload size limits. Authentication is handled via Replit Auth (OpenID Connect) with session management using connect-pg-simple.

### Data Architecture

Shared TypeScript schemas define zodiac signs, elements, mood options, and moon phases, along with Zod schemas for runtime validation. Astrological calculations determine sun, moon, and rising signs, and moon phases. LocalStorage is used for user profiles, mood entries, intentions, current element, and onboarding state.

### Onboarding Flow

A multi-step onboarding process allows users to provide their name, birth details, and initial intention without requiring sign-in. Users can choose to create an account, continue as a guest, or sign in via Replit Auth. A one-time welcome screen introduces features post-onboarding.

### Subscription Model (All Features Free)

As of January 2026, all features are completely free and accessible to everyone. The previous tier system (Free, Initiates, Premium, Ascended) has been removed. All usage limits are now unlimited, and all premium features including Dream Journal, AI Subliminals, Golden Dawn theme, and Energy Wall are accessible without payment. The Stripe integration remains in the codebase but is inactive.

### Labs (Beta Features)

Beta features include a Dream Journal with AI interpretation (using OpenAI), and AI Subliminals which generate personalized affirmation tracks based on user intention and astrological profile. Subliminal categories include love/relationships, self-worth/confidence, abundance, nervous system healing, protection/boundaries, shadow integration, and spiritual alignment. Each subliminal has style options (gentle, balanced, deep) affecting affirmation density, duration choices (10, 20, 40 minutes), and background sound selections (delta waves, theta waves, celestial echo, ocean calm, pure silence). All beta features are now freely accessible to everyone without limits.

### Mirror Work Feature

Mirror Work is a self-affirmation tool that uses the device's front-facing camera to create a mirror experience with teleprompter-style affirmations. Features include:
- Front-facing camera access with horizontal flip (mirror effect)
- 6 affirmation categories: Self Love, Worthiness, Abundance, Kindness, Protection, and Healing (10 affirmations each)
- Auto-advancing teleprompter with adjustable scroll speed
- Video recording capability with play, download, and delete options
- Recordings are session-only (stored in memory) - users must download to save permanently
- Settings panel for category selection and speed adjustment

### Presence Feature

Presence is a dark-screen stillness timer for grounding and nervous system reset. Features include:
- Near-black background (#050508) during active sessions for minimal stimulation
- Session length presets: 5, 10, 30 minutes plus custom duration (1-60 minutes)
- Optional cues: vibration and/or sound at configurable intervals (none, every 5 min, every 10 min, end only)
- Focus reminder banner encouraging Do Not Disturb before starting
- Minimal timer display during session with end session confirmation
- Post-session transition screen with two choices: "Journal (1–3 minutes)" or "Return Home"
- Optional journal with rotating open-ended prompts (e.g., "What came up during the stillness?", "What feels different now?")
- Journal entries stored in localStorage under "presence_journal_entries" with source: presence tag
- Session logging: tracks total sessions, total minutes, and optional reflections
- Settings and logs persist in localStorage

### Privacy Policy

A Privacy Policy page is available at /privacy-policy and accessible from Settings > Legal. It covers data collection, usage, storage, third-party services (OpenAI), user rights, children's privacy, and contact information. Required for App Store submission.

## External Dependencies

**Third-Party UI Libraries**: Radix UI (primitives), Framer Motion (animation), Embla Carousel (sliders), Lucide React (icons).

**Development Tools**: TypeScript, Tailwind CSS, PostCSS (with Autoprefixer), ESBuild.

**Data Validation**: Zod, React Hook Form (with Zod resolver).

**Date/Time Utilities**: date-fns.

**Backend Services**: OpenAI SDK (for AI features).

**Session Management**: Express Session, Connect PG Simple (PostgreSQL session store).

**Database**: Drizzle ORM (for PostgreSQL), `pg` (PostgreSQL client library).


**Mobile Development**: Capacitor (for iOS and Android hybrid app).