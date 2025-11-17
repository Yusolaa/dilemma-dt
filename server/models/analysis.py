from pydantic import BaseModel, Field

class FrameworkAnalysis(BaseModel):
    """Response model for ethical framework analysis"""
    
    utilitarian: str = Field(
        description="Analysis from utilitarian perspective (consequences, overall welfare)"
    )
    deontological: str = Field(
        description="Analysis from deontological perspective (duties, rules, principles)"
    )
    virtue_ethics: str = Field(
        description="Analysis from virtue ethics perspective (character, moral virtues)"
    )
    care_ethics: str = Field(
        description="Analysis from care ethics perspective (relationships, empathy)"
    )
    raw_response: str = Field(
        description="Full raw LLM response for debugging",
        exclude=True  # Don't send to frontend by default
    )
    
    class Config:
        json_schema_extra = {
            "example": {
                "utilitarian": "Maximizes immediate benefit for one person but risks broader organizational harm",
                "deontological": "Violates duty of confidentiality despite good intentions",
                "virtue_ethics": "Demonstrates loyalty but undermines trustworthiness",
                "care_ethics": "Prioritizes immediate relationship needs over institutional stability"
            }
        }