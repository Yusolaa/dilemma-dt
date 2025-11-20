import requests
import json

BASE_URL = "http://localhost:8000"

def test_decision_flow():
    """Test complete decision flow"""
    
    # Step 1: Get scenario
    print("1. Fetching scenario...")
    response = requests.get(f"{BASE_URL}/api/scenarios/leaked_report_001")
    scenario = response.json()
    print(f"   Scenario: {scenario['title']}\n")
    
    # Step 2: Make first decision
    print("2. Making first decision...")
    response = requests.post(
        f"{BASE_URL}/api/decisions/submit",
        json={
            "scenario_id": "leaked_report_001",
            "session_id": None,
            "step": 1,
            "choice_id": "A",
            "choice_text": "Tell Tom immediately so he can prepare"
        }
    )
    result1 = response.json()
    session_id = result1["session_id"]
    print(f"   Session ID: {session_id}")
    print(f"   Utilitarian: {result1['analysis']['utilitarian']}\n")
    
    # Step 3: Make second decision
    print("3. Making second decision...")
    response = requests.post(
        f"{BASE_URL}/api/decisions/submit",
        json={
            "scenario_id": "leaked_report_001",
            "session_id": session_id,
            "step": 2,
            "choice_id": "B",
            "choice_text": "Stay quiet and observe"
        }
    )
    result2 = response.json()
    print(f"   Care Ethics: {result2['analysis']['care_ethics']}\n")
    
    # Step 4: Make final decision
    print("4. Making final decision...")
    response = requests.post(
        f"{BASE_URL}/api/decisions/submit",
        json={
            "scenario_id": "leaked_report_001",
            "session_id": session_id,
            "step": 3,
            "choice_id": "A",
            "choice_text": "Tell the complete truth"
        }
    )
    result3 = response.json()
    print(f"   Consequence: {result3.get('consequence', 'None')}")
    print(f"   Is Final: {result3['is_final']}\n")
    
    # Step 5: Get session history
    print("5. Getting session history...")
    response = requests.get(f"{BASE_URL}/api/decisions/session/{session_id}")
    history = response.json()
    print(f"   Total choices made: {len(history['choices_made'])}")
    for choice in history['choices_made']:
        print(f"   Step {choice['step']}: {choice['choice_text']}")

if __name__ == "__main__":
    test_decision_flow()