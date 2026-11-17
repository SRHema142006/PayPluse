import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from app.database.db import init_db
from app.routes import (
    auth, dashboard, invoices, customers, payments,
    reminders, ai, cashflow, financing, loan_readiness,
    reports, notifications, settings
)

app = FastAPI(
    title="PayPlus Financial Assistant API",
    description="AI-powered financial management web application for small businesses",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
    os.getenv("CORS_ORIGIN", "*")
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

# Register API routes
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(invoices.router)
app.include_router(customers.router)
app.include_router(payments.router)
app.include_router(reminders.router)
app.include_router(ai.router)
app.include_router(cashflow.router)
app.include_router(financing.router)
app.include_router(loan_readiness.router)
app.include_router(reports.router)
app.include_router(notifications.router)
app.include_router(settings.router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "app": "PayPlus API",
        "version": "1.0.0"
    }

# Mount static frontend build if present
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api/"):
            return {"error": "API route not found"}
        index_file = os.path.join(frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "PayPlus Backend Running"}
