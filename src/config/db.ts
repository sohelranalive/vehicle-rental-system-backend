import { Pool } from "pg";
import config from ".";

// db connection
export const pool = new Pool({
  connectionString: `${config.db_connection}`,
});

const initializeDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS Vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type TEXT CHECK(type IN ('car', 'bike', 'van', 'SUV')),
        registration_number TEXT NOT NULL UNIQUE,
        daily_rent_price NUMERIC NOT NULL CHECK(daily_rent_price > 0),
        availability_status TEXT DEFAULT 'available' CHECK(availability_status IN ('available', 'booked')));
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS Users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE CHECK(email = LOWER(email)),
        password VARCHAR(100) NOT NULL CHECK(LENGTH(password) >= 6),
        phone VARCHAR(100) NOT NULL,
        role TEXT DEFAULT 'customer' CHECK(role IN ('admin', 'customer')));
        `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS Bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES Users(id) ON DELETE CASCADE,
        vehicle_id  INT REFERENCES Vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL CHECK(rent_end_date>rent_start_date),
        total_price NUMERIC NOT NULL CHECK(total_price > 0),
        status TEXT CHECK(status IN ('active', 'cancelled', 'returned')));
        `);
};

export default initializeDB;
