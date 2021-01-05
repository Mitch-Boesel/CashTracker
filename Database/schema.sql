-- schema.sql
-- Since we might run the import many times we'll drop if exists
DROP DATABASE IF EXISTS cashtracker;

CREATE DATABASE cashtracker;

-- Make sure we're using our `cashtracker` database
\c cashtracker;

-- We can create our user table
CREATE TABLE IF NOT EXISTS Purchase
(
    pid INT,
    price MONEY NOT NULL,
    purchase_date DATE NOT NULL,
    category VARCHAR(25),
    business VARCHAR(100),
    PRIMARY KEY(pid)
);
