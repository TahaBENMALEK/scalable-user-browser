# API Examples & Usage Guide

## Base URL
```
http://localhost:3001
```

---

## Endpoints

### 1. Health Check
```bash
curl http://localhost:3001/health
```

Response (200 OK):
```json
{
  "status": "ok",
  "timestamp": "2026-01-04T14:32:15.234Z"
}
```

---

### 2. Get Alphabet Index
```bash
curl http://localhost:3001/api/users/index
```

Response (200 OK):
```json
{
  "index": [
    { "letter": "A", "count": 1250430, "startPosition": 0 },
    { "letter": "B", "count": 982345, "startPosition": 1250430 }
  ],
  "totalUsers": 10000000
}
```

Use Case: Build alphabet navigation with user counts per letter.

---

### 3. Get Users by Letter
```bash
curl "http://localhost:3001/api/users?letter=A&cursor=0&limit=50"
```

Response (200 OK):
```json
{
  "letter": "A",
  "cursor": 0,
  "limit": 50,
  "data": ["aaron123", "abby_cool", "abraham_smith"],
  "hasMore": true,
  "nextCursor": 50,
  "total": 1250430
}
```

Key Fields:
- `data`: Array of usernames
- `hasMore`: Boolean - more results available?
- `nextCursor`: Value for next request
- `total`: Total usernames for this letter

---

## Pagination Example

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
    cursor = nextCursor;
  } else {
    hideLoadMoreButton();
  }
}
```

---

## Error Handling

### Missing Letter (400)
```json
{
  "error": "ValidationError",
  "message": "Letter parameter is required",
  "code": "INVALID_LETTER"
}
```

### Invalid Letter (400)
```json
{
  "error": "ValidationError",
  "message": "Invalid letter parameter. Must be A-Z",
  "code": "INVALID_LETTER"
}
```

### Letter Not Found (404)
```json
{
  "error": "NotFoundError",
  "message": "No users found for letter X",
  "code": "LETTER_NOT_FOUND"
}
```

### Invalid Cursor (400)
```json
{
  "error": "ValidationError",
  "message": "Cursor must be non-negative",
  "code": "INVALID_CURSOR"
}
```

### Limit Too High (400)
```json
{
  "error": "ValidationError",
  "message": "Limit cannot exceed 100",
  "code": "INVALID_LIMIT"
}
```

---

## JavaScript Examples

### Fetch Index
```javascript
const getIndex = async () => {
  const { data } = await axios.get('http://localhost:3001/api/users/index');
  return data;
};
```

### Paginate Users
```javascript
const getUsersByLetter = async (letter, cursor = 0, limit = 50) => {
  const { data } = await axios.get('http://localhost:3001/api/users', {
    params: { letter, cursor, limit }
  });
  return data;
};
```

### Infinite Scroll
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

    const { data } = await axios.get('http://localhost:3001/api/users', {
      params: { letter: this.letter, cursor: this.cursor, limit: this.limit }
    });

    const { data: users, hasMore, nextCursor } = data;
    this.hasMore = hasMore;
    this.cursor = nextCursor;
    
    return users;
  }
}
```

---

## Testing Commands

```bash
# Test health
curl -s http://localhost:3001/health | jq

# Test index
curl -s http://localhost:3001/api/users/index | jq '.totalUsers'

# Test pagination
curl -s "http://localhost:3001/api/users?letter=A&cursor=0&limit=5" | jq '.data'

# Measure response time
curl -w "\nTime: %{time_total}s\n" "http://localhost:3001/api/users?letter=A&cursor=0&limit=50"
```

---

**Swagger UI:** http://localhost:3001/api-docs

**Last Updated:** 2026-01-04  
**Author:** Taha BENMALEK