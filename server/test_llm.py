import asyncio
from services.framework_analyzer import framework_analyzer

async def test():
    analysis = await framework_analyzer.analyze_decision(
        choice="Tell Elon about the layoffs immediately",
        context="You found a confidential document about upcoming layoffs. Your friend Tom works in the affected department.",
        decision_history=[]
    )
    
    print("UTILITARIAN:", analysis.utilitarian)
    print("DEONTOLOGICAL:", analysis.deontological)
    print("VIRTUE ETHICS:", analysis.virtue_ethics)
    print("CARE ETHICS:", analysis.care_ethics)

if __name__ == "__main__":
    asyncio.run(test())