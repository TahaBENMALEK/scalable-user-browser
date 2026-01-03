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
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/TahaBENMALEK/scalable-user-browser.git
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

## Running with Docker ( I Recommend thid)

### Quick Start with Docker
```bash
# Build and start
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

## Running Locally (Development)

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


## Testing

**Backend:**
```bash
cd backend
npm test              # Run all tests
npm run test:coverage # With coverage
```

**Frontend Manual Test:**
1. Open http://localhost:3000
2. Click any letter (A-Z)
3. Verify users load
4. Scroll to test infinite loading

**Troubleshooting:**
- Ports in use? Change in `docker-compose.yml`
- Data file missing? Check `./data/usernames.txt` exists
- Build fails? Run `docker-compose build --no-cache`


### Extra: Available Scripts

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
- **Tailwind CSS 3.4** - Utility-first styling (colors extracted from SanadTech logo)
- **Axios 1.6** - HTTP client
- **react-window + react-window-infinite-loader** - List virtualization with infinite scroll

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

## Design Decisions

### 1. Alphabet Navigation Only (No Full List by Default)
**Decision:** Empty state on load, users select a letter to browse.

**Rationale:**
- Loading 10M users sequentially would take several minutes
- Defeats the purpose of efficient alphabetical indexing
- Most users want specific letter ranges, not to scroll through millions
- Aligns with technical requirement: "algorithmic efficiency and analytical skills"
- Provides instant initial load with responsive alphabet menu

### 2. No Search Functionality
**Decision:** Alphabet navigation is the primary and sufficient interface.

**Rationale:**
- Not mentioned in technical requirements
- Alphabet navigation provides "easy navigation through alphabetized list" as specified
- Search would require different indexing strategy (prefix trees/elasticsearch) outside scope
- Keeps focus on core requirement: efficient display and navigation of large sorted datasets
- Simple, performant solution matching the 5-day timeline

### 3. List Virtualization Strategy
**Decision:** Use react-window with InfiniteLoader for rendering optimization.

**Rationale:**
- Only renders visible items (12-15 at a time in 600px viewport)
- Maintains smooth 60fps scrolling regardless of dataset size
- Memory efficient: O(1) memory usage instead of O(n)
- Industry-standard solution for large lists (used by Twitter, Facebook, etc.)

### 4. Color Palette Selection
**Decision:** Extract colors from SanadTech company logo.

**Rationale:**
- Shows attention to detail and company research
- Creates brand alignment and professional appearance
- Used HTML Color Picker tool for accurate extraction
- Demonstrates thoughtful design approach within technical test context

### 5. File-Based Storage (No Database)
**Decision:** Stream data directly from text file using Node.js readline.

**Rationale:**
- Requirements allow "file-based or backend/database"
- Simpler deployment (no database setup required)
- Demonstrates efficient streaming algorithms
- Index built once at startup, then kept in memory
- Suitable for read-only, sorted data scenarios

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

- Issue #1-8: Backend implementation and testing (COMPLETED)
- Issue #9: React setup and base layout (COMPLETED)
- Issue #10: Infinite scroll and alphabet navigation (COMPLETED)
- Issue #11: Dockerization and environment setup (TODO)
- Issue #12: Final documentation and submission readiness (TODO)

---

**Status**: Backend Complete - Frontend Core Features Complete  
**Created**: 2025-12-31  
**Last Updated**: 2026-01-03  
**Author**: Taha BENMALEK <benmalektaha.inpt@gmail.com>