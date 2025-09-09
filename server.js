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
app.use(cors()); // Enable CORS for all routes - allow requests from any origin

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
app.get("/", (request, response) => {
  response.send("Node.js Messages REST API 🎉");
});

// GET /messages - get all messages
app.get("/messages", async (req, res) => {
  /**
   * GET /messages
   * Eksempel på brug:
   *   /messages?search=hej&sort=-date&page=2&limit=3
   *
   * Query params:
   *   search: filtrer på tekst
   *   sort: "date" (ældste først) eller "-date" (nyeste først)
   *   page: sidetal (starter fra 1)
   *   limit: antal beskeder per side
   *
   * Eksempel på svar:
   * {
   *   total: 12,
   *   page: 2,
   *   limit: 3,
   *   data: [ { id, text, ... }, ... ]
   * }
   */

  try {
    // 1. Læs alle beskeder fra fil
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
    });
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved hentning af beskeder." });
  }
});

// GET /messages/:id - get message by id
app.get("/messages/:id", async (req, res) => {
  try {
    const messages = await readMessages();
    const messageId = req.params.id;
    const message = messages.find(message => message.id === messageId);
    if (!message) {
      return res.status(404).json({ error: "Besked ikke fundet." });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved hentning af besked." });
  }
});

// POST /messages - add new message
app.post("/messages", async (req, res) => {
  try {
    const messages = await readMessages();
    const { text, sender } = req.body;
    if (!text || !sender) {
      return res.status(400).json({ error: "Både 'text' og 'sender' skal udfyldes." });
    }
    const newMessage = {
      id: randomUUID(),
      date: new Date().toISOString(),
      text,
      sender
    };
    messages.push(newMessage);
    await writeMessages(messages);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved oprettelse af besked." });
  }
});

// PUT /messages/:id - update message
app.put("/messages/:id", async (req, res) => {
  try {
    const messages = await readMessages();
    const messageId = req.params.id;
    const message = messages.find(message => message.id === messageId);
    if (!message) {
      return res.status(404).json({ error: "Besked ikke fundet." });
    }
    const { text, sender } = req.body;
    if (!text || !sender) {
      return res.status(400).json({ error: "Både 'text' og 'sender' skal udfyldes." });
    }
    message.text = text;
    message.sender = sender;
    await writeMessages(messages);
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved opdatering af besked." });
  }
});

// DELETE /messages/:id - delete message
app.delete("/messages/:id", async (req, res) => {
  try {
    let messages = await readMessages();
    const messageId = req.params.id;
    const message = messages.find(message => message.id === messageId);
    if (!message) {
      return res.status(404).json({ error: "Besked ikke fundet." });
    }
    messages = messages.filter(message => message.id !== messageId);
    await writeMessages(messages);
    res.status(200).json({ message: "Besked slettet." });
  } catch (error) {
    res.status(500).json({ error: "Serverfejl ved sletning af besked." });
  }
});

// ========== Start the server ========== //
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`App is running on http://localhost:${PORT}`);
  console.log(`Messages Endpoint http://localhost:${PORT}/messages`);
});
