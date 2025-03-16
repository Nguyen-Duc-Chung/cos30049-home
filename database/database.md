 <!-- DATABASE SCHEMA -->
CREATE DATABASE COS30049_project_db

CREATE TABLE car_table (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token_id INT NOT NULL UNIQUE,
    owner VARCHAR(255) NOT NULL,
    seller VARCHAR(255) NOT NULL,

    title VARCHAR(255),
    price DECIMAL(10,2) CHECK (price >= 0.1) NOT NULL,
    category VARCHAR(50),
    car_condition VARCHAR(50),
    created_date DATE ,
    image_path VARCHAR(500),
    description TEXT,



    currently_listed BOOLEAN DEFAULT TRUE
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_address VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255),
    email VARCHAR(255)
);

-- Create `transaction_history` table with foreign keys
CREATE TABLE transaction_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer VARCHAR(255) NOT NULL,
    seller VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    transaction_hash VARCHAR(255) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key to car_table (token_id)
    token_id INT,
    FOREIGN KEY (token_id) REFERENCES car_table(token_id) ON DELETE CASCADE,
    
    -- Foreign key to users (wallet_address)
    FOREIGN KEY (buyer) REFERENCES users(wallet_address) ON DELETE CASCADE,
    FOREIGN KEY (seller) REFERENCES users(wallet_address) ON DELETE CASCADE
);
