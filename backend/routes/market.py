from fastapi import APIRouter
import httpx

router = APIRouter()

@router.get("/market-prices/{state}")
async def get_market_prices(state: str, crop: str = None):
    # Use data.gov.in API or scrape agmarknet.gov.in
    # API: https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070
    
    API_KEY = "your_data_gov_in_api_key"
    url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={API_KEY}&format=json&filters[state.keyword]={state}&limit=20"
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url)
            return response.json()
        except:
            return {"error": "Failed to fetch market data"}

@router.get("/price-trend/{crop}")
def price_trend(crop: str):
    # Return mock historical data for chart
    import random
    months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
    prices = [random.randint(1500, 3500) for _ in months]
    return {"crop": crop, "months": months, "prices": prices}
