# Scenario, DecisionPoint
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
# from enum import Enum

class ChoiceOption(BaseModel):
    """Single choice option at a decision point"""
    id: str = Field(description="Unique choice ID (e.g., 'A', 'B', 'C')")
    text: str = Field(description="Choice text shown to user")
    
class DecisionPoint(BaseModel):
    """Single decision point in scenario"""
    step: int = Field(description="Step number in scenario")
    context: str = Field(description="Situation description")
    prompt: str = Field(description="Question asked to user")
    choices: List[ChoiceOption] = Field(description="Available choices")
    
class ConsequenceRule(BaseModel):
    """Rule for generating consequences based on past choices"""
    trigger_choice: str = Field(description="Choice ID that triggers this (e.g., 'A')")
    trigger_step: int = Field(description="Step where choice was made")
    appears_at_step: int = Field(description="Step where consequence appears")
    consequence_template: str = Field(description="Template for consequence text")

class Scenario(BaseModel):
    """Complete scenario definition"""
    id: str = Field(description="Unique scenario ID")
    title: str = Field(description="Scenario title")
    description: str = Field(description="Brief scenario description")
    category: str = Field(description="Category (business, medical, personal, civic)")
    difficulty: str = Field(description="Difficulty level (beginner, intermediate, advanced)")
    decision_points: List[DecisionPoint] = Field(description="All decision points")
    consequence_rules: List[ConsequenceRule] = Field(description="Consequence generation rules")
    estimated_time: int = Field(description="Estimated completion time in minutes")
    
class UserDecisionHistory(BaseModel):
    """Track user's path through scenario"""
    scenario_id: str
    session_id: str
    current_step: int = 0
    choices_made: List[Dict[str, str]] = []  # [{"step": 1, "choice_id": "A"}]
    
class DecisionRequest(BaseModel):
    """Request to submit a decision"""
    scenario_id: str
    session_id: str
    step: int
    choice_id: str
    choice_text: str