from fastapi import FastAPI, HTTPException
from typing import List, Optional
from enum import IntEnum
from pydantic import BaseModel, Field

app = FastAPI()

# Creating new user 
@app.post('/register')
def create_user():
    pass

# User login
@app.post('/login')
def user_login():
    pass

# Upload a file
@app.post('/upload_file')
def upload_file():
    pass
# Get a specific file
@app.get('/get_file/{file_name}')
def get_file(file_name: str):
    pass
# List all uploaded file
@app.get('/list_files')
def list_files ():
    pass
# Generate study guide
@app.post('/generate_study_guide')
def generate_study_guide():
    pass
# Generate mock exams
@app.post('/generate_mock_exam')
def generate_mock_exams():
    pass
# Setting reminders
@app.post('/set_reminder')
def set_reminder():
    pass
# Viewing all reminders
@app.get('/get_reminders')
def get_reminders():
    pass
# Delete reminder
@app.delete('/delete_reminder/{reminder_id}')
def delete_reminder(reminder_id: int):
    pass
# Chat
@app.post('/chat_to_bot')
def chat():
    pass
# Personalizing
@app.post('/set_preference')
def set_preference():
    pass
# Update preference
@app.put('/update_preference')
def updating_preference():
    pass
# Viewing preference
@app.get('/view_preference')
def get_set_preference():
    pass
# Recommendation
@app.get('/get_recommendation')
def get_recommendation():
    pass
# Past questions
@app.post('/add_past_question')
def past_questions():
    pass
# Generating practice question
@app.post('/generate_practice_question')
def generate_pre_questions():
    pass
# Getting news interest (usually course specific)
@app.post('/add_news_interest')
def get_news_interest():
    pass
# Getting the news update
@app.get('/get_news_update')
def get_news_updates():
    pass