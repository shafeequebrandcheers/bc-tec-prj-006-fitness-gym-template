/* =========================================================
   FITNESS, GYM & YOGA TEMPLATE - CENTRAL CONFIGURATION
   ---------------------------------------------------------
   Edit only this file to set up a new business.
   Sample data below is placeholder content for a yoga studio -
   replace it with the business's real, verified details.
   ========================================================= */

const fitnessConfig = {
  // Options: "gym", "crossfit", "yoga-studio", "pilates", "personal-training"
  businessType: "yoga-studio",

  brandName: "Prana Flow Studio",
  tagline: "Find Your Balance, Build Your Strength",
  description: "A welcoming yoga studio offering mindful classes for every level, from first-timers to experienced practitioners.",
  logo: "", // e.g., "images/logo.png" - leave empty to show the brand icon

  contact: {
    phone: "+1 (555) 789-0123",
    whatsapp: "15557890123", // Country code + number, digits only
    email: "namaste@pranaflow.com",
    address: "88 Lotus Avenue, Sector 4",
    mapLink: "https://maps.google.com/?q=88+Lotus+Avenue"
  },

  // Leave url empty to hide a link.
  social: [
    { platform: "Instagram", url: "https://instagram.com/pranaflowstudio" },
    { platform: "Facebook", url: "https://facebook.com/pranaflowstudio" },
    { platform: "YouTube", url: "" }
  ],

  // Set closed: true for days the studio is closed.
  operatingHours: [
    { day: "Monday - Friday", hours: "6:30 AM - 8:30 PM" },
    { day: "Saturday", hours: "8:00 AM - 1:00 PM" },
    { day: "Sunday", closed: true }
  ],

  hero: {
    headline: "Find Your Balance, Build Your Strength",
    description: "Mindful yoga classes for every body and every level. Breathe deeper, move with intention and leave feeling restored.",
    image: "", // e.g., "images/hero.jpg" - also used as the video poster
    video: ""  // e.g., "videos/hero.mp4" - keep it short and compressed
  },

  // Weekly Class Schedule
  // category, duration and spots are optional. spots = places left (leave empty if unknown).
  schedule: [
    { day: "Monday", time: "07:00 AM", title: "Morning Vinyasa Flow", category: "Vinyasa", duration: "60 min", instructor: "Sarah Jenkins", level: "All Levels", spots: 6 },
    { day: "Monday", time: "06:00 PM", title: "Deep Restorative Yin", category: "Yin", duration: "75 min", instructor: "Elena Rostova", level: "Beginner Friendly" },
    { day: "Tuesday", time: "07:00 AM", title: "Hatha Foundations", category: "Hatha", duration: "60 min", instructor: "Arjun Mehta", level: "Beginner Friendly", spots: 8 },
    { day: "Tuesday", time: "07:00 PM", title: "Power Vinyasa", category: "Vinyasa", duration: "60 min", instructor: "Sarah Jenkins", level: "Intermediate", spots: 3 },
    { day: "Wednesday", time: "12:30 PM", title: "Lunchtime Flow", category: "Vinyasa", duration: "45 min", instructor: "Sarah Jenkins", level: "All Levels" },
    { day: "Wednesday", time: "06:30 PM", title: "Guided Meditation & Breathwork", category: "Meditation", duration: "45 min", instructor: "Arjun Mehta", level: "All Levels" },
    { day: "Thursday", time: "07:00 AM", title: "Morning Vinyasa Flow", category: "Vinyasa", duration: "60 min", instructor: "Sarah Jenkins", level: "All Levels", spots: 10 },
    { day: "Thursday", time: "06:00 PM", title: "Yin & Sound Bath", category: "Yin", duration: "75 min", instructor: "Elena Rostova", level: "All Levels", spots: 0 },
    { day: "Friday", time: "06:00 PM", title: "Slow Flow & Stretch", category: "Hatha", duration: "60 min", instructor: "Elena Rostova", level: "Beginner Friendly" },
    { day: "Saturday", time: "09:00 AM", title: "Weekend Vinyasa", category: "Vinyasa", duration: "75 min", instructor: "Sarah Jenkins", level: "Intermediate", spots: 5 },
    { day: "Saturday", time: "11:00 AM", title: "Prenatal Yoga", category: "Prenatal", duration: "60 min", instructor: "Elena Rostova", level: "Beginner Friendly" }
  ],

  // Trainers / Instructors - optional fields are hidden when empty.
  trainers: [
    { name: "Sarah Jenkins", role: "Lead Vinyasa Instructor", qualifications: "RYT-500", experience: "9 years teaching", image: "", specialties: ["Vinyasa", "Power Yoga", "Alignment"], bio: "Sarah teaches dynamic, breath-led flows with a focus on safe alignment." },
    { name: "Elena Rostova", role: "Yin & Restorative Instructor", qualifications: "RYT-200, Yin Yoga Certified", experience: "6 years teaching", image: "", specialties: ["Yin", "Restorative", "Prenatal"], bio: "Elena's slower classes focus on deep stretching, rest and recovery." },
    { name: "Arjun Mehta", role: "Hatha & Meditation Teacher", qualifications: "RYT-300", experience: "", image: "", specialties: ["Hatha", "Breathwork", "Meditation"], bio: "" }
  ],

  // Membership Tiers / Pricing Plans
  // highlighted: true visually features the plan. ctaLabel is optional.
  pricingPlans: [
    { name: "Drop-In Pass", price: "$22", billing: "Per Class", features: ["Access to 1 class", "Mat & towel included", "Flexible booking"] },
    { name: "Monthly Unlimited", price: "$130", billing: "Per Month", features: ["Unlimited studio classes", "Priority booking", "Guest pass (1/month)"], badge: "Most Popular", highlighted: true, ctaLabel: "Join Now" },
    { name: "10-Class Pack", price: "$180", billing: "Valid 3 Months", features: ["10 classes of your choice", "Mat & towel included", "Share with a friend"] }
  ],

  about: {
    title: "A calm space to move, breathe and grow",
    subtitle: "Yoga for every body",
    paragraph1: "Prana Flow Studio was created as a welcoming space where anyone can practise yoga, whatever their age, flexibility or experience.",
    paragraph2: "Our small classes let instructors offer personal guidance and modifications, so you can progress at your own pace.",
    image: "", // e.g., "images/about.jpg" - leave empty to show a placeholder
    differentiators: [
      { icon: "🧘", title: "Small Class Sizes", text: "More personal attention from your instructor." },
      { icon: "🌱", title: "Beginner Friendly", text: "Modifications offered in every class." },
      { icon: "🕯️", title: "Calm Environment", text: "A quiet, light-filled studio away from the rush." }
    ]
  },

  facilities: [
    { icon: "🧘", label: "Spacious yoga studio" },
    { icon: "🧺", label: "Mats, blocks & bolsters provided" },
    { icon: "🚿", label: "Changing rooms & showers" },
    { icon: "🔒", label: "Lockers" },
    { icon: "🍵", label: "Tea lounge" },
    { icon: "🅿️", label: "Street parking nearby" }
  ],

  // Add only genuine feedback shared with permission. The section is hidden when empty.
  // e.g., { quote: "...", name: "Member name", detail: "Member since 2024", image: "" }
  testimonials: [],

  faqs: [
    { question: "I'm a complete beginner. Can I join?", answer: "Yes. Classes marked Beginner Friendly or All Levels are a great place to start, and instructors offer modifications throughout." },
    { question: "What should I bring?", answer: "Comfortable clothing and a water bottle. Mats, blocks and bolsters are available at the studio." },
    { question: "How does the free trial work?", answer: "Send us a free trial request with your preferred class and date. Our team will contact you to confirm your spot." },
    { question: "Can I pause or cancel my membership?", answer: "Membership terms are explained when you join. Please contact our team with any questions before signing up." }
  ],

  booking: {
    methods: ["whatsapp", "email"], // "whatsapp", "email" or both (visitor chooses)
    defaultMethod: "whatsapp",
    ctaLabel: "Start Your Free Trial",
    classCtaLabel: "Book",
    planCtaLabel: "Choose Plan",
    freeTrial: true,      // false hides the free-trial option
    requireEmail: false,  // true makes email a required field
    modalTitle: "Join Prana Flow",
    modalIntro: "Tell us what you're interested in and we'll get back to you to confirm the details.",
    submitLabel: "Send Inquiry",
    emailSubject: "Studio inquiry",
    pricingNote: "Prices are shown for information. Payment and membership sign-up are completed directly with the studio."
  },

  // Theme: leave values empty to use the default theme of the businessType.
  theme: {
    preset: "", // Use another business type's theme, e.g. "pilates"
    colors: {
      primary: "",      // Buttons and highlights
      primaryDark: "",  // Hover states
      background: "",   // Page background
      surface: "",      // Cards and panels
      text: "",         // Main text
      textMuted: "",    // Supporting text
      border: ""        // Card and input borders
    },
    headingFont: "", // e.g., "'Oswald', sans-serif"
    bodyFont: ""     // e.g., "'Inter', sans-serif"
  },

  // Optional overrides for section headings (defaults come from businessPresets below)
  sections: {
    classesTitle: "",
    classesSubtitle: "",
    trainersTitle: "",
    trainersSubtitle: "",
    membershipTitle: "",
    membershipSubtitle: ""
  }
};

/* =========================================================
   BUSINESS TYPE PRESETS
   Default wording and icon for each supported business type.
   "aliases" are other accepted businessType values.
   Colours, fonts and visual style for each type live in css/variables.css.
   ========================================================= */
const businessPresets = {
  "gym": {
    aliases: ["bodybuilding", "gym-bodybuilding", "fitness-gym"],
    label: "Strength & Fitness Gym",
    icon: "🏋️",
    teamLabel: "Trainers",
    classesTitle: "Class Schedule",
    classesSubtitle: "Strength, conditioning and group training sessions every week.",
    trainersTitle: "Meet Your Trainers",
    trainersSubtitle: "Experienced coaches to guide your training.",
    membershipTitle: "Memberships",
    membershipSubtitle: "Choose the plan that fits your training goals."
  },
  "crossfit": {
    aliases: ["crossfit-box", "crossfit-studio"],
    label: "CrossFit Box",
    icon: "🔥",
    teamLabel: "Coaches",
    classesTitle: "WOD Schedule",
    classesSubtitle: "Coached sessions scaled for every athlete.",
    trainersTitle: "Our Coaches",
    trainersSubtitle: "Coaches who scale every workout to your level.",
    membershipTitle: "Memberships",
    membershipSubtitle: "Flexible options for every athlete."
  },
  "yoga-studio": {
    aliases: ["yoga"],
    label: "Yoga Studio",
    icon: "🧘",
    teamLabel: "Instructors",
    classesTitle: "Weekly Class Schedule",
    classesSubtitle: "Find a class that suits your level, schedule and practice.",
    trainersTitle: "Our Yoga Instructors",
    trainersSubtitle: "Experienced teachers to guide your practice.",
    membershipTitle: "Passes & Memberships",
    membershipSubtitle: "Simple options for regular practice or the occasional class."
  },
  "pilates": {
    aliases: ["pilates-studio"],
    label: "Pilates Studio",
    icon: "🤸",
    teamLabel: "Instructors",
    classesTitle: "Class Schedule",
    classesSubtitle: "Mat and reformer classes for strength, posture and control.",
    trainersTitle: "Our Pilates Instructors",
    trainersSubtitle: "Instructors focused on precise, mindful movement.",
    membershipTitle: "Class Packages",
    membershipSubtitle: "Packages designed for consistent practice."
  },
  "personal-training": {
    aliases: ["personal-trainer", "pt", "personal-training-center"],
    label: "Personal Training",
    icon: "💪",
    teamLabel: "Trainers",
    classesTitle: "Sessions & Small Groups",
    classesSubtitle: "One-to-one and small group sessions scheduled around you.",
    trainersTitle: "Your Personal Trainers",
    trainersSubtitle: "Coaches who build programmes around your goals.",
    membershipTitle: "Training Packages",
    membershipSubtitle: "Packages built around your goals and schedule."
  }
};
