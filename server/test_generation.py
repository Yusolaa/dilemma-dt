import requests
import json

BASE_URL = "http://localhost:8000"

def test_generate_scenario():
    """Test AI scenario generation"""
    
    print("🤖 Generating AI scenario...\n")
    
    response = requests.post(
        f"{BASE_URL}/api/generate/generate",
        json={
            "topic": "discovering a security vulnerability in your company's product",
            "category": "business",
            "difficulty": "intermediate",
            "num_decision_points": 3,
            "save_to_library": True
        }
    )
    
    if response.status_code == 200:
        result = response.json()
        scenario = result['scenario']
        
        print(f"✅ Generated: {scenario['title']}")
        print(f"📝 Description: {scenario['description']}")
        print(f"🎯 ID: {scenario['id']}")
        print(f"💾 Saved: {result['saved']}\n")
        
        print(f"Decision Points: {len(scenario['decision_points'])}")
        for dp in scenario['decision_points']:
            print(f"\nStep {dp['step']}: {dp['prompt']}")
            for choice in dp['choices']:
                print(f"  {choice['id']}) {choice['text']}")
        
        print(f"\nConsequence Rules: {len(scenario['consequence_rules'])}")
        
    else:
        print(f"❌ Error: {response.text}")

def test_topic_suggestions():
    """Test topic suggestions"""
    
    print("\n💡 Getting topic suggestions...\n")
    
    response = requests.get(
        f"{BASE_URL}/api/generate/suggestions",
        params={"category": "medical"}
    )
    
    if response.status_code == 200:
        result = response.json()
        print(f"Category: {result['category']}")
        print("Suggested topics:")
        for i, topic in enumerate(result['topics'], 1):
            print(f"  {i}. {topic}")
    else:
        print(f"❌ Error: {response.text}")

if __name__ == "__main__":
    test_generate_scenario()
    test_topic_suggestions()