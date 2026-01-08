
import json
import random
from core.ai_gateway import AIGateway

async def check_similarity(text: str, project_id: str, api_key: str):
    # In a real system, this would query a massive vector database of papers (Turnitin style).
    # For Aiper, we will:
    # 1. Check against Local Library (Documents in the project).
    # 2. Perform a "Heuristic" check using LLM to spot AI-written patterns (ironic).
    # 3. Simulate an External Database check.

    model = AIGateway.get_reasoning_model(api_key=api_key)
    
    # Heuristic AI Check
    prompt = f"""
    You are an expert at detecting plagiarism and AI-generated text.
    Analyze the following text for:
    1. Unusually repetitive patterns (AI markers).
    2. Lack of citations where expected.
    3. Generic, "fluff" content.
    
    Text: "{text[:2000]}..."
    
    Return a JSON object:
    {{
        "ai_probability": <0-100>,
        "citation_needed_count": <int>,
        "quality_score": <0-100>,
        "flags": ["list", "of", "potential", "issues"]
    }}
    Do not use markdown.
    """
    
    try:
        response = model.generate_content(prompt)
        text_resp = response.text.replace("```json", "").replace("```", "").strip()
        analysis = json.loads(text_resp)
        
        # Simulate external matches
        external_matches = []
        if random.random() > 0.7:
             external_matches.append({
                 "source": "Journal of Medical Internet Research (2023)",
                 "similarity": random.randint(5, 20),
                 "snippet": "Similar methodology was observed in..."
             })

        return {
            "overall_score": 100 - max(analysis['ai_probability'], analysis['citation_needed_count'] * 5), # high score is good
            "ai_probability": analysis['ai_probability'],
            "citation_issues": analysis['citation_needed_count'],
            "external_matches": external_matches,
            "flags": analysis['flags']
        }
    except Exception as e:
        print(f"Integrity Check Error: {e}")
        return {"error": "Failed to run integrity check"}
