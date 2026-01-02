# API Contract Documentation

## Base URL
```
http://localhost:3001/api
```

## Endpoints

### 1. Health Check
**GET** `/health`

**Description**: Check if the API is running

**Response**: `200 OK`
```json
{
  "status": "ok",
  "timestamp": "2026-01-01T10:30:00.000Z"
}
```

---

### 2. Get Alphabet Index
**GET** `/users/index`

**Description**: Get list of available letters and user counts per letter

**Response**: `200 OK`
```json
{
  "index": [
    { "letter": "A", "count": 125430, "startPosition": 0 },
    { "letter": "B", "count": 98234, "startPosition": 125430 },
    { "letter": "C", "count": 156789, "startPosition": 223664 }
  ],
  "totalUsers": 10000000
}
```

---

### 3. Get Users by Letter (Paginated)
**GET** `/users?letter={letter}&cursor={cursor}&limit={limit}`

**Description**: Get paginated list of usernames starting with specified letter

**Query Parameters**:
| Parameter | Type   | Required | Default | Description |
|-----------|--------|----------|---------|-------------|
| letter    | string | Yes      | -       | Single letter A-Z (case insensitive) |
| cursor    | number | No       | 0       | Starting position (offset) |
| limit     | number | No       | 50      | Number of results (max 100) |

**Success Response**: `200 OK`
```json
{
  "letter": "A",
  "cursor": 0,
  "limit": 50,
  "data": [
    "aaron123",
    "abby_cool",
    "abraham_smith"
  ],
  "hasMore": true,
  "nextCursor": 50,
  "total": 125430
}
```

**Error Responses**:

**400 Bad Request** - Invalid parameters
```json
{
  "error": "Bad Request",
  "message": "Invalid letter parameter. Must be A-Z",
  "code": "INVALID_LETTER"
}
```

**404 Not Found** - Letter not found
```json
{
  "error": "Not Found",
  "message": "No users found for letter X",
  "code": "LETTER_NOT_FOUND"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "code": "INTERNAL_ERROR"
}
```

---

## Error Codes Reference

| Code | HTTP Status | Description |
|------|-------------|-------------|
| INVALID_LETTER | 400 | Letter parameter not A-Z |
| INVALID_CURSOR | 400 | Cursor is not a valid number |
| INVALID_LIMIT | 400 | Limit exceeds maximum (100) |
| LETTER_NOT_FOUND | 404 | No users for specified letter |
| INTERNAL_ERROR | 500 | Unexpected server error |

---

## Rate Limiting
- **Not implemented in MVP**
- Future: 100 requests per minute per IP

## CORS
- Allowed origins: `http://localhost:3000` (development)
- Production origins will be configured via environment variables