#!/bin/bash

# Space Debris Database Setup Script
# This script sets up the PostgreSQL database for the Space Debris API

set -e

echo "🚀 Setting up Space Debris Database..."
echo "======================================"

# Check if PostgreSQL is running
if ! pg_isready -q; then
    echo "❌ PostgreSQL is not running. Please start PostgreSQL first."
    exit 1
fi

# Database configuration
DB_NAME="orbital_chain"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"

echo "📊 Database Configuration:"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""

# Create database if it doesn't exist
echo "🔧 Creating database if it doesn't exist..."
createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME 2>/dev/null || echo "Database already exists or creation failed"

# Run the setup SQL script
echo "📝 Running database setup script..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f src/database/setup.sql

echo ""
echo "✅ Database setup completed successfully!"
echo ""
echo "🌱 Next steps:"
echo "1. Install dependencies: yarn install"
echo "2. Seed the database: yarn seed:seed"
echo "3. Start the application: yarn start:dev"
echo ""
echo "🔑 Default credentials will be created during seeding:"
echo "  Admin: admin@orbitalchain.com / admin123"
echo "  Moderator: moderator@orbitalchain.com / moderator123"
echo "  User: user1@orbitalchain.com / user123"
