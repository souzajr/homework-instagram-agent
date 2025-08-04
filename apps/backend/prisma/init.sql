-- Initialize database with extensions if needed
-- This file runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (handled by POSTGRES_DB env var)
-- But we can add any additional setup here

SELECT 'Instagram Agent Database Initialized!' as message;