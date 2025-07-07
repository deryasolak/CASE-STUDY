from fastapi import FastAPI, HTTPException
import json
import os

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def get_gold_price():
    return 75.0 

@app.get("/products")
def get_products():
    if not os.path.isfile("products.json"):
        raise HTTPException(status_code=500, detail="products.json dosyası bulunamadı!")
    try:
        with open("products.json", "r", encoding="utf-8") as f:
            products = json.load(f)
        gold_price = get_gold_price()
        for product in products:
            price = (product["popularityScore"] + 1) * product["weight"] * gold_price
            product["price"] = round(price, 2)
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hata: {str(e)}")