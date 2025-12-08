# Vehicle Rental System – Backend API

A simple modular based backend for managing vehicle rentals, users, and bookings using **Node.js + Express + PostgreSQL**.

## Live URL

https://www.w3schools.com/postgresql/postgresql_all.php

## Features

- User registration and login (JWT authentication)
  - User can register and during register he can made himself admin (it will be updated) or customer, if he don't put anything he will a customer
- Vehicle CRUD operations
  - Only admin can do this. Add Vehicle, Delete vehicle(only if no booking), Update Vehicle
- User and admin can book car
  - User can only book for them self. Admin can book for any existing user.
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

- git clone https://github.com/sohelranalive/vehicle-rental-system-backend.git
- cd vehicle-rental-backend
- npm install
- create a .env file and provide below information
  - PORT = ?
  - CONNECTION_STR = ?
  - JWT_SECRET = ?

## Usages

## Authorization

### User Registration

#### Endpoint

```
POST /api/v1/auth/signup
```

#### Request Body

```json
{
  "name": "Your name",
  "email": "youremail@email.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"  (can put admin as well, only if you want to manage.)
}
```

### User Login

Sign in using your registered email and password. You will receive a authorization token.

#### Endpoint

```
POST /api/v1/auth/signin
```

#### Request Body

```json
{
  "email": "youremail@email.com",
  "password": "securePassword123"
}
```

## Vehicle

### Create Vehicle

Only admin can create vehicle and you have give authorization header which you have received during sign up.

#### Endpoint

```
POST /api/v1/vehicles
```

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

#### Request Body

```json
{
  "vehicle_name": "Car name",
  "type": "Car type",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

### Get All Vehicles

It's public anyone can see all vehicles

#### Endpoint

```
GET /api/v1/vehicles
```

### 5. Get Vehicle by ID

**Access:** Public  
**Description:** Retrieve specific vehicle details

#### Endpoint

```
GET /api/v1/vehicles/:vehicleId
```

**Example:**

```
GET /api/v1/vehicles/2
```

### Update Vehicle

Only admin can do this action. But you have to put your's token in header

#### Endpoint

```
PUT /api/v1/vehicles/:vehicleId
```

**Example:**

```
PUT /api/v1/vehicles/1
```

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

#### Request Body (Provide which field you want to update)

```json
{
  "vehicle_name": "Toyota Camry 2024 Premium",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 55,
  "availability_status": "available"
}
```

### Delete Vehicle

Only admin can do this with token and if there is no active booking.

#### Endpoint

```
DELETE /api/v1/vehicles/:vehicleId
```

**Example:**

```
DELETE /api/v1/vehicles/1
```

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

## Users

### Get All Users

Only Admin can do this with token.

#### Endpoint

```
GET /api/v1/users
```

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

### Update User

Only admin can this with token

#### Endpoint

```
PUT /api/v1/users/:userId
```

**Example:**

```
PUT /api/v1/users/1
```

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

#### Request Body (All fields optional)

```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567899",
  "role": "admin"
}
```

### 10. Delete User

Only admin can this with token. if user doesn't have any active bookings.

#### Endpoint

```
DELETE /api/v1/users/:userId
```

**Example:**

```
DELETE /api/v1/users/1
```

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

## Booking

### Create Booking

Customer and admin create booking with token. Customer can do own booking, admin can do it for any user.

#### Endpoint

```
POST /api/v1/bookings
```

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

#### Request Body

```json
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

### Get All Bookings

Customer and admin can see all booking with token. Customer can see own booking, admin can see all.

#### Endpoint

```
GET /api/v1/bookings
```

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

### Update Booking

Customer and admin can update bookings with token. Customer can cancel the booking and admin can make it returned.

#### Endpoint

```
PUT /api/v1/bookings/:bookingId
```

**Example:**

```
PUT /api/v1/bookings/1
```

#### Request Headers

```
Authorization: Bearer <jwt_token>
```

#### Request Body - Customer Cancellation

```json
{
  "status": "cancelled"
}
```

#### Request Body - Admin Mark as Returned

```json
{
  "status": "returned"
}
```

## Author

    Md Sohel Rana
    Master of Engineering – Information Technology
    Frankfurt University of Applied Sciences
    Frankfurt, Germany
