import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # App Settings
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    SECRET_KEY: str = "dev-secret-key-change-in-prod"
    
    # Database
    DATABASE_URL: str = "sqlite:///./beacon.db"
    
    # External APIs
    ANTHROPIC_API_KEY: str = ""
    TAVILY_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'

settings = Settings()
