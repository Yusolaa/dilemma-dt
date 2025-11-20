from fastapi import APIRouter, HTTPException, Depends
from models.scenario import Scenario
from services.scenario_engine import scenario_engine
import json
import os

router = APIRouter()

# Simple API key auth (replace with proper auth in production)
async def verify_admin_key(api_key: str):
    if api_key != os.getenv("ADMIN_API_KEY"):
        raise HTTPException(status_code=403, detail="Unauthorized")
    return True

@router.post("/scenarios", dependencies=[Depends(verify_admin_key)])
async def create_scenario(scenario: Scenario):
    """Create new scenario"""
    
    # Load existing scenarios
    scenarios_path = "data/scenarios.json"
    with open(scenarios_path, 'r') as f:
        data = json.load(f)
    
    # Add new scenario
    data['scenarios'].append(scenario.dict())
    
    # Save
    with open(scenarios_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    # Reload scenarios in engine
    scenario_engine._load_scenarios()
    
    return {"message": "Scenario created", "id": scenario.id}

@router.put("/scenarios/{scenario_id}", dependencies=[Depends(verify_admin_key)])
async def update_scenario(scenario_id: str, scenario: Scenario):
    """Update existing scenario"""
    
    scenarios_path = "data/scenarios.json"
    with open(scenarios_path, 'r') as f:
        data = json.load(f)
    
    # Find and update
    for i, s in enumerate(data['scenarios']):
        if s['id'] == scenario_id:
            data['scenarios'][i] = scenario.dict()
            break
    else:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    # Save
    with open(scenarios_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    scenario_engine._load_scenarios()
    
    return {"message": "Scenario updated"}

@router.delete("/scenarios/{scenario_id}", dependencies=[Depends(verify_admin_key)])
async def delete_scenario(scenario_id: str):
    """Delete scenario"""
    
    scenarios_path = "data/scenarios.json"
    with open(scenarios_path, 'r') as f:
        data = json.load(f)
    
    data['scenarios'] = [s for s in data['scenarios'] if s['id'] != scenario_id]
    
    with open(scenarios_path, 'w') as f:
        json.dump(data, f, indent=2)
    
    scenario_engine._load_scenarios()
    
    return {"message": "Scenario deleted"}