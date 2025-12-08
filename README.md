# Vehicle Rental System – Backend API

A simple modular based backend for managing vehicle rentals, users, and bookings using **Node.js + Express + PostgreSQL**.

## Live URL

https://vehicle-rental-system-backend-delta.vercel.app/

## Features

- User registration and login

  - Public can register using basic information (id, name, email, password, phone & role(on registration user can be either "admin" or customer))
  - When a user will login using his credentials (email, password) he/she will be registered as well as will receive a authorization token (JWT authentication)

- User information

  - Admin can see all the users registered into the system.
  - Admin can delete a user (only if user doesn't have any active booking)
  - User can update own information and admin can update any users information

- Vehicle operations

  - A admin can add new vehicle, delete vehicles(only if vehicle's availability status is not booked), edit vehicle's information using vehicles id.
  - Admin and public can view all vehicles information as well as single vehicles using vehicles id

- Bookings operations

  - A user can only book vehicle for him/her only if the vehicle is available.
  - A admin can also book vehicles for any user.

- Used Modular architecture (routes → controllers → services)

- PostgreSQL relational datasets (Neon)

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- postgreSQL
- JWT for authentication
- bcrypt for password hashing

## Setup in your local machine

- git clone https://github.com/sohelranalive/vehicle-rental-system-backend.git
- cd vehicle-rental-backend
- npm install
- create a .env file and provide below information
  - PORT = ?
  - CONNECTION_STR = ?
  - JWT_SECRET = ?
- npm run dev

## Author

    Md Sohel Rana
    Master of Engineering - Information Technology
    Frankfurt University of Applied Sciences
    Frankfurt, Germany
