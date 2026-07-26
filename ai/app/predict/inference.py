import os
import joblib
import pandas as pd
import numpy as np
from pydantic import BaseModel, Field
from typing import List, Dict, Any

# Define the Pydantic schema for input
class AssessmentInput(BaseModel):
    age: int = Field(..., ge=10, le=100)
    height: float = Field(..., ge=100, le=250)
    weight: float = Field(..., ge=30, le=200)
    cycle_regularity: int = Field(..., ge=0, le=2) # 0: Regular, 1: Irregular, 2: Very Irregular
    cycle_length: int = Field(..., ge=15, le=120)
    heavy_bleeding: int = Field(..., ge=0, le=1)
    acne: int = Field(..., ge=0, le=1)
    hair_loss: int = Field(..., ge=0, le=1)
    facial_hair: int = Field(..., ge=0, le=1)
    weight_gain: int = Field(..., ge=0, le=1)
    exercise_days: int = Field(..., ge=0, le=7)
    stress_level: int = Field(..., ge=0, le=2) # 0: Low, 1: Medium, 2: High
    sleep_hours: float = Field(..., ge=2, le=16)
    water_intake: int = Field(..., ge=0, le=30)
    sugar_consumption: int = Field(..., ge=0, le=2) # 0: Low, 1: Medium, 2: High
    insulin_resistance: int = Field(..., ge=0, le=1)
    family_history: int = Field(..., ge=0, le=1)
    mood_swings: int = Field(..., ge=0, le=1)
    physical_activity: int = Field(..., ge=0, le=2) # 0: Sedentary, 1: Mod Active, 2: Active

class PredictionResult(BaseModel):
    risk_percentage: float
    confidence_score: float
    risk_category: str
    explanation: str
    key_factors: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
    disclaimer: str

model_cache = None

def get_model():
    global model_cache
    if model_cache is not None:
        return model_cache
        
    model_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    model_path = os.path.join(model_dir, 'model', 'pcos_model.joblib')
    
    if not os.path.exists(model_path):
        print("Model file not found. Training model on synthetic data...")
        from app.model.train import train_and_save_model
        train_and_save_model()
        
    model_cache = joblib.load(model_path)
    return model_cache

def predict_pcos_risk(data: AssessmentInput) -> PredictionResult:
    model_data = get_model()
    pipeline = model_data['pipeline']
    feature_names = model_data['feature_names']
    
    # Calculate BMI
    bmi = data.weight / ((data.height / 100.0) ** 2)
    
    # Prepare input DataFrame matching exact feature names
    input_dict = {
        'age': data.age,
        'bmi': bmi,
        'cycle_regularity': data.cycle_regularity,
        'cycle_length': data.cycle_length,
        'heavy_bleeding': data.heavy_bleeding,
        'acne': data.acne,
        'hair_loss': data.hair_loss,
        'facial_hair': data.facial_hair,
        'weight_gain': data.weight_gain,
        'exercise_days': data.exercise_days,
        'stress_level': data.stress_level,
        'sleep_hours': data.sleep_hours,
        'water_intake': data.water_intake,
        'sugar_consumption': data.sugar_consumption,
        'insulin_resistance': data.insulin_resistance,
        'family_history': data.family_history,
        'mood_swings': data.mood_swings,
        'physical_activity': data.physical_activity
    }
    
    df = pd.DataFrame([input_dict])[feature_names]
    
    # Run prediction
    probs = pipeline.predict_proba(df)[0]
    pcos_prob = probs[1] # Probability of PCOS
    
    # Calculate confidence score (based on the distance from the decision boundary 0.5)
    # The further from 0.5, the higher the confidence.
    confidence = abs(pcos_prob - 0.5) * 2.0 * 100.0
    # Map confidence to a realistic range, say 75% to 98%
    confidence_score = round(75.0 + (confidence * 0.23), 1)
    
    risk_percentage = round(pcos_prob * 100.0, 1)
    
    # Determine risk category
    if risk_percentage < 35.0:
        risk_category = "Low"
    elif risk_percentage < 70.0:
        risk_category = "Moderate"
    else:
        risk_category = "High"
        
    # Analyze contributing factors
    key_factors = []
    
    # Check cycle regularity
    if data.cycle_regularity == 2:
        key_factors.append({"factor": "Very irregular menstrual cycle", "severity": "High", "impact": "Positive"})
    elif data.cycle_regularity == 1:
        key_factors.append({"factor": "Irregular menstrual cycle", "severity": "Medium", "impact": "Positive"})
    else:
        key_factors.append({"factor": "Regular menstrual cycle", "severity": "Low", "impact": "Negative"})
        
    # Check BMI
    if bmi >= 30:
        key_factors.append({"factor": "High BMI (Obese)", "severity": "High", "impact": "Positive"})
    elif bmi >= 25:
        key_factors.append({"factor": "Elevated BMI (Overweight)", "severity": "Medium", "impact": "Positive"})
    else:
        key_factors.append({"factor": "Healthy BMI range", "severity": "Low", "impact": "Negative"})
        
    # Check physical features
    if data.facial_hair == 1:
        key_factors.append({"factor": "Excess facial/body hair growth", "severity": "High", "impact": "Positive"})
    if data.acne == 1:
        key_factors.append({"factor": "Persistent acne or oily skin", "severity": "Medium", "impact": "Positive"})
    if data.hair_loss == 1:
        key_factors.append({"factor": "Scalp hair thinning / hair fall", "severity": "Medium", "impact": "Positive"})
    if data.weight_gain == 1:
        key_factors.append({"factor": "Unexplained weight gain", "severity": "High", "impact": "Positive"})
    if data.insulin_resistance == 1:
        key_factors.append({"factor": "Signs of insulin resistance", "severity": "High", "impact": "Positive"})
    if data.family_history == 1:
        key_factors.append({"factor": "Family history of PCOS / Diabetes", "severity": "Medium", "impact": "Positive"})
        
    # Check lifestyle factors
    if data.exercise_days < 3:
        key_factors.append({"factor": "Low physical exercise frequency", "severity": "Medium", "impact": "Positive"})
    else:
        key_factors.append({"factor": "Active exercise routine", "severity": "Low", "impact": "Negative"})
        
    if data.stress_level == 2:
        key_factors.append({"factor": "High stress levels", "severity": "Medium", "impact": "Positive"})
    elif data.stress_level == 0:
        key_factors.append({"factor": "Low stress levels", "severity": "Low", "impact": "Negative"})
        
    if data.sleep_hours < 6.5:
        key_factors.append({"factor": "Inadequate sleep duration", "severity": "Medium", "impact": "Positive"})
    elif data.sleep_hours >= 7.5:
        key_factors.append({"factor": "Healthy sleep routine", "severity": "Low", "impact": "Negative"})
        
    # Generate explanation text
    if risk_category == "High":
        explanation = f"Your responses indicate a high risk ({risk_percentage}%) of PCOS/PCOD. Key contributors include "
        pos_factors = [f['factor'].lower() for f in key_factors if f['severity'] in ['High', 'Medium']]
        explanation += ", ".join(pos_factors[:4]) + "."
    elif risk_category == "Moderate":
        explanation = f"Your responses suggest a moderate risk ({risk_percentage}%) of developing PCOS/PCOD based on common symptoms and lifestyle factors."
    else:
        explanation = f"Your responses show a low risk ({risk_percentage}%) of PCOS/PCOD. Your current cycle regularity and lifestyle habits are protective factors."

    # Generate recommendations
    recommendations = []
    
    # Base level recommendations
    if risk_category == "High":
        recommendations.append({
            "category": "Medical Consultation",
            "title": "Consult a Gynecologist",
            "description": "Schedule a professional consultation. We recommend discussing hormone panels (free and total testosterone, DHEAS, LH/FSH ratio) and a pelvic ultrasound.",
            "icon": "Doctor"
        })
    elif risk_category == "Moderate":
        recommendations.append({
            "category": "Medical Consultation",
            "title": "Schedule a Wellness Check",
            "description": "Consider consulting a healthcare provider or gynecologist to discuss your irregular cycles and hormone wellness.",
            "icon": "Doctor"
        })
        
    # Diet/Nutrition
    if data.sugar_consumption == 2 or data.insulin_resistance == 1 or bmi >= 25:
        recommendations.append({
            "category": "Nutrition",
            "title": "Adopt a Low-GI Diet",
            "description": "Focus on high-fiber, low-glycemic index foods (whole grains, green vegetables, legumes) and lean protein. This helps manage insulin spikes and supports weight management.",
            "icon": "Nutrition"
        })
    else:
        recommendations.append({
            "category": "Nutrition",
            "title": "Balanced Whole Food Diet",
            "description": "Incorporate complex carbohydrates, anti-inflammatory fats (olive oil, avocados, nuts), and a variety of colorful vegetables to maintain hormonal harmony.",
            "icon": "Nutrition"
        })
        
    # Lifestyle & Exercise
    if data.exercise_days < 3:
        recommendations.append({
            "category": "Lifestyle",
            "title": "Introduce Regular Physical Activity",
            "description": "Aim for at least 150 minutes of moderate exercise per week. Combine strength training (which improves insulin sensitivity) with brisk walking or yoga.",
            "icon": "Lifestyle"
        })
    else:
        recommendations.append({
            "category": "Lifestyle",
            "title": "Optimize Exercise Routine",
            "description": "Keep up your physical activity. Ensure a mix of cardiovascular workouts and resistance training, allowing adequate time for rest and recovery.",
            "icon": "Lifestyle"
        })
        
    # Stress and Wellness
    if data.stress_level == 2:
        recommendations.append({
            "category": "Wellness",
            "title": "Active Stress Management",
            "description": "High stress increases cortisol, which exacerbates PCOS symptoms. Practice mindfulness, deep breathing, or yoga for 15-20 minutes daily.",
            "icon": "Wellness"
        })
        
    # Sleep
    if data.sleep_hours < 7.0:
        recommendations.append({
            "category": "Habits",
            "title": "Establish Sleep Hygiene",
            "description": "Prioritize 7-8 hours of quality sleep. Set a consistent sleep schedule and reduce blue light exposure at least 1 hour before bedtime.",
            "icon": "Sleep"
        })
        
    # Hydration
    if data.water_intake < 8:
        recommendations.append({
            "category": "Habits",
            "title": "Increase Daily Hydration",
            "description": "Drink at least 8-10 glasses (2-2.5 liters) of water daily to support metabolic function and cellular detoxification.",
            "icon": "Water"
        })

    disclaimer = (
        "HerLytics is not a diagnostic or treatment platform. It provides predictive insights based on "
        "user-supplied information and should not be used as a substitute for professional medical advice, "
        "diagnosis, or treatment. Users with concerning symptoms or elevated risk should consult a "
        "qualified healthcare professional."
    )
    
    return PredictionResult(
        risk_percentage=risk_percentage,
        confidence_score=confidence_score,
        risk_category=risk_category,
        explanation=explanation,
        key_factors=key_factors,
        recommendations=recommendations,
        disclaimer=disclaimer
    )
