# Username Browser 🔍

A high-performance web application for browsing millions of usernames with alphabetical indexing and infinite scroll.

## 🎯 Project Goals
- Stream 10M+ usernames without loading them into memory
- Alphabetical index (A–Z) built at startup
- Cursor-based pagination API
- Virtualized infinite scroll frontend
- Full Docker support

## 🏗️ Architecture
- **Backend**: Node.js + Express.js
- **Frontend**: React.js
- **Principles**: TDD, OOP, SOLID, Clean Architecture
- **Data**: File-based streaming from `usernames.txt`

## 📁 Project Structure
```
scalable-user-browser/          ← Root directory
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
│   ├── src/
│   │   ├── components/        ← React components
│   │   ├── services/          ← API calls
│   │   ├── hooks/             ← Custom React hooks
│   │   └── styles/            ← CSS/styling
│   ├── public/                ← Static assets
│   ├── package.json
│   ├── .eslintrc.json         ← ESLint configuration
│   ├── .prettierrc.json       ← Prettier configuration
│   └── .env.example           ← Environment variables template
│
├── data/                       ← Data storage
│   └── .gitkeep               ← Keeps folder in Git
│
├── .gitignore
├── LICENSE
├── README.md
└── docker-compose.yml          ← Docker orchestration
```

## 🛠️ Development Setup

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

### Available Scripts

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

#### Frontend
- `npm start` - Start development server (http://localhost:3000)
- `npm test` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run build` - Build for production
- `npm run lint` - Check code quality
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## 📊 API Endpoints | API Documentation:

Interactive API documentation is available via Swagger UI.

### Access Documentation

After starting the backend server:

```bash
cd backend
npm run dev
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

Configure the API base URL in `.env`:

```bash
BASE_URL=http://localhost:3001  # Change for production
```

## 👨‍💻 Development Process
This project follows TDD (RED → GREEN → REFACTOR) with strict issue tracking and PR-based workflow.

### Git Workflow
1. Create feature branch from `main`
2. Implement changes
3. Run tests and linting
4. Commit with descriptive messages
5. Create Pull Request
6. Merge after review

## 🧪 Testing Strategy
- **Backend**: Jest + Supertest for API testing
- **Frontend**: React Testing Library for component testing
- **TDD Approach**: Write failing tests first (RED), make them pass (GREEN), then refactor

## Current Test Status

### Backend Tests
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

---

**Status**: 🏗️ In Progress  
**Created**: 2025-12-31  
**Last Updated**: 2026-01-02