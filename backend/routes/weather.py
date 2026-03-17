from fastapi import APIRouter
import httpx, os

router = APIRouter()
WEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")

@router.get("/weather/{city}")
async def get_weather(city: str):
    async with httpx.AsyncClient() as client:
        # Current weather
        current = await client.get(
            f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={WEATHER_API_KEY}&units=metric"
        )
        # 5-day forecast
        forecast = await client.get(
            f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={WEATHER_API_KEY}&units=metric"
        )
    
    # Handle API errors
    if current.status_code != 200 or forecast.status_code != 200:
        return {"error": "Failed to fetch weather data. Please check your API key and city name."}

    current_data = current.json()
    forecast_data = forecast.json()
    
    # Generate farming alerts
    alerts = []
    temp = current_data["main"]["temp"]
    humidity = current_data["main"]["humidity"]
    
    if humidity > 80:
        alerts.append({"type": "warning", "message": "High humidity — risk of fungal disease"})
    if temp > 38:
        alerts.append({"type": "danger", "message": "Extreme heat — protect crops with irrigation"})
    
    return {
        "current": current_data,
        "forecast": forecast_data["list"][:8],  # 24 hours
        "alerts": alerts,
        "sowing_recommendation": "Good conditions for sowing in next 3 days" if humidity < 70 else "Wait for better conditions"
    }
