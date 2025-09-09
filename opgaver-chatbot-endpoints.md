# Ekstraopgaver: Fra EJS til REST API – Chatbot Endpoints

## 1. Introduktion til chats-datastrukturen

**Bemærk:** Du har ikke filen `chats.json` fra start – du skal selv oprette den som en del af øvelsen!

Forestil dig, at du bygger en chatbot eller chat-app, hvor brugeren kan have flere samtaler (chats) – fx "Dagens vejrudsigt" eller "Teknisk support". Hver chat har sin egen historik af beskeder mellem bruger og chatbot.

Derfor gemmer vi data som en liste af chats, hvor hver chat har et `id`, en `title`, en `date` og en liste af beskeder (`messages`). Hver besked har også et `id`, `text`, `sender` og `date`. Her er et eksempel:

```json
[
  {
    "id": "11223344-5555-6666-7777-888899990000",
    "title": "Dagens vejrudsigt ☀️",
    "date": "2023-10-01T12:00:00Z",
    "messages": [
      {
        "id": "e1a2c3d4-1111-2222-3333-444455556666",
        "date": "2025-09-03T09:15:00.000Z",
        "text": "Hej! Hvordan går det?",
        "sender": "user"
      },
      {
        "id": "f7b8a9c0-7777-8888-9999-000011112222",
        "date": "2025-09-03T09:16:00.000Z",
        "text": "Det går fint, tak! Hvordan kan jeg hjælpe dig?",
        "sender": "chatbot"
      }
    ]
  },
  {
    "id": "22334455-6666-7777-8888-999900001111",
    "title": "Teknisk support 🛠️",
    "date": "2023-10-02T15:30:00Z",
    "messages": [
      {
        "id": "11223344-5555-6666-7777-888899990000",
        "date": "2025-09-04T10:00:00.000Z",
        "text": "Hej, jeg har problemer med min computer.",
        "sender": "user"
      },
      {
        "id": "22334455-6666-7777-8888-999900001111",
        "date": "2025-09-04T10:01:00.000Z",
        "text": "Hej! Hvad slags problemer oplever du?",
        "sender": "chatbot"
      }
    ]
  }
]
```


**Refleksion:**
- Hvorfor er det smart at gemme chats og beskeder på denne måde?
- Hvilke fordele giver det, hvis du senere vil vise en oversigt over chats, eller analysere samtaler?
- Kan du forestille dig andre apps eller systemer, der bruger lignende datastrukturer?

---

## 2. Opret din egen chats.json-fil

Nu skal du selv oprette filen, så du kan arbejde videre med data.

1. Opret en ny fil i mappen `data` med navnet `chats.json`.
2. Kopiér og indsæt eksempeldata i filen. Du kan kopiere data fra *1. Introduktion til chats-datastrukturen*. 
3. Gem filen.

---

## 3. Forstå datastrukturen – små testopgaver

Når du har oprettet `chats.json`, så prøv at læse og forstå datastrukturen.

### Opgaver:
1. Hvor mange chats er der i eksemplet?
2. Hvad er titlen på den første chat?
3. Hvor mange beskeder er der i den første chat?
4. Hvem er afsender på den første besked i den første chat?
5. Hvad er teksten i den sidste besked i den anden chat?

**Tip:**
Åbn `chats.json` og find svarene ved at læse filen manuelt – eller prøv at skrive små kodeeksempler i Node.js, der læser og udskriver data fra filen.

Eksempel på at læse filen i Node.js (samme stil som i server.js):

```js
import fs from "fs/promises";
const data = await fs.readFile("data/chats.json");
const chats = JSON.parse(data);
console.log(chats.length); // antal chats
```

---

## 4. Lav read og write funktioner til chats

For at arbejde med dine chats-data i Node/Express, skal du lave to hjælpefunktioner – én til at læse (read) og én til at skrive (write) filen `chats.json`. Det minder om det, du har gjort for `messages`.

**TODO:**

- Tilføj/lav disse funktioner i dit projekt.
- Prøv at bruge `readChats()` i en route eller i en lille test-fil for at sikre, at du kan læse dine chats.

**Tip:**
Hvis du allerede har tilsvarende funktioner for messages, kan du bruge dem som skabelon.

<details>
<summary>💡 Hint & kodeeksempel</summary>

Opret evt. en ny fil <code>data/chats.js</code> og tilføj:

```js
import fs from "fs/promises";

export async function readChats() {
  const data = await fs.readFile("data/chats.json");
  return JSON.parse(data);
}

export async function writeChats(chats) {
  await fs.writeFile("data/chats.json", JSON.stringify(chats, null, 2));
}
```

</details>

---

## 5. Byg endpoints til chats og beskeder – step-by-step

### Step 1: GET /chats – hent alle chats

- Lav et endpoint: `GET /chats`
- Brug `readChats()` til at hente alle chats og returnér dem som JSON.

<details>
<summary>💡 Hint & kodeeksempel</summary>

```js
app.get("/chats", async (req, res) => {
  const chats = await readChats();
  res.json(chats);
});
```

</details>

Test med Postman/Thunder Client.

---

### Step 2: GET /chats/:id – hent én chat

- Lav et endpoint: `GET /chats/:id`
- Find chatten med det rigtige id (fx med `find`).
- Returnér chatten som JSON – eller status 404 hvis ikke fundet.

<details>
<summary>💡 Hint & kodeeksempel</summary>

```js
app.get("/chats/:id", async (req, res) => {
  const chats = await readChats();
  const chat = chats.find(c => c.id === req.params.id);
  if (!chat) return res.status(404).json({ error: "Chat ikke fundet" });
  res.json(chat);
});
```

</details>

---

### Step 3: POST /chats – opret ny chat

- Lav et endpoint: `POST /chats`
- Tjek at der er en titel i request body.
- Opret et nyt chat-objekt (brug fx `crypto.randomUUID()` til id).
- Tilføj chatten til listen og gem med `writeChats()`.
- Returnér den nye chat og status 201.

**Testdata og testvejledning:**

- Eksempel på request body:
  ```json
  {
    "title": "Chat med support"
  }
  ```
- Forventet svar (status 201):
  ```json
  {
    "id": "GENERERET_ID",
    "title": "Chat med support",
    "date": "2025-09-09T10:00:00.000Z",
    "messages": []
  }
  ```
- Prøv også at sende en tom body eller uden title:
  ```json
  {}
  ```
  Forventet svar: status 400 og fejlbesked, fx:
  ```json
  { "error": "Titel mangler" }
  ```

<details>
<summary>💡 Hint & kodeeksempel</summary>

```js
import { randomUUID } from "crypto";
// ...
app.post("/chats", async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: "Titel mangler" });
  const chats = await readChats();
  const newChat = {
    id: randomUUID(),
    title,
    date: new Date().toISOString(),
    messages: []
  };
  chats.push(newChat);
  await writeChats(chats);
  res.status(201).json(newChat);
});
```

</details>

---

### Step 4: DELETE /chats/:id – slet en chat

- Lav et endpoint: `DELETE /chats/:id`
- Find chatten og fjern den fra listen.
- Gem listen med `writeChats()`.
- Returnér status 204 (no content) eller 404 hvis ikke fundet.

<details>
<summary>💡 Hint & kodeeksempel</summary>

```js
app.delete("/chats/:id", async (req, res) => {
  const chats = await readChats();
  const index = chats.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Chat ikke fundet" });
  chats.splice(index, 1);
  await writeChats(chats);
  res.status(204).end();
});
```

</details>

---

### Step 5: Endpoints til beskeder i en chat – trin for trin

Når vi arbejder med beskeder i en bestemt chat, bruger vi endpoints som `/chats/:id/messages`. Det betyder:

- Vi finder først den rigtige chat (med id fra URL'en)
- Derefter arbejder vi med chat'ens messages-array

Dette kaldes "nested resources" i REST – vi arbejder med ressourcer (beskeder) der tilhører en anden ressource (chat). Det gør det nemt at hente, tilføje og slette beskeder i den rigtige chat.

---

#### a) GET /chats/:id/messages – hent alle beskeder i en chat

1. Lav et endpoint: `GET /chats/:id/messages`
2. Find chatten med det rigtige id (brug `find`)
3. Returnér chat.messages som JSON
4. Returnér status 404 hvis chat ikke findes

<details>
<summary>💡 Hint & kodeeksempel</summary>

```js
app.get("/chats/:id/messages", async (req, res) => {
  const chats = await readChats();
  const chat = chats.find(c => c.id === req.params.id);
  if (!chat) return res.status(404).json({ error: "Chat ikke fundet" });
  res.json(chat.messages);
});
```

</details>

---

#### b) POST /chats/:id/messages – tilføj besked til en chat

1. Lav et endpoint: `POST /chats/:id/messages`
2. Find chatten (brug `find`)
3. Tjek at både `text` og `sender` findes i body – ellers returnér status 400
4. Opret et nyt besked-objekt (brug randomUUID til id, og tilføj dato)
5. Tilføj beskeden til chat.messages
6. Gem listen med `writeChats()`
7. Returnér den nye besked og status 201

**Testdata til request body:**

```json
{
  "text": "Hej chatbot!",
  "sender": "user"
}
```

<details>
<summary>💡 Hint & kodeeksempel</summary>

```js
import { randomUUID } from "crypto";
// ...
app.post("/chats/:id/messages", async (req, res) => {
  const { text, sender } = req.body;
  if (!text || !sender) return res.status(400).json({ error: "Text og sender skal udfyldes" });
  const chats = await readChats();
  const chat = chats.find(c => c.id === req.params.id);
  if (!chat) return res.status(404).json({ error: "Chat ikke fundet" });
  const newMessage = {
    id: randomUUID(),
    date: new Date().toISOString(),
    text,
    sender
  };
  chat.messages.push(newMessage);
  await writeChats(chats);
  res.status(201).json(newMessage);
});
```

</details>

---

#### c) DELETE /chats/:chatId/messages/:messageId – slet besked

1. Lav et endpoint: `DELETE /chats/:chatId/messages/:messageId`
2. Find chatten (brug `find`)
3. Find beskeden i chat.messages (brug `findIndex`)
4. Fjern beskeden fra messages-array (brug `splice`)
5. Gem listen med `writeChats()`
6. Returnér status 204 hvis alt gik godt, eller 404 hvis chat/besked ikke findes

<details>
<summary>💡 Hint & kodeeksempel</summary>

```js
app.delete("/chats/:chatId/messages/:messageId", async (req, res) => {
  const chats = await readChats();
  const chat = chats.find(c => c.id === req.params.chatId);
  if (!chat) return res.status(404).json({ error: "Chat ikke fundet" });
  const index = chat.messages.findIndex(m => m.id === req.params.messageId);
  if (index === -1) return res.status(404).json({ error: "Besked ikke fundet" });
  chat.messages.splice(index, 1);
  await writeChats(chats);
  res.status(204).end();
});
```

</details>

---

**Refleksion:**

- Hvorfor er det smart at arbejde med nested endpoints som `/chats/:id/messages`?
- Hvordan kan du sikre, at du altid får de rigtige statuskoder og fejlbeskeder?

---

Test alle endpoints løbende med Postman/Thunder Client og tjek at du får de rigtige statuskoder og fejlbeskeder.

Test alle endpoints løbende med Postman/Thunder Client og tjek at du får de rigtige statuskoder og fejlbeskeder.

---

## 6. Refleksion og ekstraopgaver

- Hvilke endpoints giver ellers mening for en chatbot?  
  (fx `/responses`, `/keywords`, `/answers`)
- Hvordan adskiller API’et sig fra en klassisk EJS-app?
- Hvordan kan du strukturere din serverlogik, så det er let at udvide med flere chatbot-funktioner?

- Prøv at tilføje filtrering, sortering eller paginering til `/chats` eller `/chats/:id/messages` med query parameters.
  - Eksempel: `/chats?title=vejr` eller `/chats/:id/messages?sender=user`

---

**Hint:**
Brug din eksisterende viden om REST, statuskoder og fejlhåndtering – og eksperimentér!
Du kan tage udgangspunkt i datastrukturen fra `chats.json`.

---

💡 Prøv selv først – og brug hints, hvis du sidder fast!
Stil spørgsmål og reflekter over hvert trin.
