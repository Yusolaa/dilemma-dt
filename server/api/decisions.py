from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.framework_analyzer import framework_analyzer
from models.analysis import FrameworkAnalysis

router = APIRouter()

class DecisionAnalysisRequest(BaseModel):
    choice: str
    context: str
    decision_history: Optional[List[str]] = []

class DecisionAnalysisResponse(BaseModel):
    analysis: FrameworkAnalysis
    choice: str

@router.post("/analyze", response_model=DecisionAnalysisResponse)
async def analyze_decision(request: DecisionAnalysisRequest):
    """
    Analyze a decision through multiple ethical frameworks
    """
    try:
        analysis = await framework_analyzer.analyze_decision(
            choice=request.choice,
            context=request.context,
            decision_history=request.decision_history
        )
        
        return DecisionAnalysisResponse(
            analysis=analysis,
            choice=request.choice
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to analyze decision: {str(e)}"
        )