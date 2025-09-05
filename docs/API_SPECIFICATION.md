# Space Debris API - Complete Specification

## Base URL
```
http://localhost:3030/api/v1
```

## Authentication
- **Type**: JWT Bearer Token
- **Header**: `Authorization: Bearer <token>`

---

## 1. Health Check

### GET /health
**Description**: Check API health status

**Request**:
```http
GET http://localhost:3030/api/v1/health
```

**Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 12345
}
```

---

## 2. Authentication APIs

### POST /auth/register
**Description**: Register a new user

**Request**:
```http
POST http://localhost:3030/api/v1/auth/register
Content-Type: application/json

{
  "wallet_address": "0x1234567890123456789012345678901234567890",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "wallet_address": "0x1234567890123456789012345678901234567890",
    "email": "user@example.com",
    "role": "user",
    "points": 0,
    "joined_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### POST /auth/login
**Description**: Login user

**Request**:
```http
POST http://localhost:3030/api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "wallet_address": "0x1234567890123456789012345678901234567890",
    "email": "user@example.com",
    "role": "user",
    "points": 0,
    "joined_at": "2024-01-15T10:30:00.000Z"
  }
}
```

### GET /auth/profile
**Description**: Get current user profile

**Request**:
```http
GET http://localhost:3030/api/v1/auth/profile
Authorization: Bearer <token>
```

**Response**:
```json
{
  "id": "uuid",
  "wallet_address": "0x1234567890123456789012345678901234567890",
  "email": "user@example.com",
  "role": "user",
  "points": 0,
  "joined_at": "2024-01-15T10:30:00.000Z"
}
```

### POST /auth/change-password
**Description**: Change user password

**Request**:
```http
POST http://localhost:3030/api/v1/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**Response**:
```json
{
  "message": "Password changed successfully"
}
```

### POST /auth/reset-password
**Description**: Reset user password (Admin only)

**Request**:
```http
POST http://localhost:3030/api/v1/auth/reset-password
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "email": "user@example.com",
  "newPassword": "newpassword123"
}
```

### POST /auth/logout
**Description**: Logout user

**Request**:
```http
POST http://localhost:3030/api/v1/auth/logout
Authorization: Bearer <token>
```

**Response**:
```json
{
  "message": "Logged out successfully"
}
```

---

## 3. User APIs

### GET /users
**Description**: Get all users (Admin only)

**Request**:
```http
GET http://localhost:3030/api/v1/users
Authorization: Bearer <admin_token>
```

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `role` (optional): Filter by role (user, moderator, admin)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "wallet_address": "0x1234567890123456789012345678901234567890",
      "email": "user@example.com",
      "role": "user",
      "points": 100,
      "joined_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### GET /users/:id
**Description**: Get user by ID

**Request**:
```http
GET http://localhost:3030/api/v1/users/{id}
Authorization: Bearer <token>
```

### GET /users/wallet/:walletAddress
**Description**: Get user by wallet address

**Request**:
```http
GET http://localhost:3030/api/v1/users/wallet/0x1234567890123456789012345678901234567890
Authorization: Bearer <token>
```

### POST /users
**Description**: Create new user (Admin only)

**Request**:
```http
POST http://localhost:3030/api/v1/users
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "wallet_address": "0x1234567890123456789012345678901234567890",
  "email": "user@example.com",
  "password": "password123",
  "role": "user"
}
```

### PATCH /users/:id
**Description**: Update user

**Request**:
```http
PATCH http://localhost:3030/api/v1/users/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newemail@example.com",
  "points": 150
}
```

### PATCH /users/:id/points
**Description**: Update user points

**Request**:
```http
PATCH http://localhost:3030/api/v1/users/{id}/points
Authorization: Bearer <token>
Content-Type: application/json

{
  "points": 200
}
```

### DELETE /users/:id
**Description**: Delete user (Admin only)

**Request**:
```http
DELETE http://localhost:3030/api/v1/users/{id}
Authorization: Bearer <admin_token>
```

---

## 4. Debris APIs

### GET /debris
**Description**: Get all debris objects

**Request**:
```http
GET http://localhost:3030/api/v1/debris
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `source` (optional): Filter by source (NORAD, ESA, JAXA, etc.)
- `minRisk` (optional): Minimum risk score
- `maxRisk` (optional): Maximum risk score

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "catalog_id": "25544",
      "source": "NORAD",
      "epoch": "2024-01-15T12:00:00.000Z",
      "tle_line1": "1 25544U 98067A   24015.50000000  .00000000  00000-0  00000+0 0  9990",
      "tle_line2": "2 25544  51.6400 123.4567 0001234   0.0000   0.0000 15.12345678901234",
      "lat": 51.64,
      "lon": 123.4567,
      "alt": 400.5,
      "risk_score": 8.5,
      "on_chain_tx": "0xabc123...",
      "created_at": "2024-01-15T10:30:00.000Z",
      "updated_at": "2024-01-15T10:30:00.000Z"
    }
  ],
  "total": 1,
  "page": 1,
  "limit": 10
}
```

### GET /debris/:id
**Description**: Get debris by ID

**Request**:
```http
GET http://localhost:3030/api/v1/debris/{id}
Authorization: Bearer <token>
```

### GET /debris/catalog/:catalogId
**Description**: Get debris by catalog ID

**Request**:
```http
GET http://localhost:3030/api/v1/debris/catalog/25544
Authorization: Bearer <token>
```

### GET /debris/risk
**Description**: Get debris by risk score range

**Request**:
```http
GET http://localhost:3030/api/v1/debris/risk?min=5&max=10
Authorization: Bearer <token>
```

### GET /debris/location
**Description**: Get debris by location

**Request**:
```http
GET http://localhost:3030/api/v1/debris/location?lat=51.64&lon=123.45&radius=100
Authorization: Bearer <token>
```

### POST /debris
**Description**: Create new debris (Admin only)

**Request**:
```http
POST http://localhost:3030/api/v1/debris
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "catalog_id": "25544",
  "source": "NORAD",
  "epoch": "2024-01-15T12:00:00.000Z",
  "tle_line1": "1 25544U 98067A   24015.50000000  .00000000  00000-0  00000+0 0  9990",
  "tle_line2": "2 25544  51.6400 123.4567 0001234   0.0000   0.0000 15.12345678901234",
  "lat": 51.64,
  "lon": 123.4567,
  "alt": 400.5,
  "risk_score": 8.5,
  "on_chain_tx": "0xabc123..."
}
```

### PATCH /debris/:id
**Description**: Update debris

**Request**:
```http
PATCH http://localhost:3030/api/v1/debris/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "risk_score": 9.0,
  "on_chain_tx": "0xupdated123..."
}
```

### DELETE /debris/:id
**Description**: Delete debris (Admin only)

**Request**:
```http
DELETE http://localhost:3030/api/v1/debris/{id}
Authorization: Bearer <admin_token>
```

---

## 5. Observation APIs

### GET /observations
**Description**: Get all observations

**Request**:
```http
GET http://localhost:3030/api/v1/observations
Authorization: Bearer <token>
```

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `approved` (optional): Filter by approval status (true/false)
- `userId` (optional): Filter by user ID
- `debrisId` (optional): Filter by debris ID

### GET /observations/:id
**Description**: Get observation by ID

**Request**:
```http
GET http://localhost:3030/api/v1/observations/{id}
Authorization: Bearer <token>
```

### GET /observations/user/:userId
**Description**: Get observations by user

**Request**:
```http
GET http://localhost:3030/api/v1/observations/user/{userId}
Authorization: Bearer <token>
```

### GET /observations/debris/:debrisId
**Description**: Get observations by debris

**Request**:
```http
GET http://localhost:3030/api/v1/observations/debris/{debrisId}
Authorization: Bearer <token>
```

### GET /observations/pending
**Description**: Get pending observations (Moderator only)

**Request**:
```http
GET http://localhost:3030/api/v1/observations/pending
Authorization: Bearer <moderator_token>
```

### GET /observations/approved
**Description**: Get approved observations

**Request**:
```http
GET http://localhost:3030/api/v1/observations/approved
Authorization: Bearer <token>
```

### POST /observations
**Description**: Create new observation

**Request**:
```http
POST http://localhost:3030/api/v1/observations
Authorization: Bearer <token>
Content-Type: application/json

{
  "debris_id": "uuid",
  "image_url": "https://example.com/image.jpg",
  "note": "Clear observation of debris object",
  "location_lat": 51.64,
  "location_lon": 123.4567,
  "location_alt": 400.5,
  "tx_hash": "0xobs123..."
}
```

### PATCH /observations/:id
**Description**: Update observation

**Request**:
```http
PATCH http://localhost:3030/api/v1/observations/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "note": "Updated observation note",
  "image_url": "https://example.com/new-image.jpg"
}
```

### PATCH /observations/:id/approve
**Description**: Approve observation (Moderator only)

**Request**:
```http
PATCH http://localhost:3030/api/v1/observations/{id}/approve
Authorization: Bearer <moderator_token>
```

### PATCH /observations/:id/reject
**Description**: Reject observation (Moderator only)

**Request**:
```http
PATCH http://localhost:3030/api/v1/observations/{id}/reject
Authorization: Bearer <moderator_token>
```

### DELETE /observations/:id
**Description**: Delete observation

**Request**:
```http
DELETE http://localhost:3030/api/v1/observations/{id}
Authorization: Bearer <token>
```

---

## 6. Moderation APIs

### GET /moderations
**Description**: Get all moderations (Admin only)

**Request**:
```http
GET http://localhost:3030/api/v1/moderations
Authorization: Bearer <admin_token>
```

### GET /moderations/:id
**Description**: Get moderation by ID

**Request**:
```http
GET http://localhost:3030/api/v1/moderations/{id}
Authorization: Bearer <token>
```

### GET /moderations/moderator/:moderatorId
**Description**: Get moderations by moderator

**Request**:
```http
GET http://localhost:3030/api/v1/moderations/moderator/{moderatorId}
Authorization: Bearer <token>
```

### GET /moderations/observation/:observationId
**Description**: Get moderation by observation

**Request**:
```http
GET http://localhost:3030/api/v1/moderations/observation/{observationId}
Authorization: Bearer <token>
```

### GET /moderations/stats
**Description**: Get moderation statistics

**Request**:
```http
GET http://localhost:3030/api/v1/moderations/stats
Authorization: Bearer <token>
```

**Response**:
```json
{
  "total_moderations": 100,
  "approved_count": 75,
  "rejected_count": 25,
  "pending_count": 0,
  "approval_rate": 0.75
}
```

### POST /moderations
**Description**: Create new moderation (Moderator only)

**Request**:
```http
POST http://localhost:3030/api/v1/moderations
Authorization: Bearer <moderator_token>
Content-Type: application/json

{
  "observation_id": "uuid",
  "approved": true
}
```

### PATCH /moderations/:id
**Description**: Update moderation (Moderator only)

**Request**:
```http
PATCH http://localhost:3030/api/v1/moderations/{id}
Authorization: Bearer <moderator_token>
Content-Type: application/json

{
  "approved": false
}
```

### DELETE /moderations/:id
**Description**: Delete moderation (Admin only)

**Request**:
```http
DELETE http://localhost:3030/api/v1/moderations/{id}
Authorization: Bearer <admin_token>
```

---

## 7. Blockchain Log APIs

### GET /blockchain-logs
**Description**: Get all blockchain logs

**Request**:
```http
GET http://localhost:3030/api/v1/blockchain-logs
Authorization: Bearer <token>
```

### GET /blockchain-logs/:id
**Description**: Get blockchain log by ID

**Request**:
```http
GET http://localhost:3030/api/v1/blockchain-logs/{id}
Authorization: Bearer <token>
```

### GET /blockchain-logs/debris/:debrisId
**Description**: Get blockchain logs by debris

**Request**:
```http
GET http://localhost:3030/api/v1/blockchain-logs/debris/{debrisId}
Authorization: Bearer <token>
```

### GET /blockchain-logs/transaction/:txHash
**Description**: Get blockchain log by transaction hash

**Request**:
```http
GET http://localhost:3030/api/v1/blockchain-logs/transaction/0xabc123...
Authorization: Bearer <token>
```

### GET /blockchain-logs/block/:blockNumber
**Description**: Get blockchain logs by block number

**Request**:
```http
GET http://localhost:3030/api/v1/blockchain-logs/block/18500000
Authorization: Bearer <token>
```

### GET /blockchain-logs/stats
**Description**: Get blockchain statistics

**Request**:
```http
GET http://localhost:3030/api/v1/blockchain-logs/stats
Authorization: Bearer <token>
```

### GET /blockchain-logs/latest-block
**Description**: Get latest block number

**Request**:
```http
GET http://localhost:3030/api/v1/blockchain-logs/latest-block
Authorization: Bearer <token>
```

### POST /blockchain-logs
**Description**: Create new blockchain log (Admin only)

**Request**:
```http
POST http://localhost:3030/api/v1/blockchain-logs
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "debris_id": "uuid",
  "tx_hash": "0xabc123...",
  "block_number": 18500000
}
```

### PATCH /blockchain-logs/:id
**Description**: Update blockchain log (Admin only)

**Request**:
```http
PATCH http://localhost:3030/api/v1/blockchain-logs/{id}
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "tx_hash": "0xupdated123..."
}
```

### DELETE /blockchain-logs/:id
**Description**: Delete blockchain log (Admin only)

**Request**:
```http
DELETE http://localhost:3030/api/v1/blockchain-logs/{id}
Authorization: Bearer <admin_token>
```

---

## Test Credentials

### Admin User
- **Email**: admin@orbitalchain.com
- **Password**: admin123
- **Role**: admin

### Moderator User
- **Email**: moderator@orbitalchain.com
- **Password**: moderator123
- **Role**: moderator

### Regular User
- **Email**: user1@orbitalchain.com
- **Password**: user123
- **Role**: user

---

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": ["Validation error message"],
  "error": "Bad Request"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

### 500 Internal Server Error
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Postman Collection Setup

1. **Create Environment Variables**:
   - `base_url`: `http://localhost:3030/api/v1`
   - `admin_token`: (Get from login)
   - `moderator_token`: (Get from login)
   - `user_token`: (Get from login)

2. **Pre-request Scripts** (for authenticated endpoints):
   ```javascript
   if (pm.environment.get("admin_token")) {
       pm.request.headers.add({
           key: "Authorization",
           value: "Bearer " + pm.environment.get("admin_token")
       });
   }
   ```

3. **Test Scripts** (for login endpoints):
   ```javascript
   if (pm.response.code === 200) {
       const response = pm.response.json();
       pm.environment.set("admin_token", response.access_token);
   }
   ```
