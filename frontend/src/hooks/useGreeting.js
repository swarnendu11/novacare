import { useState, useEffect } from "react";

const getGreetingType = () => {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
};

const GREETINGS = {
  morning: [
    "Good Morning",
    "Great Morning",
    "Fresh Morning",
    "Top of the Morning",
  ],
  afternoon: [
    "Good Afternoon",
    "Brilliant Afternoon",
    "Energetic Afternoon",
    "Sunny Afternoon",
  ],
  evening: [
    "Good Evening",
    "Pleasant Evening",
    "Calm Evening",
    "Peaceful Evening",
  ],
  night: ["Good Night", "Quiet Night", "Deep Night", "Serene Night"],
};

const SALUTATIONS = {
  morning: [
    "Ready to save lives today?",
    "Let’s make this a productive day.",
    "Excellence starts here.",
    "Patients are waiting for your care.",
  ],
  afternoon: [
    "Your dedication is inspiring.",
    "Keep up the amazing work.",
    "Systems are operating optimally.",
    "Ensuring quality healthcare together.",
  ],
  evening: [
    "Reviewing the day’s achievements.",
    "Wrapping up with precision.",
    "Your hard work makes a difference.",
    "Hope your shift was impactful.",
  ],
  night: [
    "Vigilance never sleeps.",
    "The facility is under your watch.",
    "Quiet halls, deep commitment.",
    "Guarding health through the night.",
  ],
};

export function useGreeting() {
  const [index, setIndex] = useState(0);
  const type = getGreetingType();

  useEffect(() => {
    // Change greeting variation every 5 minutes or on reload
    setIndex(Math.floor(Date.now() / (5 * 60 * 1000)) % 4);

    const interval = setInterval(
      () => {
        setIndex((prev) => (prev + 1) % 4);
      },
      5 * 60 * 1000,
    ); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  return {
    greeting: GREETINGS[type][index],
    salutation: SALUTATIONS[type][index],
  };
}
