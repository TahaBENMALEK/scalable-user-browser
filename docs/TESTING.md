# Testing Guide

Complete guide for testing the Username Browser application.

---

## Backend Tests

### Running Tests

```bash
cd backend

# Run all tests
npm test

# Run with watch mode
npm run test:watch

# Run with coverage report
npm run test:coverage
```

### Test Coverage

```bash
npm run test:coverage

# Expected Output:
File                     | % Stmts | % Branch | % Funcs | % Lines
-------------------------|---------|----------|---------|--------
All files                |     100 |      100 |     100 |     100
 controllers             |     100 |      100 |     100 |     100
  userController.js      |     100 |      100 |     100 |     100
 services                |     100 |      100 |     100 |     100
  UserService.js         |     100 |      100 |     100 |     100
 repositories            |     100 |      100 |     100 |     100
  UserRepository.js      |     100 |      100 |     100 |     100
 utils                   |     100 |      100 |     100 |     100
  validators.js          |     100 |      100 |     100 |     100
  errors.js              |     100 |      100 |     100 |     100

Test Suites: 4 passed, 4 total
Tests:       38 passed, 38 total
```

---

## API Testing

### Health Check

```bash
curl http://localhost:3001/health

# Expected Response (200 OK):
{
  "status": "ok",
  "timestamp": "2026-01-04T14:32:15.234Z"
}
```

### Get Alphabet Index

```bash
curl http://localhost:3001/api/users/index | jq

# Expected Response (200 OK):
{
  "index": [
    { "letter": "A", "count": 1250430, "startPosition": 0 },
    { "letter": "B", "count": 982345, "startPosition": 1250430 }
  ],
  "totalUsers": 10000000
}
```

### Get Users by Letter

```bash
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=10" | jq

# Expected Response (200 OK):
{
  "letter": "A",
  "cursor": 0,
  "limit": 10,
  "data": ["aaron123", "abby_cool", ...],
  "hasMore": true,
  "nextCursor": 10,
  "total": 1250430
}
```

### Test Pagination

```bash
# First page
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=5" | jq '.data'

# Second page
curl "http://localhost:3001/api/users?letter=A&cursor=5&limit=5" | jq '.data'

# Third page
curl "http://localhost:3001/api/users?letter=A&cursor=10&limit=5" | jq '.data'
```

---

## Error Testing

### Invalid Letter

```bash
curl "http://localhost:3001/api/users?letter=999"

# Expected Response (400 Bad Request):
{
  "error": "ValidationError",
  "message": "Invalid letter parameter. Must be A-Z",
  "code": "INVALID_LETTER"
}
```

### Missing Letter

```bash
curl "http://localhost:3001/api/users?cursor=0&limit=50"

# Expected Response (400 Bad Request):
{
  "error": "ValidationError",
  "message": "Letter parameter is required",
  "code": "INVALID_LETTER"
}
```

### Negative Cursor

```bash
curl "http://localhost:3001/api/users?letter=A&cursor=-1&limit=50"

# Expected Response (400 Bad Request):
{
  "error": "ValidationError",
  "message": "Cursor must be non-negative",
  "code": "INVALID_CURSOR"
}
```

### Limit Too High

```bash
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=500"

# Expected Response (400 Bad Request):
{
  "error": "ValidationError",
  "message": "Limit cannot exceed 100",
  "code": "INVALID_LIMIT"
}
```

---

## Docker Testing

### Verify Containers

```bash
# Check container status
docker-compose ps

# Expected Output:
NAME                    STATUS    PORTS
user-browser-backend    Up        0.0.0.0:3001->3001/tcp
user-browser-frontend   Up        0.0.0.0:3000->80/tcp
```

### Check Container Logs

```bash
# Backend logs
docker-compose logs backend

# Expected: "Index built successfully" message

# Frontend logs
docker-compose logs frontend

# Follow logs in real-time
docker-compose logs -f
```

### Test Container Health

```bash
# Backend health
curl http://localhost:3001/health

# Frontend accessibility
curl -I http://localhost:3000

# Expected: HTTP/1.1 200 OK
```

### Monitor Container Resources

```bash
docker stats

# Expected Output:
CONTAINER               CPU %    MEM USAGE / LIMIT    MEM %
user-browser-backend    0.5%     37.2MiB / 512MiB     7.3%
user-browser-frontend   0.1%     12.5MiB / 128MiB     9.8%
```

---

## Performance Testing

### Measure Response Time

```bash
curl -w "\nTime: %{time_total}s\n" \
  -s "http://localhost:3001/api/users?letter=A&cursor=0&limit=50" \
  > /dev/null

# Expected: Time: 0.020s - 0.030s
```

### Load Testing with Apache Bench

```bash
# Install Apache Bench
apt-get install apache2-utils  # Linux
brew install apache2-utils      # macOS

# Run load test
ab -n 1000 -c 10 "http://localhost:3001/api/users?letter=A&cursor=0&limit=50"

# Expected Results:
Requests per second:    250-300 req/s
Time per request:       20-25ms (mean)
Failed requests:        0
```

### Concurrent Request Testing

```bash
# Heavy load test
ab -n 10000 -c 100 "http://localhost:3001/api/users?letter=A&cursor=0&limit=50"

# Expected Results:
Requests per second:    1000-1500 req/s
95th percentile:        45ms
99th percentile:        80ms
Failed requests:        0
```

---

## Frontend Manual Testing

### Basic Functionality

1. **Initial Load**
   - Open http://localhost:3000
   - Verify alphabet navigation (A-Z buttons) displays
   - Verify no users shown initially (empty state)

2. **Select Letter**
   - Click letter "A"
   - Verify users load in list
   - Verify user count displays correctly

3. **Infinite Scroll**
   - Scroll down the list
   - Verify more users load automatically
   - Verify smooth scrolling (no lag)
   - Verify "Loading..." indicator appears while fetching

4. **Switch Letters**
   - Click different letter (e.g., "B")
   - Verify list updates with new users
   - Verify cursor resets to 0
   - Verify user count updates

5. **Error Handling**
   - Stop backend: `docker-compose stop backend`
   - Try selecting a letter
   - Verify error message displays
   - Restart backend: `docker-compose start backend`

### Performance Testing

1. **Browser Performance**
   - Open DevTools → Performance tab
   - Start recording
   - Select letter and scroll
   - Stop recording
   - Verify: 60fps maintained, no long tasks >50ms

2. **Memory Testing**
   - Open DevTools → Memory tab
   - Take heap snapshot
   - Scroll through 1000+ users
   - Take another heap snapshot
   - Verify: Memory growth is minimal (virtualization working)

3. **Network Testing**
   - Open DevTools → Network tab
   - Select a letter
   - Scroll to trigger pagination
   - Verify: Requests show 15-25ms response time
   - Verify: No failed requests

---

## Integration Testing

### Complete User Flow

```bash
# 1. Verify backend is running
curl http://localhost:3001/health

# 2. Get alphabet index
curl http://localhost:3001/api/users/index | jq '.totalUsers'

# 3. Load first page of letter A
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=5" | jq

# 4. Load next page
curl "http://localhost:3001/api/users?letter=A&cursor=5&limit=5" | jq

# 5. Switch to letter B
curl "http://localhost:3001/api/users?letter=B&cursor=0&limit=5" | jq

# 6. Test frontend
open http://localhost:3000
# Click "A", scroll, click "B", scroll
```

---

## Test Checklist

### Before Submission

- ✅ All 38 backend tests passing
- ✅ 100% test coverage achieved
- ✅ Health endpoint responds correctly
- ✅ Index endpoint returns all 26 letters
- ✅ Pagination works (first, middle, last pages)
- ✅ Error responses have correct status codes
- ✅ Docker containers start without errors
- ✅ Frontend loads without console errors
- ✅ Infinite scroll works smoothly
- ✅ Letter switching works correctly
- ✅ No memory leaks in browser
- ✅ API response times under 30ms
- ✅ Load test passes (1000+ requests)

### Common Issues During Testing

See [Troubleshooting Guide](TROUBLESHOOTING.md) for solutions to common problems.

---

**Last Updated:** 2026-01-04  
**Author:** Taha BENMALEK