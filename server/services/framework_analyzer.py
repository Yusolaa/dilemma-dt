# Ethical framework analysis
from services.llm_service import llm_service
from models.analysis import FrameworkAnalysis
from typing import List

class FrameworkAnalyzer:
    """Analyzes decisions through multiple ethical frameworks"""
    
    FRAMEWORKS = [
        "Utilitarian",
        "Deontological", 
        "Virtue Ethics",
        "Care Ethics"
    ]
    
    async def analyze_decision(
        self,
        choice: str,
        context: str,
        decision_history: List[str] = None
    ) -> FrameworkAnalysis:
        """
        Analyze a single decision through all ethical frameworks
        
        Args:
            choice: The decision made (e.g., "Tell Tom immediately")
            context: Current scenario context
            decision_history: Previous choices made
            
        Returns:
            FrameworkAnalysis object with all 4 framework perspectives
        """
        
        # Build context with history
        history_text = ""
        if decision_history:
            history_text = "\n\nPrevious decisions:\n" + "\n".join(
                f"{i+1}. {d}" for i, d in enumerate(decision_history)
            )
        
        # System prompt for consistent output
        system_prompt = """You are an expert in applied ethics. Analyze decisions through multiple ethical frameworks.
Be concise (20-30 words per framework), objective, and non-judgmental.
Use this format for EACH framework:

**Framework Name:** [Brief analysis highlighting key considerations]

Do NOT use emojis. Be professional and educational."""

        # User prompt
        user_prompt = f"""Context: {context}{history_text}

Current Decision: "{choice}"

Analyze this decision through these 4 frameworks:
1. **Utilitarian:** Focus on consequences and overall welfare
2. **Deontological:** Focus on duties, rules, and principles
3. **Virtue Ethics:** Focus on character and moral virtues demonstrated
4. **Care Ethics:** Focus on relationships, empathy, and context

Provide analysis for each framework."""

        # Generate analysis
        response = await llm_service.generate_completion(
            prompt=user_prompt,
            system_prompt=system_prompt,
            temperature=0.6,  # Lower for more consistent analysis
            max_tokens=600
        )
        
        # Parse response into structured format
        analysis = self._parse_analysis(response)
        
        return FrameworkAnalysis(
            utilitarian=analysis.get("Utilitarian", "Analysis unavailable"),
            deontological=analysis.get("Deontological", "Analysis unavailable"),
            virtue_ethics=analysis.get("Virtue Ethics", "Analysis unavailable"),
            care_ethics=analysis.get("Care Ethics", "Analysis unavailable"),
            raw_response=response
        )
    
    def _parse_analysis(self, response: str) -> dict:
        """Parse LLM response into framework dictionary"""
        analysis = {}
        
        for framework in self.FRAMEWORKS:
            # Simple parsing - look for framework name in response
            if framework in response:
                # Extract text after framework name until next framework or end
                start = response.find(framework)
                
                # Find end point (next framework or end of text)
                end = len(response)
                for next_fw in self.FRAMEWORKS:
                    if next_fw != framework:
                        next_pos = response.find(next_fw, start + len(framework))
                        if next_pos != -1 and next_pos < end:
                            end = next_pos
                
                # Extract and clean
                text = response[start:end]
                text = text.replace(framework, "").replace("**", "").strip()
                text = text.lstrip(":").strip()
                
                # Take first sentence/paragraph
                if "\n\n" in text:
                    text = text.split("\n\n")[0]
                
                analysis[framework] = text
        
        return analysis


# Singleton instance
framework_analyzer = FrameworkAnalyzer()