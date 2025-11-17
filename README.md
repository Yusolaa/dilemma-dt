# Dilemma Decision Tree

An interactive ethical decision-making tool that analyzes choices through multiple philosophical frameworks and reveals delayed consequences, shows you how different moral philosophies judge your choice and maps out the likely future consequences.

## Tech Stack

**Server:** Python, FastAPI, Groq (Llama 3.3 70B)  
**Client:** Next.js, TypeScript, TailwindCSS  
**Database:** PostgreSQL

## Quick Start

### Server Setup

```bash
cd server
python -m venv .venv
source .venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configure environment
cp .env
# Add your GROQ_API_KEY to .env

# Run server
uvicorn app.main:app --reload
```

API runs at `http://localhost:8000`

### Client Setup

```bash
cd client
npm install

# Configure environment
cp .env.local

# Run dev server
npm run dev
```

App runs at `http://localhost:3000`

## Features

- Multi-step ethical scenarios with branching paths
- Real-time analysis through 4 ethical frameworks:
  - Utilitarian
  - Deontological
  - Virtue Ethics
  - Care Ethics
- Delayed consequences (2-3 steps later)
- Reflection summaries with no judgment

## API Endpoints

- `GET /api/scenarios` - List scenarios
- `GET /api/scenarios/{id}` - Get scenario details
- `POST /api/decisions/analyze` - Analyze decision
- `POST /api/reflections/generate` - Generate reflection

## Environment Variables

**Server (.env)**

```
GROQ_API_KEY=your_key_here
DATABASE_URL=postgresql://user:pass@localhost:5432/dilemma_db
```

**Client (.env.local)**

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## License

MIT
