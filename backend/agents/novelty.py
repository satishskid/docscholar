
import httpx
import os
import asyncio
from core.ai_gateway import AIGateway

async def search_openalex(query: str, limit: int = 10):
    url = f"https://api.openalex.org/works?search={query}&per-page={limit}&sort=relevance_score:desc"
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url)
            data = resp.json()
            results = []
            for item in data.get('results', []):
                 # Reconstruct abstract
                abstract = "No abstract available."
                index = item.get('abstract_inverted_index')
                if index:
                    word_list = []
                    for word, positions in index.items():
                        for pos in positions:
                            word_list.append((pos, word))
                    word_list.sort()
                    abstract = " ".join([w[1] for w in word_list])
                
                results.append({
                    "title": item.get('display_name'),
                    "abstract": abstract[:500],
                    "year": item.get('publication_year'),
                    "citations": item.get('cited_by_count'),
                    "url": item.get('doi') or item.get('open_access', {}).get('oa_url')
                })
            return results
        except Exception as e:
            print(f"OpenAlex Error: {e}")
            return []

async def analyze_novelty(topic: str, api_key: str):
    # 1. Gather Prior Art
    prior_art = await search_openalex(topic)
    
    if not prior_art:
        return {
            "score": 0,
            "reasoning": "Could not find sufficient prior art to compare. This might be extremely novel or a search error.",
            "prior_art": []
        }

    # 2. Construct Prompt for Gemini
    context_str = "\n\n".join([
        f"Title: {p['title']}\nYear: {p['year']}\nAbstract: {p['abstract']}" 
        for p in prior_art
    ])
    
    prompt = f"""
    You are a Senior Research Editor at NEJM. Evaluate the NOVELTY of the following research topic based on the retrieved prior art.
    
    Proposed Research Topic: "{topic}"
    
    Existing Prior Art (Top 10 matches):
    {context_str}
    
    Task:
    1. Assign a "Novelty Score" from 0-100 (100 = Groundbreaking/Zero Precedent, 0 = Duplicate/Well-Known Fact).
    2. Provide a "Consensus Summary" of what is already known.
    3. Identify the "Gap" or specific angle that makes this new Proposal unique (or suggest one if it's generic).
    
    Return JSON format only:
    {{
        "novelty_score": int,
        "consensus": "string",
        "gap_analysis": "string",
        "verdict": "string (High/Medium/Low Novelty)"
    }}
    """
    
    # 3. Call Gemini
    # 3. Call Gemini
    model = AIGateway.get_fast_model(api_key=api_key)
    try:
        response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
        ai_analysis =  response.text
        # Use robust extraction
        analysis_json = AIGateway.extract_json_from_text(ai_analysis)
        
        return {
            **analysis_json,
            "prior_art": prior_art[:3] # Return top 3 for UI display
        }
    except Exception as e:
        print(f"Gemini Error: {e}")
        return {
            "novelty_score": 0,
            "consensus": "Error analyzing novelty.",
            "gap_analysis": str(e),
            "verdict": "Error",
            "prior_art": prior_art[:3]
        }
