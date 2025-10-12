-- Create providers table
CREATE TABLE IF NOT EXISTS providers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    npi_number VARCHAR(10) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    organization_name VARCHAR(200),
    provider_type VARCHAR(50),
    specialty VARCHAR(100),
    address_line1 VARCHAR(200),
    address_line2 VARCHAR(200),
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_logs table
CREATE TABLE IF NOT EXISTS verification_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
    verification_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    details JSONB,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create uploads table
CREATE TABLE IF NOT EXISTS uploads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(50),
    upload_status VARCHAR(20) DEFAULT 'pending',
    processed_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_providers_npi ON providers(npi_number);
CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);
CREATE INDEX IF NOT EXISTS idx_verification_logs_provider_id ON verification_logs(provider_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_type ON verification_logs(verification_type);
CREATE INDEX IF NOT EXISTS idx_uploads_status ON uploads(upload_status);

-- Enable Row Level Security (RLS)
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access to providers" ON providers FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to providers" ON providers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to providers" ON providers FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to verification_logs" ON verification_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to verification_logs" ON verification_logs FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to uploads" ON uploads FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to uploads" ON uploads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to uploads" ON uploads FOR UPDATE USING (true);
