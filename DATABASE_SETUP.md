# Database Setup & Seeding Guide

This guide will help you set up the PostgreSQL database and seed it with sample data for the Space Debris API.

## Prerequisites

- PostgreSQL 12+ installed and running
- Node.js 18+ installed
- Yarn package manager

## Quick Setup

### 1. Database Setup

**Option A: Using the setup script (Recommended)**
```bash
# Make sure PostgreSQL is running
# Run the setup script
./scripts/setup-database.sh
```

**Option B: Manual setup**
```bash
# Create database
createdb orbital_chain

# Run the setup SQL script
psql -d orbital_chain -f src/database/setup.sql
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Seed the Database
```bash
# Seed with sample data
yarn seed:seed

# Or clear and reseed
yarn seed:reset
```

### 4. Start the Application
```bash
yarn start:dev
```

## Database Schema

The database includes the following tables:

### Users Table
- **id**: UUID (Primary Key)
- **wallet_address**: Unique 42-character wallet address
- **email**: Unique email address
- **password**: Hashed password (bcrypt)
- **role**: Enum (user, moderator, admin)
- **points**: Integer points system
- **joined_at**: Timestamp

### Debris Table
- **id**: UUID (Primary Key)
- **catalog_id**: Unique catalog identifier
- **source**: Data source (NORAD, ESA, JAXA, etc.)
- **epoch**: Observation timestamp
- **tle_line1**: Two-Line Element line 1
- **tle_line2**: Two-Line Element line 2
- **lat**: Latitude coordinate
- **lon**: Longitude coordinate
- **alt**: Altitude in kilometers
- **risk_score**: Risk assessment score (0-10)
- **on_chain_tx**: Blockchain transaction hash

### Observations Table
- **id**: UUID (Primary Key)
- **user_id**: Foreign key to users
- **debris_id**: Foreign key to debris
- **image_url**: Optional image URL
- **note**: Observation notes
- **location_lat**: Observer latitude
- **location_lon**: Observer longitude
- **location_alt**: Observer altitude
- **approved**: Boolean approval status
- **submitted_at**: Submission timestamp
- **tx_hash**: Blockchain transaction hash

### Moderations Table
- **id**: UUID (Primary Key)
- **observation_id**: Foreign key to observations
- **moderator_id**: Foreign key to users
- **approved**: Boolean approval decision
- **approved_at**: Approval timestamp

### Blockchain Logs Table
- **id**: UUID (Primary Key)
- **debris_id**: Foreign key to debris
- **tx_hash**: Transaction hash
- **block_number**: Blockchain block number
- **committed_at**: Transaction timestamp

## Seeding Commands

### Available Commands

```bash
# Seed the database with sample data
yarn seed:seed

# Clear all seeded data
yarn seed:clear

# Clear and reseed the database
yarn seed:reset

# Run custom seeder command
yarn seed:run <command>
```

### Sample Data Included

**Users (6 total):**
- 1 Admin user
- 1 Moderator user
- 4 Regular users

**Debris (10 total):**
- Various space debris objects with TLE data
- Different risk scores and sources
- Realistic orbital parameters

**Observations (10 total):**
- User observations of debris objects
- Mix of approved and pending observations
- Location data and notes

**Moderations (10 total):**
- Moderation decisions for observations
- Mix of approved and rejected observations

**Blockchain Logs (13 total):**
- Transaction logs for debris data
- Block numbers and timestamps
- Multiple logs per debris object

## Test Credentials

After seeding, you can use these credentials to test the API:

### Admin User
- **Email**: admin@orbitalchain.com
- **Password**: admin123
- **Role**: admin
- **Points**: 1000

### Moderator User
- **Email**: moderator@orbitalchain.com
- **Password**: moderator123
- **Role**: moderator
- **Points**: 500

### Regular Users
- **Email**: user1@orbitalchain.com
- **Password**: user123
- **Role**: user
- **Points**: 100

- **Email**: user2@orbitalchain.com
- **Password**: user123
- **Role**: user
- **Points**: 50

## Database Features

### Geospatial Support
- PostGIS extension enabled
- Geospatial indexes for location queries
- Support for distance-based searches

### Performance Optimizations
- Indexes on frequently queried columns
- Foreign key constraints
- Automatic timestamp updates

### Data Integrity
- Unique constraints on critical fields
- Foreign key relationships
- Enum types for controlled values

## Troubleshooting

### Common Issues

**1. PostgreSQL not running**
```bash
# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Start PostgreSQL (Ubuntu/Debian)
sudo systemctl start postgresql
```

**2. Permission denied on setup script**
```bash
chmod +x scripts/setup-database.sh
```

**3. Database connection issues**
- Check your `.env` file configuration
- Ensure PostgreSQL is running
- Verify database credentials

**4. Seeding fails**
- Make sure database is set up first
- Check that all dependencies are installed
- Verify database connection

### Reset Everything

If you need to start over:

```bash
# Drop and recreate database
dropdb orbital_chain
createdb orbital_chain

# Run setup script
./scripts/setup-database.sh

# Install dependencies
yarn install

# Seed database
yarn seed:seed

# Start application
yarn start:dev
```

## API Testing

Once the database is seeded, you can test the API:

```bash
# Health check
curl http://localhost:3030/api/v1/health

# Login
curl -X POST http://localhost:3030/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@orbitalchain.com", "password": "admin123"}'

# Get debris (after login)
curl -X GET http://localhost:3030/api/v1/debris \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Next Steps

1. **Explore the API**: Use the seeded data to test all endpoints
2. **Add more data**: Create additional users, debris, and observations
3. **Customize**: Modify the seeder data to match your needs
4. **Production**: Set up proper database backups and monitoring

The database is now ready for development and testing! 🚀
