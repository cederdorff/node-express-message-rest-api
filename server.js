// ========== Import dependencies ========== //
import express from "express";
import cors from "cors";
import sql from "./db.js";

// ========== Setup Express App ========== //
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS for all routes - allow requests from any origin

// ========= Define API Endpoints ========== //

// Test database connection
app.get("/test-db", async (req, res) => {
  try {
    const result = await sql`SELECT NOW()`;
    res.json({ success: true, time: result[0].now });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/", (request, response) => {
  response.send("Node.js Messages REST API 🎉");
});

// ========= Threads Endpoints ========== //

// GET /threads - get all threads
app.get("/threads", async (req, res) => {
  try {
    const threads = await sql`
      SELECT id, title, created_at 
      FROM threads 
      ORDER BY created_at DESC
    `;
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved hentning af threads." });
  }
});

// GET /threads/:id - get thread by id
app.get("/threads/:id", async (req, res) => {
  try {
    const threadId = req.params.id;
    const threads = await sql`
      SELECT id, title, created_at 
      FROM threads 
      WHERE id = ${threadId}
    `;
    if (threads.length === 0) {
      return res.status(404).json({ error: "Thread ikke fundet." });
    }
    res.json(threads[0]);
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved hentning af thread." });
  }
});

// POST /threads - create new thread
app.post("/threads", async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title skal udfyldes." });
    }
    const threads = await sql`
      INSERT INTO threads (title) 
      VALUES (${title}) 
      RETURNING id, title, created_at
    `;
    res.status(201).json(threads[0]);
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved oprettelse af thread." });
  }
});

// DELETE /threads/:id - delete thread
app.delete("/threads/:id", async (req, res) => {
  try {
    const threadId = req.params.id;
    const result = await sql`
      DELETE FROM threads 
      WHERE id = ${threadId} 
      RETURNING id
    `;
    if (result.length === 0) {
      return res.status(404).json({ error: "Thread ikke fundet." });
    }
    res.json({ message: "Thread slettet." });
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved sletning af thread." });
  }
});

// ========= Messages Endpoints ========== //

// GET /threads/:id/messages - get all messages in a thread
app.get("/threads/:id/messages", async (req, res) => {
  try {
    const threadId = req.params.id;
    const messages = await sql`
      SELECT id, thread_id, type, content, created_at 
      FROM messages 
      WHERE thread_id = ${threadId} 
      ORDER BY created_at ASC
    `;
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved hentning af beskeder." });
  }
});

// POST /threads/:id/messages - add message to thread
app.post("/threads/:id/messages", async (req, res) => {
  try {
    const threadId = req.params.id;
    const { type, content } = req.body;

    if (!type || !content) {
      return res.status(400).json({ error: "Type og content skal udfyldes." });
    }

    if (!["user", "bot"].includes(type)) {
      return res.status(400).json({ error: "Type skal være 'user' eller 'bot'." });
    }

    const messages = await sql`
      INSERT INTO messages (thread_id, type, content) 
      VALUES (${threadId}, ${type}, ${content}) 
      RETURNING id, thread_id, type, content, created_at
    `;
    res.status(201).json(messages[0]);
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved oprettelse af besked." });
  }
});

// ========== Start the server ========== //
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`App is running on http://localhost:${PORT}`);
  console.log(`Messages Endpoint http://localhost:${PORT}/threads`);
});
