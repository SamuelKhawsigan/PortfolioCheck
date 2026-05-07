# Portfolio Backend & CMS API

This project is a robust, secure, and scalable backend for a dynamic portfolio and integrated CMS, built with Next.js, Prisma, and PostgreSQL.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Auth.js (NextAuth) with JWT & Credentials Provider
- **Validation**: Zod
- **Storage**: Local File Storage (`public/uploads`)

## Setup Instructions

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL database instance

### 2. Environment Configuration
Create a `.env` file in the root directory (use `.env.example` as a template):
```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
AUTH_SECRET="your-secret-here" # Generate with: npx auth secret
UPLOAD_DIR="./public/uploads"
```

### 3. Installation
```bash
npm install
```

### 4. Database Setup
Run migrations to create the database schema:
```bash
npx prisma migrate dev --name init
```

### 5. Seeding Admin User
Create the initial administrator account (default: `admin` / `password123`):
```bash
npm run seed:admin
```
**Important**: Log in and change your password immediately after setup.

## API Documentation

### Public Endpoints (Read-Only)
- `GET /api/profile`: Retrieve bio and contact links.
- `GET /api/projects`: List all published projects.
- `GET /api/ctf-writeups`: List published CTF writeups.
- `GET /api/certifications`: List certifications.
- `GET /api/experience`: List professional experience.
- `GET /api/skills`: List categorized skills.
- `GET /api/blog`: List published blog posts.
- `POST /api/contact`: Submit contact form (includes rate limiting).

### Administrative Endpoints (Authenticated CRUD)
All admin routes are protected under `/api/admin/*`.
- `GET /api/admin/projects`: List all projects (including drafts).
- `POST /api/admin/projects`: Create a new project.
- `PATCH /api/admin/projects/[id]`: Update project details.
- `DELETE /api/admin/projects/[id]`: Delete a project.
- `POST /api/admin/upload`: Secure file upload (Multipart Form Data). Returns the file URL.

*Note: Similar CRUD endpoints exist for Blog, CTF Writeups, Profile, Experience, Skills, and Certifications.*

## Security Features
- **Password Hashing**: Uses `bcryptjs` with 10 salt rounds.
- **Session Management**: JWT-based sessions handled by Auth.js.
- **Route Protection**: Middleware-level authentication checks for all `/api/admin` paths.
- **Input Sanitization**: Schema-based validation using Zod prevents XSS and malformed data.
- **Rate Limiting**: Applied to the public contact form to prevent spam.
