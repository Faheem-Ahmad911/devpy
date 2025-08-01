-- Create the messages table in Supabase
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    service VARCHAR(255),
    budget VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow INSERT operations
-- This allows anyone to submit messages
CREATE POLICY "Allow message submissions" ON messages
    FOR INSERT 
    WITH CHECK (true);

-- Optional: Create a policy to allow reading messages (for admin purposes)
-- Uncomment the lines below if you want to be able to read messages
-- CREATE POLICY "Allow reading messages" ON messages
--     FOR SELECT 
--     USING (true);
