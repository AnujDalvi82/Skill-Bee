# SCAMPER Innovation Platform

A digital platform for structured creative thinking, empowering teams to unlock systematic innovation through the proven SCAMPER methodology.

## Product Vision

To become the leading digital platform for structured creative thinking, empowering every team to unlock systematic innovation through proven methodologies like SCAMPER, transforming how organizations approach product development and problem-solving.

## Target Audience

- Innovation teams
- Product managers
- Design thinking facilitators
- Startup founders
- Corporate strategy groups seeking structured approaches to creative problem-solving and continuous improvement initiatives

## Core Features

- **Project Management**: Create and manage innovation projects
- **SCAMPER Sessions**: Apply SCAMPER techniques (Substitute, Combine, Adapt, Modify, Put to another use, Eliminate, Reverse)
- **Idea Tracking**: Capture and manage ideas generated from SCAMPER sessions
- **CRUD Operations**: Full create, read, update, delete functionality for all entities

## Technology Stack

- **Backend**: FastAPI (Python)
- **Database**: SQLite (SQLAlchemy ORM)
- **Architecture**: Modular Monolith
- **API**: RESTful API with automatic OpenAPI documentation

## Prerequisites

- Python 3.9 or higher
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file with your configuration
```

## Running Locally

1. Activate virtual environment (if not already activated):
```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Start the application:
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

3. Access the application:
- API: http://localhost:8000
- Interactive API Documentation: http://localhost:8000/docs
- Alternative API Documentation: http://localhost:8000/redoc

## API Endpoints

### Projects
- `POST /api/v1/projects` - Create a new project
- `GET /api/v1/projects` - List all projects
- `GET /api/v1/projects/{project_id}` - Get a specific project
- `PUT /api/v1/projects/{project_id}` - Update a project
- `DELETE /api/v1/projects/{project_id}` - Delete a project

### SCAMPER Sessions
- `POST /api/v1/sessions` - Create a new SCAMPER session
- `GET /api/v1/sessions` - List all sessions (filter by project_id)
- `GET /api/v1/sessions/{session_id}` - Get a specific session
- `PUT /api/v1/sessions/{session_id}` - Update a session
- `DELETE /api/v1/sessions/{session_id}` - Delete a session

### Ideas
- `POST /api/v1/ideas` - Create a new idea
- `GET /api/v1/ideas` - List all ideas (filter by session_id)
- `GET /api/v1/ideas/{idea_id}` - Get a specific idea
- `PUT /api/v1/ideas/{idea_id}` - Update an idea
- `DELETE /api/v1/ideas/{idea_id}` - Delete an idea

## SCAMPER Methodology

SCAMPER is a creative thinking technique that uses seven prompts:

- **S**ubstitute: What can you substitute or replace?
- **C**ombine: What can you combine or merge?
- **A**dapt: What can you adapt or adjust?
- **M**odify: What can you magnify, minify, or modify?
- **P**ut to another use: How can you use it differently?
- **E**liminate: What can you remove or simplify?
- **R**everse: What can you rearrange or reverse?

## Project Structure

```
.
├── backend/
│   ├── main.py              # Main application entry point
│   ├── config.py            # Configuration management
│   ├── database.py          # Database setup and session management
│   ├── models.py            # SQLAlchemy database models
│   ├── schemas.py           # Pydantic schemas for validation
│   ├── routers/
│   │   └── scamper_router.py # API route handlers
│   └── requirements.txt     # Python dependencies
├── .env.example             # Environment variables template
└── README.md               # This file
```

## Environment Variables

See `.env.example` for all available configuration options:

- `DATABASE_URL`: Database connection string
- `SECRET_KEY`: Secret key for security (change in production)
- `CORS_ORIGINS`: Allowed CORS origins
- `DEBUG`: Enable/disable debug mode

## Development

### Database Migrations

The application automatically creates database tables on startup. For production, consider using Alembic for migrations:

```bash
pip install alembic
alembic init alembic
# Configure alembic.ini and env.py
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

### Code Quality

Follow PEP 8 style guidelines for Python code. Use tools like:
- `black` for code formatting
- `flake8` for linting
- `mypy` for type checking

## Security Considerations

- Change `SECRET_KEY` in production to a strong random string
- Use environment variables for sensitive configuration
- Enable HTTPS in production
- Implement rate limiting for API endpoints
- Add authentication and authorization as needed

## License

[Add your license information here]

## Support

For questions or issues, please contact [your contact information]
