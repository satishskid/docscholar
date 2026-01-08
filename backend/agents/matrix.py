
import json
from core.ai_gateway import AIGateway

async def generate_matrix(papers: list[dict], api_key: str):
    """
    papers: List of dicts with {id, title, abstract}
    Returns: JSON with comparison matrix
    """
    if not papers:
        return {"matrix": []}

    # Construct Prompt
    papers_text = ""
    for idx, p in enumerate(papers):
        papers_text += f"Paper {idx+1}: {p.get('title')}\nAbstract: {p.get('abstract')}\n\n"

    prompt = f"""
    You are a Research Analyst. Create a "Literature Review Matrix" for the following papers.
    For EACH paper, extract the following structured data:
    1. Study Design (RCT, Cohort, Review, etc.)
    2. Population (Who was studied?)
    3. Intervention/Exposure
    4. Main Outcome
    5. Key Findings
    
    Papers:
    {papers_text}
    
    Return ONLY a JSON array of objects. Format:
    [
        {{
            "paper_id": "original id if available or index",
            "title": "...",
            "design": "...",
            "population": "...",
            "intervention": "...",
            "outcome": "...",
            "findings": "..."
        }},
        ...
    ]
    """

    model = AIGateway.get_fast_model(api_key=api_key)
    
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        matrix_data = json.loads(response.text)
        
        # Map back to original IDs if needed, though prompt handles it best if we passed IDs
        # For now, let's assume the LLM respects the order or titles. 
        # Better: We can try to attach the original ID if the LLM returns it, or map by index.
        
        # Hydrate with original ID if missing
        for i, row in enumerate(matrix_data):
            if i < len(papers):
                row['id'] = papers[i].get('id')
                
        return {"matrix": matrix_data}
        
    except Exception as e:
        print(f"Matrix Generation Error: {e}")
        return {"error": str(e), "matrix": []}
