# Step-by-step: Fejlhåndtering & Statuskoder i REST API

Denne guide hjælper dig med at udbygge dit Node.js/Express API med korrekt fejlhåndtering og brug af HTTP statuskoder. Hvert trin bygger ovenpå din eksisterende kode og forklarer, hvorfor og hvordan du skal håndtere fejl og statuskoder pædagogisk.

---

## Kort overblik: HTTP statuskoder

| Kode | Navn                  | Hvornår bruges den?               |
| ---- | --------------------- | --------------------------------- |
| 200  | OK                    | Alt gik godt (GET/PUT/DELETE)     |
| 201  | Created               | Noget blev oprettet (POST)        |
| 400  | Bad Request           | Klienten sendte ugyldige data     |
| 404  | Not Found             | Ressource blev ikke fundet        |
| 500  | Internal Server Error | Serveren fejlede (uforudset fejl) |

---

---

## 1. Hvorfor fejlhåndtering og statuskoder?

- Hvorfor er det vigtigt at returnere de rigtige statuskoder?
- Hvad sker der hvis du ikke håndterer fejl korrekt?

<details>
<summary>💡 Hint</summary>
Statuskoder gør det nemt for klienten at forstå om en request lykkedes eller fejlede. Fejlhåndtering sikrer at serveren ikke crasher og at brugeren får brugbare fejlbeskeder.
</details>

**Eksempel på dårlig fejlhåndtering:**

```js
app.get("/messages", async (req, res) => {
  let messages = await readMessages();
  res.json(messages);
});
```

Hvis der sker en fejl i `readMessages()`, crasher serveren eller sender en uklar HTML-fejl. Prøv evt. at lave en fejl og se hvad der sker!

---

## 2. Brug af try/catch i routes

### Step 1: Forstå try/catch og brug det i dine routes

**Forklaring:**
`try/catch` bruges til at fange fejl i din kode, så serveren ikke crasher. Alt kode i `try { ... }` forsøges kørt. Hvis der opstår en fejl, hopper koden direkte til `catch (error) { ... }`.

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

**TODO:**

1. Omskriv én af dine async routes (fx GET /messages) med try/catch som ovenfor.
2. Test: Lav en fejl (fx forkert filnavn i readFile) og lav et request – får du nu status 500 og en JSON-fejl?
3. Gentag for de andre async routes én ad gangen. Test efter hver ændring.
4. **Test også happy path:** Lav et request hvor alt går godt – får du status 200 og de rigtige data?

**Eksempel på fejlbesked:**

```json
{
  "error": "Besked ikke fundet."
}
```

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

**Ekstraopgave:**

Sørg for at alle fejlbeskeder i dit API altid har samme JSON-format, fx:

```json
{
  "error": "Besked ikke fundet."
}
```

Det gør det nemt for frontend at vise fejl på en ensartet måde.

---

## 5. Test din fejlhåndtering

**TODO:**

1. Prøv at lave en POST eller PUT request uden text/sender – får du status 400 og en JSON-fejl?
2. Prøv at hente eller slette en besked med et forkert id – får du status 404 og en JSON-fejl?
3. Prøv at slette eller ødelægge din messages.json fil – får du status 500 og en JSON-fejl?
4. Prøv at lave en request der får serveren til at fejle (fx forkert filnavn i readFile) – får du status 500 og en JSON-fejl?
5. **Test også happy path:** Lav requests hvor alt går godt – får du status 200/201 og de forventede data?

Du skal se relevante statuskoder og fejlbeskeder i JSON – ikke at serveren crasher eller returnerer HTML-fejl.

---

## 6. Ekstra: Gør din kode endnu mere robust

**Ekstraopgaver: Forbedr fejlhåndteringen i dine routes**

- Giv mere brugervenlige og detaljerede fejlbeskeder (fx "Både 'text' og 'sender' skal udfyldes.")
- Udvid valideringen: Tjek at text/sender er strings og ikke for lange
- Log fejl til konsol i catch-blokke (fx `console.error(error)`)

<details>
<summary>💡 Hint</summary>
Prøv at gøre fejlbeskederne så brugbare som muligt for frontend-brugeren. Du kan fx skrive:

```js
if (!text || !sender) {
  return res.status(400).json({ error: "Både 'text' og 'sender' skal udfyldes." });
}
if (typeof text !== "string" || typeof sender !== "string") {
  return res.status(400).json({ error: "Text og sender skal være tekst." });
}
if (text.length > 500) {
  return res.status(400).json({ error: "Beskeden må maks. være 500 tegn." });
}
```

Og i catch:

```js
catch (error) {
  console.error(error);
  res.status(500).json({ error: "Serverfejl" });
}
```

</details>

---

**Refleksion:**

- Hvorfor er god fejlhåndtering vigtig for både udviklere og brugere?
- Hvordan kan du gøre fejlbeskeder mere brugbare for frontend?
- Hvordan undgår du at afsløre følsomme oplysninger i fejlbeskeder til brugeren?

---

💡 Prøv selv først – og brug hints, hvis du sidder fast!
Stil spørgsmål og reflekter over hvert trin.
