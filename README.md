# Username Browser

A high-performance web application for browsing millions of usernames with alphabetical indexing and infinite scroll.

---

## Project Context

This project was developed as a technical assessment for the **Sanadtech PFE Internship** (5-day challenge, December 31, 2025 - January 4, 2026).

**Challenge:** Build a web application that efficiently loads and displays 10 million usernames without freezing the browser, with alphabetical navigation and infinite scrolling.

---

## Requirements & Solutions

| Requirement | Solution Implemented |
|-------------|---------------------|
| Load 10M+ usernames efficiently | ✅ File streaming + cursor-based pagination |
| No browser freezing | ✅ List virtualization (react-window) - renders only 12-15 visible items |
| Alphabetical navigation | ✅ A-Z menu with real-time user counts |
| Infinite scrolling | ✅ Continuous data loading on scroll with InfiniteLoader |
| Scalable architecture | ✅ O(1) memory, works with 100M+ users |
| Algorithmic efficiency | ✅ O(1) index lookup, O(m) streaming where m = page size |

---

## Key Achievements

- **Performance:** 15-25ms API response time, 35MB memory for 10M users
- **Scalability:** Architecture supports 1B+ usernames without code changes
- **Browser Efficiency:** Never freezes - virtualization renders max 15 items at once
- **Code Quality:** 100% test coverage (38 passing tests), SOLID principles, Clean Architecture
- **Production Ready:** Full Docker support, comprehensive documentation

---

## Documentation

- **[Architecture Overview](docs/ARCHITECTURE.md)** - System design, flow diagrams, and technical decisions
- **[Performance Benchmarks](docs/PERFORMANCE.md)** - Startup time, latency, memory usage, and scalability metrics
- **[API Examples](docs/API_EXAMPLES.md)** - Complete usage guide with curl and JavaScript examples
- **[Testing Guide](docs/TESTING.md)** - Test commands, coverage reports, and validation steps
- **[Development Guide](docs/DEVELOPMENT.md)** - Local setup, npm scripts, and development workflow
- **[Troubleshooting](docs/TROUBLESHOOTING.md)** - Common issues and solutions

---

## Quick Start with Docker

### Prerequisites
- Docker Engine 20.10+
- Docker Compose 2.0+

### Setup Steps

**1. Prepare Data File**

Create `./data/usernames.txt` with sample usernames (one per line). See [Usernames Example](docs/USERNAMES_EXAMPLE.md) for sample data.

**Tested with:** Sanadtech provided sample dataset (630,566 usernames) - verified no browser freezing.

**2. Configure Environment Variables**

```bash
# Backend
cd backend
cp .env.example .env

# Frontend  
cd ../frontend
cp .env.example .env
```

**3. Start Services**

```bash
# Return to project root
cd ..

# Build and start
docker-compose up -d

# Check status
docker-compose ps
```

### Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Docs**: http://localhost:3001/api-docs

For detailed setup and troubleshooting, see [Development Guide](docs/DEVELOPMENT.md).

---

## Project Structure

```
scalable-user-browser/          
│
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # HTTP request handlers
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access layer
│   │   ├── routes/            # API route definitions
│   │   └── utils/             # Helper functions
│   ├── tests/                 # Backend tests (38 passing)
│   ├── Dockerfile
│   └── package.json
│
├── frontend/                   # React.js app
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API service layer
│   │   └── App.jsx            # Root component
│   ├── Dockerfile
│   └── package.json
│
├── data/                       # Data storage
│   └── usernames.txt          # 10M+ usernames
│
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md
│   ├── PERFORMANCE.md
│   ├── API_EXAMPLES.md
│   ├── TESTING.md
│   ├── DEVELOPMENT.md
│   └── TROUBLESHOOTING.md
│
├── docker-compose.yml
└── README.md
```

---

## Technology Stack

**Backend:** Node.js + Express.js + File Streaming (readline) + Jest + Swagger

**Frontend:** React 18 + Vite 5 + Tailwind CSS + Axios + react-window

**DevOps:** Docker + Nginx + Multi-stage builds

---

## Design

The application uses the **Sanadtech brand color palette** for a cohesive visual identity:

- **Primary Orange (Flamingo):** `#f76531` - Navigation and primary actions
- **Accent Orange (Flame Pea):** `#e66536` - Interactive elements and highlights
- **Dark Gray (Tundora/Scorpion):** `#4b4a4a` / `#5d5c5c` - Text and borders
- **Warm Tones:** `#d1633c`, `#ba6242`, `#a26049` - Accent colors
- **Background:** `#f8fafc` - Clean, professional interface

The UI design prioritizes functionality and performance while maintaining a modern, professional appearance aligned with Sanadtech's brand identity.

---

## Design Decisions

### Why Alphabet Navigation Only?
Loading 10M users sequentially would take minutes and freeze the browser. Alphabet-first navigation aligns with efficient indexing strategy.

### Why File-Based Storage?
Requirements allow "file-based or backend/database". File streaming demonstrates efficient algorithms and simplifies deployment for read-only sorted data.

### Why List Virtualization?
Renders only visible items (12-15) instead of 10M DOM nodes. Maintains 60fps scrolling with O(1) memory usage.

### Why Cursor-Based Pagination?
Consistent results even if data changes. Efficient for large datasets without SQL OFFSET overhead.

For detailed technical decisions, see [Architecture Overview](docs/ARCHITECTURE.md).

---

## Performance Highlights

**Addressing the "No Browser Freeze" Challenge:**
- **List Virtualization:** Only renders 12-15 visible items (not 10M)
- **Cursor Pagination:** Loads data in 50-item chunks on-demand
- **File Streaming:** Backend never loads full dataset into memory
- **Indexed Access:** O(1) lookup time per letter

**Key Metrics:**
- Startup: 3 seconds for 10M records
- API Latency: 15-25ms average
- Memory: 35MB total (95% more efficient than loading all data)
- Throughput: 1,500 req/s on single instance

See [Performance Benchmarks](docs/PERFORMANCE.md) for detailed metrics.

---

## Testing

```bash
# Run backend tests
cd backend
npm test              # 38 passing tests
npm run test:coverage # 100% coverage

# Test with Docker
docker-compose up -d
curl http://localhost:3001/health
```

For complete testing guide, see [Testing Guide](docs/TESTING.md).

---

## Issues Progress

- ✅ Issue #1-8: Backend implementation and testing
- ✅ Issue #9: React setup and base layout
- ✅ Issue #10: Infinite scroll and alphabet navigation
- ✅ Issue #11: Dockerization and environment setup
- ✅ Issue #12: Final documentation and submission readiness

---

## Support

Having issues? Check the [Troubleshooting Guide](docs/TROUBLESHOOTING.md) or open an issue on GitHub.

---

**Project Type:** Technical Assessment for Sanadtech PFE Internship  
**Duration:** 5 days (Dec 31, 2025 - Jan 4, 2026)  
**Status:** Production Ready 
**Latest Evidences:**
**New Menu Loaded from Sanadtech Sample Data**  
<img width="1181" height="357" alt="new users" src="https://github.com/user-attachments/assets/1a2c902f-6a63-4913-889b-07fcb66d449c" />

**Clicking on a Letter Output**  
<img width="1366" height="727" alt="app running final" src="https://github.com/user-attachments/assets/54714b96-28f0-464c-ac59-c76e927eb7f8" />

**Loading While Navigating**  
<img width="1366" height="728" alt="loading" src="https://github.com/user-attachments/assets/87de7db4-4d9a-4c49-a071-bb900e1d5ba1" />

**Smooth Loading Until the End of List per Letter**  
<img width="1366" height="728" alt="smooth load until the end" src="https://github.com/user-attachments/assets/b802ba93-f8a3-4698-9cbb-46fde61e737a" />

**Author:** Taha BENMALEK <benmalektaha.inpt@gmail.com>

## License

MIT License - Free To use this project for learning and educationg puposes! - See LICENSE file for more details