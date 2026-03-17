from fastapi import APIRouter, UploadFile, File
import io

router = APIRouter()

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
    # Mocking tensorflow load and predict
    # In real app, we would load .h5 model and do np.argmax(predictions[0])
    
    contents = await file.read()
    
    # Mock return (always returns Tomato Early Blight for testing)
    class_name = "Tomato___Early_blight"
    confidence = 94.2
    
    return {
        "disease": class_name,
        "confidence": f"{confidence}%",
        "details": CURE_MAP.get(class_name, {"cure": "Consult local agricultural officer"})
    }
