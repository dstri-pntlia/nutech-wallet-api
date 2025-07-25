-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255),
  balance DECIMAL(15,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- banners table
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  banner_name VARCHAR(100) NOT NULL,
  banner_image VARCHAR(255) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- services table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  service_code VARCHAR(50) UNIQUE NOT NULL,
  service_name VARCHAR(100) NOT NULL,
  service_icon VARCHAR(255) NOT NULL,
  service_tariff DECIMAL(15,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  service_code VARCHAR(50) NOT NULL,
  service_name VARCHAR(100) NOT NULL,
  transaction_type VARCHAR(20) NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
