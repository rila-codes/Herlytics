// streakManager.ts - Centralized Dynamic Wellness Streak Engine for HerLytics

import { getCurrentUserEmail } from './assessmentState';
import api from '../services/api';

export interface Milestone {
  days: number;
  id: string;
  title: string;
  badge: string;
  icon: string;
  description: string;
}

export const STREAK_MILESTONES: Milestone[] = [
  { days: 7, id: 'consistency_7', title: 'Consistency Badge', badge: 'Consistency Badge', icon: '🌸', description: 'Completed wellness activities for 7 consecutive days!' },
  { days: 30, id: 'blooming_30', title: 'Blooming Habit Badge', badge: 'Blooming Habit Badge', icon: '🦋', description: 'Maintained a 30-day streak of healthy habits!' },
  { days: 100, id: 'champion_100', title: 'Wellness Champion Badge', badge: 'Wellness Champion Badge', icon: '🌳', description: 'Reached an extraordinary 100-day wellness streak!' },
  { days: 365, id: 'year_365', title: 'One Year Wellness Journey', badge: 'One Year Wellness Journey', icon: '👑', description: 'Completed a full year of daily health & wellness tracking!' }
];

export interface StreakInfo {
  currentStreak: number;
  lastActiveDate: string | null;
  completedToday: boolean;
  activeDates: string[]; // YYYY-MM-DD
  wasResetToday: boolean; // True if user returned after missing a day
  badgeIcon: string;
  streakTitle: string;
  subtitle: string;
  nextMilestone: Milestone | null;
  unlockedMilestones: Milestone[];
  resetMessage?: string;
}

/**
 * Returns today's date formatted as YYYY-MM-DD
 */
export const getTodayDateStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Gets a date string minus N days
 */
export const getOffsetDateStr = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Gets storage key for user streak data
 */
export const getStreakStorageKey = (): string => {
  const email = getCurrentUserEmail();
  return email ? `herlytics_${email}_streak_data` : 'demo_streak_data';
};

/**
 * Calculates dynamic streak info based on stored activity dates for the active user.
 */
export const getStreakInfo = (): StreakInfo => {
  const key = getStreakStorageKey();
  const raw = localStorage.getItem(key);
  let activeDates: string[] = [];
  let claimedMilestones: string[] = [];

  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      activeDates = Array.isArray(parsed.activeDates) ? parsed.activeDates : [];
      claimedMilestones = Array.isArray(parsed.claimedMilestones) ? parsed.claimedMilestones : [];
    } catch {
      activeDates = [];
    }
  }

  // Deduplicate and sort descending
  const datesSet = new Set(activeDates);
  const todayStr = getTodayDateStr();
  const yesterdayStr = getOffsetDateStr(1);

  const completedToday = datesSet.has(todayStr);
  const completedYesterday = datesSet.has(yesterdayStr);

  // Calculate consecutive streak
  let currentStreak = 0;
  let wasResetToday = false;

  if (completedToday || completedYesterday) {
    // Start counting back from today (if completed today) or yesterday
    let checkOffset = completedToday ? 0 : 1;
    while (datesSet.has(getOffsetDateStr(checkOffset))) {
      currentStreak++;
      checkOffset++;
    }
  } else {
    // Neither today nor yesterday was completed.
    // Check if user had past activity dates older than yesterday (meaning they missed at least 1 day)
    const hasPastActivity = Array.from(datesSet).some(d => d < yesterdayStr);
    if (hasPastActivity) {
      wasResetToday = true;
    }
    currentStreak = 0;
  }

  // Determine dynamic badge, title & subtitle
  let badgeIcon = '🌱';
  let streakTitle = 'Day 1 Streak';
  let subtitle = "Your wellness journey starts today!";

  if (currentStreak === 0) {
    badgeIcon = '🌱';
    streakTitle = 'No Active Streak Yet';
    subtitle = "Complete today's wellness activities to begin your first streak.";
  } else if (currentStreak === 1) {
    badgeIcon = '🌱';
    streakTitle = 'Day 1 Streak';
    subtitle = "Your wellness journey starts today!";
  } else if (currentStreak >= 2 && currentStreak < 5) {
    badgeIcon = '🌿';
    streakTitle = `${currentStreak} Day Streak`;
    subtitle = "Keep growing!";
  } else if (currentStreak >= 5 && currentStreak < 15) {
    badgeIcon = '🌿';
    streakTitle = `${currentStreak} Day Streak`;
    subtitle = "You're building healthy habits.";
  } else if (currentStreak >= 15 && currentStreak < 30) {
    badgeIcon = '🌸';
    streakTitle = `${currentStreak} Day Streak`;
    subtitle = "Your wellness journey is blooming.";
  } else if (currentStreak >= 30 && currentStreak < 100) {
    badgeIcon = '🦋';
    streakTitle = `${currentStreak} Day Streak`;
    subtitle = "Consistency creates lasting change.";
  } else {
    badgeIcon = '🌳';
    streakTitle = `${currentStreak} Day Streak`;
    subtitle = "Incredible wellness champion!";
  }

  // Encouraging reset message if returning after a missed day
  let resetMessage: string | undefined = undefined;
  if (wasResetToday && currentStreak === 0) {
    resetMessage = "Welcome back! 🌸 Every new beginning is a chance to grow again. Let's start a fresh streak today.";
  }

  // Milestones evaluation
  const unlockedMilestones = STREAK_MILESTONES.filter(m => currentStreak >= m.days);
  const nextMilestone = STREAK_MILESTONES.find(m => currentStreak < m.days) || null;

  return {
    currentStreak,
    lastActiveDate: activeDates.length > 0 ? activeDates[0] : null,
    completedToday,
    activeDates: Array.from(datesSet).sort().reverse(),
    wasResetToday,
    badgeIcon,
    streakTitle,
    subtitle,
    nextMilestone,
    unlockedMilestones,
    resetMessage
  };
};

/**
 * Records a daily wellness activity for the user (water, sleep, mood, exercise, checkin, cycle).
 * Updates user streak state, checks for milestone unlocks, and dispatches real-time UI events.
 */
export const recordDailyActivity = (activityType: string): StreakInfo => {
  const key = getStreakStorageKey();
  const todayStr = getTodayDateStr();

  let activeDates: string[] = [];
  let claimedMilestones: string[] = [];

  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      activeDates = Array.isArray(parsed.activeDates) ? parsed.activeDates : [];
      claimedMilestones = Array.isArray(parsed.claimedMilestones) ? parsed.claimedMilestones : [];
    } catch {
      activeDates = [];
    }
  }

  const datesSet = new Set(activeDates);
  const wasAlreadyCompletedToday = datesSet.has(todayStr);
  datesSet.add(todayStr);

  const updatedDates = Array.from(datesSet).sort().reverse();
  const infoBefore = getStreakInfo();

  // Save to user storage
  const storageData = {
    activeDates: updatedDates,
    claimedMilestones,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem(key, JSON.stringify(storageData));

  // Try saving log to backend if running
  try {
    api.post('/api/lifestyle/logs', {
      logDate: todayStr,
      notes: `Logged ${activityType}`
    }).catch(() => {});
  } catch {
    // Ignore backend offline error
  }

  const updatedInfo = getStreakInfo();

  // Check if a milestone was newly unlocked today
  if (!wasAlreadyCompletedToday) {
    const newlyUnlockedMilestone = STREAK_MILESTONES.find(
      m => updatedInfo.currentStreak === m.days && !claimedMilestones.includes(m.id)
    );

    if (newlyUnlockedMilestone) {
      claimedMilestones.push(newlyUnlockedMilestone.id);
      localStorage.setItem(key, JSON.stringify({
        ...storageData,
        claimedMilestones
      }));

      // Dispatch custom milestone unlocked event
      window.dispatchEvent(new CustomEvent('herlytics_milestone_unlocked', {
        detail: newlyUnlockedMilestone
      }));
    }
  }

  // Dispatch global event so HeaderBar, Dashboard, Profile, and BloomGarden re-render immediately
  window.dispatchEvent(new Event('herlytics_streak_updated'));

  return updatedInfo;
};
