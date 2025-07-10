from pydantic import BaseModel
from typing import Union, Optional, List
from datetime import datetime


# ---------- User ---------
class UserCreate(BaseModel):
    new_user_name: str
    new_user_password: str
class UserLogin(BaseModel):
    existing_user_name: str
    existing_user_password: str
    
# ------- File --------    
class FileUpload(BaseModel):
    file_name: str
    file_type: str
    uploaded_at: datetime
    user_id: str

# -------- AI -----------
class AIRequest(BaseModel):
    prompt: str                # User's message to the AI
    intent: str                # "chat", "study_guide", "mock_exam", etc.
    topic: Optional[str] = None     # If user already specified a topic
    file_id: Optional[str] = None   # PDF or file reference if needed
    user_id: str
class AIResponse(BaseModel):
    response: str
    intent: str
    timestamp: datetime
class AILog(BaseModel):
    user_id: str
    prompt: str
    response: str
    intent: str
    topic: Optional[str]
    file_used: Optional[str]
    timestamp: datetime
    
# ------- App Features ------
class Reminder(BaseModel):
    title: str
    description: Optional[str] = None
    remind_at: datetime
    user_id: str
 
class Preference(BaseModel):
    study_style: Optional[str] = None         # e.g., "visual", "auditory"
    topics_of_interest: Optional[List[str]] = None
    user_id: str
 

