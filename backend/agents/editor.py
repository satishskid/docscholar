
from core.ai_gateway import AIGateway

async def process_editor_command(text: str, command: str, context: str, api_key: str):
    model = AIGateway.get_fast_model(api_key=api_key)

    system_prompt = "You are an expert academic editor and writing assistant. "
    
    if command == "expand":
        prompt = f"""
        {system_prompt}
        Expand the following text, adding more detail, academic depth, and flow. 
        Maintain the original meaning but make it more comprehensive.
        
        Text to Expand:
        "{text}"
        """
    elif command == "paraphrase":
        prompt = f"""
        {system_prompt}
        Paraphrase the following text to improve clarity, flow, and academic tone.
        
        Text to Paraphrase:
        "{text}"
        """
    elif command == "citation":
        prompt = f"""
        {system_prompt}
        Find a relevant citation or suggest where a citation is needed for the following text.
        Use a placeholder format like [Author, Year] or describe the type of citation needed.
        If you have context, use it.
        
        Text:
        "{text}"
        """
    else:
        return {"result": text}

    try:
        response = model.generate_content(prompt)
        return {"result": response.text.strip()}
    except Exception as e:
        print(f"Editor Command Error: {e}")
        return {"result": text, "error": str(e)}
