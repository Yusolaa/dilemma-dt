import asyncio
from services.framework_analyzer import framework_analyzer

async def test():
    analysis = await framework_analyzer.analyze_decision(
        context="You found a confidential document about upcoming layoffs. Your friend Elon works in the affected department.",
        choice="Do not tell Elon about the layoffs",
        decision_history=[]
    )
    
    print("UTILITARIAN:", analysis.utilitarian)
    print("DEONTOLOGICAL:", analysis.deontological)
    print("VIRTUE ETHICS:", analysis.virtue_ethics)
    print("CARE ETHICS:", analysis.care_ethics)

if __name__ == "__main__":
    asyncio.run(test())