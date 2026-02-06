# RISE
Rocket Integrated Systems Engineering - unified database for student rocketry systems engineering and project management.

## Features

- Requirements management and traceability
- Component tracking and hierarchy
- Requirement-to-component allocation
- Mass budgeting
- Timeline tracking
- Report tracking

## Quick Start

### Prerequisites
- Docker Desktop
- Python 
- Git

### Running RISE
```bash
# Clone the repository
git clone https://github.com/yourteam/rise.git
cd rise

# Create environment file - edit this file with your database url and password
# your .env file is gitignored, DO NOT put any passwords or sensitive information in files that will be uploaded
cp .env.example .env

# Start RISE
docker-compose up

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Development

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure
```
rise/
├── backend/          # FastAPI application
├── frontend/         # React application
├── docs/             # Documentation
├── docker-compose.yml
└── README.md
```

## License

MIT
