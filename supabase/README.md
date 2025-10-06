# Supabase Setup for Node.js Express API

Dette directory indeholder SQL scripts og instruktioner til at opsætte din Supabase database til dit Express API.

## Forudsætninger

1. Opret en gratis Supabase-konto på https://supabase.com
2. Opret et nyt projekt (noter project URL og database password)

## Setup Trin

### 1. Opret Database Tabeller

1. Åbn din Supabase project dashboard
2. Gå til SQL Editor (venstre sidebar)
3. Kopiér indholdet af `schema.sql` og kør det i SQL Editor
4. Dette opretter `threads` og `messages` tabeller med korrekte relationer og indekser

### 2. Tilføj Test Data

1. I SQL Editor, kopiér indholdet af `seed.sql` og kør det
2. Dette tilføjer 10 eksempel chat threads med flere beskeder hver
3. Du kan verificere dataene ved at gå til Table Editor → threads

### 3. Konfigurer Database Forbindelse

**Hvordan finder du connection string:**

1. Åbn din Supabase project dashboard
2. Klik på **"Connect"** knappen i toppen af dashboardet
3. Vælg din ønskede forbindelsestype nedenfor

**Vælg forbindelsestype baseret på dit setup:**

#### **Option A: Direct Connection (anbefalet til udvikling)**

Til persistent forbindelse og udvikling:

1. I "Connect to your project" dialogen, vælg "Direct connection"
2. Kopiér "Connection string":
   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

#### **Option B: Transaction Pooler (anbefalet til produktion)**

Hvis du får forbindelsesfejl eller kører på IPv4-netværk:

1. I "Connect to your project" dialogen, vælg "Transaction pooler"
2. Kopiér connection string:
   ```env
   DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
   ```

**Fordele ved Transaction Pooler:**

- IPv4 kompatibel (virker på flere netværk)
- Håndterer mange samtidige forbindelser bedre
- Deler connection pool mellem clients

**Note:** Transaction pooler understøtter IKKE PREPARE statements, men det påvirker ikke dette projekt.

#### **Option C: Session Pooler**

Kun hvis du har IPv4-netværk og Direct Connection ikke virker:

1. I "Connect to your project" dialogen, vælg "Session pooler"
2. Kopiér connection string:

```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

### 4. Opsæt Environment Variables

1. Opret `.env` fil i rod-mappen af dit projekt:

   ```env
   DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

2. Erstat `[YOUR-PASSWORD]` med dit database password
3. Erstat `[YOUR-PROJECT-REF]` med din project reference (fra URL'en)

### 5. Start og Test

**Dette projekt bruger `postgres` pakken til database forbindelse - den er allerede inkluderet i package.json.**

1. Installer dependencies:

   ```bash
   npm install
   ```

2. Start serveren:

   ```bash
   npm run dev
   ```

3. Test database forbindelsen:
   ```
   GET http://localhost:3000/test-db
   ```

## API Endpoints

### Threads

- `GET /threads` - Hent alle threads
- `GET /threads/:id` - Hent én thread
- `POST /threads` - Opret ny thread
- `DELETE /threads/:id` - Slet thread

### Messages

- `GET /threads/:id/messages` - Hent alle beskeder i en thread
- `POST /threads/:id/messages` - Tilføj besked til thread

## Eksempler

### Opret ny thread:

```json
POST /threads
{
  "title": "Min første chat"
}
```

### Tilføj besked til thread:

```json
POST /threads/[THREAD_ID]/messages
{
  "type": "user",
  "content": "Hej, hvordan har du det?"
}
```

## Fejlsøgning

### Kan ikke forbinde til database (ENOTFOUND eller connection fejl):

**1. Prøv Transaction Pooler:**
Hvis du får `getaddrinfo ENOTFOUND` fejl, skift til transaction pooler:

```env
DATABASE_URL=postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:6543/postgres
```

**2. Tjek almindelige problemer:**

- Tjek at DATABASE_URL er korrekt i `.env`
- Tjek at dit Supabase projekt ikke er paused
- Tjek at du er på et netværk der tillader database forbindelser

**3. Hvilken forbindelsestype skal jeg vælge?**

- **Direct Connection:** Brug til udvikling på dit eget netværk
- **Transaction Pooler:** Brug hvis Direct Connection fejler, eller til produktion
- **Session Pooler:** Kun hvis Transaction Pooler ikke virker på IPv4 netværk

**4. Genstart serveren efter ændringer:**

```bash
npm run dev
```

### Test forbindelsen:

```
GET http://localhost:3000/test-db
```

Hvis du får en timestamp tilbage, virker forbindelsen!

### RLS (Row Level Security):

For dette eksempel er RLS deaktiveret for simplicitet. I produktion bør du:

1. Aktivere RLS på begge tabeller
2. Oprette security policies for adgangskontrol

## Verify Setup

Run these queries in the SQL Editor to verify your setup:

```sql
-- Check threads were created
SELECT COUNT(*) FROM threads;
-- Should return 10

-- Check messages were created
SELECT COUNT(*) FROM messages;
-- Should return 30+

-- View a thread with its messages
SELECT
  t.title,
  m.type,
  m.content,
  m.created_at
FROM threads t
JOIN messages m ON m.thread_id = t.id
WHERE t.id = '11111111-1111-1111-1111-111111111111'
ORDER BY m.created_at;
```

## Schema overview

### threads table

- `id` (uuid): Primary key, auto-generated
- `title` (text): Thread title (required)
- `created_at` (timestamp): Creation timestamp

### messages table

- `id` (uuid): Primary key, auto-generated
- `thread_id` (uuid): Foreign key to threads table
- `type` (text): Either 'user' or 'bot' (constrained)
- `content` (text): Message content (required)
- `created_at` (timestamp): Creation timestamp

## Clean up (optional)

To start fresh, delete all data:

```sql
-- Delete all messages (will cascade from threads)
DELETE FROM threads;
```

Then re-run the seed.sql script to restore test data. Or create your own.
