from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import get_db, projects, requirements, components

app = FastAPI(
    title="RISE - Rocket Integrated Systems Engineering",
    description="Unified database for student rocketry systems engineering and project management",
    version="0.1.0"
)

# middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite and other dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root endpoint
@app.get("/")
def read_root():
    return {
        "message": "Welcome to RISE API",
        "version": "0.1.0",
        "docs": "/docs"
    }

# Health check
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# Get all projects
@app.get("/api/projects")
def get_projects(db: Session = Depends(get_db)):
    project_list = db.query(projects).all()
    return project_list

# Get all requirements
@app.get("/api/requirements")
def get_requirements(limit: int = 100, db: Session = Depends(get_db)):
    requirement_list = db.query(requirements).limit(limit).all()
    return requirement_list

# Get single requirement by requirement_id
@app.get("/api/requirements/{requirement_id}")
def get_requirement(requirement_id: str, db: Session = Depends(get_db)):
    req = db.query(requirements).filter(
        requirements.requirement_id == requirement_id
    ).first()
    if not req:
        return {"error": "Requirement not found"}
    return req

# Get all components
@app.get("/api/components")
def get_components(limit: int = 100, db: Session = Depends(get_db)):
    component_list = db.query(components).limit(limit).all()
    return component_list

# Get single component by part_id
@app.get("/api/components/{part_id}")
def get_component(part_id: str, db: Session = Depends(get_db)):
    comp = db.query(components).filter(
        components.part_id == part_id
    ).first()
    if not comp:
        return {"error": "Component not found"}
    return comp

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)