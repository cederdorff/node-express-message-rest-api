# Node.js Express REST API med Supabase

Et moderne REST API bygget med Node.js, Express og Supabase database til at håndtere chat threads og beskeder.

## ✨ Features

- **CRUD operationer** for threads og beskeder
- **Supabase database** integration med PostgreSQL
- **JSON filsystem fallback** (legacy support)
- **CORS** understøttelse
- **ES modules** og moderne JavaScript
- **Environment variables** support
- **Auto-reload** under udvikling

## 🚀 Quick Start

### 1. Clone og installer

```bash
git clone <repository-url>
cd node-express-message-rest-api
npm install
```

### 2. Opsæt Supabase (anbefalet)

1. Følg den detaljerede guide i [`supabase/README.md`](supabase/README.md)
2. Opret `.env` fil med din DATABASE_URL
3. Kør tabeller setup i Supabase SQL Editor

### 3. Start projektet

```bash
# Udvikling med auto-reload
npm run dev

# Produktion
npm start
```

### 4. Test API'et

Åbn http://localhost:3000 i din browser eller test endpoints:

- `GET /test-db` - Test database forbindelse
- `GET /threads` - Hent alle threads
- `POST /threads` - Opret ny thread

## 📚 API Endpoints

### Threads

| Method | Endpoint       | Beskrivelse       |
| ------ | -------------- | ----------------- |
| GET    | `/threads`     | Hent alle threads |
| GET    | `/threads/:id` | Hent én thread    |
| POST   | `/threads`     | Opret ny thread   |
| DELETE | `/threads/:id` | Slet thread       |

### Messages

| Method | Endpoint                | Beskrivelse                 |
| ------ | ----------------------- | --------------------------- |
| GET    | `/threads/:id/messages` | Hent alle beskeder i thread |
| POST   | `/threads/:id/messages` | Tilføj besked til thread    |

### Legacy (JSON fil)

| Method | Endpoint        | Beskrivelse                |
| ------ | --------------- | -------------------------- |
| GET    | `/messages`     | Hent beskeder fra JSON fil |
| POST   | `/messages`     | Opret besked i JSON fil    |
| PUT    | `/messages/:id` | Opdater besked             |
| DELETE | `/messages/:id` | Slet besked                |

## 💾 Database Schema

```sql
-- Threads table
CREATE TABLE threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('user', 'bot')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);
```

## 🔧 Konfiguration

### Environment Variables

Opret `.env` fil i projektets rod:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Package Scripts

```json
{
  "start": "node --env-file=.env server.js",
  "dev": "node --env-file=.env --watch server.js"
}
```

## 📝 Eksempler

### Opret thread

```bash
curl -X POST http://localhost:3000/threads \
  -H "Content-Type: application/json" \
  -d '{"title": "Min første chat"}'
```

### Tilføj besked

```bash
curl -X POST http://localhost:3000/threads/THREAD_ID/messages \
  -H "Content-Type: application/json" \
  -d '{"type": "user", "content": "Hej verden!"}'
```

## 🛠️ Teknologier

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Supabase** - Database og backend services
- **postgres** - PostgreSQL client
- **CORS** - Cross-origin resource sharing

## 📂 Projektstruktur

```
├── server.js          # Hovedfil med Express app
├── db.js              # Database forbindelse
├── data/              # JSON filer (legacy)
├── supabase/          # Database setup og dokumentation
├── package.json       # Dependencies og scripts
└── .env              # Environment variables (opret selv)
```

## 🐛 Fejlsøgning

### Database forbindelsesfejl

- Tjek at `.env` fil eksisterer og har korrekt DATABASE_URL
- Prøv Transaction Pooler hvis Direct Connection fejler
- Se detaljeret guide i [`supabase/README.md`](supabase/README.md)

### Server starter ikke

```bash
# Tjek Node.js version (skal være 18+)
node --version

# Installer dependencies igen
npm install

# Start med debug
npm run dev
```

## 📖 Yderligere Dokumentation

- [Supabase Setup Guide](supabase/README.md) - Detaljeret database setup
- [CORS Eksempler](docs/cors-eksempler.md) - CORS konfiguration
- [Express.js Docs](https://expressjs.com/) - Express framework dokumentation

## 🤝 Bidrag

1. Fork projektet
2. Opret feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit ændringer (`git commit -m 'Add AmazingFeature'`)
4. Push til branch (`git push origin feature/AmazingFeature`)
5. Åbn Pull Request

## 📄 Licens

Dette projekt er open source og tilgængeligt under [MIT License](LICENSE).
