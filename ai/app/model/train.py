import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
import joblib
import os

def generate_synthetic_data(num_samples=1500):
    np.random.seed(42)
    
    # Features
    age = np.random.randint(15, 45, size=num_samples)
    bmi = np.random.uniform(16, 40, size=num_samples)
    cycle_regularity = np.random.choice([0, 1, 2], size=num_samples, p=[0.5, 0.3, 0.2]) # 0: Regular, 1: Irregular, 2: Very Irregular
    cycle_length = np.random.randint(21, 60, size=num_samples)
    # Adjust cycle length based on regularity
    for i in range(num_samples):
        if cycle_regularity[i] == 0:
            cycle_length[i] = np.random.randint(21, 35)
        elif cycle_regularity[i] == 1:
            cycle_length[i] = np.random.randint(35, 45)
        else:
            cycle_length[i] = np.random.randint(45, 90)
            
    heavy_bleeding = np.random.choice([0, 1], size=num_samples, p=[0.7, 0.3])
    acne = np.random.choice([0, 1], size=num_samples, p=[0.6, 0.4])
    hair_loss = np.random.choice([0, 1], size=num_samples, p=[0.6, 0.4])
    facial_hair = np.random.choice([0, 1], size=num_samples, p=[0.75, 0.25])
    weight_gain = np.random.choice([0, 1], size=num_samples, p=[0.6, 0.4])
    exercise_days = np.random.randint(0, 8, size=num_samples)
    stress_level = np.random.choice([0, 1, 2], size=num_samples, p=[0.3, 0.5, 0.2]) # 0: Low, 1: Medium, 2: High
    sleep_hours = np.random.uniform(4, 10, size=num_samples)
    water_intake = np.random.randint(2, 13, size=num_samples)
    sugar_consumption = np.random.choice([0, 1, 2], size=num_samples, p=[0.4, 0.4, 0.2]) # 0: Low, 1: Medium, 2: High
    insulin_resistance = np.random.choice([0, 1], size=num_samples, p=[0.8, 0.2])
    family_history = np.random.choice([0, 1], size=num_samples, p=[0.85, 0.15])
    mood_swings = np.random.choice([0, 1], size=num_samples, p=[0.5, 0.5])
    physical_activity = np.random.choice([0, 1, 2], size=num_samples, p=[0.4, 0.4, 0.2]) # 0: Sedentary, 1: Mod Active, 2: Active
    
    # Create scoring for target (PCOS risk)
    # Higher score means higher probability of PCOS
    score = (
        (cycle_regularity * 2.5) +
        ((cycle_length > 35).astype(int) * 2.0) +
        ((bmi > 25).astype(int) * 1.5) +
        (facial_hair * 3.0) +
        (acne * 1.5) +
        (hair_loss * 1.2) +
        (weight_gain * 1.5) +
        (insulin_resistance * 2.5) +
        (family_history * 2.0) +
        (stress_level * 0.8) +
        ((exercise_days < 3).astype(int) * 0.8) +
        ((sleep_hours < 6).astype(int) * 0.5) +
        (sugar_consumption * 1.0)
    )
    
    # Normalize score between 0 and 1
    max_score = 22.0
    prob = np.clip(score / max_score, 0, 1)
    
    # Generate labels
    y = np.array([np.random.choice([0, 1], p=[1-p_val, p_val]) for p_val in prob])
    
    df = pd.DataFrame({
        'age': age,
        'bmi': bmi,
        'cycle_regularity': cycle_regularity,
        'cycle_length': cycle_length,
        'heavy_bleeding': heavy_bleeding,
        'acne': acne,
        'hair_loss': hair_loss,
        'facial_hair': facial_hair,
        'weight_gain': weight_gain,
        'exercise_days': exercise_days,
        'stress_level': stress_level,
        'sleep_hours': sleep_hours,
        'water_intake': water_intake,
        'sugar_consumption': sugar_consumption,
        'insulin_resistance': insulin_resistance,
        'family_history': family_history,
        'mood_swings': mood_swings,
        'physical_activity': physical_activity
    })
    
    return df, y

def train_and_save_model():
    print("Generating synthetic dataset...")
    X, y = generate_synthetic_data()
    
    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # Create training pipeline
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('rf', RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42))
    ])
    
    print("Training Random Forest Classifier...")
    pipeline.fit(X_train, y_train)
    
    # Accuracy
    train_acc = pipeline.score(X_train, y_train)
    test_acc = pipeline.score(X_test, y_test)
    print(f"Training Accuracy: {train_acc:.4f}")
    print(f"Testing Accuracy: {test_acc:.4f}")
    
    # Model directory
    model_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'pcos_model.joblib')
    
    # Save the pipeline and feature names
    model_data = {
        'pipeline': pipeline,
        'feature_names': list(X.columns),
        'metrics': {
            'train_accuracy': train_acc,
            'test_accuracy': test_acc
        }
    }
    
    joblib.dump(model_data, model_path)
    print(f"Model saved successfully to {model_path}")
    
if __name__ == '__main__':
    train_and_save_model()
