from google import genai
from google.genai import types
from abc import ABC, abstractmethod
import os
from typing import Optional, List, Dict, Any
import groq

class LLMProvider(ABC):
    """Abstract base class for LLM providers."""
    
    @abstractmethod
    def generate_content(self, model_name: str, contents: Any, **kwargs) -> Any:
        pass

    @abstractmethod
    def embed_content(self, model_name: str, content: str, task_type: str) -> Dict[str, List[float]]:
        pass

class GeminiProvider(LLMProvider):
    """Implementation for Google Gemini via google-genai SDK."""
    
    def __init__(self, api_key: str):
        self.client = genai.Client(api_key=api_key)

    def generate_content(self, model_name: str, contents: Any, **kwargs) -> Any:
        # Wrap response to match expectation (object with .text)
        try:
            return self.client.models.generate_content(model=model_name, contents=contents, config=kwargs.get('generation_config'))
        except Exception as e:
            raise e

    def embed_content(self, model_name: str, content: str, task_type: str) -> Dict[str, List[float]]:
        try:
             resp = self.client.models.embed_content(
                 model=model_name,
                 contents=content,
                 config=types.EmbedContentConfig(task_type=task_type)
             )
             if resp.embeddings:
                  return {'embedding': resp.embeddings[0].values}
             return {'embedding': []}
        except Exception as e:
             raise e

class GroqProvider(LLMProvider):
    """Implementation for Groq."""
    
    def __init__(self, api_key: str):
        self.client = groq.Groq(api_key=api_key)

    def generate_content(self, model_name: str, contents: Any, **kwargs) -> Any:
        # Map generic 'contents' to Groq messages
        # valid input: str or list of strings
        messages = []
        if isinstance(contents, str):
            messages.append({"role": "user", "content": contents})
        elif isinstance(contents, list):
            # simplistic mapping, assumes last is user/instruction or list of strings
            full_prompt = "\n".join([str(c) for c in contents])
            messages.append({"role": "user", "content": full_prompt})
            
        try:
            chat_completion = self.client.chat.completions.create(
                messages=messages,
                model=model_name,
            )
            # Wrap to match Gemini-like interface (object with .text)
            class GroqResponseWrapper:
                def __init__(self, text):
                    self.text = text
            
            return GroqResponseWrapper(chat_completion.choices[0].message.content)
        except Exception as e:
            raise e

    def embed_content(self, model_name: str, content: str, task_type: str) -> Dict[str, List[float]]:
        # Groq doesn't strictly have embeddings yet in the same way, 
        # but generic OpenAI-compatible often do. 
        # For now, we might not use Groq for embeddings or use a compatible model.
        # Placeholder or specific implementation implies mixing providers.
        raise NotImplementedError("Groq embeddings not configured/supported in this adapter yet.")

class AIModelConfig:
    """
    Centralized configuration for AI Models.
    Update this single class to upgrade models across the entire application.
    """
    
    # Provider Selection: "gemini" or "groq"
    PROVIDER = "gemini" 

    # Online Models (Google Vertex/Gemini)
    GEMINI_FAST_MODEL = "gemini-2.0-flash"  
    GEMINI_REASONING_MODEL = "gemini-2.0-flash-lite-preview-02-05"
    GEMINI_EMBEDDING_MODEL = "models/text-embedding-004"
    
    # Groq Models
    GROQ_FAST_MODEL = "llama3-70b-8192"
    GROQ_REASONING_MODEL = "mixtral-8x7b-32768"

    # Local Models
    LOCAL_MODEL_PATH = "google/t5-gemma-2-4b"
    USE_LOCAL_MODE = False
    
    @classmethod
    def get_fast_model_name(cls):
        if cls.PROVIDER == "groq": return cls.GROQ_FAST_MODEL
        return cls.GEMINI_FAST_MODEL

    @classmethod
    def get_reasoning_model_name(cls):
        if cls.PROVIDER == "groq": return cls.GROQ_REASONING_MODEL
        return cls.GEMINI_REASONING_MODEL

    @classmethod
    def get_embedding_model_name(cls):
        # Always Gemini for now for RAG consistency
        return cls.GEMINI_EMBEDDING_MODEL


class AIGateway:
    """
    Factory class to get the appropriate model instance based on configuration.
    Refactored to support generic Providers.
    """
    
    _provider_instance: Optional[LLMProvider] = None
    _current_api_key: Optional[str] = None

    @staticmethod
    def get_provider(api_key: Optional[str] = None) -> LLMProvider:
        """Returns or initializes the provider singleton."""
        
        # If API key changes or not set, re-init (simple strategy)
        if api_key and api_key != AIGateway._current_api_key:
             AIGateway._current_api_key = api_key
             
             # Auto-detect Groq Key
             if api_key.startswith("gsk_"):
                 AIGateway._provider_instance = GroqProvider(api_key)
             else:
                 # Default to Gemini
                 AIGateway._provider_instance = GeminiProvider(api_key)
        
        if not AIGateway._provider_instance:
             raise ValueError("AI Provider not initialized. Pass api_key.")
             
        return AIGateway._provider_instance
    
    @staticmethod
    def configure_api(api_key: str):
        """Pre-initializes the provider."""
        AIGateway.get_provider(api_key)

    @staticmethod
    def get_fast_model(api_key: Optional[str] = None):
        """Returns a wrapper usable by legacy agents."""
        provider = AIGateway.get_provider(api_key)
        model_name = AIModelConfig.get_fast_model_name()
        
        class ProviderModelWrapper:
            def __init__(self, provider, model):
                self.provider = provider
                self.model = model
            
            def generate_content(self, contents, **kwargs):
                return self.provider.generate_content(self.model, contents, **kwargs)

        return ProviderModelWrapper(provider, model_name)

    @staticmethod
    def get_reasoning_model(api_key: Optional[str] = None):
        """Returns a wrapper for reasoning model."""
        provider = AIGateway.get_provider(api_key)
        model_name = AIModelConfig.get_reasoning_model_name()
        
        class ProviderModelWrapper:
            def __init__(self, provider, model):
                self.provider = provider
                self.model = model
            
            def generate_content(self, contents, **kwargs):
                return self.provider.generate_content(self.model, contents, **kwargs)
                     
        return ProviderModelWrapper(provider, model_name)

    @staticmethod
    def embed_content(content: str, api_key: Optional[str] = None, task_type: str = "retrieval_document"):
        """Wrapper for embedding."""
        provider = AIGateway.get_provider(api_key)
        # Note: We might force Gemini for embeddings even if provider=Groq 
        # if Groq doesn't support the same embedding space
        if isinstance(provider, GroqProvider):
            # Fallback to Gemini for embeddings if key available, or error
            # For this 'Release 1.0', let's assume if using Groq, we still use Gemini for Embeddings
            # which requires Gemini Key. 
            pass 

        return provider.embed_content(
            model_name=AIModelConfig.get_embedding_model_name(),
            content=content,
            task_type=task_type
        )
