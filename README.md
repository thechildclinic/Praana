
# Prana.ai - Guided Breathing & Meditation by GreyBrain.ai

**Prana.ai** is a voice-guided web application from **GreyBrain.ai**, designed to lead users through various pranayama (yogic breathing) techniques and introduce concepts of meditation, including a "Listen Mode" for passive and active meditative experiences. Guided by "Shanti," your virtual coach, Prana.ai aims to help you cultivate **focus**, achieve **relaxation and balance**, reduce stress, and enhance overall well-being.

## Features

*   **Guided Pranayama Sessions:** Includes a variety of techniques:
    *   Diaphragmatic Breathing (Belly Breathing)
    *   Ujjayi Breathing (Victorious Breath)
    *   Kapalabhati Breathing (Skull Shining Breath)
    *   Anulom Vilom (Alternate Nostril Breathing)
    *   Bhramari Breathing (Bee Breath)
*   **"Listen Mode" & Meditation Introduction:**
    *   Shanti introduces Prana.ai's "Listen Mode," designed for immersive audio-based meditation.
    *   Explains benefits for **focus and balance**, the science behind meditation, and how "Listen Mode" can be integrated into daily life (e.g., during morning/evening walks for mindful movement).
    *   Focus on gentle induction into meditative practices, emphasizing an audible, calming experience.
*   **Voice-Guided Instruction:** "Shanti" provides clear, step-by-step instructions and breath cues.
*   **Personalization:**
    *   **User Type:** Asks if the session is for an Adult or a Child, laying the groundwork for tailored content.
    *   Adapts to user's experience level (Beginner, Intermediate, Advanced).
*   **Kids-Specific Track (Conceptual):**
    *   Recognizes the need for **focus, calm, and balance** for children in a digitally overwhelming world.
    *   Messaging points towards future kid-friendly pranayama and "Listen Mode" meditation sessions (shorter, engaging).
*   **Immersive Audio Experience:**
    *   **Calming Background Music:** Optional ambient music to deepen relaxation, **focus, and balance** (user-toggleable).
    *   **Dynamic Breath Sounds:** Subtle audio cues for inhales and exhales synchronized with guidance, enhancing an eyes-closed practice for pranayama.
*   **Visual Breathing Animations (Pranayama):**
    *   **Instructional View:** Static diagrams explaining the mechanics of each technique.
    *   **Rhythmic View:** Dynamic animations to guide breath timing during practice.
*   **Enhanced Hands-Free Experience:** Strong emphasis on using the app with (user-owned) Bluetooth breath sensors for a focused, eyes-closed, and immersive pranayama session. Conceptual guidance provided.
*   **Session Structure:** Includes warm-up and cool-down sequences. Users can choose between pranayama or an introduction to "Listen Mode" meditation after the initial setup.
*   **Interactive Controls:**
    *   **Voice Commands:** Pause, resume, stop, next step, explain/help.
    *   **Tap Interactions:** Navigate instructions, pause/resume practice.
*   **Tiered Access System (Current):**
    *   **Lite Version:** Limited access to techniques.
    *   **Full Version:** Unlocks all suitable techniques; activated via a purchased code from GreyBrain.ai for Prana.ai.
    *   **Demo Mode:** Full feature access for a limited number of sessions using a demo code.
*   **Future Premium Version (Conceptual):**
    *   **Personalized Gemini Insights:** Planned for future, offering personalized reflections and deeper guidance for both pranayama and "Listen Mode" meditation using Google's Gemini API, provided by GreyBrain.ai for Prana.ai.
*   **Branding:** Developed by GreyBrain.ai.
*   **Offline Potential:** Designed with a structure that could support offline functionality via a Service Worker in the future.

## Tech Stack

*   **Frontend:**
    *   React 19 (imported via esm.sh)
    *   TypeScript
    *   Tailwind CSS (via CDN)
    *   Custom CSS for theming
*   **Web APIs:**
    *   Web Speech API (SpeechSynthesis for Shanti's voice, SpeechRecognition for user commands)
    *   HTML5 Audio for background music and breath sounds.
*   **Development Environment:**
    *   Modern web browser with support for ES Modules and Web Speech API.
    *   No build step required due to esm.sh and CDN usage for libraries.

## Project Structure
(Structure remains largely the same, with audio assets conceptually in `/assets/audio/`)
```
.
├── index.html                  # Main HTML, includes audio elements, Tailwind, fonts, importmap
├── index.tsx                   # React application root
├── App.tsx                     # Main app component (Prana.ai), handles state, stages, audio controls, tier logic, session intent
├── VoiceContext.tsx            # Manages Web Speech API (TTS & STT)
├── types.ts                    # Global TypeScript interfaces and enums (UserType, SessionIntent added)
├── constants.ts                # App-wide constants (GreyBrain.ai messages for Prana.ai, including meditation & kids, techniques)
├── metadata.json               # Application name (Prana.ai), description, permissions
├── i18n.ts                     # (Placeholder for future localization)
├── components/
│   ├── ... (stage components, UI components)
│   ├── PranayamaTechniquePlayer.tsx # Core component for pranayama
│   ├── WelcomeStage.tsx        # Now asks for UserType (Adult/Kid)
│ └── icons/                  # SVG icon components
├── assets/                     # (Conceptual directory for media)
│   └── audio/
│       ├── calming-yoga-music.mp3 # Placeholder
│       ├── breath-inhale.mp3      # Placeholder
│       └── breath-exhale.mp3      # Placeholder
└── README.md                   # This file
```

## Getting Started

### Prerequisites
*   A modern web browser (e.g., Chrome, Edge).
*   A working microphone for voice interaction.
*   Speakers/headphones for audio guidance, music, and breath sounds.
*   **(User to provide)** Audio files: `calming-yoga-music.mp3`, `breath-inhale.mp3`, `breath-exhale.mp3` placed in a publicly accessible `/assets/audio/` directory relative to `index.html`, or update paths in `App.tsx` and `PranayamaTechniquePlayer.tsx`.

### Running Locally
1.  **Clone/Download Files:** Ensure all project files are in a single directory.
2.  **Add Audio Assets:** Create an `assets/audio` folder and place the required MP3 files there.
3.  **Open in Browser:** Open `index.html` directly in your browser or use a live server.

### API Keys & Authentication
*   **Current Application (Prana.ai):** Does not require external API keys for its core frontend features. Gemini API integration is conceptual.
*   **Freemium Model (Future):** Integration with **Clerk.dev** for user accounts and a full freemium model is planned for a future update to Prana.ai. The current system uses activation codes (e.g., from greybrain.ai/prana-activate) for Full/Demo access.
*   **Future Gemini Integration (Backend):** Gemini API interactions will be handled by a secure backend service. **Never expose API keys on the client-side.**

## Key Components & Logic Changes

### `App.tsx`
*   Manages background music play/pause state and controls.
*   Orchestrates overall branding and messaging for Prana.ai by GreyBrain.ai.
*   Handles `userType` (Adult/Kid) and `sessionIntent` (Pranayama/Meditation Listen Mode Intro) to guide app flow.
*   Introduces a conceptual `ActivityChoiceStage` after `HowToInteractStage`.

### `PracticeStage.tsx`
*   If `sessionIntent` is 'meditation_introduction', this stage now plays a series of Shanti's messages about upcoming "Listen Mode" meditation features within Prana.ai instead of a pranayama technique.

### `WelcomeStage.tsx`
*   Includes a new step to ask the user if the session is for an adult or a child, storing this as `userType`.

### `constants.ts`
*   `APP_NAME` updated to "Prana.ai".
*   `SHANTI_MESSAGES` extensively revised:
    *   To include questions and confirmations for `userType`.
    *   To add scripts for introducing the "Listen Mode" meditation track (including for walks), its science, and special considerations for kids, all under the Prana.ai brand by GreyBrain.ai, emphasizing **focus and balance**.
    *   To update the Premium Gemini feature description to cover meditation within Prana.ai.

## Future Enhancements (Conceptual Roadmap for Prana.ai by GreyBrain.ai)
*   **Full "Listen Mode" Meditation Player & Content:** Develop dedicated meditation sessions with audio for passive listening and activities like walking.
*   **Kid-Specific Pranayama & "Listen Mode" Meditation Techniques:** Create and integrate tailored content.
*   **Clerk.dev Integration:** Implement a full freemium model with user accounts for Prana.ai.
*   **Full Backend Integration:** Secure validation of activation codes, payment gateways, user data management.
*   **Google Gemini API Integration:** Real-time personalized insights for pranayama and "Listen Mode" meditation (Premium users) via a secure backend, as a GreyBrain.ai service for Prana.ai.
*   **Service Worker:** Robust offline functionality.
*   **Deeper Localization.**
*   **Actual Bluetooth Breath Sensor Integration.**

## Contributing
Prana.ai is currently developed by GreyBrain.ai. Contribution guidelines would be established if it moves to an open-source model.
