# 📦 Parcel Delivery Management System

A full-stack backend project for managing parcel delivery requests between Senders, Receivers, and Admins.

## 🚀 Features

- User Authentication (JWT)
- Role-Based Access Control (Admin, Sender, Receiver)
- Parcel Request Creation & Tracking
- Incoming & Delivered Parcel Management
- Admin Control for Users & Parcels
- Input Validation with Zod
- Error Handling & Status Management

## 📌 Requirements (As per Assignment)

- Implement secure user authentication & authorization.
- Use roles: **Admin**, **Sender**, **Receiver**.
- Allow senders to create, edit, and cancel parcel requests.
- Allow receivers to view, confirm, and mark parcels as delivered.
- Admin can manage (CRUD) users and parcels.
- Use **Zod** for validation.
- Include tracking system with unique tracking IDs.
- Include proper error handling & status codes.
- Provide API endpoints for all operations.

## 🛠️ Tech Stack

- **Node.js**, **Express.js**
- **MongoDB**, **Mongoose**
- **TypeScript**
- **Zod** for Validation
- **JWT** for Authentication
- **BCrypt** for Password Hashing

## 🔗 API Endpoints

### 🔐 Auth

- `POST /auth/register` – Register a new user (Sender, Receiver, or Admin).
- `POST /auth/login` – Login and receive a JWT token.

### 👥 Users (Admin Only)

- `GET /users` – Get all users.
- `PATCH /users/:id` – Update user info (role, status).
- `DELETE /users/:id` – Delete a user.

### 📦 Parcels

#### ✅ Sender

- `POST /parcels/request` – Create a new parcel request.
- `GET /parcels/me` – Get all parcels created by the logged-in user.
- `PATCH /parcels/:id` – Update parcel request (before dispatch).
- `PATCH /parcels/:id/cancel` – Cancel a parcel (if allowed).
- `GET /parcels/track/:trackingId` – Track parcel by tracking ID.

#### ✅ Receiver

- `GET /parcels/incoming` – View incoming parcels assigned to receiver.
- `GET /parcels/delivery` – View delivered parcels.
- `PATCH /parcels/:id/confirm` – Confirm parcel delivery.
- `PATCH /parcels/:id/delivered` – Mark parcel as delivered.

#### ✅ Admin

- `GET /parcels` – Get all parcels.
- `PATCH /parcels/update/:id` – Update parcel (Admin override).
- `DELETE /parcels/delete/:id` – Delete parcel.

## ⚙️ Setup Instructions

1. Clone the repository:

   ```bash
   git clone <repo-url>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file with:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Run the server:

   ```bash
   npm run dev
   ```

5. Test API endpoints using **Postman** or **Thunder Client**.
