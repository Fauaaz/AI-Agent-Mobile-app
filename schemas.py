from pydantic import BaseModel

class UserCreate(BaseModel):
    pass 

class UserLogin(BaseModel):
    pass 

class FileUpload(BaseModel):
    pass

class StudyGuideRequest(BaseModel):
    pass

class StudyGuideResponse(BaseModel):
    pass

class MockExamsRequest(BaseModel):
    pass

class Question(BaseModel):
    pass

class MockExamsResponse(BaseModel):
    pass

class Reminder(BaseModel):
    pass
 
class ChatMessage(BaseModel):
    pass

class ChatResponse(BaseModel):
    pass
 
class Preference(BaseModel):
    pass
 
class RecommendationRequest(BaseModel):
    pass 

class RecommendationResponse(BaseModel):
    pass 

class PracticeQuestion(BaseModel):
    pass 

class NewsInterest(BaseModel):
    pass

class NewsUpdate(BaseModel):
    pass  