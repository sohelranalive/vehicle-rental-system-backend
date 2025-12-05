import { Pool } from "pg";
import config from ".";

// db connection
export const pool = new Pool({
  connectionString: `${config.db_connection}`,
});

const initializeDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type TEXT CHECK(type IN ('car', 'bike', 'van', 'SUV')),
        registration_number TEXT NOT NULL UNIQUE,
        daily_rent_price NUMERIC NOT NULL CHECK(daily_rent_price > 0),
        availability_status TEXT CHECK(availability_status IN ('available', 'booked')));
        `);

  //
  //
  //
  //  await pool.query(`CREATE TABLE IF NOT EXISTS vehicles(
  // id SERIAL PRIMARY KEY,
  // vehicle_name VARCHAR(100) NOT NULL,
  // type ENUM('car', 'bike', 'van', 'SUV') NOT NULL,
  // email VARCHAR(100) NOT NULL UNIQUE,
  // )
  // CREATE INDEX email_lower ON users (lower(email));
  //    email VARCHAR(70) UNIQUE NOT NULL CHECK (email = LOWER(email))
  // `);
};

export default initializeDB;
