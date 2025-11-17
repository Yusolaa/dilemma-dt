# Decision tree logic
from models.scenario import Scenario, DecisionPoint, UserDecisionHistory
from typing import Optional, Dict
import json
import os

class ScenarioEngine:
    """Manages scenario loading and progression"""
    
    def __init__(self):
        self.scenarios: Dict[str, Scenario] = {}
        self._load_scenarios()
    
    def _load_scenarios(self):
        """Load scenarios from JSON file"""
        scenarios_path = os.path.join(
            os.path.dirname(__file__), 
            "../data/scenarios.json"
        )
        
        try:
            with open(scenarios_path, 'r') as f:
                data = json.load(f)
                for scenario_data in data['scenarios']:
                    scenario = Scenario(**scenario_data)
                    self.scenarios[scenario.id] = scenario
        except FileNotFoundError:
            print("Warning: scenarios.json not found. Using empty scenario list.")
            self.scenarios = {}
    
    def get_scenario(self, scenario_id: str) -> Optional[Scenario]:
        """Get scenario by ID"""
        return self.scenarios.get(scenario_id)
    
    def list_scenarios(self) -> list[Scenario]:
        """Get all available scenarios"""
        return list(self.scenarios.values())
    
    def get_decision_point(
        self, 
        scenario_id: str, 
        step: int
    ) -> Optional[DecisionPoint]:
        """Get specific decision point"""
        scenario = self.get_scenario(scenario_id)
        if not scenario:
            return None
        
        for dp in scenario.decision_points:
            if dp.step == step:
                return dp
        
        return None
    
    def get_next_step(
        self,
        scenario_id: str,
        current_step: int
    ) -> Optional[DecisionPoint]:
        """Get next decision point"""
        scenario = self.get_scenario(scenario_id)
        if not scenario:
            return None
        
        return self.get_decision_point(scenario_id, current_step + 1)
    
    def is_final_step(self, scenario_id: str, step: int) -> bool:
        """Check if this is the last step"""
        scenario = self.get_scenario(scenario_id)
        if not scenario:
            return True
        
        return step >= len(scenario.decision_points)


# Singleton instance
scenario_engine = ScenarioEngine()