from services.llm_service import llm_service
from models.scenario import Scenario
import json
import uuid
from typing import Optional

class ScenarioGenerator:
    """Generate complete scenarios using LLM"""
    
    async def generate_scenario(
        self,
        topic: str,
        category: str,
        difficulty: str = "intermediate",
        num_decision_points: int = 3
    ) -> Scenario:
        """
        Generate a complete ethical scenario
        
        Args:
            topic: Main topic/theme (e.g., "workplace discrimination")
            category: business, medical, personal, civic
            difficulty: beginner, intermediate, advanced
            num_decision_points: Number of decision steps (2-5)
            
        Returns:
            Complete Scenario object
        """
        
        system_prompt = """You are an expert ethical scenario designer and educator.
Create realistic, nuanced ethical dilemmas for training purposes.

CRITICAL RULES:
1. Output ONLY valid JSON - no markdown, no backticks, no explanation
2. Each decision point must have 3-4 distinct choices
3. Choices should have no obvious "correct" answer
4. Consequences must logically connect to earlier choices
5. Use realistic, professional scenarios
6. Be culturally sensitive and inclusive
7. Avoid extreme violence or graphic content

Output this EXACT JSON structure:
{
  "title": "Brief catchy title (max 60 chars)",
  "description": "One sentence description (max 150 chars)",
  "category": "exact category provided",
  "difficulty": "exact difficulty provided",
  "estimated_time": 8,
  "decision_points": [
    {
      "step": 1,
      "context": "Detailed situation (100-200 words)",
      "prompt": "Question asking what to do",
      "choices": [
        {"id": "A", "text": "Choice description"},
        {"id": "B", "text": "Choice description"},
        {"id": "C", "text": "Choice description"}
      ]
    }
  ],
  "consequence_rules": [
    {
      "trigger_choice": "A",
      "trigger_step": 1,
      "appears_at_step": 3,
      "consequence_template": "Brief consequence description"
    }
  ]
}"""

        user_prompt = f"""Generate an ethical dilemma scenario:

TOPIC: {topic}
CATEGORY: {category}
DIFFICULTY: {difficulty}
DECISION POINTS: {num_decision_points}

Requirements:
- Create {num_decision_points} sequential decision points
- Each decision point has 3-4 realistic choices
- No choice should be obviously "right" or "wrong"
- Add {num_decision_points - 1} consequence rules that trigger 2 steps after the choice
- Make consequences feel natural and realistic
- Focus on moral complexity and trade-offs

Example consequence rule:
- If user chooses "Report to authorities" at step 1
- Consequence appears at step 3: "Your report led to an investigation, but your relationship with colleagues is strained"

Generate the complete scenario now as valid JSON."""

        try:
            response = await llm_service.generate_completion(
                prompt=user_prompt,
                system_prompt=system_prompt,
                temperature=0.8,  # Higher for creativity
                max_tokens=3000
            )
            
            # Clean response (remove markdown if present)
            cleaned = response.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned.replace("```json", "").replace("```", "").strip()
            
            # Parse JSON
            scenario_data = json.loads(cleaned)
            
            # Generate unique ID
            scenario_data["id"] = f"gen_{uuid.uuid4().hex[:12]}"
            
            # Validate and create Scenario object
            scenario = Scenario(**scenario_data)
            
            return scenario
            
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse generated scenario JSON: {str(e)}\nResponse: {response}")
        except Exception as e:
            raise Exception(f"Failed to generate scenario: {str(e)}")
    
    async def generate_multiple(
        self,
        topics: list[str],
        category: str,
        difficulty: str = "intermediate"
    ) -> list[Scenario]:
        """Generate multiple scenarios in batch"""
        scenarios = []
        
        for topic in topics:
            try:
                scenario = await self.generate_scenario(
                    topic=topic,
                    category=category,
                    difficulty=difficulty
                )
                scenarios.append(scenario)
            except Exception as e:
                print(f"Failed to generate scenario for '{topic}': {str(e)}")
                continue
        
        return scenarios
    
    async def refine_scenario(
        self,
        scenario: Scenario,
        feedback: str
    ) -> Scenario:
        """Refine an existing scenario based on feedback"""
        
        system_prompt = "You refine ethical scenarios based on feedback. Output only valid JSON."
        
        user_prompt = f"""Original Scenario:
{scenario.model_dump_json(indent=2)}

Feedback: {feedback}

Improve the scenario based on this feedback. Maintain the same structure and ID.
Output the refined scenario as valid JSON."""

        response = await llm_service.generate_completion(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.7,
            max_tokens=3000
        )
        
        cleaned = response.strip().replace("```json", "").replace("```", "").strip()
        scenario_data = json.loads(cleaned)
        
        return Scenario(**scenario_data)


# Singleton instance
scenario_generator = ScenarioGenerator()