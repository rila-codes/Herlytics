// assessmentState.ts - Centralized state manager for authentic user assessment status

export interface AssessmentData {
  id?: string;
  riskScore: number;
  riskCategory: string;
  riskPercentage: number;
  completedAt: string;
  answersMap?: Record<string, any>;
  recommendations?: string[];
  dietPlan?: any;
}

export const ASSESSMENT_STORAGE_KEY = 'demo_latest_assessment';
export const HISTORY_STORAGE_KEY = 'demo_assessment_history';

/**
 * Returns true only if the user has completed at least one valid assessment.
 */
export const hasCompletedAssessment = (): boolean => {
  try {
    const raw = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed && (parsed.riskPercentage !== undefined || parsed.riskCategory || parsed.completedAt || parsed.answers));
  } catch (err) {
    console.error('Error reading assessment state:', err);
    return false;
  }
};

/**
 * Retrieves the latest authentic assessment data for the user.
 * Returns null if no assessment has been completed.
 */
export const getLatestAssessmentData = (): AssessmentData | null => {
  try {
    const raw = localStorage.getItem(ASSESSMENT_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AssessmentData;
  } catch (err) {
    console.error('Error parsing latest assessment data:', err);
    return null;
  }
};

/**
 * Saves completed assessment results to localStorage.
 */
export const saveAssessmentResults = (data: Record<string, any>): void => {
  try {
    localStorage.setItem(ASSESSMENT_STORAGE_KEY, JSON.stringify(data));
    
    // Also save to history
    const existingHistoryRaw = localStorage.getItem(HISTORY_STORAGE_KEY);
    const history = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
    history.unshift({
      ...data,
      completedAt: data.completedAt || new Date().toISOString()
    });
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    
    // Dispatch custom event to notify components across the app to re-render immediately
    window.dispatchEvent(new Event('herlytics_assessment_updated'));
  } catch (err) {
    console.error('Error saving assessment results:', err);
  }
};
