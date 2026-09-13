# ☕ Coffee Shop Management System

A complete, offline-first point-of-sale (POS) and management system for cafés and coffee shops — built as a single installable Windows desktop application with an embedded backend and database.

[![Java](https://img.shields.io/badge/Java-21-orange?logo=openjdk)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-brightgreen?logo=springboot)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Electron](https://img.shields.io/badge/Electron-desktop-47848F?logo=electron)](https://www.electronjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## 📖 Overview

This project digitizes the day-to-day operations of a café: taking orders, managing tables, tracking inventory in real time, running shifts, and generating sales reports — all from one desktop app that runs on a single Windows machine with no manual setup for the end user.

## ✨ Features

- **Authentication & Roles** — JWT-based login with Manager, Cashier, and Barista roles, each with scoped permissions
- **Menu & Categories** — create, edit, and organize menu items and categories, including availability toggles
- **Inventory & Recipes** — track raw materials, link them to menu items via recipes, and get low-stock warnings
- **Table Management** — visual table map with live status and reservations
- **Point of Sale (POS)** — build an order, add items to the cart, and check out for dine-in or takeaway
- **Atomic Stock Deduction** — inventory is deducted automatically and safely on every completed sale
- **Kitchen Queue** — a live order queue for kitchen/barista staff to update order status
- **Shift Management** — open/close cash register shifts with reconciliation
- **Purchases** — record incoming stock purchases and payments
- **Reports** — sales, profit, and best-sellers by date range, with Excel export
- **Dark mode** UI

## 🛠 Tech Stack

| Layer      | Technology                                              |
|------------|----------------------------------------------------------|
| Backend    | Java 21, Spring Boot 4.1 (Web, Data JPA, Security, Validation), Flyway, JJWT |
| Database   | PostgreSQL 16                                             |
| Frontend   | React 19, React Router, Redux Toolkit, Tailwind CSS 4, Recharts |
| Build      | Vite                                                      |
| Desktop shell | Electron (bundles backend + PostgreSQL + frontend into a single installer) |

## 📦 Download

Prebuilt Windows installers are available on the [**Releases**](../../releases) page — no need to install Java, PostgreSQL, or Node.js separately.

1. Download the latest `.exe` from [Releases](../../releases/latest).
2. Run the installer. Windows may show an "Unknown Publisher" warning since the app isn't code-signed yet — click **More info → Run anyway**.
3. Launch the app from the Start menu / Desktop shortcut.

## 💻 Development Setup

This is a monorepo with three parts:

```
.
├── backend/     # Spring Boot REST API
├── frontend/    # React + Vite UI
```

### Prerequisites

- [Java 21 (JDK)](https://adoptium.net/)
- [Maven](https://maven.apache.org/) (or use the included `mvnw` wrapper)
- [PostgreSQL 16](https://www.postgresql.org/download/)
- [Node.js](https://nodejs.org/) (LTS) and npm

### 1. Database

Create an empty PostgreSQL database and a user for the app:

```sql
CREATE DATABASE cafe_db;
CREATE USER cafe_user WITH PASSWORD 'cafe_pass';
GRANT ALL PRIVILEGES ON DATABASE cafe_db TO cafe_user;
```

The backend runs Flyway migrations automatically on startup — no manual schema setup needed.

### 2. Backend

```bash
cd backend
```

Set the following environment variables (or edit `src/main/resources/application-local.properties` for local development only — **never commit real secrets**):

| Variable      | Description                          | Default      |
|---------------|---------------------------------------|--------------|
| `DB_HOST`     | Database host                         | `localhost`  |
| `DB_PORT`     | Database port                         | `5433`       |
| `DB_NAME`     | Database name                         | `cafe_db`    |
| `DB_USER`     | Database username                     | `cafe_user`  |
| `DB_PASSWORD` | Database password                     | `cafe_pass`  |
| `JWT_SECRET`  | Secret key used to sign JWT tokens    | *(required — generate your own)* |

Generate a secret, for example:

```bash
openssl rand -base64 32
```

Run the backend:

```bash
./mvnw spring-boot:run
```

The API starts on `http://localhost:8080`. Interactive API docs are available at `http://localhost:8080/swagger-ui.html`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The dev server starts on `http://localhost:5173` and proxies API calls to the backend.

### 4. Desktop (Electron) — optional, for building the installer

```bash
cd desktop
npm install
npm run build   # builds the Windows installer (.exe)
```

## 📄 License

This project is licensed under the [MIT License](LICENSE).
