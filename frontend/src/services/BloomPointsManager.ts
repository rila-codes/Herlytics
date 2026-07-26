// BloomPointsManager.ts - Garden of Progress & Habit Streak Engine for HerLytics

export interface HabitStreak {
  name: string;
  key: string;
  icon: string;
  streakDays: number;
  completedToday: boolean;
  pointsPerDay: number;
}

export interface BloomState {
  totalBloomPoints: number;
  bloomLevel: string;
  bloomLevelIndex: number;
  streakDays: number;
  gardenStage: string;
  gardenStageIcon: string;
  weeklyProgressDays: number; // e.g. 5/7 days
  bloomPassAvailable: boolean;
  activeSeasonalTheme: 'Spring' | 'Summer' | 'Monsoon' | 'Winter';
  habits: HabitStreak[];
  unlockedBadges: string[];
}

export const BLOOM_LEVELS = [
  { name: 'Seed', icon: '🌱', minPoints: 0 },
  { name: 'Sprout', icon: '🌿', minPoints: 10 },
  { name: 'Bloom', icon: '🌸', minPoints: 30 },
  { name: 'Glow', icon: '✨', minPoints: 60 },
  { name: 'Thrive', icon: '🌼', minPoints: 100 },
  { name: 'Inspire', icon: '💜', minPoints: 150 }
];

export const GARDEN_STAGES = [
  { days: 1, stage: 'Small Seedling', icon: '🌱', desc: 'Day 1–7: Your wellness journey is taking root!' },
  { days: 8, stage: 'Green Plant', icon: '🌿', desc: 'Day 8–15: Strong stems and green leaves growing.' },
  { days: 16, stage: 'Flower Blooms', icon: '🌸', desc: 'Day 16–30: Colorful flowers blooming everywhere!' },
  { days: 31, stage: 'Butterflies Appear', icon: '🦋', desc: 'Day 31–60: Playful butterflies visiting your garden.' },
  { days: 61, stage: 'Beautiful Garden', icon: '🌺', desc: 'Day 61–100: A lush, thriving botanical haven.' },
  { days: 101, stage: 'Wellness Sanctuary', icon: '🌳', desc: '365 Days: Your personal sanctuary of health.' }
];

export const INITIAL_HABITS: HabitStreak[] = [
  { name: 'Water Goal', key: 'water', icon: '💧', streakDays: 1, completedToday: true, pointsPerDay: 1 },
  { name: 'Sleep Log', key: 'sleep', icon: '😴', streakDays: 1, completedToday: true, pointsPerDay: 1 },
  { name: 'Exercise', key: 'exercise', icon: '🏃', streakDays: 1, completedToday: false, pointsPerDay: 1 },
  { name: 'Mood Logging', key: 'mood', icon: '😊', streakDays: 1, completedToday: true, pointsPerDay: 1 },
  { name: 'Meal Plan', key: 'meal', icon: '🍎', streakDays: 1, completedToday: true, pointsPerDay: 1 },
  { name: 'Cycle Tracker', key: 'cycle', icon: '🩸', streakDays: 1, completedToday: true, pointsPerDay: 1 },
  { name: 'AI Check-in', key: 'ai', icon: '🤖', streakDays: 1, completedToday: true, pointsPerDay: 1 }
];

export const BADGES = [
  { id: 'water_hero', title: 'Hydration Hero', icon: '💧', desc: 'Met water goal for 7 consecutive days' },
  { id: 'sleep_champ', title: 'Sleep Champion', icon: '😴', desc: 'Averaged 7.5+ hours of sleep this week' },
  { id: 'fitness_friend', title: 'Fitness Friend', icon: '🏃', desc: 'Completed 3+ active movement sessions' },
  { id: 'mood_master', title: 'Mood Master', icon: '😊', desc: 'Logged mood for 10 consecutive days' },
  { id: 'healthy_plate', title: 'Healthy Plate', icon: '🥗', desc: 'Followed low-GI meals for a full week' },
  { id: 'blooming_cons', title: 'Blooming Consistency', icon: '🌸', desc: 'Maintained a 14-day Bloom Streak' },
  { id: 'wellness_warrior', title: 'Wellness Warrior', icon: '💜', desc: 'Reached Bloom Level: Glow' },
  { id: 'garden_guardian', title: 'Garden Guardian', icon: '🌺', desc: 'Nurtured garden for 30+ days' }
];

export const getStoredBloomState = (): BloomState => {
  const stored = localStorage.getItem('demo_bloom_state');
  if (stored) {
    return JSON.parse(stored);
  }

  const defaultState: BloomState = {
    totalBloomPoints: 6,
    bloomLevel: 'Seed',
    bloomLevelIndex: 0,
    streakDays: 1,
    gardenStage: 'Small Seedling',
    gardenStageIcon: '🌱',
    weeklyProgressDays: 1,
    bloomPassAvailable: true,
    activeSeasonalTheme: 'Spring',
    habits: INITIAL_HABITS,
    unlockedBadges: []
  };

  localStorage.setItem('demo_bloom_state', JSON.stringify(defaultState));
  return defaultState;
};

export const saveBloomState = (state: BloomState) => {
  localStorage.setItem('demo_bloom_state', JSON.stringify(state));
};

export const toggleHabitToday = (key: string): BloomState => {
  const state = getStoredBloomState();
  const updatedHabits = state.habits.map((h) => {
    if (h.key === key) {
      const nowCompleted = !h.completedToday;
      return {
        ...h,
        completedToday: nowCompleted,
        streakDays: nowCompleted ? h.streakDays + 1 : Math.max(0, h.streakDays - 1)
      };
    }
    return h;
  });

  const pointsDelta = updatedHabits.find((h) => h.key === key)?.completedToday ? 1 : -1;
  const newPoints = Math.max(0, state.totalBloomPoints + pointsDelta);

  // Recalculate Bloom Level
  let newLevel = BLOOM_LEVELS[0].name;
  let levelIdx = 0;
  for (let i = BLOOM_LEVELS.length - 1; i >= 0; i--) {
    if (newPoints >= BLOOM_LEVELS[i].minPoints) {
      newLevel = BLOOM_LEVELS[i].name;
      levelIdx = i;
      break;
    }
  }

  const updatedState: BloomState = {
    ...state,
    totalBloomPoints: newPoints,
    bloomLevel: newLevel,
    bloomLevelIndex: levelIdx,
    habits: updatedHabits
  };

  saveBloomState(updatedState);
  return updatedState;
};
