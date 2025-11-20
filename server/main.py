from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import scenarios, decisions
from api import scenarios, decisions, generation
from api import admin



app = FastAPI(
    title="Dilemma Decision Tree API",
    description="Ethical decision-making analysis API",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(generation.router, prefix="/api/generate", tags=["generation"])
app.include_router(scenarios.router, prefix="/api/scenarios", tags=["scenarios"])
app.include_router(decisions.router, prefix="/api/decisions", tags=["decisions"])

@app.get("/")
def read_root():
    return {
        "message": "Dilemma Decision Tree API",
        "docs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}