-- Space Debris Database Setup Script
-- Run this script to create the database and initial structure

-- Create database (run as postgres superuser)
-- CREATE DATABASE orbital_chain;

-- Connect to the database
-- \c orbital_chain;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    role user_role DEFAULT 'user',
    points INTEGER DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create debris table
CREATE TABLE IF NOT EXISTS debris (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    catalog_id VARCHAR(255) UNIQUE NOT NULL,
    source VARCHAR(255) NOT NULL,
    epoch TIMESTAMP NOT NULL,
    tle_line1 TEXT NOT NULL,
    tle_line2 TEXT NOT NULL,
    lat DECIMAL(10,7) NOT NULL,
    lon DECIMAL(10,7) NOT NULL,
    alt DECIMAL(10,2) NOT NULL,
    risk_score DECIMAL(5,2) DEFAULT 0,
    on_chain_tx VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create observations table
CREATE TABLE IF NOT EXISTS observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    debris_id UUID NOT NULL REFERENCES debris(id) ON DELETE CASCADE,
    image_url VARCHAR(500),
    note TEXT,
    location_lat DECIMAL(10,7) NOT NULL,
    location_lon DECIMAL(10,7) NOT NULL,
    location_alt DECIMAL(10,2) NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tx_hash VARCHAR(255)
);

-- Create moderations table
CREATE TABLE IF NOT EXISTS moderations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    observation_id UUID NOT NULL REFERENCES observations(id) ON DELETE CASCADE,
    moderator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approved BOOLEAN NOT NULL,
    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blockchain_logs table
CREATE TABLE IF NOT EXISTS blockchain_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    debris_id UUID NOT NULL REFERENCES debris(id) ON DELETE CASCADE,
    tx_hash VARCHAR(255) NOT NULL,
    block_number BIGINT NOT NULL,
    committed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_debris_catalog_id ON debris(catalog_id);
CREATE INDEX IF NOT EXISTS idx_debris_risk_score ON debris(risk_score);
CREATE INDEX IF NOT EXISTS idx_observations_user_id ON observations(user_id);
CREATE INDEX IF NOT EXISTS idx_observations_debris_id ON observations(debris_id);
CREATE INDEX IF NOT EXISTS idx_observations_approved ON observations(approved);
CREATE INDEX IF NOT EXISTS idx_moderations_observation_id ON moderations(observation_id);
CREATE INDEX IF NOT EXISTS idx_moderations_moderator_id ON moderations(moderator_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_logs_debris_id ON blockchain_logs(debris_id);
CREATE INDEX IF NOT EXISTS idx_blockchain_logs_tx_hash ON blockchain_logs(tx_hash);
CREATE INDEX IF NOT EXISTS idx_blockchain_logs_block_number ON blockchain_logs(block_number);

-- Create geospatial index for debris location queries
CREATE INDEX IF NOT EXISTS idx_debris_location ON debris USING GIST (ST_Point(lon, lat));

-- Create geospatial index for observation location queries
CREATE INDEX IF NOT EXISTS idx_observations_location ON observations USING GIST (ST_Point(location_lon, location_lat));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_debris_updated_at BEFORE UPDATE ON debris FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_observations_updated_at BEFORE UPDATE ON observations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
