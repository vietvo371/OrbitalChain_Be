# Space Debris API Setup Guide

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- Yarn package manager

## Installation

1. Install dependencies:
```bash
yarn install
```

2. Create a `.env` file in the root directory with the following configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=orbital_chain

# Application Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# JWT Configuration (for future authentication)
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h

# Blockchain Configuration (for future integration)
BLOCKCHAIN_RPC_URL=https://your-blockchain-rpc-url
BLOCKCHAIN_CONTRACT_ADDRESS=0x...
```

3. Create the PostgreSQL database:
```sql
CREATE DATABASE orbital_chain;
```

4. Start the application:
```bash
# Development mode
yarn start:dev

# Production mode
yarn build
yarn start:prod
```

## API Endpoints

The API will be available at `http://localhost:3000/api/v1`

### Health Check
- `GET /api/v1/health` - API health status

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/profile` - Get current user profile (Protected)
- `POST /api/v1/auth/change-password` - Change password (Protected)
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/logout` - Logout user (Protected)

### Users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `GET /api/v1/users/wallet/:walletAddress` - Get user by wallet address
- `PATCH /api/v1/users/:id` - Update user
- `PATCH /api/v1/users/:id/points` - Add points to user
- `DELETE /api/v1/users/:id` - Delete user

### Debris
- `POST /api/v1/debris` - Create debris
- `GET /api/v1/debris` - Get all debris
- `GET /api/v1/debris/:id` - Get debris by ID
- `GET /api/v1/debris/catalog/:catalogId` - Get debris by catalog ID
- `GET /api/v1/debris/risk?minRiskScore=X` - Get debris by risk score
- `GET /api/v1/debris/location?lat=X&lon=Y&radius=Z` - Get debris by location
- `PATCH /api/v1/debris/:id` - Update debris
- `DELETE /api/v1/debris/:id` - Delete debris

### Observations
- `POST /api/v1/observations` - Create observation
- `GET /api/v1/observations` - Get all observations
- `GET /api/v1/observations/:id` - Get observation by ID
- `GET /api/v1/observations/user/:userId` - Get observations by user
- `GET /api/v1/observations/debris/:debrisId` - Get observations by debris
- `GET /api/v1/observations/pending` - Get pending observations
- `GET /api/v1/observations/approved` - Get approved observations
- `PATCH /api/v1/observations/:id` - Update observation
- `PATCH /api/v1/observations/:id/approve` - Approve observation
- `PATCH /api/v1/observations/:id/reject` - Reject observation
- `DELETE /api/v1/observations/:id` - Delete observation

### Moderations
- `POST /api/v1/moderations` - Create moderation
- `GET /api/v1/moderations` - Get all moderations
- `GET /api/v1/moderations/:id` - Get moderation by ID
- `GET /api/v1/moderations/moderator/:moderatorId` - Get moderations by moderator
- `GET /api/v1/moderations/observation/:observationId` - Get moderation by observation
- `GET /api/v1/moderations/stats` - Get moderation statistics
- `PATCH /api/v1/moderations/:id` - Update moderation
- `DELETE /api/v1/moderations/:id` - Delete moderation

### Blockchain Logs
- `POST /api/v1/blockchain-logs` - Create blockchain log
- `GET /api/v1/blockchain-logs` - Get all blockchain logs
- `GET /api/v1/blockchain-logs/:id` - Get blockchain log by ID
- `GET /api/v1/blockchain-logs/debris/:debrisId` - Get logs by debris
- `GET /api/v1/blockchain-logs/transaction/:txHash` - Get log by transaction hash
- `GET /api/v1/blockchain-logs/block/:blockNumber` - Get logs by block number
- `GET /api/v1/blockchain-logs/stats` - Get transaction statistics
- `GET /api/v1/blockchain-logs/latest-block` - Get latest block number
- `PATCH /api/v1/blockchain-logs/:id` - Update blockchain log
- `DELETE /api/v1/blockchain-logs/:id` - Delete blockchain log

## Database Schema

The application uses the following entities with their relationships:

- **User**: Stores user information with wallet addresses and roles
- **Debris**: Stores space debris data with TLE information and risk scores
- **Observation**: Links users to debris observations with location data
- **Moderation**: Tracks approval/rejection of observations by moderators
- **BlockchainLog**: Records blockchain transactions for debris data

## Features

- ✅ Full CRUD operations for all entities
- ✅ TypeORM integration with PostgreSQL
- ✅ Input validation using class-validator
- ✅ RESTful API design
- ✅ Proper error handling
- ✅ Database relationships
- ✅ CORS support
- ✅ Environment configuration
- ✅ Health check endpoint
- ✅ Modular architecture
- ✅ JWT Authentication system
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ User registration and login
- ✅ Password change functionality
- ✅ Protected routes with guards

## Authentication Examples

### Register a new user
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "wallet_address": "0x1234567890123456789012345678901234567890",
    "email": "user@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Access protected routes
```bash
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Change password
```bash
curl -X POST http://localhost:3000/api/v1/auth/change-password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword123"
  }'
```

## Development

- Run tests: `yarn test`
- Run e2e tests: `yarn test:e2e`
- Lint code: `yarn lint`
- Format code: `yarn format`
