# Smart Krushi Mitra (स्मार्ट कृषी मित्र)

Your Smart Farming Companion — a complete Digital Farming Assistant platform that helps Indian farmers manage crops from sowing to harvesting.

---

## Architecture Diagram

```mermaid
graph TD
    A[React 18 Frontend] -->|REST API Requests| B[Node.js Express Backend]
    B -->|Bypasses RLS for Admin Tasks| C[Supabase PostgreSQL]
    A -->|Client Direct Queries with RLS| C
    B -->|Weather Queries / Cache| D[Open-Meteo API]
    B -->|Automatic Schedules| E[Recommendation Engine]
```

---

## Database ER Diagram

```mermaid
erDiagram
    profiles {
        uuid id PK
        uuid user_id FK
        text full_name
        text mobile
        text state
        text district
        text taluka
        text village
        user_role role
    }
    crops {
        uuid id PK
        uuid user_id FK
        uuid crop_master_id FK
        date sowing_date
        numeric area
        text variety
        crop_status status
    }
    crop_master {
        uuid id PK
        text name
        text category
        integer duration_days
        text expected_yield
    }
    crop_stages {
        uuid id PK
        uuid crop_master_id FK
        text stage_name
        integer start_day
        integer end_day
    }
    
    profiles ||--o{ crops : owns
    crop_master ||--o{ crops : instantiates
    crop_master ||--o{ crop_stages : has
```

---

## Setup & Running Guide

### Database Setup
1. Create a Supabase Project.
2. In the Supabase SQL Editor, copy and run the schema file: [01_schema.sql](file:///c:/Agrozone%20office/Smart%20krushi%20Mitra/supabase/database/migrations/01_schema.sql).
3. Populate database seeds by executing: [seed.sql](file:///c:/Agrozone%20office/Smart%20krushi%20Mitra/supabase/database/seed/seed.sql).

### Backend Setup
1. Navigate to `/backend`.
2. Copy `.env.example` to `.env` and fill in `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run in development:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run Vite server:
   ```bash
   npm run dev
   ```
4. Access app at `http://localhost:3000`.
