# POST /analyze-decision
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from services.framework_analyzer import framework_analyzer
from services.consequence_generator import consequence_generator
from services.scenario_engine import scenario_engine
from models.analysis import FrameworkAnalysis
from models.scenario import UserDecisionHistory
import uuid

router = APIRouter()

# In-memory session storage (replace with Redis/DB later)
sessions: dict[str, UserDecisionHistory] = {}

class DecisionSubmitRequest(BaseModel):
    scenario_id: str
    session_id: Optional[str] = None
    step: int
    choice_id: str
    choice_text: str

class DecisionSubmitResponse(BaseModel):
    session_id: str
    analysis: FrameworkAnalysis
    consequence: Optional[str] = None
    next_step: Optional[int] = None
    is_final: bool

@router.post("/submit", response_model=DecisionSubmitResponse)
async def submit_decision(request: DecisionSubmitRequest):
    """
    Submit a decision and get analysis + consequences
    """
    
    # Get or create session
    session_id = request.session_id or str(uuid.uuid4())
    
    if session_id not in sessions:
        sessions[session_id] = UserDecisionHistory(
            scenario_id=request.scenario_id,
            session_id=session_id,
            current_step=request.step,
            choices_made=[]
        )
    
    session = sessions[session_id]
    
    # Record choice
    session.choices_made.append({
        "step": request.step,
        "choice_id": request.choice_id,
        "choice_text": request.choice_text
    })
    session.current_step = request.step
    
    # Get scenario context
    scenario = scenario_engine.get_scenario(request.scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    decision_point = scenario_engine.get_decision_point(
        request.scenario_id, 
        request.step
    )
    
    # Generate framework analysis
    decision_history = [c["choice_text"] for c in session.choices_made[:-1]]
    
    analysis = await framework_analyzer.analyze_decision(
        choice=request.choice_text,
        context=decision_point.context if decision_point else scenario.description,
        decision_history=decision_history
    )
    
    # Check for triggered consequences
    consequence = None
    triggered_rule = consequence_generator.check_consequence_triggers(
        history=session,
        current_step=request.step,
        rules=scenario.consequence_rules
    )
    
    if triggered_rule:
        consequence = await consequence_generator.generate_consequence(
            rule=triggered_rule,
            history=session,
            context=scenario.description
        )
    
    # Determine next step
    is_final = scenario_engine.is_final_step(request.scenario_id, request.step)
    next_step = None if is_final else request.step + 1
    
    return DecisionSubmitResponse(
        session_id=session_id,
        analysis=analysis,
        consequence=consequence,
        next_step=next_step,
        is_final=is_final
    )

@router.get("/session/{session_id}")
async def get_session(session_id: str):
    """Get session history"""
    if session_id not in sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return sessions[session_id]