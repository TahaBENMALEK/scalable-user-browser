# Username Browser

A high-performance web application for browsing millions of usernames with alphabetical indexing and infinite scroll.

## Project Goals
- Stream 10M+ usernames without loading them into memory
- Alphabetical index (A–Z) built at startup
- Cursor-based pagination API
- Virtualized infinite scroll frontend
- Full Docker support

## Architecture
- **Backend**: Node.js + Express.js
- **Frontend**: React.js + Vite + Tailwind CSS
- **Principles**: TDD, OOP, SOLID, Clean Architecture
- **Data**: File-based streaming from `usernames.txt`

## Project Structure
```
scalable-user-browser/          
│
├── backend/                    ← Express.js API
│   ├── src/
│   │   ├── config/            ← Configuration files
│   │   ├── controllers/       ← HTTP request handlers
│   │   ├── services/          ← Business logic
│   │   ├── repositories/      ← Data access layer
│   │   ├── routes/            ← API route definitions
│   │   └── utils/             ← Helper functions
│   ├── tests/                 ← Backend tests
│   ├── package.json
│   ├── .eslintrc.json         ← ESLint configuration
│   ├── .prettierrc.json       ← Prettier configuration
│   ├── jest.config.js         ← Jest configuration
│   └── .env.example           ← Environment variables template
│
├── frontend/                   ← React.js app
│   ├── index.html             ← Entry HTML file
│   ├── src/
│   │   ├── components/        ← React components
│   │   ├── config/            ← Configuration files
│   │   ├── services/          ← API service layer
│   │   ├── App.jsx            ← Root component
│   │   ├── main.jsx           ← Application entry point
│   │   └── index.css          ← Global styles with Tailwind
│   ├── package.json
│   ├── vite.config.js         ← Vite configuration
│   ├── tailwind.config.js     ← Tailwind configuration
│   ├── postcss.config.js      ← PostCSS configuration
│   ├── .eslintrc.cjs          ← ESLint configuration
│   ├── .prettierrc.json       ← Prettier configuration
│   └── .env.example           ← Environment variables template
│
├── data/                       ← Data storage
│   └── .gitkeep               ← Keeps folder in Git
│
├── .gitignore
├── LICENSE
├── README.md
└── docker-compose.yml          ← Docker orchestration (coming soon)
```

## Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd scalable-user-browser
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with your API URL
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Backend runs on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:3000

### Available Scripts

#### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

#### Frontend
- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## Technology Stack

### Backend
- **Node.js + Express.js** - REST API server
- **File Streaming** - Memory-efficient data access
- **Jest + Supertest** - Testing framework
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 18.2** - UI library
- **Vite 5.0** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **Axios 1.6** - HTTP client
- **react-window** - List virtualization (prepared)

## API Documentation

Interactive API documentation is available via Swagger UI.

### Access Documentation

After starting the backend server:

```bash
cd backend
npm start
```

Visit the following URLs:

- **Swagger UI (Interactive):** http://localhost:3001/api-docs
- **OpenAPI Spec (JSON):** http://localhost:3001/api-docs.json
- **Health Check:** http://localhost:3001/health

### Available Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/users/index` | Get alphabetical index with counts |
| GET | `/api/users?letter=A&cursor=0&limit=50` | Get paginated users by letter |

### Testing Endpoints

Use the Swagger UI to test endpoints interactively:

1. Navigate to http://localhost:3001/api-docs
2. Click on any endpoint to expand
3. Click "Try it out"
4. Enter parameters (if required)
5. Click "Execute" to see live results

### Environment Variables

**Backend (.env):**
```bash
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001
DATA_FILE_PATH=./data/usernames.txt
DEFAULT_PAGE_LIMIT=50
MAX_PAGE_LIMIT=100
```

**Frontend (.env):**
```bash
VITE_API_BASE_URL=http://localhost:3001
```

## Development Process

This project follows TDD (RED → GREEN → REFACTOR) with strict issue tracking and PR-based workflow.

### Git Workflow
1. Create feature branch from `main`
2. Implement changes
3. Run tests and linting
4. Commit with descriptive messages
5. Create Pull Request
6. Merge after review

### Branch Naming Convention
```
feature/issue-X-descriptive-name
```

### Commit Message Format
```
Brief summary (imperative mood)

- Bullet point details
- What changed and why
- Reference to issue

Addresses Issue #X
```

## Testing Strategy

- **Backend**: Jest + Supertest for API testing
- **Frontend**: React Testing Library for component testing (coming in Issue #10+)
- **TDD Approach**: Write failing tests first (RED), make them pass (GREEN), then refactor

### Current Test Status

#### Backend Tests
- **Health Check**: 2/2 passing
- **Repository Layer**: 12/12 passing
- **User Index API**: 5/5 passing
- **User Pagination**: 12/12 passing

**Total**: 38 passing, 0 failing, 38 total

All tests passing - GREEN phase complete

Run tests:
```bash
cd backend
npm test
```

Watch mode:
```bash
npm run test:watch
```

Coverage report:
```bash
npm run test:coverage
```

## Issues Progress

- Issue #1-8: Backend implementation (COMPLETED)
- Issue #9: React setup and base layout (IN PROGRESS)
- Issue #10: Infinite scroll and alphabet navigation (TODO)
- Issue #11: Dockerization and environment setup (TODO)
- Issue #12: Final documentation and submission readiness (TODO)

---

**Status**: In Progress  
**Created**: 2025-12-31  
**Last Updated**: 2026-01-03  
**Author**: Taha BENMALEK <benmalektaha.inpt@gmail.com>