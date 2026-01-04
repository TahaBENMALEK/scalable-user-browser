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

## Documentation

- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design, flow diagrams, and technical decisions
- **[Performance Benchmarks](docs/PERFORMANCE.md)** - Startup time, latency, memory usage, and scalability metrics
- **[API Examples](docs/API_EXAMPLES.md)** - Complete usage guide with curl and JavaScript examples
- **[API Reference](http://localhost:3001/api-docs)** - Interactive Swagger documentation (after starting server)

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
│   ├── Dockerfile             ← Backend container config
│   └── package.json
│
├── frontend/                   ← React.js app
│   ├── src/
│   │   ├── components/        ← React components
│   │   ├── config/            ← Configuration files
│   │   ├── hooks/             ← Custom React hooks
│   │   ├── services/          ← API service layer
│   │   └── App.jsx            ← Root component
│   ├── Dockerfile             ← Frontend container config
│   ├── nginx.conf             ← Nginx configuration
│   └── package.json
│
├── data/                       ← Data storage
│   └── usernames.txt          ← 10M+ usernames (add your file here)
│
├── docs/                       ← Documentation
│   ├── ARCHITECTURE.md        ← System design
│   ├── PERFORMANCE.md         ← Benchmarks
│   └── API_EXAMPLES.md        ← Usage guide
│
├── docker-compose.yml          ← Docker orchestration
└── README.md
```

## Quick Start with Docker

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+
- Data file at `./data/usernames.txt`

### Build and Start

```bash
# Build and start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

## Development Setup

### Running Locally (Without Docker)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm start
```
Backend runs on http://localhost:3001

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
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
- `npm run format` - Format code with Prettier

#### Frontend
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier

## Testing

### Backend Tests
```bash
cd backend
npm test              # Run all tests (38 passing)
npm run test:coverage # With coverage report
```

### Frontend Manual Testing
1. Open http://localhost:3000
2. Click any letter (A-Z) in alphabet navigation
3. Verify users load in virtualized list
4. Scroll down to test infinite loading
5. Switch letters to verify list updates

### Docker Testing
```bash
# Verify containers are healthy
docker-compose ps

# Test backend health
curl http://localhost:3001/health

# Test alphabet index
curl http://localhost:3001/api/users/index

# Test pagination
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=10"
```

## Troubleshooting

### Ports Already in Use
```bash
# Change ports in docker-compose.yml
ports:
  - "3002:3001"  # Backend
  - "3001:80"    # Frontend
```

### Data File Not Found
```bash
# Verify file exists
ls -la ./data/usernames.txt

# Check backend logs
docker-compose logs backend
```

### Build Fails
```bash
# Clear cache and rebuild
docker-compose build --no-cache

# Remove all containers and rebuild
docker-compose down -v
docker-compose up -d --build
```

### Frontend Can't Connect to Backend
```bash
# Verify backend is running
curl http://localhost:3001/health

# Check frontend environment variables
cat frontend/.env
# Should have: VITE_API_BASE_URL=http://localhost:3001
```

## Technology Stack

### Backend
- **Node.js + Express.js** - REST API server
- **File Streaming** - Memory-efficient data access (readline module)
- **Jest + Supertest** - Testing framework
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 18.2** - UI library
- **Vite 5.0** - Build tool and dev server
- **Tailwind CSS 3.4** - Utility-first styling
- **Axios 1.6** - HTTP client
- **react-window** - List virtualization for infinite scroll

### DevOps
- **Docker** - Containerization with multi-stage builds
- **Nginx** - Production web server for frontend
- **GitHub Actions** - CI/CD pipeline (optional)

## Design Decisions

### 1. Alphabet Navigation Only
Empty state on load, users select a letter to browse.

**Rationale:** Loading 10M users sequentially would take minutes and defeat the purpose of efficient indexing. Most users want specific letter ranges, not to scroll through millions.

### 2. No Search Functionality
Alphabet navigation is the primary interface.

**Rationale:** Not mentioned in requirements. Search would require different indexing strategy (prefix trees/elasticsearch) outside scope. Keeps focus on core requirement: efficient display and navigation.

### 3. List Virtualization
Use react-window with InfiniteLoader.

**Rationale:** Only renders visible items (12-15 at a time), maintains 60fps scrolling, O(1) memory usage instead of O(n).

### 4. File-Based Storage
Stream data directly from text file using Node.js readline.

**Rationale:** Requirements allow "file-based or backend/database". Simpler deployment, demonstrates efficient streaming algorithms, suitable for read-only sorted data.

### 5. Cursor-Based Pagination
Use cursors (position offsets) instead of page numbers.

**Rationale:** Consistent results even if data changes, efficient for large datasets, no need to skip rows like SQL OFFSET.

## Performance Features

- Index built once at startup (not per request)
- File streaming (never loads full file into memory)
- Efficient cursor-based pagination
- Supports 10M+ usernames with ~35MB RAM usage
- Request latency: 15-25ms average
- Startup time: 2-3 seconds for 10M dataset

See [Performance Benchmarks](docs/PERFORMANCE.md) for detailed metrics.

## Issues Progress

- ✅ Issue #1-8: Backend implementation and testing (COMPLETED)
- ✅ Issue #9: React setup and base layout (COMPLETED)
- ✅ Issue #10: Infinite scroll and alphabet navigation (COMPLETED)
- ✅ Issue #11: Dockerization and environment setup (COMPLETED)
- ✅ Issue #12: Final documentation and submission readiness (COMPLETED)

---

**Status**: Production Ready  
**Created**: 2025-12-31  
**Last Updated**: 2026-01-04  
**Author**: Taha BENMALEK <benmalektaha.inpt@gmail.com>

## License

MIT License - See LICENSE file for details