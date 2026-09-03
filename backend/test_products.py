from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
response = client.get("/api/v1/products")
print(response.status_code)
print(response.text)
