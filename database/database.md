 <!-- DATABASE SCHEMA -->
CREATE DATABASE COS30049_project_db;
use  COS30049_project_db


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


-- Create the transactions table to record all transactions (buying and selling of cars)
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,            -- Unique transaction ID
    token_id INT NOT NULL,                         -- The car's token ID (foreign key to car_table)
    buyer VARCHAR(255),                            -- Buyer address
    seller VARCHAR(255),                           -- Seller address
    price DECIMAL(10,2) NOT NULL,                  -- Transaction price (ETH)
    transaction_type ENUM('Received', 'Transfer') NOT NULL, -- Type of transaction: 'Received' (seller) or 'Transfer' (buyer)
    transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP -- Timestamp of the transaction
);