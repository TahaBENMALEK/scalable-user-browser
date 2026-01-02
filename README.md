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

## 📊 API Endpoints
_(Will be documented with Swagger in Issue #8)_

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
- **Health Check**: 3/3 passing
- **Alphabet Index**: 0/5 passing (not implemented)
- **User Pagination**: 0/19 passing (not implemented)

**Total**: 3 passing, 24 failing, 27 total

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