

import { PranayamaTechnique, PranayamaTechniqueId, ExperienceLevel, SessionStage, UserType } from './types';

export const APP_NAME = "Prana.ai";

export const STAGE_DURATIONS = {
  [SessionStage.WARM_UP]: 120, // 2 minutes
  [SessionStage.COOL_DOWN]: 120, // 2 minutes
  [SessionStage.ACTIVITY_CHOICE]: 0, // Duration handled by interaction
  DEFAULT_PRACTICE_TIME_PER_TECHNIQUE: 300, // 5 minutes, can be overridden by technique rounds * phase durations
};

export const MOCK_VALID_ACTIVATION_CODE = "GREYBRAIN2024"; // For full access
export const MOCK_VALID_DEMO_CODE = "GBDEMO24";   // For demo access
export const DEMO_SESSIONS_LIMIT = 2;                 // Number of sessions for demo
export const LITE_TIER_TECHNIQUE_LIMIT = 1;           // For Lite version

export const TECHNIQUES: Record<PranayamaTechniqueId, PranayamaTechnique> = {
  [PranayamaTechniqueId.DIAPHRAGMATIC]: {
    id: PranayamaTechniqueId.DIAPHRAGMATIC,
    name: "Diaphragmatic Breathing (Belly Breathing)",
    description: "Focus on expanding the abdomen during inhalation for deep relaxation and improved oxygen intake. Helps find calm and balance.",
    suitability: {
      [ExperienceLevel.BEGINNER]: true,
      [ExperienceLevel.INTERMEDIATE]: true,
      [ExperienceLevel.ADVANCED]: true,
    },
    animationType: 'expand-contract',
    instructionalDiagramType: 'belly',
    initialInstruction: "Let's begin with Belly Breathing. Find a comfortable position. This technique helps to calm your nervous system and enhance focus. You can place one hand on your chest and the other on your belly to feel the movement.",
    phases: [
      { type: 'instruction', text: "Relax your shoulders and jaw. Feel your connection to your seat." },
      { type: 'inhale', duration: 4, text: "Breathe in slowly and deeply through your nose, feeling your belly expand like a balloon. Your chest should remain relatively still." },
      { type: 'hold_in', duration: 2, text: "Hold your breath gently, feeling the stillness within." },
      { type: 'exhale', duration: 6, text: "Exhale slowly through your mouth or nose, feeling your belly draw inwards as the air releases, releasing any tension." },
      { type: 'pause', duration: 1, text: "Pause briefly before the next breath, noticing the calm and balance." },
    ],
    rounds: {
      [ExperienceLevel.BEGINNER]: 6,
      [ExperienceLevel.INTERMEDIATE]: 8,
      [ExperienceLevel.ADVANCED]: 10,
    },
    finalInstruction: "Well done. Notice the sense of calm and centeredness this gentle rhythm brings. This is a foundational breath for relaxation and focus.",
    benefits: ["Reduces stress & anxiety", "Calms the nervous system", "Improves lung capacity & oxygenation", "Lowers heart rate", "Enhances focus & grounding for balance"],
    contraindications: ["Generally safe for everyone. If recent abdominal surgery, practice gently and with awareness."]
  },
  [PranayamaTechniqueId.UJJAYI]: {
    id: PranayamaTechniqueId.UJJAYI,
    name: "Ujjayi Breathing (Victorious Breath)",
    description: "Gentle constriction of the throat creates a soft, audible breath, promoting focus, inner warmth, and balance.",
    suitability: {
      [ExperienceLevel.INTERMEDIATE]: true,
      [ExperienceLevel.ADVANCED]: true,
    },
    animationType: 'glow',
    instructionalDiagramType: 'throat-sound',
    initialInstruction: "Now, let's explore Ujjayi, the 'Victorious Breath'. This breath is known for its calming and focusing qualities, aiding in mental balance. Sit comfortably tall.",
    phases: [
      { type: 'instruction', text: "Slightly constrict the back of your throat, as if you were about to whisper or fog up a mirror. Maintain this gentle constriction throughout, creating a soft ocean-like sound." },
      { type: 'inhale', duration: 5, text: "Inhale slowly through your nose, allowing the breath to make a soft 'sa' sound in your throat. Feel the breath flow." },
      { type: 'hold_in', duration: 2, text: "Hold the breath gently, cultivating inner stillness and focus." },
      { type: 'exhale', duration: 7, text: "Exhale slowly through your nose, maintaining the throat constriction and the soft sound. Make the exhale smooth, even, and complete." },
      { type: 'pause', duration: 1, text: "Pause naturally, resting in the quiet space you've created, feeling balanced." },
    ],
    rounds: {
      [ExperienceLevel.INTERMEDIATE]: 7,
      [ExperienceLevel.ADVANCED]: 10,
    },
    finalInstruction: "Excellent. Ujjayi helps to focus the mind and balance your system. Feel the warmth and centeredness.",
    benefits: ["Calms the mind & reduces mental chatter", "Increases focus and concentration", "Generates internal heat", "Regulates blood pressure", "Relieves tension & soothes nerves, promoting balance"],
    contraindications: ["If you have high blood pressure, practice without breath retention or consult your doctor. If it feels uncomfortable, revert to normal breathing."]
  },
  [PranayamaTechniqueId.KAPALABHATI]: {
    id: PranayamaTechniqueId.KAPALABHATI,
    name: "Kapalabhati (Skull Shining Breath)",
    description: "Rapid, forceful exhalations with passive inhalations, energizing the mind and cleansing respiratory pathways for enhanced focus.",
    suitability: {
      [ExperienceLevel.ADVANCED]: true,
    },
    animationType: 'pulse',
    instructionalDiagramType: 'forceful-exhale',
    initialInstruction: "We will now practice Kapalabhati, an energizing and cleansing breath for focus. Ensure you are comfortable and your stomach is relatively empty.",
    phases: [
      { type: 'instruction', text: "Take a normal breath in and out to prepare." },
      { type: 'custom', text: "Begin a series of 20-30 short, forceful exhalations through the nose. Focus on the exhale, allowing the inhale to be passive and automatic. Pump your abdomen with each exhale.", duration: 30, details: "Focus: quick, sharp exhales for purification and mental clarity." },
      { type: 'instruction', text: "After the last forceful exhale, take a deep inhale." },
      { type: 'inhale', duration: 4, text: "Inhale fully and comfortably." },
      { type: 'hold_in', duration: 10, text: "Hold the breath in, without strain, cultivating focus." },
      { type: 'exhale', duration: 8, text: "Exhale slowly and completely." },
      { type: 'instruction', text: "Rest for a few normal breaths before the next round, observing the effects on your focus and balance." },
    ],
    rounds: {
      [ExperienceLevel.ADVANCED]: 3,
    },
    finalInstruction: "Kapalabhati is very cleansing and invigorating. Notice the clarity and alertness it brings, enhancing your focus.",
    benefits: ["Cleanses nasal passages & lungs", "Energizes the body and mind", "Improves digestion & metabolism", "Tones abdominal muscles", "Increases alertness & mental clarity for sharp focus"],
    contraindications: ["Avoid if pregnant, or have high blood pressure, heart conditions, epilepsy, hernia, or recent abdominal surgery. Stop if dizzy or lightheaded."]
  },
  [PranayamaTechniqueId.ANULOM_VILOM]: {
    id: PranayamaTechniqueId.ANULOM_VILOM,
    name: "Anulom Vilom (Alternate Nostril Breathing)",
    description: "Alternating breaths between nostrils to balance the nervous system, calm the mind, harmonize energies, and improve focus.",
    suitability: {
      [ExperienceLevel.INTERMEDIATE]: true,
      [ExperienceLevel.ADVANCED]: true,
    },
    animationType: 'nostril-alternating',
    instructionalDiagramType: 'alternate-nostril',
    initialInstruction: "Let's practice Anulom Vilom, Alternate Nostril Breathing. This balances your mind and body, enhancing focus. Use your right thumb to close your right nostril, and your ring finger for the left. Your index and middle fingers can rest gently between your eyebrows or be folded.",
    phases: [
      { type: 'instruction', text: "Close your right nostril with your thumb." },
      { type: 'nostril_inhale_left', duration: 4, text: "Inhale slowly and deeply through your left nostril." },
      { type: 'instruction', text: "Close your left nostril with your ring finger, release your thumb from the right." },
      { type: 'nostril_exhale_right', duration: 6, text: "Exhale completely through your right nostril." },
      { type: 'nostril_inhale_right', duration: 4, text: "Inhale slowly and deeply through your right nostril." },
      { type: 'instruction', text: "Close your right nostril, release your left." },
      { type: 'nostril_exhale_left', duration: 6, text: "Exhale completely through your left nostril. This completes one round." },
    ],
    rounds: {
      [ExperienceLevel.INTERMEDIATE]: 5,
      [ExperienceLevel.ADVANCED]: 8,
    },
    finalInstruction: "Anulom Vilom brings profound balance and tranquility. Feel the harmony and centered focus within.",
    benefits: ["Calms the nervous system & reduces anxiety", "Balances brain hemispheres, improving focus", "Improves respiratory function & lung health", "Reduces stress & mental fatigue", "Enhances focus, clarity & emotional stability"],
    contraindications: ["Generally safe. If you have a cold or blocked nostrils, avoid or practice gently. Discontinue if any discomfort arises."]
  },
  [PranayamaTechniqueId.BHRAMARI]: {
    id: PranayamaTechniqueId.BHRAMARI,
    name: "Bhramari (Bee Breath)",
    description: "Humming sound during exhalation to calm the mind, relieve tension, connect with inner vibrational sound, and improve focus.",
    suitability: {
      [ExperienceLevel.BEGINNER]: true,
      [ExperienceLevel.INTERMEDIATE]: true,
      [ExperienceLevel.ADVANCED]: true,
    },
    animationType: 'ripple',
    instructionalDiagramType: 'humming-vibration',
    initialInstruction: "We will now practice Bhramari, the Bee Breath. This is deeply calming and enhances focus. Sit comfortably. You can gently close your ears with your thumbs or index fingers, or simply keep your hands on your knees.",
    phases: [
      { type: 'instruction', text: "Close your eyes gently. Turn your awareness inward." },
      { type: 'inhale', duration: 4, text: "Inhale deeply through your nose." },
      { type: 'hum', duration: 8, text: "Keeping your mouth closed, exhale slowly making a smooth, continuous humming sound like a bee. Feel the vibration in your head, aiding your focus." },
      { type: 'pause', duration: 1, text: "Pause briefly, absorbing the resonance and sense of balance." },
    ],
    rounds: {
      [ExperienceLevel.BEGINNER]: 5,
      [ExperienceLevel.INTERMEDIATE]: 7,
      [ExperienceLevel.ADVANCED]: 9,
    },
    finalInstruction: "Bhramari soothes the mind and releases agitation. Enjoy the peaceful vibrations and heightened sense of focus and balance.",
    benefits: ["Instantly calms the mind & alleviates anxiety", "Relieves stress, anger, and agitation", "May improve sleep quality", "Soothes the nerves & lowers blood pressure", "Enhances introspection, focus, & meditative states for inner balance"],
    contraindications: ["Avoid if you have an active ear infection. Practice gently."]
  },
};

export const SHANTI_MESSAGES: Record<string, string> = {
  welcome: `Namaste. I am Shanti, your guide from GreyBrain.ai. Welcome to ${APP_NAME}, your personalized journey to enhanced focus, calm, and balance through pranayama and mindful listening.`,
  askUserType: "To begin, is this session for an adult, or for a child?",
  selectedUserType: "Thank you. This session is for a {userType}.",
  askExperience: "To tailor our session perfectly for you, could you please share your experience level with pranayama or meditation?",
  askFeeling: "Before we begin our practice, how are you feeling in this moment?",
  askGoals: "And what do you hope to cultivate or achieve from our session today? Perhaps more focus, calm, a sense of balance, or vitality?",
  thankYouForSharing: "Thank you for sharing that. It helps me guide you better.",
  wonderfulGoal: "That's a wonderful intention for our practice. We'll work towards that focus and balance.",
  selectedExperience: "Okay, {experienceLevel}. We will work with that.",
  finalWelcomeMessage: `Thank you for sharing. Now, let me quickly explain how our sessions at GreyBrain.ai with ${APP_NAME} work to help you optimize your well-being, focus, and balance.`,
  cannotCompleteWelcomeMissingExperience: "It seems the experience level wasn't set. Let's try that again. Please select an option below so I can guide you appropriately.",
  cannotCompleteWelcomeMissingUserType: "Please select if this session is for an adult or a child to continue.",
  speechErrorDefault: "I'm having a little trouble understanding you. ",
  speechErrorNoSpeech: "I didn't detect any sound. Could you please speak a bit louder, tap the screen, or use the text input if available? Clear communication helps our session.",
  speechErrorMicDenied: "It seems microphone access was denied. To use voice interaction, please check your browser settings. You can also tap the screen or use the fallback inputs.",
  speechErrorTryAgain: "Could you try speaking again clearly? Alternatively, tap the screen, check your microphone, or use the fallback inputs.",
  
  bestExperienceTip: "For the most natural voice experience with me, ensure your browser is up-to-date. Browsers like Chrome or Edge often provide higher quality speech. Using headphones can also enhance your audio immersion for focus and balance.",
  howToInteractIntro: "Wonderful. Before we begin, let me quickly explain how our sessions unfold and how you can interact with me in Prana.ai.",
  howToInteractSessionFlow: "I'll guide you through a gentle warm-up to prepare your system. Then, you can choose between a focused Pranayama (breathing) practice, or an introduction to our 'Listen Mode' for meditation, designed to cultivate focus and balance. We'll conclude with a cool-down to integrate the practice.",
  howToInteractVoiceCommands: "During our session, especially during breathing or our 'Listen Mode', you can use voice commands like 'pause', 'resume', 'stop', or 'next step'. If you need clarification, say 'explain this' or 'help'. This allows for a seamless, hands-free, and eyes-closed practice, helping you maintain deep focus and balance. For the best experience, we recommend using voice commands hands-free.",
  howToInteractTap: "You can also tap the screen. Tapping often moves to the next step or instruction. During a breathing exercise, tapping the animation area can pause or resume.",
  howToInteractSensorIntro: `${APP_NAME} is designed for a focused, eyes-closed experience. For even deeper immersion and feedback on your breath's rhythm and depth, many find Bluetooth-enabled breath sensors beneficial.`,
  howToInteractAskSensor: `While ${APP_NAME} doesn't connect directly to sensors yet, would you like me to include prompts as if we were using one? This allows you to correlate my guidance if you have your own sensor. It's completely optional but can enhance your awareness, focus, and balance.`,
  howToInteractSensorYes: "Excellent! I'll add occasional prompts related to sensor feedback. Remember to primarily follow your body's sensations to cultivate focus and balance.",
  howToInteractSensorNo: "Understood. We'll proceed with standard guidance, focusing on your internal experience to cultivate focus and balance.",
  howToInteractConfirmation: "Are you ready to begin your journey to enhanced focus and balance with our warm-up?",
  howToInteractConfirmYes: "Wonderful! Let's begin.",
  howToInteractNotUnderstood: "I didn't quite catch that. You can say 'yes' or 'ready' to continue, or tap the 'Let's Begin Warm-up' button to proceed.",

  activityChoicePrompt: "Now that you're prepared, would you like to engage in a Pranayama (yogic breathing) session to enhance your vitality and focus, or would you prefer an introduction to our 'Listen Mode' for mindful meditation, designed to cultivate calm, focus, and balance?",
  activityChoicePranayamaButton: "Pranayama Session",
  activityChoiceMeditationIntroButton: "Meditation (Listen Mode Intro)",
  activityChoiceNotUnderstood: "Sorry, I didn't catch that. Please choose 'Pranayama' for breathing exercises or 'Meditation (Listen Mode Intro)' to learn about our upcoming meditation guidance for focus and balance. You can also tap your choice.",

  meditationIntroMain: `That's great! We at GreyBrain.ai are excited to introduce you to the 'Listen Mode' within ${APP_NAME}. Meditation is a powerful practice for cultivating inner peace, clarity, resilience, focus, and balance. Our upcoming sessions will help you gently train your attention, observe your thoughts without judgment, and connect with a deeper sense of calm through immersive audio experiences.`,
  meditationIntroScience: "Scientifically, meditation has been shown to reduce stress by lowering cortisol levels, improve concentration by strengthening neural pathways related to focus, and even promote emotional health by increasing self-awareness and positive feelings. It’s a wonderful way to harmonize your mind and achieve balance.",
  meditationIntroWalk: "Our 'Listen Mode' will feature guided walking meditations, perfect for integrating mindfulness into your daily routine. Whether it's a morning walk to energize and focus, or an evening stroll to unwind and find balance, these audio sessions will help connect your inner practice with the world around you, enhancing your awareness and calm.",
  meditationIntroKids: `For our younger users, we're designing special 'Listen Mode' meditations that are engaging and easy to follow. In today's digitally overwhelming world, children greatly benefit from practices that enhance focus, manage emotions, and build inner calm and balance. Our kids' meditations in ${APP_NAME} will be shorter, use relatable imagery, and help them develop these essential life skills.`,
  meditationIntroConclusion: `Look out for these full 'Listen Mode' meditation features in an upcoming update to ${APP_NAME} from GreyBrain.ai! For now, let's proceed to our cool-down to integrate today's session and the sense of focus and balance we've cultivated.`,
  
  kidsFocusMessageGeneral: "For our young users, these practices are especially helpful. In a world full of digital information, learning to focus your breath and mind can be a superpower! It helps you concentrate better in school, feel calmer, and understand your feelings, leading to greater balance.",
  kidsSpecificPlanMessage: `GreyBrain.ai is developing special, shorter, and fun pranayama and 'Listen Mode' meditation sessions just for kids within ${APP_NAME}. Stay tuned!`,

  warmUpIntro: "Excellent. Let's start with a gentle warm-up to prepare your body and mind for enhanced focus and balance.",
  coolDownIntro: "Wonderful. Now, let's move into a cool-down to integrate the benefits of our practice and solidify that sense of focus and balance.",
  farewell: "Our session is complete. Take a moment to notice how you feel. I hope you carry this focused calm, vitality, and sense of balance with you.",
  practiceSuggestion: `Remember, regular practice of pranayama and mindful listening, even for a few minutes each day, can bring lasting benefits to your focus, balance, and overall well-being. Consider exploring these techniques further with ${APP_NAME}.`,
  safetyReminder: "Always listen to your body. If you experience any pain or significant discomfort, please stop the practice and consult a healthcare professional if needed. Pranayama and meditation should be nurturing experiences for your focus and balance.",
  feedbackPrompt: "How are you feeling after that technique? Was the pace comfortable for you, aiding your focus and balance?",
  sessionStart: "Let's begin our journey into breath, focus, and balance.",
  nextTechnique: "Let's move to our next technique to further cultivate your practice of focus and balance.",
  sessionEnded: `Thank you for practicing with ${APP_NAME} today. May your mind be focused, your spirit balanced, and your day be well. Be well.`,
  explainConceptAck: "Okay, let me remind you about this technique and how it works to support your focus and balance.",
  tellMeFeeling: "Tell me how you're feeling... (or tap screen for text input)",
  askFeelingPlaceholder: "e.g., energized, calm, focused, balanced...",
  askGoalsPlaceholder: "e.g., to energize, to find calm, to improve focus, to achieve balance...",
  whatIsYourGoal: "What do you hope to achieve with your practice today? (or tap screen for text input)",
  confirmFeelingButton: "Confirm Feeling",
  confirmGoalButton: "Confirm Goal",
  tapToSpeakResponse: "Tap to Speak Your Response",
  listeningEllipsis: "Listening for your intention...",
  micNotAvailableWelcome: `Microphone access is not available. Please tap the screen or use the buttons or text areas provided to interact with ${APP_NAME}.`,
  enableMicWelcome: `Please enable your microphone for voice interaction with ${APP_NAME}, tap the screen, or use the buttons/text areas below.`,
  selectedLevelConfirmation: "Selected: {level}. A good foundation for our work towards focus and balance.",
  practiceCommandInfo: "Remember, for a hands-free experience to maintain focus, you can say 'pause', 'resume', 'stop', or 'next step'. Tap the screen to pause or resume. If you need assistance, say 'help'.",
  practiceSensorRhythmCheck: "For those using a sensor, observe your breath rhythm. Is it aligning with the guided flow? Adjust gently as needed to find your balance and focus.",
  practiceSensorDepthCheck: "If you have a sensor, note the depth of your breath. Are you breathing fully and comfortably to enhance focus?",
  practiceSensorConsistency: "A sensor might show how consistent your breath is. Aim for smooth, even inhales and exhales to maintain a steady flow for balance and focus.",
  practicePaused: "Practice paused. Rest in awareness, maintaining your focus.",
  practiceResuming: "Resuming. Re-engage with your breath and focus.",
  stoppingTechnique: "Stopping technique. Allowing your system to settle and find balance.",
  cmdStop: "Okay, stopping the current flow.",
  cmdPause: "Pausing the practice.",
  cmdResume: "Resuming the practice.",
  cmdNextStep: "Moving to the next step.",
  cmdTimedPhaseInfo: "We are in a timed phase, focusing your breath. You can say 'pause' or 'stop', or tap the screen to pause.",
  cmdPaceFeedback: "Thank you for the feedback. I'll guide the pace as set for this technique. Focus on your comfort, the flow of your breath, and your inner balance.",
  startingRound: "Starting round {roundNumber}. Deepen your focus and sense of balance.",
  howToInteractLetsBeginButton: "Let's Begin Warm-up",
  howToInteractNextTipButton: "Next Tip",
  farewellAskFeeling: "Before you go, how are you feeling now? Are you more centered, calm, balanced, or focused?",
  farewellFeelingPlaceholder: "e.g., Calm, refreshed, centered, focused, balanced...",
  farewellConfirmFeelingButton: "Confirm Feeling",
  farewellSpeakFeelingButton: "Speak Feeling",
  farewellEndSessionButton: "End Session",
  ptpLoadingText: "Preparing technique...",
  ptpRoundText: "Round {currentRound} of {totalRounds}",
  ptpPhaseTimeInstructionText: "Guidance Phase",
  ptpNextStepButtonText: "Next Step (or Tap Screen)",
  ptpResumeButtonText: "Resume Flow",
  ptpPauseButtonText: "Pause Flow",
  ptpStopTechniqueButtonText: "Stop Technique",
  ptpHavingTroubleButtonText: "Having Trouble? / Explain",
  ptpListeningCommandsText: "Listening for commands...",
  ptpHintTapAnimationText: "Hint: Tap the animation to pause/resume or advance instructions for an optimal eyes-closed experience, enhancing focus.",
  ptpBeginButtonText: "Begin {techniqueName} (or Tap Screen)",
  ptpBenefitsTitle: "Key Benefits for Focus & Balance:",
  ptpContraindicationsTitle: "Practice with Awareness:",
  modalReflectionTitle: "Practice Reflection for Focus & Balance",
  modalFeedbackPlaceholder: "How was that for your focus & calm? (Optional)",
  modalSubmitFeedbackButton: "Submit Feedback",
  modalGuidanceTitle: "Guidance from Shanti",
  modalContinueCarefullyButton: "Continue Carefully",
  modalStopTechniqueButton: "Stop Technique",
  modalEndSessionButton: "End Session Now",
  warmUpTitle: "Gentle Warm-up for Focus",
  warmUpSkipButton: "Skip Warm-up",
  coolDownTitle: "Cool-down & Integration of Balance",
  coolDownFinishButton: "Finish Cool-down",
  footerSafetyReminder: "Always listen to your body. If you experience any pain or significant discomfort, stop and consult a healthcare professional if needed. Pranayama and meditation are journeys of self-awareness, focus, and balance.",
  spokenBenefitsIntro: "This practice offers several benefits for your focus and balance, such as ",
  spokenBenefitsContinuation: ", and ",
  spokenBenefitsEnd: ". ",
  // Activation & Tier Messages
  activateFullVersionButton: `Unlock Full ${APP_NAME}`,
  upgradeToPremiumButton: "Upgrade to Premium Insights",
  activationModalTitle: `Activate Full ${APP_NAME}`,
  activationCodeLabel: "Enter Activation Code:",
  activationSubmitButton: "Activate",
  activationSuccessFull: `Full Access to ${APP_NAME} activated! Enjoy all techniques and features for optimal focus and balance.`,
  activationSuccessDemo: `${APP_NAME} Demo activated! You have {limit} sessions with full features to explore focus and balance.`,
  activationErrorInvalidCode: "Invalid activation code. Please check the code and try again.",
  activationPurchasePrompt: `To unlock all features in ${APP_NAME} and deepen your practice of focus and balance, `,
  activationVisitWebsite: "Visit [greybrain.ai/prana-activate] to get your code.",
  premiumFeatureDescription: `Unlock deeper insights and personalized reflections for both your pranayama and 'Listen Mode' meditation practice with ${APP_NAME} Premium features, powered by advanced AI from GreyBrain.ai. Discover unique patterns in your breathwork and receive guidance tailored to your journey of focus, calm, and balance.`,
  premiumReflectionPrompt: "Get Personalized Reflection (Premium)",
  premiumReflectionLoading: "Shanti is preparing your personalized reflection for focus and balance with GreyBrain.ai...",
  premiumReflectionMock: "Based on your session focusing on {goal} with techniques like {techniqueName}, GreyBrain.ai suggests exploring how your breath and meditative focus influence your day. Consistent practice can deepen this awareness, focus, and balance. Well done.",
  demoSessionRemaining: `${APP_NAME} Demo: {remaining} session(s) left.`,
  demoExpiredTitle: `${APP_NAME} Demo Access Ended`,
  demoExpiredMessage: `Thank you for trying ${APP_NAME}! Your demo access has ended. To continue mastering your practice for focus and balance with all techniques and features, please purchase a full activation code.`,
  purchaseAfterDemoButton: `Purchase Full ${APP_NAME} Access`,
  liteVersionPromptPractice: `You are using the Lite version of ${APP_NAME}. Activate the full version to access more techniques and deepen your practice of focus and balance.`,
  liteVersionPromptSensor: `This enhanced feedback feature is available in the Full version of ${APP_NAME}. Activate to explore further for improved focus.`
};


export const WARM_UP_STEPS = [
  "Find a comfortable seated position, spine tall yet relaxed, shoulders soft. Prepare for your practice of focus and balance.",
  "Gently close your eyes or soften your gaze, turning your awareness inward.",
  "Take three deep, cleansing breaths. Inhale fully; exhale completely, releasing any tension.",
  "Slowly roll your shoulders up towards your ears, back, and then down. Repeat 3 times.",
  "Gently tilt your head to the right, feeling a light stretch along the left side of your neck. Hold for a breath. Return to center.",
  "Now, tilt your head to the left. Hold for a breath. Return to center.",
  "Slowly turn your head to look over your right shoulder. Pause. Return to center.",
  "Turn to look over your left shoulder. Pause. Return to center.",
  "Bring your awareness to your breath, noticing its natural rhythm. Feel the subtle pulse of your being, finding your center for focus and balance."
];

export const COOL_DOWN_STEPS = [
  "Allow your breath to return to its natural, effortless rhythm.",
  "Keep your eyes gently closed or your gaze soft. Rest in stillness.",
  "Scan your body from your toes to the crown of your head, noticing any sensations of warmth, tingling, expansion, or release.",
  "Acknowledge any shifts in your mental or emotional state. Perhaps a sense of focused calm, clarity, or profound quiet and balance.",
  "Rest in this awareness for a few moments, simply being present.",
  "Offer yourself a moment of gratitude for taking this time for your well-being, focus, and balance.",
  "When you're ready, slowly begin to deepen your breath. Wiggle your fingers and toes, gently re-awakening.",
  "Gently open your eyes, bringing your expanded awareness, focus, and balance back to your surroundings, carrying this calm with you."
];

export const GENERAL_INSTRUCTIONS = {
  SIT_COMFORTABLY: "Find a comfortable seated position, either on a cushion on the floor or in a chair with your feet flat on the ground. Keep your spine comfortably straight.",
  RELAX_SHOULDERS: "Relax your shoulders away from your ears. Soften your jaw and the muscles in your face.",
  CLOSE_EYES: "You may close your eyes gently to deepen your inner focus, or keep a soft, unfocused gaze downwards."
};

export const HOW_TO_INTERACT_VOICE_COMMANDS_DISPLAY = [
    { command: "'Pause'", description: "Temporarily stop the current practice." },
    { command: "'Resume'", description: "Continue your practice after pausing." },
    { command: "'Stop'", description: "End the current breathing technique or listening session." },
    { command: "'Next Step'", description: "Move to the next guidance (in non-timed phases)." },
    { command: "'Explain This' / 'Help'", description: "Get a reminder or assistance on the technique or concept." },
];
