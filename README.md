# ChemStock – Simple Inventory Management System

ChemStock is a full-stack inventory management system designed to manage chemical products and their stock levels.  
The application allows users to register chemical products, maintain inventory records, and perform stock IN and OUT operations with proper validation.

---

## 🌐 Live Deployment

- **Frontend (Live Application):**  
  https://chemstock-frontend.onrender.com

- **Backend API:**  
  https://chemstock.onrender.com/api

---

## Tech Stack

### Frontend
- React (Vite)
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL

---

## Setup Instructions

### 1. Prerequisites

Ensure the following are installed on your system:
- Node.js (v18 or higher recommended)
- PostgreSQL
- npm or yarn

---

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

#### Environment Configuration

Create a `.env` file in the backend root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/chemstock"
PORT=5000
```

Make sure the PostgreSQL database `chemstock` exists and the PostgreSQL service is running.

---

#### Run Database Migrations

```bash
npx prisma generate
npx prisma migrate dev
```

These commands will:
- Generate the Prisma client
- Create database tables
- Sync the schema with PostgreSQL

---

#### Start the Backend Server

```bash
npm run dev
```

The backend server will run at:

```
http://localhost:5000
```

---

### 3. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

(Optional) Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start the Frontend Application

```bash
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

## Database Schema / Models

The backend uses Prisma ORM with PostgreSQL for database management.

---

### Product Model

Represents a chemical product.

| Field        | Type            | Description              |
|--------------|-----------------|--------------------------|
| id           | UUID            | Primary key              |
| productName  | String          | Name of the chemical     |
| casNumber    | String (Unique) | CAS number               |
| unit         | Enum            | KG / MT / LITRE          |
| createdAt   | DateTime        | Auto-generated timestamp |

#### Constraints
- CAS number must be unique
- Unit values are restricted using an enum

---

### Inventory Model

Tracks stock information for each product.

| Field        | Type     | Description                     |
|--------------|----------|---------------------------------|
| id           | UUID     | Primary key                     |
| productId    | UUID     | Foreign key referencing Product |
| currentStock | Float    | Current stock quantity          |
| updatedAt    | DateTime | Auto-updated timestamp          |

#### Constraints
- One-to-one relationship with Product
- Stock values cannot go below zero
- Inventory records are deleted automatically when a product is deleted

---

### Relationship Overview

```
Product 1 ---- 1 Inventory
```

Each product has exactly one associated inventory record.

---

### Unit Enum

```prisma
enum Unit {
  KG
  MT
  LITRE
}
```

This ensures only valid unit values are stored at the database level.

---

## Application Flow (High Level)

1. User interacts with the React frontend
2. Frontend sends API requests using Axios
3. Express backend validates incoming requests
4. Prisma executes database operations
5. PostgreSQL stores and retrieves data
6. Responses are sent back to the frontend

---

## Key Features

- Create, update, and delete chemical products
- Enforce unique CAS numbers
- View real-time inventory data
- Perform stock IN and OUT operations
- Prevent negative stock values
- Clear separation between frontend and backend layers

---

## Notes

- Frontend and backend are fully decoupled
- API communication is handled through a dedicated API layer
- Prisma manages schema definitions, migrations, and relations

---

## Author

Ayush Gade  
