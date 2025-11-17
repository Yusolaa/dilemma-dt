from groq import Groq
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    """Centralized service for all LLM interactions"""
    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        self.model = "llama-3.3-70b-versatile"
        
        # Model parameters
        self.default_temperature = 0.7  
        self.default_max_tokens = 1000
    
    async def generate_completion(
        self,
        prompt: str,
        system_prompt: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Generic completion method for all LLM calls
        
        Args:
            prompt: User prompt
            system_prompt: System instructions (optional)
            temperature: Randomness (0-2, default 0.7)
            max_tokens: Response length limit
            
        Returns:
            Generated text response
        """
        messages = []
        
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt
            })
        
        messages.append({
            "role": "user",
            "content": prompt
        })
        
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature or self.default_temperature,
                max_tokens=max_tokens or self.default_max_tokens,
                top_p=1,
                stream=False
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"LLM Error: {str(e)}")
            raise Exception(f"Failed to generate completion: {str(e)}")
    
    async def generate_with_history(
        self,
        messages: list[dict],
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None
    ) -> str:
        """
        Generate completion with conversation history
        Useful for multi-turn scenarios
        
        Args:
            messages: List of {"role": "user/assistant", "content": "..."}
            
        Returns:
            Generated text response
        """
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature or self.default_temperature,
                max_tokens=max_tokens or self.default_max_tokens,
                top_p=1,
                stream=False
            )
            
            return response.choices[0].message.content
            
        except Exception as e:
            print(f"LLM Error: {str(e)}")
            raise Exception(f"Failed to generate completion: {str(e)}")


# Singleton instance
llm_service = LLMService()