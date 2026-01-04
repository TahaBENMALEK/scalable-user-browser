# Troubleshooting Guide

Solutions to common issues when running the Username Browser application.

---

## Docker Issues

### Port Already in Use

**Problem:**
```
Error starting userServiceExit: Ports are not available: 
listen tcp 0.0.0.0:3001: bind: address already in use
```

**Solution 1: Kill the process using the port**
```bash
# Linux/macOS
lsof -ti:3001 | xargs kill -9
lsof -ti:3000 | xargs kill -9

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 3001).OwningProcess | Stop-Process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process
```

**Solution 2: Change ports in docker-compose.yml**
```yaml
services:
  backend:
    ports:
      - "3002:3001"  # Use port 3002 instead
  
  frontend:
    ports:
      - "3001:80"    # Use port 3001 instead
```

Update frontend `.env`:
```env
VITE_API_BASE_URL=http://localhost:3002
```

---

### Containers Won't Start

**Problem:**
```
Error response from daemon: container xyz is not running
```

**Solution:**
```bash
# Stop all containers
docker-compose down

# Remove all containers and volumes
docker-compose down -v

# Rebuild and start
docker-compose up -d --build

# Check logs
docker-compose logs -f
```

---

### Data File Not Found

**Problem:**
```
Error: ENOENT: no such file or directory, open '../data/usernames.txt'
```

**Solution:**

1. **Verify file exists:**
```bash
ls -la ./data/usernames.txt
```

2. **Check file path in backend/.env:**
```env
# For Docker (don't change this)
DATA_FILE_PATH=/app/data/usernames.txt

# For local development
DATA_FILE_PATH=../data/usernames.txt
```

3. **Verify volume mounting in docker-compose.yml:**
```yaml
services:
  backend:
    volumes:
      - ./data:/app/data:ro  # :ro = read-only
```

4. **Create sample data:**
```bash
mkdir -p data
echo "alice" > data/usernames.txt
echo "bob" >> data/usernames.txt
echo "charlie" >> data/usernames.txt
```

---

### Build Failures

**Problem:**
```
ERROR [build 4/6] RUN npm ci --only=production
```

**Solution:**
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Restart
docker-compose up -d
```

---

## Backend Issues

### Backend Won't Start Locally

**Problem:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
cd backend

# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install

# Start server
npm run dev
```

---

### Index Build Fails

**Problem:**
```
Error building index: ENOENT: no such file or directory
```

**Solution:**

1. **Check DATA_FILE_PATH in .env:**
```bash
cd backend
cat .env | grep DATA_FILE_PATH
```

2. **Use relative path for local development:**
```env
DATA_FILE_PATH=../data/usernames.txt
```

3. **Verify file permissions:**
```bash
chmod 644 data/usernames.txt
```

---

### Tests Failing

**Problem:**
```
FAIL tests/services/UserService.test.js
Error: Index not initialized
```

**Solution:**

1. **Ensure test data exists:**
```bash
# Tests use backend/tests/fixtures/test-usernames.txt
cat backend/tests/fixtures/test-usernames.txt
```

2. **Run tests with proper environment:**
```bash
cd backend
NODE_ENV=test npm test
```

3. **Clear Jest cache:**
```bash
npm test -- --clearCache
```

---

## Frontend Issues

### Frontend Can't Connect to Backend

**Problem:**
```
Network Error: Request failed with status code 404
CORS error
```

**Solution:**

1. **Verify backend is running:**
```bash
curl http://localhost:3001/health
```

2. **Check VITE_API_BASE_URL in frontend/.env:**
```env
VITE_API_BASE_URL=http://localhost:3001
```

3. **Restart frontend to reload env variables:**
```bash
cd frontend
npm run dev
```

4. **Check browser console for CORS errors.** Backend should allow frontend origin in CORS config.

---

### Build Fails

**Problem:**
```
ERROR: Failed to compile with 1 error
Module not found: Can't resolve 'axios'
```

**Solution:**
```bash
cd frontend

# Remove node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Rebuild
npm run build
```

---

### White Screen / No Content

**Problem:** Frontend loads but shows blank page.

**Solution:**

1. **Check browser console for errors:**
```
Press F12 → Console tab
```

2. **Verify API is accessible:**
```bash
curl http://localhost:3001/api/users/index
```

3. **Check React errors in console:**
```
Look for red error messages
```

4. **Clear browser cache:**
```
Ctrl+Shift+R (hard reload)
```

---

### Infinite Scroll Not Working

**Problem:** Users load but scrolling doesn't trigger more data.

**Solution:**

1. **Check if hasMore is true:**
Open DevTools → Console:
```javascript
// Check state in React DevTools
```

2. **Verify scroll event listener:**
Check browser console for errors during scroll.

3. **Test API directly:**
```bash
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=50"
# Check if hasMore=true and nextCursor exists
```

---

## Performance Issues

### Slow Response Times

**Problem:** API requests take 100ms+ instead of 20-30ms.

**Causes & Solutions:**

1. **Using HDD instead of SSD**
   - Solution: Move data file to SSD or use Docker volumes on SSD

2. **File too large**
   - Solution: Verify file size is reasonable (~100MB for 10M users)

3. **High cursor position**
   - Solution: Expected - later positions take slightly longer (25-35ms)

4. **Too many concurrent requests**
   - Solution: Implement rate limiting or caching

---

### High Memory Usage

**Problem:** Backend using 500MB+ RAM instead of ~35MB.

**Causes & Solutions:**

1. **Memory leak in code**
   - Check for unclosed file streams
   - Verify Repository closes file handles

2. **Loading full file into memory**
   - Verify using streaming (readline) not fs.readFileSync

3. **Too many cached results**
   - Solution: Clear any caching if implemented

**Monitor memory:**
```bash
# Docker
docker stats user-browser-backend

# Local
node --inspect src/index.js
# Open chrome://inspect → Memory tab
```

---

### Browser Freezing

**Problem:** Browser becomes unresponsive when scrolling.

**Causes & Solutions:**

1. **List virtualization not working**
   - Verify react-window is installed
   - Check UserList component uses FixedSizeList

2. **Rendering too many items**
   - Check itemCount in FixedSizeList (should be current data length, not total)

3. **Heavy computation in render**
   - Use React.memo for UserItem components
   - Avoid inline functions in map()

---

## Environment Issues

### Wrong Node Version

**Problem:**
```
Error: The engine "node" is incompatible with this module
```

**Solution:**
```bash
# Check version
node --version

# Should be 18.x or higher
# Install correct version:
nvm install 18
nvm use 18

# Or download from nodejs.org
```

---

### Environment Variables Not Loading

**Problem:** App uses default values instead of .env values.

**Solution:**

**Backend:**
```bash
# Verify .env exists
ls -la backend/.env

# Check file content
cat backend/.env

# Restart server
cd backend && npm run dev
```

**Frontend (Vite):**
```bash
# Variables MUST start with VITE_
cat frontend/.env
# Should have: VITE_API_BASE_URL=...

# Restart dev server
cd frontend && npm run dev
```

---

## Network Issues

### API Returns 504 Gateway Timeout

**Problem:** Requests to backend timeout.

**Solution:**

1. **Check backend logs:**
```bash
docker-compose logs backend | tail -50
```

2. **Verify data file is accessible:**
```bash
docker exec user-browser-backend ls -la /app/data/
```

3. **Increase timeout in nginx.conf (if using Docker):**
```nginx
proxy_read_timeout 60s;
```

---

### CORS Errors

**Problem:**
```
Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**

Check CORS configuration in backend/src/index.js:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

If frontend is on different port, update origin.

---

## Data Issues

### Index Shows Wrong Counts

**Problem:** Alphabet index shows incorrect user counts.

**Solution:**

1. **Verify data file format:**
```bash
# Each line should have exactly one username
head -10 data/usernames.txt

# Check for empty lines
grep -c '^$' data/usernames.txt
```

2. **Rebuild index:**
```bash
# Restart backend
docker-compose restart backend

# Check logs for "Index built successfully"
docker-compose logs backend
```

---

### Usernames Not Sorted

**Problem:** Users appear in wrong order.

**Solution:**

Data file must be pre-sorted alphabetically:

```bash
# Sort the file
sort data/usernames.txt > data/usernames_sorted.txt
mv data/usernames_sorted.txt data/usernames.txt

# Restart backend
docker-compose restart backend
```

---

## Getting Help

If issues persist:

1. **Check logs:**
```bash
docker-compose logs -f
```

2. **Verify system requirements:**
   - Docker 20.10+
   - Docker Compose 2.0+
   - Node.js 18+ (for local dev)

3. **Check GitHub Issues:**
   - Search for similar problems
   - Open new issue with logs

4. **Contact:**
   - Email: benmalektaha.inpt@gmail.com
   - Include: OS, Node version, error logs

---

**Last Updated:** 2026-01-04  
**Author:** Taha BENMALEK