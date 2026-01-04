# API Examples & Usage Guide

Complete examples for testing and integrating with the Username Browser API.

---

## Base URL

```
http://localhost:3001
```

---

## 1. Health Check

### Request
```bash
curl http://localhost:3001/health
```

### Response (200 OK)
```json
{
  "status": "ok",
  "timestamp": "2026-01-04T14:32:15.234Z"
}
```

### Use Case
- Verify API is running
- Health monitoring in production
- Load balancer health checks

---

## 2. Get Alphabet Index

### Request
```bash
curl http://localhost:3001/api/users/index
```

### Response (200 OK)
```json
{
  "index": [
    {
      "letter": "A",
      "count": 1250430,
      "startPosition": 0
    },
    {
      "letter": "B",
      "count": 982345,
      "startPosition": 1250430
    },
    {
      "letter": "C",
      "count": 1567890,
      "startPosition": 2232775
    }
    // ... rest of alphabet
  ],
  "totalUsers": 10000000
}
```

### Use Case
- Build alphabet navigation menu
- Display user counts per letter
- Show total dataset size

### Frontend Example
```javascript
// Fetch index for alphabet navigation
const response = await fetch('http://localhost:3001/api/users/index');
const { index, totalUsers } = await response.json();

// Render buttons: A (1.2M), B (982K), C (1.5M)...
index.forEach(({ letter, count }) => {
  renderButton(letter, count);
});
```

---

## 3. Get Users by Letter (First Page)

### Request
```bash
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=50"
```

### Response (200 OK)
```json
{
  "letter": "A",
  "cursor": 0,
  "limit": 50,
  "data": [
    "aaron123",
    "abby_cool",
    "abraham_smith",
    "ada_lovelace",
    "adam_west"
    // ... 45 more usernames
  ],
  "hasMore": true,
  "nextCursor": 50,
  "total": 1250430
}
```

### Key Fields
- **`data`**: Array of usernames for current page
- **`hasMore`**: Boolean - are there more results?
- **`nextCursor`**: Use this value for the next request
- **`total`**: Total usernames for this letter

### Use Case
- Initial load when user clicks letter "A"
- Display first 50 usernames in list

---

## 4. Get Next Page (Pagination)

### Request
```bash
curl "http://localhost:3001/api/users?letter=A&cursor=50&limit=50"
```

### Response (200 OK)
```json
{
  "letter": "A",
  "cursor": 50,
  "limit": 50,
  "data": [
    "alex_turner",
    "alice_wonder",
    "andy_garcia"
    // ... 47 more usernames
  ],
  "hasMore": true,
  "nextCursor": 100,
  "total": 1250430
}
```

### Frontend Example (Infinite Scroll)
```javascript
let cursor = 0;
const limit = 50;

async function loadMore() {
  const response = await fetch(
    `http://localhost:3001/api/users?letter=A&cursor=${cursor}&limit=${limit}`
  );
  const { data, hasMore, nextCursor } = await response.json();
  
  displayUsers(data);
  
  if (hasMore) {
    cursor = nextCursor; // Update cursor for next load
  } else {
    hideLoadMoreButton(); // No more data
  }
}
```

---

## 5. Complete Pagination Flow

### Step-by-Step Example

```bash
# Step 1: Get index
curl http://localhost:3001/api/users/index
# Response: Letter A has 1,250,430 users

# Step 2: Load first page (0-49)
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=50"
# Response: hasMore=true, nextCursor=50

# Step 3: Load second page (50-99)
curl "http://localhost:3001/api/users?letter=A&cursor=50&limit=50"
# Response: hasMore=true, nextCursor=100

# Step 4: Load third page (100-149)
curl "http://localhost:3001/api/users?letter=A&cursor=100&limit=50"
# Response: hasMore=true, nextCursor=150

# ... continue until hasMore=false
```

---

## 6. Error Handling Examples

### Missing Letter Parameter

#### Request
```bash
curl "http://localhost:3001/api/users?cursor=0&limit=50"
```

#### Response (400 Bad Request)
```json
{
  "error": "ValidationError",
  "message": "Letter parameter is required",
  "code": "INVALID_LETTER"
}
```

---

### Invalid Letter

#### Request
```bash
curl "http://localhost:3001/api/users?letter=123&cursor=0&limit=50"
```

#### Response (400 Bad Request)
```json
{
  "error": "ValidationError",
  "message": "Invalid letter parameter. Must be A-Z",
  "code": "INVALID_LETTER"
}
```

---

### Letter Not Found

#### Request
```bash
curl "http://localhost:3001/api/users?letter=X&cursor=0&limit=50"
```

#### Response (404 Not Found)
```json
{
  "error": "NotFoundError",
  "message": "No users found for letter X",
  "code": "LETTER_NOT_FOUND"
}
```

---

### Negative Cursor

#### Request
```bash
curl "http://localhost:3001/api/users?letter=A&cursor=-1&limit=50"
```

#### Response (400 Bad Request)
```json
{
  "error": "ValidationError",
  "message": "Cursor must be non-negative",
  "code": "INVALID_CURSOR"
}
```

---

### Limit Too High

#### Request
```bash
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=500"
```

#### Response (400 Bad Request)
```json
{
  "error": "ValidationError",
  "message": "Limit cannot exceed 100",
  "code": "INVALID_LIMIT"
}
```

---

### Cursor Beyond Data

#### Request
```bash
curl "http://localhost:3001/api/users?letter=A&cursor=9999999&limit=50"
```

#### Response (200 OK - Empty Result)
```json
{
  "letter": "A",
  "cursor": 9999999,
  "limit": 50,
  "data": [],
  "hasMore": false,
  "nextCursor": null,
  "total": 1250430
}
```

---

## 7. Advanced Usage

### Custom Page Sizes

```bash
# Small pages (mobile)
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=10"

# Default pages (desktop)
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=50"

# Large pages (data export)
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=100"
```

---

### Case Insensitive

```bash
# Lowercase letter (works)
curl "http://localhost:3001/api/users?letter=a&cursor=0&limit=50"

# Response normalizes to uppercase
{
  "letter": "A",  # <-- Uppercase
  "cursor": 0,
  "limit": 50,
  "data": ["aaron123", ...]
}
```

---

## 8. JavaScript/Axios Examples

### Get Index
```javascript
import axios from 'axios';

const getIndex = async () => {
  try {
    const { data } = await axios.get('http://localhost:3001/api/users/index');
    return data;
  } catch (error) {
    console.error('Error fetching index:', error.response.data);
  }
};
```

### Paginate Users
```javascript
const getUsersByLetter = async (letter, cursor = 0, limit = 50) => {
  try {
    const { data } = await axios.get('http://localhost:3001/api/users', {
      params: { letter, cursor, limit }
    });
    return data;
  } catch (error) {
    if (error.response.status === 404) {
      console.log('No users found for this letter');
    } else {
      console.error('Error:', error.response.data);
    }
  }
};
```

### Infinite Scroll Implementation
```javascript
class UserLoader {
  constructor(letter) {
    this.letter = letter;
    this.cursor = 0;
    this.limit = 50;
    this.hasMore = true;
  }

  async loadMore() {
    if (!this.hasMore) return [];

    const response = await axios.get('http://localhost:3001/api/users', {
      params: {
        letter: this.letter,
        cursor: this.cursor,
        limit: this.limit
      }
    });

    const { data, hasMore, nextCursor } = response.data;
    
    this.hasMore = hasMore;
    this.cursor = nextCursor;
    
    return data;
  }

  reset(newLetter) {
    this.letter = newLetter;
    this.cursor = 0;
    this.hasMore = true;
  }
}

// Usage
const loader = new UserLoader('A');
const firstBatch = await loader.loadMore();   // 0-49
const secondBatch = await loader.loadMore();  // 50-99
```

---

## 9. Postman Collection

### Import this JSON into Postman

```json
{
  "info": {
    "name": "Username Browser API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/health"
      }
    },
    {
      "name": "Get Alphabet Index",
      "request": {
        "method": "GET",
        "url": "http://localhost:3001/api/users/index"
      }
    },
    {
      "name": "Get Users (Letter A)",
      "request": {
        "method": "GET",
        "url": {
          "raw": "http://localhost:3001/api/users?letter=A&cursor=0&limit=50",
          "query": [
            { "key": "letter", "value": "A" },
            { "key": "cursor", "value": "0" },
            { "key": "limit", "value": "50" }
          ]
        }
      }
    }
  ]
}
```

---

## 10. Testing Commands

### Quick Test Suite
```bash
# Test health
curl -s http://localhost:3001/health | jq

# Test index
curl -s http://localhost:3001/api/users/index | jq '.totalUsers'

# Test pagination
curl -s "http://localhost:3001/api/users?letter=A&cursor=0&limit=5" | jq '.data'

# Test error handling
curl -s "http://localhost:3001/api/users?letter=999" | jq
```

### Performance Testing
```bash
# Measure response time
curl -w "\nTime: %{time_total}s\n" -s "http://localhost:3001/api/users?letter=A&cursor=0&limit=50" > /dev/null

# Load test (requires Apache Bench)
ab -n 1000 -c 10 "http://localhost:3001/api/users?letter=A&cursor=0&limit=50"
```

---

**Swagger UI:** Interactive API documentation available at http://localhost:3001/api-docs