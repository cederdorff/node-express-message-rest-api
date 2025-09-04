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
app.use(cors()); // Enable CORS

// ========== File Helper Operations ========== //
// Helper: Read messages from file
async function readMessages() {
  const data = await fs.readFile("data/messages.json");
  const messages = JSON.parse(data);
  return messages;
}

// Helper: Write messages to file
function writeMessages(messages) {
  fs.writeFile("data/messages.json", JSON.stringify(messages, null, 2));
}

// ========= Define API Endpoints ========== //
app.get("/", (request, response) => {
  response.send("Node.js Messages REST API 🎉");
});

// GET /messages - get all messages
app.get("/messages", async (req, res) => {
  const messages = await readMessages();
  res.json(messages);
});

// GET /messages/search?text=hello - search messages by text
app.get("/messages/search", async (req, res) => {
  console.log("Search query:", req.query.text); // Log the search query

  const messages = await readMessages(); // Read all messages
  const searchText = req.query.text.toLowerCase(); // Get search text from query params

  // Filter messages containing the search text (case-insensitive)
  const filteredMessages = messages.filter(message => message.text.toLowerCase().includes(searchText));
  res.json(filteredMessages); // Return filtered messages
});

// GET /messages/:id - get message by id
app.get("/messages/:id", async (req, res) => {
  const messages = await readMessages();
  const messageId = req.params.id;
  const message = messages.find(message => message.id === messageId);
  res.json(message);
});

// POST /messages - add new message
app.post("/messages", async (req, res) => {
  const messages = await readMessages();
  const { text, sender } = req.body;

  const newMessage = {
    id: randomUUID(),
    date: new Date().toISOString(),
    text,
    sender
  };

  messages.push(newMessage);
  writeMessages(messages);

  res.json(newMessage);
});

// PUT /messages/:id - update message
app.put("/messages/:id", async (req, res) => {
  const messages = await readMessages();
  const messageId = req.params.id;
  const message = messages.find(message => message.id === messageId);

  const { text, sender } = req.body;
  message.text = text;
  message.sender = sender;

  writeMessages(messages);
  res.json(message);
});

// DELETE /messages/:id - delete message
app.delete("/messages/:id", async (req, res) => {
  let messages = await readMessages();
  const messageId = req.params.id;

  messages = messages.filter(message => message.id !== messageId);

  writeMessages(messages);
  res.json(messages);
});

// ========== Start the server ========== //
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`App is running on http://localhost:${PORT}`);
  console.log(`Messages Endpoint http://localhost:${PORT}/messages`);
});
