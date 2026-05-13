Student Management System — Developer Skill Test

A modular full-stack school management system designed for developer assessments and real-world workflow simulation. The project demonstrates practical implementation of frontend, backend, microservices, DevOps, and blockchain integration in a scalable architecture.

System Architecture

The project is split into independent services to simulate a production-grade system:

frontend/ — React (Vite) + TypeScript + Material UI + Redux Toolkit
backend/ — Node.js + Express + PostgreSQL + JWT + Argon2 + Zod
go-service/ — Golang microservice for PDF report generation
blockchain/ — Solidity smart contracts with Hardhat setup
seed_db/ — SQL schema and seed data for local development

Each module is designed to run independently or together using Docker Compose.

Getting Started
Run Full Stack (Recommended)

Make sure Docker is installed and running.

docker-compose up --build

Once started, the services will be available at:

Frontend
cd frontend
npm install
npm run dev
Backend
cd backend
npm install
npm run dev
Go PDF Service
cd go-service
go mod download
go run src/main.go
Environment Configuration

Each service requires environment variables to run properly.

Backend (.env)
PORT — server port
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD — PostgreSQL config
JWT_SECRET — token signing secret
JWT_EXPIRES_IN — access token lifespan
REFRESH_TOKEN_EXPIRES_IN — refresh token lifespan
CSRF_SECRET — CSRF protection secret
NODE_ENV — environment mode
Frontend (.env)
VITE_API_URL — base URL for backend API
Go Service
BACKEND_URL — Node.js backend URL
PORT — service port
API Overview
Authentication
POST /api/auth/login — authenticate user
POST /api/auth/register — create account
GET /api/csrf-token — retrieve CSRF token
Students
GET /api/students — list all students
GET /api/students/:id — get student details
POST /api/students — create student
PUT /api/students/:id — update student
DELETE /api/students/:id — remove student
Notices
GET /api/notices — fetch notices
POST /api/notices — create notice
PDF Reports (Go Service)
GET /api/v1/students/:id/report — generate student PDF report
Blockchain Module

Smart contracts are located in:

blockchain/contracts/CertificateRegistry.sol

This module handles:

Certificate issuance
Certificate verification
On-chain record storage
Frontend Integration
/app/certificates — wallet connection interface
Certificate issuance and verification dashboard
Testing
Backend Tests
cd backend
npm test
Blockchain Tests
cd blockchain
npm test
Database Seeding

The PostgreSQL database is automatically initialized using:

seed_db/init.sql

This includes:

Table creation
Initial role setup
Sample users and data
Docker Notes

The system is fully containerized using Docker Compose.

Make sure:

PostgreSQL container is running
Backend DB config matches Docker service name (db)
Frontend API URL points to backend service in Docker network
Troubleshooting
Backend not connecting to database

Ensure:

PostgreSQL is running
DB_HOST=db when using Docker Compose
Frontend API errors in Docker

Check:

VITE_API_URL is correctly pointing to backend service
Go service issues

Ensure:

Backend is running
BACKEND_URL is correctly set
Port is not blocked
Design Notes
Backend uses layered architecture (controllers → services → repositories)
Form validation is handled with Zod on both frontend and backend
Authentication uses JWT with refresh token rotation
RBAC controls access to protected routes
Microservice design isolates PDF generation from core backend
Blockchain module is optional but fully functional for certification use cases
Summary

This project is designed as a realistic engineering assessment system, combining:

Scalable full-stack architecture
Secure authentication system
Microservice-based reporting
Blockchain certificate verification
Containerized deployment

It reflects how modern production-grade school or enterprise systems are structured.