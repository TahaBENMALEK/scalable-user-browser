# Development Guide

Complete guide for local development without Docker.

---

## Prerequisites

- Node.js 18+ and npm 9+
- Git
- Text editor (VS Code recommended)

---

## Initial Setup

### Clone Repository

```bash
git clone https://github.com/yourusername/scalable-user-browser.git
cd scalable-user-browser
```

### Prepare Data File

Create `./data/usernames.txt` with sample usernames (one per line). See [Usernames Example](USERNAMES_EXAMPLE.md).

---

## Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
BASE_URL=http://localhost:3001

# Data Configuration
DATA_FILE_PATH=../data/usernames.txt

# Pagination
DEFAULT_PAGE_LIMIT=50
MAX_PAGE_LIMIT=100
```

### Start Development Server

```bash
npm run dev
```

Backend runs on http://localhost:3001 with hot reload.

---

## Frontend Setup

### Install Dependencies

```bash
cd frontend
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Edit `.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001
```

### Start Development Server

```bash
npm run dev
```

Frontend runs on http://localhost:3000 with hot reload.

---

## Available Scripts

### Backend Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start production server |
| `npm run dev` | Start with hot reload (nodemon) |
| `npm test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Check code quality with ESLint |
| `npm run format` | Format code with Prettier |

### Frontend Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code quality with ESLint |
| `npm run format` | Format code with Prettier |

---

## Development Workflow

### 1. Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm run dev  # In both backend and frontend terminals

# Run tests
cd backend && npm test
cd frontend && npm run lint

# Commit changes
git add .
git commit -m "feat: add your feature description"
```

### 2. Code Quality Checks

```bash
# Backend
cd backend
npm run lint      # Check for issues
npm run format    # Auto-fix formatting
npm test          # Run tests

# Frontend
cd frontend
npm run lint      # Check for issues
npm run format    # Auto-fix formatting
```

### 3. Before Pushing

```bash
# Ensure all tests pass
cd backend && npm test

# Ensure no lint errors
cd backend && npm run lint
cd frontend && npm run lint

# Build frontend to verify
cd frontend && npm run build
```

---

## Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── config.js           # Environment configuration
│   ├── controllers/
│   │   └── userController.js   # HTTP request handlers
│   ├── services/
│   │   └── UserService.js      # Business logic
│   ├── repositories/
│   │   └── UserRepository.js   # Data access layer
│   ├── routes/
│   │   └── userRoutes.js       # API route definitions
│   ├── utils/
│   │   ├── errors.js           # Custom error classes
│   │   └── validators.js       # Input validators
│   ├── middleware/
│   │   └── errorHandler.js     # Global error handler
│   └── index.js                # App entry point
├── tests/
│   ├── controllers/
│   ├── services/
│   ├── repositories/
│   └── utils/
├── .env.example
├── package.json
└── Dockerfile
```

### Frontend Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── AlphabetNav.jsx     # A-Z navigation
│   │   ├── UserList.jsx        # Virtualized list
│   │   └── LoadingSpinner.jsx  # Loading indicator
│   ├── hooks/
│   │   └── useInfiniteScroll.js # Infinite scroll logic
│   ├── services/
│   │   └── api.js              # Axios API client
│   ├── config/
│   │   └── config.js           # Environment configuration
│   ├── App.jsx                 # Root component
│   └── main.jsx                # Entry point
├── public/
├── .env.example
├── package.json
├── vite.config.js
└── Dockerfile
```

---

## Coding Standards

### Backend Standards

**File Naming:**
- Controllers: `camelCase.js` (e.g., `userController.js`)
- Services: `PascalCase.js` (e.g., `UserService.js`)
- Utilities: `camelCase.js` (e.g., `validators.js`)

**Code Style:**
- Use ES6+ features
- Async/await for async operations
- Export singleton services
- Comprehensive error handling

**Example:**
```javascript
// Good
class UserService {
  async getUsersByLetter(letter, cursor, limit) {
    try {
      // Implementation
    } catch (error) {
      throw new AppError('Error message', 500);
    }
  }
}

module.exports = new UserService();
```

### Frontend Standards

**Component Naming:**
- Components: `PascalCase.jsx` (e.g., `UserList.jsx`)
- Hooks: `camelCase.js` starting with `use` (e.g., `useInfiniteScroll.js`)

**Code Style:**
- Functional components with hooks
- Props destructuring
- Tailwind CSS for styling

**Example:**
```javascript
// Good
export const UserList = ({ users, loading }) => {
  const { ref, isLoading } = useInfiniteScroll();
  
  return (
    <div className="space-y-2">
      {users.map(user => (
        <div key={user} className="p-2 border">
          {user}
        </div>
      ))}
    </div>
  );
};
```

---

## Debugging

### Backend Debugging

**Console Logging:**
```javascript
console.log('Index built:', index.length, 'letters');
console.log('Request params:', { letter, cursor, limit });
```

**Node.js Inspector:**
```bash
node --inspect src/index.js

# Open Chrome DevTools
chrome://inspect
```

### Frontend Debugging

**React DevTools:**
1. Install React DevTools extension
2. Open DevTools → Components tab
3. Inspect component state and props

**Network Debugging:**
1. Open DevTools → Network tab
2. Filter by "Fetch/XHR"
3. Inspect API requests/responses

**Console Logging:**
```javascript
console.log('Selected letter:', selectedLetter);
console.log('Current cursor:', cursor);
console.log('Users loaded:', users.length);
```

---

## Common Development Tasks

### Add New API Endpoint

1. **Define route** in `backend/src/routes/userRoutes.js`
2. **Create controller method** in `backend/src/controllers/userController.js`
3. **Add service logic** in `backend/src/services/UserService.js`
4. **Write tests** in `backend/tests/`
5. **Update Swagger docs** (inline comments)

### Add New Frontend Component

1. **Create component** in `frontend/src/components/`
2. **Import and use** in parent component
3. **Add Tailwind styling**
4. **Test manually** in browser

### Modify Data Structure

1. **Update Repository** layer first
2. **Update Service** layer business logic
3. **Update Controller** response format
4. **Update Frontend** API service and components
5. **Update tests** to reflect changes

---

## Environment Variables Reference

### Backend Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3001 | Backend server port |
| `NODE_ENV` | development | Environment mode |
| `BASE_URL` | http://localhost:3001 | Server URL for Swagger |
| `DATA_FILE_PATH` | ../data/usernames.txt | Path to data file |
| `DEFAULT_PAGE_LIMIT` | 50 | Default page size |
| `MAX_PAGE_LIMIT` | 100 | Maximum page size |

### Frontend Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | http://localhost:3001 | Backend API endpoint |

**Note:** Vite requires `VITE_` prefix for environment variables.

---

## Hot Reload Configuration

### Backend (Nodemon)

Configuration in `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon src/index.js"
  },
  "nodemonConfig": {
    "watch": ["src"],
    "ext": "js,json",
    "ignore": ["tests/", "node_modules/"]
  }
}
```

### Frontend (Vite)

Configuration in `vite.config.js`:

```javascript
export default {
  server: {
    port: 3000,
    open: true,
    hmr: true
  }
}
```

---

## Performance Tips

### Backend Optimization

- Keep services stateless except for index
- Use streaming for file operations
- Avoid loading full dataset into memory
- Cache frequently accessed data (optional)

### Frontend Optimization

- Use React.memo for expensive components
- Virtualize long lists with react-window
- Debounce scroll events
- Lazy load non-critical components

---

## Git Workflow

### Commit Message Convention

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
```

**Examples:**
```bash
git commit -m "feat(api): add cursor-based pagination"
git commit -m "fix(frontend): resolve infinite scroll bug"
git commit -m "docs(readme): update setup instructions"
```

### Branch Naming

```
feature/description
bugfix/description
hotfix/description
docs/description
```

---

**Last Updated:** 2026-01-04  
**Author:** Taha BENMALEK