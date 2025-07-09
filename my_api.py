from fastapi import FastAPI, HTTPException
from typing import List, Optional
from enum import IntEnum
from pydantic import BaseModel, Field

app = FastAPI()


class Priority(IntEnum):
    LOW = 3
    MEDIUM = 2
    HIGH = 1

class TodoBase(BaseModel):
    todo_name: str = Field(..., min_length=3, max_length= 512, description= 'The name of the TODO task')
    todo_description: str = Field(..., description= 'Description of the TODO')
    priority: Priority

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    todo_id: int = Field(..., description= 'Unique Identifier of the TODO')
    

class TodoUpdate(BaseModel):
    todo_name: Optional[str] = Field(None, min_length=3, max_length= 512, description= 'The name of the TODO task')
    todo_description: Optional[str] = Field(None, description= 'Description of the TODO')
    priority: Optional[Priority]


all_todos= [
    Todo(todo_id= 1, todo_name= 'Gym', todo_description= '10 sets per repz', priority=2),
    Todo(todo_id= 2, todo_name= 'Reading', todo_description= 'Read 10 pages', priority=1),
    Todo(todo_id= 3, todo_name= 'Meditation', todo_description= 'chill', priority=3)
    
]


@app.get('/')
def index():
    return ('Message: Hello World')

@app.get('/todos/{todod_id}', response_model= Todo)
def get_todo(todo_id: int):
    for todo in all_todos:
        if todo.todo_id == todo_id:
            return todo
    
@app.get('/todos', response_model= List[Todo])
def get_todos(first_n: int = None):
    if first_n:
        return all_todos[:first_n]
    else:
        return all_todos
    
@app.post('/todos', response_model=Todo)
def create_todo(todo: TodoCreate):
    new_todo_id = max(todo.todo_id for todo in all_todos) + 1
    new_todo = Todo(todo_id= new_todo_id, todo_name= todo.todo_name, todo_description= todo.todo_description, priority= todo.priority)
    
    all_todos.append(new_todo)
    
    return new_todo


@app.put('/todos', response_model= Todo)
def update_todo(todo_id: int, updated_todo: TodoUpdate):
    for todo in all_todos:
        if todo.todo_id == todo_id:
            todo.todo_name = updated_todo.todo_name
            todo.todo_description = updated_todo.todo_description
            return todo
    raise HTTPException(status_code=404, detail= 'Not found')


@app.delete('/todos', response_model= Todo)
def delete_todo(todo_id: int):
    for index, todo in enumerate (all_todos):
        if todo.todo_id == todo_id:
            deletd_todo = all_todos.pop(index)
            return deletd_todo
    raise HTTPException(status_code=404, detail= 'Not found')

            