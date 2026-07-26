from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.predict.inference import predict_pcos_risk, AssessmentInput, PredictionResult, get_model
from app.model.train import train_and_save_model
import os

app = FastAPI(
    title="HerLytics AI Service",
    description="FastAPI service for PCOS (PCOD) Risk Prediction",
    version="1.0.0"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    print("Starting HerLytics AI Service...")
    # Trigger model loading/training on startup to ensure uvicorn runs immediately with a trained model
    try:
        get_model()
    except Exception as e:
        print(f"Error during startup model loading: {e}")

@app.get("/")
def read_root():
    return {"message": "Welcome to HerLytics AI Prediction API. Go to /docs for Swagger documentation."}

@app.get("/health")
def health_check():
    try:
        model_data = get_model()
        return {
            "status": "healthy",
            "model_loaded": True,
            "metrics": model_data.get("metrics", {})
        }
    except Exception as e:
        return {
            "status": "degraded",
            "model_loaded": False,
            "error": str(e)
        }

@app.post("/predict", response_model=PredictionResult)
def predict(payload: AssessmentInput):
    try:
        result = predict_pcos_risk(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/train")
def retrain():
    try:
        train_and_save_model()
        # Force reload model cache
        global model_cache
        from app.predict import inference
        inference.model_cache = None
        get_model()
        return {"message": "Model retrained and loaded successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Retraining failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
