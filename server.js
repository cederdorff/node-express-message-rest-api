// ========== Import dependencies ========== //
import express from "express";
import fs from "fs/promises";
import cors from "cors";
import { randomUUID } from "crypto";

// ========== Setup Express App ========== //
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(
  cors({
    origin: ["https://cederdorff.com"]
  })
); // Enable CORS for all routes - allow requests from any origin

// ========== File Helper Operations ========== //
// Helper: Read messages from file
async function readMessages() {
  const data = await fs.readFile("data/messages.json");
  const messages = JSON.parse(data);
  return messages;
}

// Helper: Write messages to file
async function writeMessages(messages) {
  await fs.writeFile("data/messages.json", JSON.stringify(messages, null, 2));
}

// ========= Define API Endpoints ========== //

// Root endpoint
// Request: GET /
// Response: "Node.js Messages REST API 🎉"
app.get("/", (request, response) => {
  response.send("Node.js Messages REST API 🎉");
});

/**
 * GET /messages
 * Eksempel på brug:
 *   /messages?search=hej&sort=-date&page=2&limit=3
 *
 * Request: GET /messages?search=hej&sort=-date&page=2&limit=3
 * Response:
 * {
 *   "total": 12,
 *   "page": 2,
 *   "limit": 3,
 *   "data": [ { "id": "...", "text": "...", ... }, ... ]
 * }
 *
 * Statuskoder: 200 OK, 500 Server Error
 */
app.get("/messages", async (req, res) => {
  try {
    // 1. Læs alle beskeder fra fil (async/await)
    let messages = await readMessages();

    // 2. Filtrering på tekst (hvis ?search=tekst)
    if (req.query.search) {
      const search = req.query.search.toLowerCase();
      messages = messages.filter(message => message.text.toLowerCase().includes(search));
    }

    // 3. Sortering på dato (hvis ?sort=-date, ellers ældste først)
    if (req.query.sort === "-date") {
      messages.sort((messageA, messageB) => new Date(messageB.date) - new Date(messageA.date));
    } else {
      messages.sort((messageA, messageB) => new Date(messageA.date) - new Date(messageB.date));
    }

    // 4. Paginering (?page=1&limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || messages.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginatedMessages = messages.slice(start, end);

    // 5. Returnér samlet antal, side, limit og data
    res.status(200).json({
      total: messages.length,
      page,
      limit,
      data: paginatedMessages
    }); // 200 OK - success
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved hentning af beskeder." }); // 500 - server error
  }
});

/**
 * GET /messages/:id
 * Request: GET /messages/1234
 * Response (200): { "id": "1234", "text": "...", ... }
 * Response (404): { "error": "Besked ikke fundet." }
 *
 * Statuskoder: 200 OK, 404 Not Found, 500 Server Error
 */
app.get("/messages/:id", async (req, res) => {
  try {
    const messages = await readMessages(); // async/await
    const messageId = req.params.id;
    const message = messages.find(message => message.id === messageId);
    if (!message) {
      return res.status(404).json({ error: "Besked ikke fundet." }); // 404 Not Found
    }
    res.status(200).json(message); // 200 OK - success
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved hentning af besked." }); // 500 - server error
  }
});

/**
 * POST /messages
 * Request: POST /messages
 * Body: { "text": "Hej!", "sender": "user" }
 * Response (201): { "id": "...", "date": "...", "text": "Hej!", "sender": "user" }
 * Response (400): { "error": "Både 'text' og 'sender' skal udfyldes." }
 *
 * Statuskoder: 201 Created, 400 Bad Request, 500 Server Error
 */
app.post("/messages", async (req, res) => {
  try {
    const messages = await readMessages(); // async/await
    const { text, sender } = req.body;
    if (!text || !sender) {
      return res.status(400).json({ error: "Både 'text' og 'sender' skal udfyldes." }); // 400 Bad Request
    }
    const newMessage = {
      id: randomUUID(),
      date: new Date().toISOString(),
      text,
      sender
    };
    messages.push(newMessage);
    await writeMessages(messages);
    res.status(201).json(newMessage); // 201 Created - success
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved oprettelse af besked." }); // 500 - server error
  }
});

/**
 * PUT /messages/:id
 * Request: PUT /messages/1234
 * Body: { "text": "Opdateret besked", "sender": "user" }
 * Response (200): { "id": "1234", "text": "Opdateret besked", ... }
 * Response (400): { "error": "Både 'text' og 'sender' skal udfyldes." }
 * Response (404): { "error": "Besked ikke fundet." }
 *
 * Statuskoder: 200 OK, 400 Bad Request, 404 Not Found, 500 Server Error
 */
app.put("/messages/:id", async (req, res) => {
  try {
    const messages = await readMessages(); // async/await
    const messageId = req.params.id;
    const message = messages.find(message => message.id === messageId);
    if (!message) {
      return res.status(404).json({ error: "Besked ikke fundet." }); // 404 Not Found
    }
    const { text, sender } = req.body;
    if (!text || !sender) {
      return res.status(400).json({ error: "Både 'text' og 'sender' skal udfyldes." }); // 400 Bad Request
    }
    message.text = text;
    message.sender = sender;
    await writeMessages(messages);
    res.status(200).json(message); // 200 OK - success
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved opdatering af besked." }); // 500 - server error
  }
});

/**
 * DELETE /messages/:id
 * Request: DELETE /messages/1234
 * Response (200): { "message": "Besked slettet." }
 * Response (404): { "error": "Besked ikke fundet." }
 *
 * Statuskoder: 200 OK, 404 Not Found, 500 Server Error
 */
app.delete("/messages/:id", async (req, res) => {
  try {
    let messages = await readMessages(); // async/await
    const messageId = req.params.id;
    const message = messages.find(message => message.id === messageId);
    if (!message) {
      return res.status(404).json({ error: "Besked ikke fundet." }); // 404 Not Found
    }
    messages = messages.filter(message => message.id !== messageId);
    await writeMessages(messages);
    res.status(200).json({ message: "Besked slettet." }); // 200 OK - success
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved sletning af besked." }); // 500 - server error
  }
});

// ========== Start the server ========== //
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`App is running on http://localhost:${PORT}`);
  console.log(`Messages Endpoint http://localhost:${PORT}/messages`);
});
