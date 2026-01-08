
import json
from core.ai_gateway import AIGateway

async def generate_protocol(pico: dict, title: str, api_key: str):
    model = AIGateway.get_reasoning_model(api_key=api_key)

    prompt = f"""
    You are a Senior Clinical Research Scientist.
    Based on the following research project:
    
    Title: "{title}"
    PICO Framework:
    {json.dumps(pico, indent=2)}
    
    Generate a rigorous Research Protocol comprising the following sections:
    1. Study Design (Detailed type, e.g., 'Prospective Observational Cohort')
    2. Methodology (Step-by-step procedure)
    3. Study Population (Inclusion/Exclusion Criteria)
    4. Data Collection (Variables, Instruments)
    5. Statistical Analysis Plan (Tests to be used, Sample size estimation method)
    6. Ethical Considerations
    
    Output strictly valid JSON with keys: "study_design", "methodology", "population", "data_collection", "statistics", "ethics".
    Do not use markdown.
    """
    
    try:
        response = model.generate_content(prompt)
        text = response.text.replace("```json", "").replace("```", "").strip()
        data = json.loads(text)
        return data
    except Exception as e:
        print(f"Protocol Generation Error: {e}")
        return {
            "study_design": "Error generating design.",
            "methodology": "Error generation methodology.",
            "population": "Error.",
            "data_collection": "Error.",
            "statistics": "Error.",
            "ethics": "Error."
        }
