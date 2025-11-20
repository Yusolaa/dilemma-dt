from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.scenario_generator import scenario_generator
from services.scenario_engine import scenario_engine
from services.llm_service import llm_service
from models.scenario import Scenario
import json

router = APIRouter()

class GenerateScenarioRequest(BaseModel):
    topic: str
    category: str
    difficulty: str = "intermediate"
    num_decision_points: int = 3
    save_to_library: bool = False

class GenerateScenarioResponse(BaseModel):
    scenario: Scenario
    saved: bool = False

class BatchGenerateRequest(BaseModel):
    topics: list[str]
    category: str
    difficulty: str = "intermediate"

@router.post("/generate", response_model=GenerateScenarioResponse)
async def generate_scenario(request: GenerateScenarioRequest):
    """
    Generate a new scenario using AI
    
    Example topics:
    - "AI bias in hiring decisions"
    - "end-of-life care decisions"
    - "insider trading temptation"
    - "environmental violations"
    """
    try:
        scenario = await scenario_generator.generate_scenario(
            topic=request.topic,
            category=request.category,
            difficulty=request.difficulty,
            num_decision_points=request.num_decision_points
        )
        
        saved = False
        if request.save_to_library:
            # Save to scenarios.json
            scenarios_path = "data/scenarios.json"
            
            try:
                with open(scenarios_path, 'r') as f:
                    data = json.load(f)
            except FileNotFoundError:
                data = {"scenarios": []}
            
            data['scenarios'].append(scenario.model_dump())
            
            with open(scenarios_path, 'w') as f:
                json.dump(data, f, indent=2)
            
            # Reload scenarios
            scenario_engine._load_scenarios()
            saved = True
        
        return GenerateScenarioResponse(
            scenario=scenario,
            saved=saved
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate scenario: {str(e)}"
        )

@router.post("/generate/batch")
async def generate_batch(request: BatchGenerateRequest):
    """Generate multiple scenarios at once"""
    
    try:
        scenarios = await scenario_generator.generate_multiple(
            topics=request.topics,
            category=request.category,
            difficulty=request.difficulty
        )
        
        return {
            "generated": len(scenarios),
            "requested": len(request.topics),
            "scenarios": scenarios
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Batch generation failed: {str(e)}"
        )

@router.post("/refine/{scenario_id}")
async def refine_scenario(scenario_id: str, feedback: str):
    """Refine existing scenario based on feedback"""
    
    scenario = scenario_engine.get_scenario(scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    try:
        refined = await scenario_generator.refine_scenario(
            scenario=scenario,
            feedback=feedback
        )
        
        return {"scenario": refined}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to refine scenario: {str(e)}"
        )

@router.get("/suggestions")
async def get_topic_suggestions(category: str):
    """Get AI-generated topic suggestions"""
    
    system_prompt = "You suggest ethical dilemma topics for training scenarios. Output only a JSON array of strings."
    
    user_prompt = f"""Suggest 10 compelling ethical dilemma topics for the {category} category.

Topics should be:
- Realistic and relevant to modern professionals
- Morally complex with no easy answers
- Suitable for training and education
- Culturally sensitive

Output format: ["topic 1", "topic 2", ...]"""

    try:
        response = await llm_service.generate_completion(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.9,
            max_tokens=500
        )
        
        cleaned = response.strip().replace("```json", "").replace("```", "").strip()
        topics = json.loads(cleaned)
        
        return {"category": category, "topics": topics}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate suggestions: {str(e)}"
        )