from fastapi import APIRouter, UploadFile, File
from tensorflow.keras.models import load_model # type: ignore
from PIL import Image
import numpy as np, io

router = APIRouter()
disease_model = None
try:
    disease_model = load_model("models/plant_disease_model.h5")
except:
    pass

CLASS_NAMES = [
    "Apple___Apple_scab", "Apple___Black_rot", "Apple___Cedar_apple_rust",
    "Tomato___Early_blight", "Tomato___Late_blight", "Tomato___healthy",
    # Full list from PlantVillage dataset
]

CURE_MAP = {
    "Tomato___Early_blight": {
        "disease": "Early Blight",
        "cause": "Alternaria solani fungus",
        "cure": "Apply copper-based fungicide. Remove infected leaves immediately.",
        "pesticide": "Mancozeb 75% WP @ 2g/L",
        "prevention": "Avoid overhead irrigation. Crop rotation recommended."
    },
    # Add all diseases
}

@router.post("/detect-disease")
async def detect_disease(file: UploadFile = File(...)):
    if not disease_model:
        return {"error": "Model not trained yet."}
        
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).resize((224, 224))
    img_array = np.expand_dims(np.array(img) / 255.0, axis=0)
    
    predictions = disease_model.predict(img_array)
    class_idx = np.argmax(predictions[0])
    confidence = round(float(predictions[0][class_idx]) * 100, 2)
    class_name = CLASS_NAMES[class_idx]
    
    return {
        "disease": class_name,
        "confidence": f"{confidence}%",
        "details": CURE_MAP.get(class_name, {"cure": "Consult local agricultural officer"})
    }
