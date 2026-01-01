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
username-browser/
├── backend/          # Express.js API
├── frontend/         # React.js app
├── data/             # usernames.txt (not in repo)
├── docker-compose.yml
└── README.md
```

## 🚀 Getting Started
_(Instructions will be added as the project progresses)_

## 📊 API Endpoints
_(Will be documented with Swagger)_

## 👨‍💻 Development Process
This project follows TDD (RED → GREEN → REFACTOR) with strict issue tracking and PR-based workflow.

---

**Status**: 🏗️ In Progress  
**Created**: 31/12/2025
**Last Updated**: 01/01/2026