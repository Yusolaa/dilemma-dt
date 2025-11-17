from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import scenarios, decisions, reflections

app = FastAPI(title='Dilemma Decision Tree API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(scenarios.router, prefix='/scenarios', tags=['scenarios'])
app.include_router(decisions.router, prefix='/decisions', tags=['decisions'])
app.include_router(reflections.router, prefix='/reflections', tags=['reflections'])

@app.get('/')
async def root():
    return {'message': 'Welcome to the Dilemma Decision Tree API'}