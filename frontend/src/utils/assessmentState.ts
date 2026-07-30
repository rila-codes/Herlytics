// assessmentState.ts - Centralized state manager for authentic user assessment status

export interface AssessmentData {
  id?: string;
  riskScore: number;
  riskCategory: string;
  riskPercentage: number;
  completedAt: string;
  answersMap?: Record<string, any>;
  answers?: { key: string; value: string }[];
  recommendations?: string[];
  dietPlan?: any;
  explanation?: string;
  confidenceScore?: number;
}

/**
 * Returns the email of the currently authenticated user, or null if unauthenticated.
 */
export const getCurrentUserEmail = (): string | null => {
  try {
    const rawUser = localStorage.getItem('user');
    if (!rawUser) return null;
    const user = JSON.parse(rawUser);
    return user?.email ? user.email.toLowerCase().trim() : null;
  } catch {
    return null;
  }
};

/**
 * Gets the user-scoped localStorage key for latest assessment.
 */
export const getAssessmentKey = (): string => {
  const email = getCurrentUserEmail();
  return email ? `herlytics_${email}_latest_assessment` : 'demo_latest_assessment';
};

/**
 * Gets the user-scoped localStorage key for assessment history.
 */
export const getHistoryKey = (): string => {
  const email = getCurrentUserEmail();
  return email ? `herlytics_${email}_assessment_history` : 'demo_assessment_history';
};

/**
 * Gets any generic user-scoped storage key.
 */
export const getUserScopedKey = (baseKey: string): string => {
  const email = getCurrentUserEmail();
  return email ? `herlytics_${email}_${baseKey}` : `demo_${baseKey}`;
};

export const ASSESSMENT_STORAGE_KEY = getAssessmentKey();
export const HISTORY_STORAGE_KEY = getHistoryKey();

/**
 * Returns true only if the currently logged in user has completed at least one valid assessment.
 */
export const hasCompletedAssessment = (): boolean => {
  try {
    const email = getCurrentUserEmail();
    if (!email) return false;
    
    const key = getAssessmentKey();
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed && (parsed.riskPercentage !== undefined || parsed.riskCategory || parsed.completedAt || parsed.answers));
  } catch (err) {
    console.error('Error reading assessment state:', err);
    return false;
  }
};

/**
 * Retrieves the latest authentic assessment data for the logged-in user.
 * Returns null if no assessment has been completed.
 */
export const getLatestAssessmentData = (): AssessmentData | null => {
  try {
    const email = getCurrentUserEmail();
    if (!email) return null;

    const key = getAssessmentKey();
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as AssessmentData;
  } catch (err) {
    console.error('Error parsing latest assessment data:', err);
    return null;
  }
};

/**
 * Saves completed assessment results to user-scoped localStorage.
 */
export const saveAssessmentResults = (data: Record<string, any>): void => {
  try {
    const assessmentKey = getAssessmentKey();
    const historyKey = getHistoryKey();

    localStorage.setItem(assessmentKey, JSON.stringify(data));
    
    // Also save to user-scoped history
    const existingHistoryRaw = localStorage.getItem(historyKey);
    const history = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
    history.unshift({
      ...data,
      completedAt: data.completedAt || new Date().toISOString()
    });
    localStorage.setItem(historyKey, JSON.stringify(history));
    
    // Dispatch custom event to notify components across the app to re-render immediately
    window.dispatchEvent(new Event('herlytics_assessment_updated'));
  } catch (err) {
    console.error('Error saving assessment results:', err);
  }
};
