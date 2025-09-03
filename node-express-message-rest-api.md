# Node.js REST API med Express – Opgaveguide

Rasmus Cederdorff (RACE)  
Senior Lecturer & Web App Developer  
race@eaaa.dk

---

## 0. Forudsætninger

**Opgave:**  
Sørg for at du har Node.js og VS Code installeret på din computer.

**Hvad skal du have installeret?**

- **Node.js** - JavaScript runtime til at køre kode uden for browseren
- **VS Code** - Kode-editor med gode værktøjer til webudvikling

**Test at alt virker:**

- Åbn terminalen og skriv `node --version` - du skal se et versionsnummer
- Åbn VS Code og tjek at det starter

<details>
<summary>Hint - Hvor downloader jeg Node.js?</summary>

Gå til https://nodejs.org og download den LTS-version (anbefalet version).
Efter installation, genstart din computer hvis nødvendigt.

</details>

---

## 1. Opret projektet

**Opgave:**  
Opret en ny mappe til dit projekt og åbn den i VS Code.

**Step-by-step:**

1. Opret en ny mappe på dit skrivebord eller i din Documents-mappe
2. Giv mappen et sigende navn, fx `node-express-message-rest-api`
3. Højreklik på mappen og vælg "Open with Code" (eller åbn VS Code og træk mappen ind)
4. Du skal nu se din tomme mappe i VS Code's file explorer

**Hvorfor gør vi dette?**

- Hver projektmappe skal være isoleret fra andre projekter
- VS Code fungerer bedst, når du åbner hele projektmappen

<details>
<summary>Hint - Jeg kan ikke se "Open with Code"</summary>

Åbn VS Code først, gå til File → Open Folder og vælg din projektmappe.

</details>

---

## 2. Initialiser Node.js-projektet

**Opgave:**  
Initialiser projektet med npm og opret en `package.json`.

**Hvad er npm og package.json?**

- **npm** = Node Package Manager - bruges til at installere biblioteker
- **package.json** = Projektets "ID-kort" med information om navn, version og dependencies

**Step-by-step:**

1. Åbn terminalen i VS Code (Terminal → New Terminal)
2. Skriv `npm init` og tryk Enter
3. Besvar spørgsmålene:
   - **package name**: Tryk Enter (bruger mappenavn)
   - **version**: Tryk Enter (bruger 1.0.0)
   - **description**: Skriv fx "REST API for messages" og tryk Enter
   - **entry point**: Skriv `server.js` og tryk Enter (VIGTIGT!)
   - **test command**: Tryk Enter
   - **git repository**: Tryk Enter
   - **keywords**: Tryk Enter
   - **author**: Skriv dit navn og tryk Enter
   - **license**: Tryk Enter
4. Skriv `yes` når du får vist oversigten

**Hvad sker der?**
Du får nu en `package.json` fil i din mappe med projektinformation.

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

---

## 3. Konfigurer package.json og scripts

**Opgave:**  
Opsæt ES modules og nyttige npm scripts til udvikling.

**Hvad er forskellen?**

- **Gammel måde**: `const express = require('express')`
- **Ny måde**: `import express from 'express'`

**Hvorfor bruge ES modules?**

- Det er den moderne standard
- Samme syntax som i moderne frontend JavaScript
- Bedre understøttelse af værktøjer

**Step-by-step:**

1. Åbn filen `package.json` i VS Code
2. Find linjen med `"main": "server.js",`
3. Tilføj en ny linje efter denne: `"type": "module",`
4. Find sektionen `"scripts"` og erstat den med disse to nyttige scripts:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "node --watch server.js"
   },
   ```
5. Gem filen (Ctrl+S eller Cmd+S)

**Hvad gør disse scripts?**

- **`npm start`** = starter serveren én gang
- **`npm run dev`** = starter serveren og genstarter automatisk ved ændringer
- `--watch` flag'et overvåger filer og genstarter serveren når du gemmer ændringer

**Sådan skal din package.json se ud:**

```json
{
  "name": "node-express-message-rest-api",
  "version": "1.0.0",
  "description": "REST API for messages",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

**Vigtigt:**
Husk kommaer efter hver linje (undtagen den sidste i hver sektion)!

**Bonus tip:**
Fra nu af kan du bruge `npm run dev` i stedet for `node server.js` - så genstarter serveren automatisk når du laver ændringer!

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

---

## 4. Opret data-mappe og besked-fil

**Opgave:**  
Opret en mappe til data og en tom JSON-fil til beskeder.

**Hvorfor gør vi dette?**

- Vi skal gemme vores beskeder et sted
- JSON-filer er nemme at læse og skrive til
- Data-mappen holder vores projektstruktur organiseret

**Step-by-step:**

1. Højreklik i VS Code's file explorer (i din projektmappe)
2. Vælg "New Folder"
3. Kald mappen `data`
4. Højreklik på den nye `data` mappe
5. Vælg "New File"
6. Åbn filen og tilføj nogle eksempel-beskeder (se nedenfor)
7. Gem filen (Ctrl+S eller Cmd+S)

**Format for beskeder:**

Hver besked skal have følgende struktur:

- `id`: Et unikt ID (kan være et tilfældigt UUID)
- `date`: Tidsstempel i ISO format
- `text`: Selve besked-teksten
- `sender`: Hvem der sendte beskeden (f.eks. "user" eller "chatbot")

**Opret nogle eksempel-beskeder:**

Kopier og indsæt følgende JSON i din `messages.json` fil:

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

---

## 5. Opret og start din server

**Opgave:**  
Installer Express og opret filen `server.js` step-by-step.

**Hvorfor starter vi minimalt?**

- Det er nemmere at forstå hver del separat
- Vi kan teste at hver del virker før vi går videre
- Hvis noget går galt, er det lettere at finde fejlen

---

### Step 1: Installer Express

**Hvad er Express?**
Express er et web framework til Node.js som gør det nemt at lave web servere og APIs.

**Installer Express nu:**

1. Sørg for terminalen er åben i VS Code
2. Skriv `npm install express` og tryk Enter
3. Vent på at installationen er færdig

**Hvad sker der?**

- npm downloader Express og gemmer det i `node_modules` mappen
- Der kommer en `package-lock.json` fil (normalt!)
- I din `package.json` vil Express nu stå under "dependencies"

---

### Step 2: Opret den allermindste server

**Hvad gør vi:**
Vi laver den simpleste Express-server der overhovedet kan køre.

1. Højreklik i projektmappen og vælg "New File"
2. Kald filen `server.js`
3. Skriv denne minimale kode:

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

---

### Næste skridt

I opgave 7 tilføjer vi imports til at arbejde med filer, så vi kan læse/skrive vores beskeder.

---

## 6. Læs og skriv data fra fil

**Opgave:**  
Tilføj funktionalitet til at læse og skrive til `messages.json` filen.

**Hvorfor skal vi have dette?**

Vores server kan nu køre og svare på requests, men vi har ikke forbindelse til vores data endnu. Vi skal kunne:

- Læse beskederne fra `messages.json`
- Skrive nye beskeder til filen
- Dette danner grundlaget for vores REST API

---

### Step 1: Tilføj file system imports

**Hvad skal vi bruge?**

- `fs/promises` - til at læse og skrive filer asynkront
- `randomUUID` - til at generere unikke IDs til nye beskeder

**Tilføj disse imports øverst i din `server.js`:**

```js
import fs from "fs/promises";
import { randomUUID } from "crypto";
```

**Sådan ser toppen af din server.js nu ud:**

```js
import express from "express";
import cors from "cors";
import fs from "fs/promises";
import { randomUUID } from "crypto";

const app = express();
// ... resten af din kode
```

---

### Step 2: Lav en test-route til at læse beskeder

**Hvad gør vi?**
Vi laver en simpel route for at teste at vi kan læse fra vores JSON-fil.

**Tilføj denne route lige FØR `app.listen`:**

```js
app.get("/test-read", async (req, res) => {
  const data = await fs.readFile("data/messages.json", "utf8");
  const messages = JSON.parse(data);
  res.json(messages);
});
```

**Hvad sker der her?**

- `fs.readFile()` læser filen som tekst
- `JSON.parse()` konverterer tekst til JavaScript objekter
- `res.json()` sender beskederne som JSON tilbage

**Test det:**

1. Start din server: `npm run dev`
2. Åbn browser: http://localhost:3000/test-read
3. Du skal se dine beskeder som JSON! 🎉

---

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
  try {
    const messages = await readMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Could not read messages" });
  }
});
```

**Fordele ved helper funktioner:**

- Mindre gentagelse af kode
- Nemmere at vedligeholde
- Bedre læsbarhed

---

### Næste skridt

Nu er vi klar til at lave rigtige REST API endpoints i opgave 7! 🚀

---

## 7. Opret REST routes

### 7.1 Opret GET-route for alle beskeder

**Opgave:**  
Lav en route der returnerer alle beskeder som JSON når du besøger `/messages`.

**Hvad er formålet?**

- Klienter skal kunne hente alle beskeder
- Dette er den mest basale operation i et REST API
- URL'en følger REST-konventioner: GET `/messages` = hent alle beskeder

**Step-by-step:**

1. Fjern dine test-routes (`/test-read` og `/test-write`) - vi laver de rigtige nu!

2. Tilføj denne route:

```js
app.get("/messages", async (req, res) => {
  const messages = await readMessages();
  res.json(messages);
});
```

**Hvad sker der?**

- `GET /messages` = REST-standard for "hent alle beskeder"
- `await readMessages()` bruger vores helper-funktion
- `res.json(messages)` sender beskederne som JSON

**Test det:**

1. Start serveren: `npm run dev`
2. Åbn browser: http://localhost:3000/messages
3. Du skal se alle dine beskeder som pænt formateret JSON! 🎉

**Forventet resultat:**

```json
[
  {
    "id": "e1a2c3d4-1111-2222-3333-444455556666",
    "date": "2025-09-03T09:15:00.000Z",
    "text": "Hej! Hvordan går det?",
    "sender": "user"
  }
  // ... flere beskeder
]
```

---

### 7.2 Opret GET-route for én besked

**Opgave:**  
Lav en route der returnerer én specifik besked baseret på ID.

**Hvad er formålet?**

- Klienter skal kunne hente én bestemt besked
- URL-parametere: `/messages/:id` hvor `:id` er et placeholder
- Eksempel: `/messages/e1a2c3d4-1111-2222-3333-444455556666`

**Step-by-step:**

**Tilføj denne route:**

```js
app.get("/messages/:id", async (req, res) => {
  const messages = await readMessages();
  const messageId = req.params.id;
  const message = messages.find(m => m.id === messageId);
  res.json(message);
});
```

**Hvad sker der?**

- `:id` i URL'en bliver tilgængelig som `req.params.id`
- `find()` søger efter besked med det rigtige ID
- `res.json(message)` sender den fundne besked

**Test det:**

1. Gå til http://localhost:3000/messages for at se alle beskeder
2. Kopier et ID fra en af beskederne
3. Besøg http://localhost:3000/messages/[det-kopierede-id]
4. Du skal se kun den ene besked!

**Eksempel:**

- URL: http://localhost:3000/messages/e1a2c3d4-1111-2222-3333-444455556666
- Resultat: Kun beskeden med det ID

---

### 7.3 Opret POST-route for ny besked

**Opgave:**  
Lav en route der kan modtage en ny besked og gemme den til filen.

**Hvad er formålet?**

- Klienter skal kunne oprette nye beskeder
- POST til `/messages` med besked-data i request body
- Serveren genererer automatisk ID og tidsstempel

**Step-by-step:**

**Tilføj denne route:**

```js
app.post("/messages", async (req, res) => {
  const messages = await readMessages();
  const { text, sender } = req.body;

  // Opret ny besked
  const newMessage = {
    id: randomUUID(),
    date: new Date().toISOString(),
    text,
    sender
  };

  // Tilføj til listen og gem
  messages.push(newMessage);
  await writeMessages(messages);

  res.json(newMessage);
});
```

**Hvad sker der?**

- `req.body` indeholder data fra klienten (takket være `express.json()`)
- `randomUUID()` genererer unikt ID
- `new Date().toISOString()` laver tidsstempel
- Tilføjer besked til array og gemmer til fil

**Test det (du skal bruge Thunder Client/Postman):**

Vi kan ikke teste POST i browseren - vi skal bruge et API-test tool.

**Med Thunder Client (VS Code):**

1. Installer Thunder Client extension i VS Code
2. Opret ny request:
   - Method: POST
   - URL: http://localhost:3000/messages
   - Body (JSON):
   ```json
   {
     "text": "Min første API besked!",
     "sender": "user"
   }
   ```
3. Send request
4. Du skal få den nye besked tilbage

**Verificer at det virker:**

- Besøg http://localhost:3000/messages i browseren
- Din nye besked skal være der!
- Tjek også din `messages.json` fil

---

### 7.4 Opret PUT-route for at opdatere besked

**Opgave:**  
Lav en route der kan opdatere en eksisterende besked baseret på ID.

**Hvad er formålet?**

- Klienter skal kunne redigere eksisterende beskeder
- PUT til `/messages/:id` med nye data i request body
- Finder besked ved ID og opdaterer kun de felter der sendes

**Step-by-step:**

**Tilføj denne route:**

```js
app.put("/messages/:id", async (req, res) => {
  const messages = await readMessages();
  const messageId = req.params.id;
  const { text, sender } = req.body;

  // Find beskeden
  const messageIndex = messages.findIndex(m => m.id === messageId);

  // Opdater beskeden (behold ID og date)
  messages[messageIndex] = {
    ...messages[messageIndex],
    text,
    sender
  };

  await writeMessages(messages);
  res.json(messages[messageIndex]);
});
```

**Hvad sker der?**

- `findIndex()` finder besked-position i array
- `...messages[messageIndex]` bevarer eksisterende felter (ID, date)
- Kun `text` og `sender` opdateres

**Test det med Thunder Client:**

1. **Først - find en besked at opdatere:**

   - GET http://localhost:3000/messages
   - Kopier et ID

2. **Opdater beskeden:**

   - Method: PUT
   - URL: http://localhost:3000/messages/[det-kopierede-id]
   - Body (JSON):

   ```json
   {
     "text": "Opdateret besked tekst!",
     "sender": "updated-user"
   }
   ```

3. **Verificer:**
   - Send request - du skal få den opdaterede besked tilbage
   - GET http://localhost:3000/messages - beskeden skal være ændret
   - Tjek `messages.json` filen

---

### 7.5 Opret DELETE-route for at slette besked

**Opgave:**  
Lav en route der kan slette en besked baseret på ID.

**Hvad er formålet?**

- Klienter skal kunne slette beskeder
- DELETE til `/messages/:id`
- Fjerner besked fra array og gemmer filen

**Step-by-step:**

**Tilføj denne route:**

```js
app.delete("/messages/:id", async (req, res) => {
  const messages = await readMessages();
  const messageId = req.params.id;

  // Find beskeden der skal slettes
  const messageIndex = messages.findIndex(m => m.id === messageId);

  // Gem beskeden før sletning (til response)
  const deletedMessage = messages[messageIndex];

  // Fjern fra array
  messages.splice(messageIndex, 1);

  await writeMessages(messages);
  res.json({
    message: "Message deleted successfully",
    deletedMessage
  });
});
```

**Hvad sker der?**

- `findIndex()` finder besked-position
- `splice(index, 1)` fjerner præcis 1 element på den position
- Returnerer den slettede besked som bekræftelse

**Test det med Thunder Client:**

1. **Find en besked at slette:**

   - GET http://localhost:3000/messages
   - Kopier et ID fra en besked du kan undvære

2. **Slet beskeden:**

   - Method: DELETE
   - URL: http://localhost:3000/messages/[det-kopierede-id]
   - Ingen body nødvendig

3. **Verificer:**
   - Du skal få bekræftelse og den slettede besked tilbage
   - GET http://localhost:3000/messages - beskeden skal være væk!
   - Tjek `messages.json` - beskeden skal være fjernet

---

## 8. Test dit API komplet

**Opgave:**  
Test alle dine endpoints systematisk for at sikre dit API virker korrekt.

**Hvorfor er systematisk testing vigtigt?**

- Sikrer at alle funktioner virker som forventet
- Opdager fejl før andre bruger dit API
- Giver dig erfaring med API-testing

---

### Test-plan: Alle CRUD-operationer

**Step 1: Test READ-operationer (GET)**

1. **Hent alle beskeder:**

   - GET http://localhost:3000/messages
   - Forventet: Array med alle beskeder

2. **Hent én besked:**

   - Kopier et ID fra ovenstående
   - GET http://localhost:3000/messages/[id]
   - Forventet: Kun den ene besked

3. **Test fejl-case:**
   - GET http://localhost:3000/messages/forkert-id
   - Forventet: 404 error

**Step 2: Test CREATE-operation (POST)**

1. **Opret ny besked:**

   - POST http://localhost:3000/messages
   - Body: `{"text": "Test besked", "sender": "tester"}`
   - Forventet: Status 201 + ny besked med auto-genereret ID

2. **Test validering:**
   - POST http://localhost:3000/messages
   - Body: `{"text": "Test"}` (mangler sender)
   - Forventet: 400 error

**Step 3: Test UPDATE-operation (PUT)**

1. **Opdater eksisterende besked:**

   - PUT http://localhost:3000/messages/[eksisterende-id]
   - Body: `{"text": "Opdateret!", "sender": "opdateret"}`
   - Forventet: Opdateret besked

2. **Test fejl-cases:**
   - PUT med forkert ID → 404 error
   - PUT uden text → 400 error

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
