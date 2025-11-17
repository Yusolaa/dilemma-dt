# Delayed consequences
from services.llm_service import llm_service
from models.scenario import ConsequenceRule, UserDecisionHistory
from typing import Optional

class ConsequenceGenerator:
    """Generates realistic consequences based on decision history"""
    
    async def generate_consequence(
        self,
        rule: ConsequenceRule,
        history: UserDecisionHistory,
        context: str
    ) -> str:
        """
        Generate consequence text based on a rule and user history
        
        Args:
            rule: ConsequenceRule defining the consequence
            history: User's complete decision history
            context: Current scenario context
            
        Returns:
            Generated consequence text
        """
        
        # Build decision history summary
        history_text = self._format_history(history)
        
        system_prompt = """You are a scenario writer creating realistic consequences for ethical decisions.
Generate consequences that:
- Are believable and grounded in reality
- Connect logically to past decisions
- Are 50-100 words
- Are neutral in tone (not judgmental)
- Show both positive and negative ripple effects"""

        user_prompt = f"""Scenario Context: {context}

User Decision History:
{history_text}

Consequence Template: {rule.consequence_template}

Generate a realistic consequence that appears at step {rule.appears_at_step}, triggered by the choice made at step {rule.trigger_step}.

The consequence should feel natural and show how the earlier decision ripples forward in unexpected ways."""

        consequence = await llm_service.generate_completion(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.8,  # Higher for creative consequences
            max_tokens=200
        )
        
        return consequence.strip()
    
    def _format_history(self, history: UserDecisionHistory) -> str:
        """Format decision history for LLM context"""
        if not history.choices_made:
            return "No previous decisions."
        
        formatted = []
        for choice in history.choices_made:
            formatted.append(f"Step {choice['step']}: {choice['choice_text']}")
        
        return "\n".join(formatted)
    
    def check_consequence_triggers(
        self,
        history: UserDecisionHistory,
        current_step: int,
        rules: list[ConsequenceRule]
    ) -> Optional[ConsequenceRule]:
        """
        Check if any consequence should trigger at current step
        
        Args:
            history: User's decision history
            current_step: Current step number
            rules: All consequence rules for scenario
            
        Returns:
            ConsequenceRule if triggered, None otherwise
        """
        for rule in rules:
            # Check if consequence should appear at this step
            if rule.appears_at_step != current_step:
                continue
            
            # Check if triggering choice was made
            for choice in history.choices_made:
                if (choice['step'] == rule.trigger_step and 
                    choice['choice_id'] == rule.trigger_choice):
                    return rule
        
        return None


# Singleton instance
consequence_generator = ConsequenceGenerator()