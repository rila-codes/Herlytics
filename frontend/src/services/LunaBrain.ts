// LunaBrain.ts - Context-Aware & Emotionally Intelligent AI Engine for HerLytics

import { getLatestAssessmentData, getUserScopedKey } from '../utils/assessmentState';

export type UserContext = {
  userName: string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  bmiCategory: string;
  pcosRiskCategory: string;
  pcosRiskPercentage: number;
  assessmentCompleted: boolean;
  lastPeriodDate: string;
  cycleLength: number;
  waterGlasses: number;
  waterGoalGlasses: number;
  sleepHours: number;
  sleepGoalHours: number;
  currentMood: string;
  exerciseDays: number;
  dietPreference: string;
};

export type ChatMessage = {
  id: string;
  sender: 'user' | 'luna';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  type?: 'text' | 'meal_suggestion' | 'weekly_review' | 'checkin_ack';
};

export const getStoredUserContext = (): UserContext => {
  const storedUser = localStorage.getItem('user');
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userName = parsedUser?.firstName || 'Friend';

  const parsedAssessment = getLatestAssessmentData();
  const assessmentCompleted = Boolean(parsedAssessment && (parsedAssessment.riskPercentage !== undefined || parsedAssessment.riskCategory));

  const answersArray = parsedAssessment?.answers || (parsedAssessment?.answersMap ? Object.entries(parsedAssessment.answersMap).map(([key, value]) => ({ key, value })) : []);
  const answersMap = new Map(answersArray.map((a: any) => [a.key, a.value]));

  const weight = parseFloat((answersMap.get('weight') as string) || '0');
  const height = parseFloat((answersMap.get('height') as string) || '0');
  const bmi = height > 0 ? Math.round((weight / ((height / 100) * (height / 100))) * 10) / 10 : 0;

  let bmiCategory = 'Not Calculated';
  if (bmi > 0) {
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi >= 18.5 && bmi < 25) bmiCategory = 'Normal Weight';
    else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
    else bmiCategory = 'Obese';
  }

  const logsKey = getUserScopedKey('menstrual_logs');
  const storedLogs = JSON.parse(localStorage.getItem(logsKey) || '[]');
  const latestLog = storedLogs.length > 0 ? storedLogs[0] : null;

  const moodKey = getUserScopedKey('today_mood');
  const storedMood = localStorage.getItem(moodKey) || 'Neutral 😐';

  const waterKey = getUserScopedKey('water_glasses');
  const sleepKey = getUserScopedKey('sleep_hours');

  return {
    userName,
    age: parseInt((answersMap.get('age') as string) || '0'),
    height,
    weight,
    bmi,
    bmiCategory,
    pcosRiskCategory: parsedAssessment?.riskCategory || 'Unassessed',
    pcosRiskPercentage: parsedAssessment?.riskPercentage || 0,
    assessmentCompleted,
    lastPeriodDate: latestLog?.logDate || '',
    cycleLength: latestLog?.cycleLength || 28,
    waterGlasses: parseInt(localStorage.getItem(waterKey) || '0'),
    waterGoalGlasses: 8,
    sleepHours: parseFloat(localStorage.getItem(sleepKey) || '0'),
    sleepGoalHours: 8,
    currentMood: storedMood,
    exerciseDays: parseInt((answersMap.get('exerciseDays') as string) || '0'),
    dietPreference: 'Vegetarian',
  };
};

export const DAILY_MOTIVATIONS = [
  "🌸 Every healthy choice today is an investment in tomorrow.",
  "💜 Progress doesn't have to be perfect. Small steps matter.",
  "🌼 Don't forget your water today—you've got this!",
  "✨ Your body does so much for you. Treat it with kindness today.",
  "🌸 Balance isn't something you find, it's something you create."
];

export const generateLunaResponse = (userQuery: string): ChatMessage => {
  const ctx = getStoredUserContext();
  const lower = userQuery.toLowerCase().trim();
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. EMOTIONAL SUPPORT & FEAR / ANXIETY
  if (
    lower.includes('scared') || lower.includes('worried') || lower.includes('fear') || 
    lower.includes('anxious') || lower.includes('nervous') || lower.includes('afraid')
  ) {
    return {
      id: Date.now().toString(),
      sender: 'luna',
      text: `It's completely understandable to feel worried, ${ctx.userName}. 💜 Please remember that your assessment score (${ctx.pcosRiskPercentage}%) is a wellness estimate to guide your lifestyle, not a clinical diagnosis.\n\nMany natural factors—like stress, sleep routines, and diet—influence these numbers, and there are wonderful, positive steps you can take every day to balance your hormones. If you ever feel concerned, speaking with a caring healthcare professional is always the best next step. I'm right here with you! 🌸`,
      timestamp: now,
      quickReplies: ['Explain my assessment', 'What should I eat today?', 'Help me reduce stress']
    };
  }

  // 2. EXPLAIN AI ASSESSMENT RESULTS
  if (
    lower.includes('explain my assessment') || lower.includes('explain result') || 
    lower.includes('risk score') || lower.includes('my risk') || lower.includes('understand result')
  ) {
    return {
      id: Date.now().toString(),
      sender: 'luna',
      text: `Here is a human breakdown of your health profile, ${ctx.userName}:\n\nYour assessment suggests a ${ctx.pcosRiskCategory.toLowerCase()} pattern (${ctx.pcosRiskPercentage}% score) based on factors such as cycle regularity (${ctx.cycleLength} days), sleep averages (${ctx.sleepHours} hrs), and BMI (${ctx.bmi} ${ctx.bmiCategory}).\n\nThis is not a medical diagnosis, but it indicates that your body will thrive with low-GI meals, consistent hydration (${ctx.waterGlasses}/${ctx.waterGoalGlasses} glasses today), and stress management. Would you like meal suggestions for today? 🥗`,
      timestamp: now,
      quickReplies: ['What should I eat today?', 'Show my progress', 'Give me a recipe']
    };
  }

  // 3. PERSONALIZED MEAL RECOMMENDATIONS
  if (
    lower.includes('what should i eat') || lower.includes('meal plan') || 
    lower.includes('diet recommendation') || lower.includes('food recommendation') || lower.includes('what to eat')
  ) {
    return {
      id: Date.now().toString(),
      sender: 'luna',
      type: 'meal_suggestion',
      text: `Based on your goal to manage ${ctx.pcosRiskCategory.toLowerCase()} and stabilize blood sugar, here are three balanced, low-GI meal ideas for today:\n\n🥣 **Breakfast**: Spiced Cinnamon Oats with pumpkin seeds & blueberries (or scrambled tofu sourdough)\n🥗 **Lunch**: Quinoa & herb roasted vegetable bowl with avocado & tahini dressing\n🥘 **Dinner**: Paneer or Lean Tofu tikka with steamed broccoli & sweet potato mash\n\nWould you like vegetarian alternatives or full recipes for any of these? 🌸`,
      timestamp: now,
      quickReplies: ['Give me recipes', 'Show vegetarian options', 'Order healthy food']
    };
  }

  // 4. WEEKLY REVIEW & SUMMARY
  if (
    lower.includes('weekly review') || lower.includes('weekly summary') || 
    lower.includes('my progress') || lower.includes('show progress')
  ) {
    return {
      id: Date.now().toString(),
      sender: 'luna',
      type: 'weekly_review',
      text: `Here is your Wellness Summary for the week, ${ctx.userName}:\n\n💧 **Water Goal Achieved**: ${Math.min(ctx.waterGlasses, 8)}/8 glasses daily average\n😴 **Sleep Goal**: ${ctx.sleepHours} hrs average (Goal: ${ctx.sleepGoalHours} hrs)\n🏃 **Exercise Activity**: ${ctx.exerciseDays} sessions this week\n😊 **Current Mood**: ${ctx.currentMood}\n\nGreat progress! This week, let's focus on getting an extra 30-60 minutes of sleep and adding 2 more glasses of water daily. You are doing amazing! 💜`,
      timestamp: now,
      quickReplies: ['What should I eat today?', 'Help me reduce stress', 'Daily motivation']
    };
  }

  // 5. DAILY MOTIVATION
  if (lower.includes('motivation') || lower.includes('quote') || lower.includes('inspire') || lower.includes('cheer me up')) {
    const randomQuote = DAILY_MOTIVATIONS[Math.floor(Math.random() * DAILY_MOTIVATIONS.length)];
    return {
      id: Date.now().toString(),
      sender: 'luna',
      text: `${randomQuote}\n\nRemember ${ctx.userName}, every small choice you make today nourishes your health for tomorrow. I'm proud of your effort! 🌸`,
      timestamp: now,
      quickReplies: ['What should I eat today?', 'Show my progress', 'Explain my assessment']
    };
  }

  // 6. HEALTH & SYMPTOM Q&A (PCOS, LATE CYCLE, WATER, STRESS)
  if (lower.includes('what is pcos') || lower.includes('pcos meaning')) {
    return {
      id: Date.now().toString(),
      sender: 'luna',
      text: `PCOS (Polycystic Ovary Syndrome) is a common hormonal condition that affects how a woman's ovaries function. It is often characterized by reproductive hormone imbalances, insulin resistance, irregular cycles, and symptoms like acne or unwanted hair growth.\n\nWhile it sounds intimidating, PCOS is highly manageable through tailored nutrition, stress reduction, and healthy movement. *Note: This is educational guidance, not medical advice.* 🌸`,
      timestamp: now,
      quickReplies: ['Explain my assessment', 'What foods are good for hormonal health?']
    };
  }

  if (lower.includes('cycle late') || lower.includes('period late') || lower.includes('why is my cycle late')) {
    return {
      id: Date.now().toString(),
      sender: 'luna',
      text: `Menstrual cycle delays can happen for several natural reasons, including hormonal fluctuations (like elevated androgens or low progesterone), high cortisol stress levels, recent sleep changes, or sudden weight shifts.\n\nSince your average cycle length is ${ctx.cycleLength} days and your last logged period was ${ctx.lastPeriodDate}, keeping stress low and eating anti-inflammatory meals helps encourage regularity. If delays persist beyond 35-45 days, it's wise to consult your doctor. 🌸`,
      timestamp: now,
      quickReplies: ['Help me reduce stress', 'What foods are good for hormonal health?']
    };
  }

  if (lower.includes('food') && lower.includes('hormon')) {
    return {
      id: Date.now().toString(),
      sender: 'luna',
      text: `Foods that support hormonal balance include:\n\n1. **Anti-inflammatory Fats**: Avocados, walnuts, extra virgin olive oil, and flaxseeds.\n2. **Low-GI Carbs**: Steel-cut oats, quinoa, sweet potatoes, and lentils.\n3. **Cruciferous Veggies**: Broccoli, cauliflower, and kale (help clear excess estrogen).\n4. **Clean Protein**: Tofu, chickpeas, eggs, and wild fish.\n\nWould you like recipes featuring these foods? 🥗`,
      timestamp: now,
      quickReplies: ['Give me recipes', 'What should I eat today?']
    };
  }

  if (lower.includes('water') || lower.includes('hydration')) {
    return {
      id: Date.now().toString(),
      sender: 'luna',
      text: `Hydration is essential for flushing excess hormones and aiding kidney function! Aim for 8-10 glasses (2 to 2.5 liters) of water daily. Right now, you've logged ${ctx.waterGlasses} glasses today—you are doing great! 💧`,
      timestamp: now,
      quickReplies: ['What should I eat today?', 'Show my progress']
    };
  }

  if (lower.includes('stress') || lower.includes('anxiety') || lower.includes('relax')) {
    return {
      id: Date.now().toString(),
      sender: 'luna',
      text: `Lowering stress directly reduces cortisol, which helps regulate ovulation! Here are 3 gentle ways to relax right now:\n\n1. **4-7-8 Breathing**: Inhale for 4s, hold for 7s, exhale slowly for 8s.\n2. **10-Minute Walk**: A light stroll lowers cortisol without triggering physical stress.\n3. **Chamomile or Peppermint Tea**: Calms gut motility and nervous tension.\n\nTake a deep breath, ${ctx.userName}. You are doing wonderfully! 💜`,
      timestamp: now,
      quickReplies: ['Daily motivation', 'What should I eat today?']
    };
  }

  // DEFAULT EMPATHETIC FALLBACK
  return {
    id: Date.now().toString(),
    sender: 'luna',
    text: `I hear you, ${ctx.userName}. Based on your health context (Age: ${ctx.age}, PCOS Risk: ${ctx.pcosRiskCategory}), I can help you with meal ideas, explaining your assessment scores, cycle tracking, stress reduction, or weekly progress summaries.\n\nRemember, I'm here for educational and emotional support—not for medical diagnosis. What would you like to focus on together today? 🌸`,
    timestamp: now,
    quickReplies: ['Explain my assessment', 'What should I eat today?', 'Show my progress', 'Daily motivation']
  };
};
