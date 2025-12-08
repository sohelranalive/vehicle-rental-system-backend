# Vehicle Rental System – Backend API

A simple modular based backend for managing vehicle rentals, users, and bookings using **Node.js + Express + PostgreSQL**.

## Live URL

https://www.w3schools.com/postgresql/postgresql_all.php

## Features

- User registration and login (JWT authentication)
  -- User can register and during register he can made himself admin (it will be updated) or customer, if he don't put anything he will a customer
- Vehicle CRUD operations
  -- Only admin can do this. Add Vehicle, Delete vehicle(only if no booking), Update Vehicle
- User and admin can book car
  -- User can only book for them self. Admin can book for any existing user.
- Vehicle availability update when booking status changes
  -- When someone booked a car it's status will be changed.
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

## Setup

## Usages
