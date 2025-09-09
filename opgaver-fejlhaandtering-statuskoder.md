# Step-by-step: Fejlhåndtering & Statuskoder i REST API

Denne guide hjælper dig med at udbygge dit Node.js/Express API med korrekt fejlhåndtering og brug af HTTP statuskoder. Hvert trin bygger ovenpå din eksisterende kode og forklarer, hvorfor og hvordan du skal håndtere fejl og statuskoder pædagogisk.

---

## 1. Hvorfor fejlhåndtering og statuskoder?

- Hvorfor er det vigtigt at returnere de rigtige statuskoder?
- Hvad sker der hvis du ikke håndterer fejl korrekt?

<details>
<summary>💡 Hint</summary>
Statuskoder gør det nemt for klienten at forstå om en request lykkedes eller fejlede. Fejlhåndtering sikrer at serveren ikke crasher og at brugeren får brugbare fejlbeskeder.
</details>

---

## 2. Brug af try/catch i routes

### Step 1: Tilføj try/catch til dine async routes

**TODO:**

1. Gå til din `server.js` og find alle dine async routes (fx GET, POST, PUT, DELETE på /messages).
2. Sæt hele route-funktionen ind i en `try { ... } catch (error) { ... }` blok.
3. I catch-blokken: returnér en fejl med status 500 og en JSON-besked.

Eksempel:

```js
app.get("/messages", async (req, res) => {
  try {
    // ...din kode...
  } catch (error) {
    res.status(500).json({ error: "Noget gik galt" });
  }
});
```

**Test:** Prøv at lave en fejl (fx stav filnavnet forkert i readFile) og se at du får en JSON-fejl og status 500.

---

### Step 2: Returnér JSON-fejlbeskeder

**TODO:**

1. Tjek at ALLE steder hvor du returnerer fejl, bruger du `res.status(...).json({ error: ... })`.
2. Prøv at lave en POST eller GET med forkert data og se at du får en JSON-fejl.

Eksempel på fejlbesked:

### Step 1: Hvad er try/catch – og hvorfor skal det bruges?

**Forklaring:**
`try/catch` bruges til at fange fejl i din kode, så serveren ikke crasher. Alt kode i `try { ... }` forsøges kørt. Hvis der opstår en fejl, hopper koden direkte til `catch (error) { ... }`.

**Eksempel uden try/catch:**

```js
app.get("/messages", async (req, res) => {
  let messages = await readMessages();
  res.json(messages);
});
```

Hvis der sker en fejl i `readMessages()`, crasher serveren eller sender en uklar fejl.

**Eksempel med try/catch:**

```js
app.get("/messages", async (req, res) => {
  try {
    let messages = await readMessages();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Noget gik galt" });
  }
});
```

Nu får klienten altid en pæn fejlbesked i JSON og status 500.

### Step 2: Sådan tilføjer du try/catch til dine routes

**TODO:**

1. Find alle dine async routes i `server.js` (de der bruger `async` og `await`).
2. Omslut hele koden i route-funktionen med `try { ... } catch (error) { ... }`.
3. I catch-blokken: returnér status 500 og en JSON-fejlbesked.

**Eksempel på omskrivning:**

Før:

```js
app.post("/messages", async (req, res) => {
  const messages = await readMessages();
  // ...
});
```

Efter:

```js
app.post("/messages", async (req, res) => {
  try {
    const messages = await readMessages();
    // ...
  } catch (error) {
    res.status(500).json({ error: "Noget gik galt" });
  }
});
```

**Test:**

1. Prøv at lave en fejl (fx stav filnavnet forkert i readFile).
2. Lav et request – du skal nu få status 500 og en JSON-fejlbesked, ikke at serveren crasher.

---

2. Kig på din kode og find eksempler på hvor du kan bruge hver kode.

### Step 2: Implementér statuskoder i din kode

**TODO:**

1. Gennemgå alle dine routes og tilføj statuskoder de rigtige steder:

- 201 ved oprettelse (POST)
- 400 hvis data mangler (POST/PUT)
- 404 hvis id ikke findes (GET/PUT/DELETE)
- 500 i catch-blokke

2. Brug `res.status(...).json(...)` hver gang.

Eksempel:

```js
if (!message) {
  return res.status(404).json({ error: "Besked ikke fundet." });
}
```

---

## 4. Ekstra validering og brugervenlige fejl

### Step 1: Valider input i POST og PUT

**TODO:**

1. I dine POST og PUT routes: Tjek at både `text` og `sender` findes og ikke er tomme.
2. Hvis noget mangler, returnér status 400 og en forklarende fejlbesked i JSON.
3. Prøv at sende requests uden text/sender og se at du får en fejl.

Eksempel:

```js
if (!text || !sender) {
  return res.status(400).json({ error: "Både 'text' og 'sender' skal udfyldes." });
}
```

### Step 2: Returnér altid JSON – også ved fejl

- Hvorfor er det vigtigt at fejl også er i JSON?
<details>
<summary>💡 Hint</summary>
Klienter forventer at alle svar fra et API er i samme format. Det gør det nemmere at håndtere fejl på frontend.
</details>

---

## 5. Test din fejlhåndtering

**TODO:**

1. Prøv at lave en POST eller PUT request uden text/sender – får du status 400 og en JSON-fejl?
2. Prøv at hente eller slette en besked med et forkert id – får du status 404 og en JSON-fejl?
3. Prøv at slette eller ødelægge din messages.json fil – får du status 500 og en JSON-fejl?
4. Prøv at lave en request der får serveren til at fejle (fx forkert filnavn i readFile) – får du status 500 og en JSON-fejl?

Du skal se relevante statuskoder og fejlbeskeder i JSON – ikke at serveren crasher eller returnerer HTML-fejl.

---

## 6. Ekstra: Gør din kode endnu mere robust

- Overvej at samle fejl-håndtering i en middleware
- Tilføj konstanter for statuskoder
- Giv mere detaljerede fejlbeskeder (fx fejl-koder)
- Log fejl til konsol eller fil

<details>
<summary>💡 Hint</summary>
Se hvordan professionelle API'er ofte har en central error handler og bruger konstanter til statuskoder.
</details>

---

**Refleksion:**

- Hvorfor er god fejlhåndtering vigtig for både udviklere og brugere?
- Hvordan kan du gøre fejlbeskeder mere brugbare for frontend?

---

💡 Prøv selv først – og brug hints, hvis du sidder fast!
Stil spørgsmål og reflekter over hvert trin.
