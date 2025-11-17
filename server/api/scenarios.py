# GET /scenarios
from fastapi import APIRouter, HTTPException
from services.scenario_engine import scenario_engine
from models.scenario import Scenario, DecisionPoint
from typing import List

router = APIRouter()

@router.get("/", response_model=List[Scenario])
async def list_scenarios():
    """Get all available scenarios"""
    return scenario_engine.list_scenarios()

@router.get("/{scenario_id}", response_model=Scenario)
async def get_scenario(scenario_id: str):
    """Get specific scenario details"""
    scenario = scenario_engine.get_scenario(scenario_id)
    
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    return scenario

@router.get("/{scenario_id}/step/{step}", response_model=DecisionPoint)
async def get_decision_point(scenario_id: str, step: int):
    """Get specific decision point in scenario"""
    decision_point = scenario_engine.get_decision_point(scenario_id, step)
    
    if not decision_point:
        raise HTTPException(
            status_code=404, 
            detail="Decision point not found"
        )
    
    return decision_point