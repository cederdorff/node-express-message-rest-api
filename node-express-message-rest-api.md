# Node Express Message REST API

Rasmus Cederdorff (RACE)  
Senior Lecturer & Web App Developer  
race@eaaa.dk

---

## Oversigt over opgaver

**Du kommer til at gennemgå følgende opgaver i rækkefølge:**

1. **Forudsætninger** → Sikr at Node.js og VS Code er installeret
2. **Opret projektet** → Ny mappe og åbn i VS Code
3. **Initialiser Node.js-projektet** → `npm init` og `package.json`
4. **Konfigurer package.json og scripts** → ES modules og npm scripts
5. **Opret data-mappe og besked-fil** → JSON fil med eksempel-data
6. **Opret og start din server** → Express installation og server.js
7. **Læs og skriv data fra fil** → Helper funktioner og test-routes
8. **Opret REST routes** → CRUD endpoints (GET, POST, PUT, DELETE)
9. **Test dit API komplet** → Systematisk test af alle en});

---

## 0. Forudsætninger

Sikr at du har Node.js og VS Code installeret:

- **Node.js** - Åbn terminal og skriv `node --version` (skal vise 20.x eller nyere)
- **VS Code** - Åbn VS Code og tjek at det starter

<details>
<summary>Hint - Hvor downloader jeg Node.js?</summary>

Gå til https://nodejs.org og download den LTS-version (anbefalet version).
Efter installation, genstart din computer hvis nødvendigt.

</details>

---

## 1. Opret projektet

1. Opret en ny mappe der hvor du plejer at placere dine projekter
2. Giv mappen et sigende navn, fx `node-express-message-rest-api`
3. Højreklik på mappen og vælg "Open with Code" (eller åbn VS Code og træk mappen ind)
4. Du skal nu se din tomme mappe i VS Code's file explorer

<details>
<summary>Hint - Jeg kan ikke se "Open with Code"</summary>

Åbn VS Code først, gå til File → Open Folder og vælg din projektmappe.

</details>

---

## 2. Initialiser Node.js-projektet

1. Åbn terminalen i VS Code (Terminal → New Terminal)
2. Skriv `npm init` og tryk Enter
3. Besvar spørgsmålene:
   - **entry point**: Skriv `server.js` (VIGTIGT!)
   - Resten kan du bare trykke Enter på
4. Skriv `yes` når du får vist oversigten

Du får nu en `package.json` fil med projektinformation.

<details>
<summary>Hint - Jeg får fejl i terminalen</summary>

Sørg for at terminalen er åbnet i din projektmappe. Du skal se mappenavnet i terminalen.
Hvis ikke, naviger til mappen med `cd sti-til-din-mappe`

</details>

<details>
<summary>Hint - Hurtig version</summary>

Du kan også bare skrive `npm init -y` for at acceptere alle standardværdier.
Husk bagefter at ændre "main" til "server.js" i package.json.

</details>

**✅ package.json oprettet?** → Fortsæt til **Opgave 3**

---

## 3. Konfigurer package.json og scripts

Opsæt ES modules og npm scripts til udvikling:

1. Åbn `package.json` i VS Code
2. Find linjen med `"main": "server.js",`
3. Tilføj en ny linje efter denne: `"type": "module",`
4. Find sektionen `"scripts"` og erstat med:

   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "node --watch server.js"
   },
   ```

5. Gem filen (Ctrl+S eller Cmd+S)

**Hvad gør dette?**

- ES modules: Moderne import/export syntax (`import` i stedet for `require`)
- `npm start`: Starter serveren én gang
- `npm run dev`: Starter serveren og genstarter automatisk ved ændringer

<details>
<summary>Hint - JSON format fejl</summary>

Hvis VS Code viser røde streger, tjek:

- Er der komma efter hver linje (undtagen den sidste)?
- Er alle strenge omgivet af anførselstegn?
- Er der matchende krøllede parenteser?
</details>

<details>
<summary>Hint - Jeg er ikke sikker på syntaksen</summary>

Du kan bruge JSON-validatorer online til at tjekke om din JSON er korrekt.
Eller se VS Code's error-meddelelser i Problems-panelet.

</details>

**✅ ES modules konfigureret?** → Fortsæt til **Opgave 4**

---

## 4. Opret data-mappe og besked-fil

1. Højreklik i VS Code's file explorer → "New Folder" → kald den `data`
2. Højreklik på `data` mappen → "New File" → kald den `messages.json`
3. Åbn `messages.json` og indsæt dette eksempel-data:

```json
[
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
  },
  {
    "id": "aabbccdd-1234-5678-9101-112131415161",
    "date": "2025-09-03T09:17:00.000Z",
    "text": "Kan du vise mig dagens vejr?",
    "sender": "user"
  },
  {
    "id": "bbccddee-2233-4455-6677-889900001111",
    "date": "2025-09-03T09:17:05.000Z",
    "text": "Selvfølgelig! Her er vejrudsigten for i dag...",
    "sender": "chatbot"
  },
  {
    "id": "ccddeeff-3344-5566-7788-990011112222",
    "date": "2025-09-03T09:18:00.000Z",
    "text": "Tak for hjælpen!",
    "sender": "user"
  },
  {
    "id": "ddeeff00-4455-6677-8899-001122334455",
    "date": "2025-09-03T09:18:10.000Z",
    "text": "Det var så lidt. Spørg endelig igen!",
    "sender": "chatbot"
  }
]
```

**Hvad betyder dette format?**

- `[]` = en array (liste) med objekter
- Hver besked er et objekt `{}` med egenskaber
- Objekterne er adskilt med kommaer
- Dette format gør det nemt for vores API at læse og skrive beskeder

**Din projektstruktur skal nu se sådan ud:**

```
dit-projekt-navn/
├── data/
│   └── messages.json
├── node_modules/
├── package.json
└── package-lock.json
```

<details>
<summary>Hint - Jeg kan ikke se hvordan man laver mapper</summary>

Højreklik præcis i det hvide område i VS Code's file explorer.
Hvis det ikke virker, prøv at klikke på projektmappens navn først.

</details>

<details>
<summary>Hint - Hvad er JSON?</summary>

JSON = JavaScript Object Notation. Det er en måde at gemme data som tekst.
Det ligner JavaScript objekter, men alt skal være i anførselstegn.

</details>

**✅ Data-mappe og messages.json oprettet?** → Fortsæt til **Opgave 5**

---

## 5. Opret og start din server

### Step 1: Installer Express

1. I terminalen: `npm install express`

### Step 2: Opret server.js

1. Højreklik i projektmappen → "New File" → `server.js`
2. Skriv denne kode:

```js
import express from "express";

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
```

**Test at det virker:**

1. Gem filen (Ctrl+S eller Cmd+S)
2. Åbn terminalen og skriv: `node server.js`
3. Du skal se: "App listening on port 3000"

Hvis det virker - godt! Du har nu en kørende server. ✅

---

### Step 3: Tilføj en simpel route

**Hvorfor gør vi dette?**
Nu kan serveren køre, men den svarer ikke på requests. Lad os tilføje en grundlæggende route.

**Tilføj denne linje lige FØR `app.listen`:**

```js
app.get("/", (req, res) => {
  res.send("Node.js Messages REST API 🎉");
});
```

**Sådan ser din server.js ud nu:**

```js
import express from "express";

const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("Node.js Messages REST API 🎉");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
```

**Test igen:**

1. Stop serveren (Ctrl+C)
2. Start den igen: `node server.js`
3. Åbn browser: http://localhost:3000
4. Du skal se: "Node.js Messages REST API 🎉"

Fungerer det? Perfekt! Nu svarer din server på requests. ✅

---

### 💡 Pro tip: Skift til `npm run dev` nu!

**Irriteret over at stoppe og starte serveren hele tiden?** 😅

Husk de scripts vi lavede i opgave 3? Nu kan du bruge dem!

**I stedet for `node server.js`, prøv:**

```bash
npm run dev
```

**Hvad sker der?**

- Serveren starter med `--watch` flag
- Den overvåger alle `.js` filer
- Genstarter automatisk når du gemmer ændringer
- Du sparer tid! ⚡

**Test det lige nu:**

1. Stop din server (Ctrl+C)
2. Start med: `npm run dev`
3. Ændr teksten til: `"Node.js Messages REST API 🚀 UPDATED!"`
4. Gem filen - se serveren genstartes automatisk!
5. Genindlæs browseren - ændringen er der allerede!

**Fra nu af bruger vi altid `npm run dev` under udvikling! 🎯**

---

### Step 4: Tilføj JSON support

**Hvorfor skal vi have dette?**
Vores API skal kunne modtage og sende JSON data (som vores beskeder). Express forstår ikke JSON automatisk.

**Tilføj denne linje lige EFTER `const PORT = 3000;`:**

```js
app.use(express.json());
```

**Hvad gør `express.json()`?**

- Fortæller Express at den skal kunne læse JSON fra requests
- Konverterer automatisk JSON til JavaScript objekter
- Gør det muligt at bruge `req.body` i vores routes

**Din server.js ser nu sådan ud:**

```js
import express from "express";

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node.js Messages REST API 🎉");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
```

**Test igen:**

1. Stop og genstart serveren
2. Tjek at http://localhost:3000 stadig virker

---

### Step 5: Installer og tilføj CORS support

**Først skal vi installere CORS:**

1. Stop serveren (Ctrl+C)
2. Skriv `npm install cors` og tryk Enter
3. Vent på installationen er færdig

**Hvad er CORS og hvorfor skal vi bruge det?**

- CORS = Cross-Origin Resource Sharing
- Browsere blokerer som standard requests mellem forskellige domæner
- Vi skal tillade andre websites/apps at bruge vores API

**Tilføj CORS import øverst:**

```js
import cors from "cors";
```

**Tilføj CORS middleware efter `express.json()`:**

```js
app.use(cors());
```

**Din komplette server.js ser nu sådan ud:**

```js
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Node.js Messages REST API 🎉");
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
```

**Final test:**

1. Stop og genstart serveren
2. Tjek at http://localhost:3000 stadig virker
3. Du har nu en fungerende Express-server med JSON og CORS support! 🎉

**Stop serveren:**
Tryk Ctrl+C i terminalen når du er færdig.

**✅ Server kører på localhost:3000?** → Fortsæt til **Opgave 6**

---

## 6. Læs og skriv data fra fil

### Step 1: Tilføj imports

Vi skal kunne arbejde med filer og generere IDs. Hvilke imports skal vi tilføje øverst i `server.js`?

<details>
<summary>💡 Hint - Hvilke imports?</summary>

```js
import fs from "fs/promises";
import { randomUUID } from "crypto";
```

</details>

### Step 2: Test fil-læsning

Lav en test-route der kan læse din `messages.json` fil:

1. **Opgave:** Lav en GET route til `/test-read`
2. **Den skal:** Læse filen `data/messages.json` som tekst
3. **Den skal:** Konvertere teksten til JavaScript objekter
4. **Den skal:** Sende objekterne som JSON tilbage

**Prøv selv først!** Hvad tror du koden skal være?

<details>
<summary>💡 Hint - test-read route</summary>

```js
app.get("/test-read", async (req, res) => {
  const data = await fs.readFile("data/messages.json", "utf8");
  const messages = JSON.parse(data);
  res.json(messages);
});
```

</details>

**Test:** http://localhost:3000/test-read

### Step 3: Test fil-skrivning

Lav en test-route der kan tilføje en ny besked:

1. **Opgave:** Lav en GET route til `/test-write`
2. **Den skal:** Læse eksisterende beskeder
3. **Den skal:** Lave et nyt besked-objekt med ID, dato, tekst og sender
4. **Den skal:** Tilføje den nye besked til listen
5. **Den skal:** Skrive den opdaterede liste tilbage til filen

**Prøv at bygge det step for step!**

**Hint 1:** Hvordan laver du et unikt ID? `randomUUID()`
**Hint 2:** Hvordan laver du en dato? `new Date().toISOString()`
**Hint 3:** Hvordan tilføjer du til en array? `.push()`

<details>
<summary>💡 Hint - test-write route</summary>

```js
app.get("/test-write", async (req, res) => {
  // Læs eksisterende beskeder
  const data = await fs.readFile("data/messages.json", "utf8");
  const messages = JSON.parse(data);

  // Lav ny besked
  const newMessage = {
    id: randomUUID(),
    date: new Date().toISOString(),
    text: "Test besked fra serveren!",
    sender: "server"
  };

  // Tilføj til listen
  messages.push(newMessage);

  // Skriv tilbage til fil
  await fs.writeFile("data/messages.json", JSON.stringify(messages, null, 2));

  res.json(newMessage);
});
```

</details>

**Test:** http://localhost:3000/test-write

### Step 4: Lav helper-funktioner

Kan du se at vi gentager kode? Lav to hjælpefunktioner:

1. **readMessages()** - skal læse og parse JSON
2. **writeMessages(messages)** - skal skrive array til fil

**Prøv selv først!**

<details>
<summary>💡 Hint - Helper funktioner</summary>

```js
// Tilføj efter imports
async function readMessages() {
  const data = await fs.readFile("data/messages.json", "utf8");
  return JSON.parse(data);
}

async function writeMessages(messages) {
  await fs.writeFile("data/messages.json", JSON.stringify(messages, null, 2));
}
```

Nu kan test-routes blive kortere:

```js
app.get("/test-read", async (req, res) => {
  const messages = await readMessages();
  res.json(messages);
});
```

</details>

```js
app.get("/test-read", async (req, res) => {
  const messages = await readMessages();
  res.json(messages);
});
```

### Step 3: Lav en test-route til at skrive beskeder

**Hvad gør vi?**
Vi laver en route der kan tilføje en ny besked for at teste skrive-funktionaliteten.

```js
app.post("/test-write", async (req, res) => {
  // Læs eksisterende beskeder
  const data = await fs.readFile("data/messages.json", "utf8");
  const messages = JSON.parse(data);

  // Lav en test-besked
  const newMessage = {
    id: randomUUID(),
    date: new Date().toISOString(),
    text: "Test besked fra serveren!",
    sender: "server"
  };

  // Tilføj til listen
  messages.push(newMessage);

  // Skriv tilbage til fil
  await fs.writeFile("data/messages.json", JSON.stringify(messages, null, 2));

  res.json({ success: true, message: newMessage });
});
```

**Hvad sker der her?**

- `randomUUID()` genererer et unikt ID
- `new Date().toISOString()` laver et tidsstempel
- `JSON.stringify(..., null, 2)` konverterer til pænt formateret JSON
- `fs.writeFile()` skriver til filen

**Test det:**

1. Åbn browser: http://localhost:3000/test-write
2. Tjek din `messages.json` fil - der skulle være en ny besked!
3. Test http://localhost:3000/test-read igen - du skal se den nye besked

**Virker det?** Fantastisk! Nu kan du læse og skrive til filer. ✅---

### Step 4: Lav helper funktioner (valgfrit men smart)

**Hvorfor helper funktioner?**
Vi kommer til at læse og skrive beskeder mange gange. Lad os lave genbrugelige funktioner.

**Tilføj disse funktioner efter dine imports:**

```js
// Helper funktioner
async function readMessages() {
  const data = await fs.readFile("data/messages.json", "utf8");
  return JSON.parse(data);
}

async function writeMessages(messages) {
  await fs.writeFile("data/messages.json", JSON.stringify(messages, null, 2));
}
```

**Nu kan dine test-routes blive kortere:**

```js
app.get("/test-read", async (req, res) => {
  const messages = await readMessages();
  res.json(messages);
});
```

**Fordele ved helper funktioner:**

- Mindre gentagelse af kode
- Nemmere at vedligeholde
- Bedre læsbarhed

**✅ Kan læse og skrive til messages.json?** → Fortsæt til **Opgave 7**

---

## 7. Opret REST routes

Nu skal vi lave de rigtige API endpoints! Fjern test-routes og lav CRUD operations.

### 7.1 GET alle beskeder

**Opgave:** Lav en route der returnerer alle beskeder når man besøger `/messages`

**Hvad skal den gøre?**

1. Bruge GET method
2. Læse alle beskeder med helper-funktionen
3. Returnere dem som JSON

**Prøv selv først!**

<details>
<summary>💡 Hint - GET alle beskeder</summary>

```js
app.get("/messages", async (req, res) => {
  const messages = await readMessages();
  res.json(messages);
});
```

</details>

**Test:** http://localhost:3000/messages

### 7.2 GET én besked

**Opgave:** Lav en route der returnerer én specifik besked baseret på ID

**Hvad skal den gøre?**

1. Bruge GET method med parameter: `/messages/:id`
2. Læse alle beskeder
3. Finde den besked der matcher ID'et (brug `.find()`)
4. Returnere kun den besked

**Tips:** `req.params.id` giver dig ID fra URL'en

<details>
<summary>💡 Hint - GET én besked</summary>

```js
app.get("/messages/:id", async (req, res) => {
  const messages = await readMessages();
  const messageId = req.params.id;
  const message = messages.find(m => m.id === messageId);
  res.json(message);
});
```

</details>

**Test:** Kopier et ID fra alle beskeder og besøg http://localhost:3000/messages/[id]

### 7.3 POST ny besked

**Opgave:** Lav en route der kan oprette nye beskeder

**Hvad skal den gøre?**

1. Bruge POST method til `/messages`
2. Læse eksisterende beskeder
3. Hente `text` og `sender` fra request body (`req.body`)
4. Lave et nyt besked-objekt med auto-genereret ID og dato
5. Tilføje den nye besked til listen
6. Gemme listen og returnere den nye besked

**Prøv selv først!** Tænk på hvad du har lært fra test-write route.

<details>
<summary>💡 Hint - POST ny besked</summary>

```js
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
  await writeMessages(messages);
  res.json(newMessage);
});
```

</details>

**Test med Thunder Client:**

- Method: POST
- URL: http://localhost:3000/messages
- Body: `{ "text": "Min første API besked!", "sender": "user" }`

### 7.4 PUT opdater besked

**Opgave:** Lav en route der kan opdatere en eksisterende besked

**Hvad skal den gøre?**

1. Bruge PUT method til `/messages/:id`
2. Læse alle beskeder
3. Finde den rigtige besked med `find()` (ikke findIndex!)
4. Opdatere besked-objektets egenskaber direkte
5. Gemme og returnere den opdaterede besked

**Tænk over det:**

- Skal du finde besked-positionen eller selve besked-objektet?
- Kan du ændre egenskaber direkte på objektet?

**Tips:**

- `find()` returnerer selve objektet
- Du kan sætte `message.text = newText` direkte
- Objekter i JavaScript er references - ændringer påvirker originalen

<details>
<summary>💡 Hint - PUT opdater besked</summary>

```js
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
```

</details>

**Test med Thunder Client:**

- Method: PUT
- URL: http://localhost:3000/messages/[id]
- Body: `{ "text": "Opdateret!", "sender": "updated-user" }`

### 7.5 DELETE slet besked

**Opgave:** Lav en route der kan slette en besked

**Hvad skal den gøre?**

1. Bruge DELETE method til `/messages/:id`
2. Læse alle beskeder
3. Finde besked-positionen
4. Gemme beskeden før sletning (til response)
5. Fjerne beskeden fra array med `splice()`
6. Gemme opdateret liste
7. Returnere bekræftelse + den slettede besked

**Tips:** `splice(index, 1)` fjerner 1 element på position `index`

<details>
<summary>💡 Hint - DELETE slet besked</summary>

```js
app.delete("/messages/:id", async (req, res) => {
  const messages = await readMessages();
  const messageId = req.params.id;

  const messageIndex = messages.findIndex(m => m.id === messageId);
  const deletedMessage = messages[messageIndex];

  messages.splice(messageIndex, 1);
  await writeMessages(messages);

  res.json({
    message: "Message deleted successfully",
    deletedMessage
  });
});
```

</details>

**Test med Thunder Client:**

- Method: DELETE
- URL: http://localhost:3000/messages/[id]

**✅ Alle CRUD routes implementeret?** → Fortsæt til **Opgave 8**

---

## 8. Test dit API komplet

**Systematisk test af alle endpoints:**

**Step 1: Test READ-operationer (GET)**

1. **Hent alle beskeder:**

   - GET http://localhost:3000/messages
   - Forventet: Array med alle beskeder

2. **Hent én besked:**

   - Kopier et ID fra ovenstående
   - GET http://localhost:3000/messages/[id]
   - Forventet: Kun den ene besked

3. (Valgfrit) Prøv et forkert ID og se hvad du får tilbage.

**Step 2: Test CREATE-operation (POST)**

1. **Opret ny besked:**

   - POST http://localhost:3000/messages
   - Body: `{"text": "Test besked", "sender": "tester"}`
   - Forventet: Status 201 + ny besked med auto-genereret ID

2. Prøv at sende kun `{ "text": "Test" }` og se hvad der sker. Send derefter en komplet besked.

**Step 3: Test UPDATE-operation (PUT)**

1. **Opdater eksisterende besked:**

   - PUT http://localhost:3000/messages/[eksisterende-id]
   - Body: `{"text": "Opdateret!", "sender": "opdateret"}`
   - Forventet: Opdateret besked

2. (Valgfrit) Prøv et forkert ID eller uden text og se hvad der sker.

**Step 4: Test DELETE-operation (DELETE)**

1. **Slet besked:**

   - DELETE http://localhost:3000/messages/[id]
   - Forventet: Bekræftelse + slettet besked

2. **Verificer sletning:**
   - GET http://localhost:3000/messages
   - Beskeden skal være væk

**Hurtig test med curl (valgfrit):**

Hvis du vil teste fra terminal:

```bash
# Hent alle beskeder
curl http://localhost:3000/messages

# Opret ny besked
curl -X POST http://localhost:3000/messages \
  -H "Content-Type: application/json" \
  -d '{"text": "Curl test", "sender": "terminal"}'
```

**✅ Alle tests gennemført?** → Fortsæt til **Opgave 9**

---

## 9. Refleksion og næste skridt

**Opgave:**
Overvej hvordan du kan forbedre og udvide dit API.

- Kan du genbruge kode med funktioner?
- Kan du tilføje sortering eller filtrering?
- Hvordan kan du udvide med fejlhåndtering?

<details>
<summary>Hint</summary>
Prøv fx at lave en helper-funktion til at læse og skrive data.
</details>

---

## REST API – Teoretisk opsummering

**Opgave:**
Forklar med egne ord:

- Hvad er et REST API?
- Hvad er forskellen på GET, POST, PUT og DELETE?
- Hvorfor bruger vi JSON?

<details>
<summary>Hint</summary>
Et REST API bruger HTTP-metoder til at manipulere ressourcer, som identificeres med URL’er. Data sendes som JSON, som er et tekstbaseret dataformat.
</details>

---

💡 Prøv selv først – og brug hints, hvis du sidder fast!
Stil spørgsmål og reflekter over hvert trin.

---

Sig til hvis du vil have flere opgaver, billeder eller forklaringer til hvert trin!

```

```
