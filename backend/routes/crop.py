from fastapi import APIRouter
import joblib, numpy as np
from pydantic import BaseModel

router = APIRouter()
model = None
try:
    model = joblib.load("models/crop_model.pkl")
except:
    pass # Will be created by ML script

class CropInput(BaseModel):
    nitrogen: float
    phosphorus: float
    potassium: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

@router.post("/predict-crop")
def predict_crop(data: CropInput):
    if not model:
        return {"error": "Model not trained yet."}
    
    features = np.array([[data.nitrogen, data.phosphorus, data.potassium,
                          data.temperature, data.humidity, data.ph, data.rainfall]])
    prediction = model.predict(features)[0]
    probability = round(max(model.predict_proba(features)[0]) * 100, 2)
    
    crop_info = {
        "rice": {"water_req": "1200-2000mm", "season": "Kharif", "avg_profit": "₹25,000/acre"},
        "wheat": {"water_req": "450-650mm", "season": "Rabi", "avg_profit": "₹20,000/acre"},
        # Add more crops
    }
    
    return {
        "recommended_crop": prediction,
        "confidence": f"{probability}%",
        "details": crop_info.get(prediction.lower(), {})
    }
