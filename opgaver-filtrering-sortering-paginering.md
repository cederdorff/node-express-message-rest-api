# Step-by-step: Filtrering, Sortering & Paginering af beskeder

Denne guide hjælper dig med at bygge et REST endpoint, hvor du trin-for-trin tilføjer filtrering, sortering og paginering. Hvert trin skal implementeres og testes, før du går videre.

---

## 1. Filtrering af beskeder

**Mål:** Udvid din GET /messages-route, så du kan filtrere beskeder baseret på tekst (`text`) i beskeden (en `message`).

### Step 1: Forstå og brug `req.query`

- Tilføj `console.log(req.query)` i din route.
- Besøg fx `/messages?search=hej` og se hvad der logges i terminalen.
- **Spørgsmål:** Hvad indeholder `req.query` hvis du ikke har nogen query params? Hvad hvis du har flere? Prøv fx `/messages?search=hej&foo=bar&underviser=hamMedArmen`
<details>
<summary>💡 Hint</summary>
`req.query` er et objekt, hvor hver query parameter i URL'en bliver til en property. Prøv fx `/messages?search=hej&foo=bar` og se hvad der logges.
</details>

### Step 2: Forstå `.filter()`

- `.filter()` bruges til at lave et nyt array med kun de elementer der opfylder en betingelse.
- Prøv i en separat fil eller browser-konsollen:
  - `[1,2,3,4].filter(n => n > 2)`
  - Hvad får du tilbage?

- Filtrering på et array af objekter. Forestil dig at du har dette array:
```js
const persons = [
  { name: "Anna", age: 22 },
  { name: "Bo", age: 17 },
  { name: "Carla", age: 30 },
  { name: "David", age: 15 }
];
```
- Brug `.filter()` til at finde alle personer over 18 år.
- Brug `.filter()` til at finde alle personer hvor navnet indeholder "a" (store/små bogstaver er ligegyldigt).

**Test:**
- Hvilket array får du hvis du filtrerer på age > 18?
- Hvilket array får du hvis du filtrerer på name indeholder "a"?

<details>
<summary>💡 Hint til persons-opgaven</summary>
- For age: Brug `person.age > 18` i filter-funktionen.
- For name: Brug `person.name.toLowerCase().includes("a")` i filter-funktionen.
</details>

- Forestil dig at du har et array af besked-objekter. Hvordan kan du bruge `.filter()` til at vælge dem hvor tekst indeholder et bestemt ord?
<details>
<summary>💡 Hint</summary>
`.filter()` tager en funktion som returnerer true/false for hvert element. Kun de elementer hvor funktionen returnerer true kommer med i det nye array.
</details>

### Step 3: Implementér filtrering i din route

- Hvis der er en `search` query param, så lav et nyt array med kun de beskeder hvor tekst matcher søgeordet.
- Husk at bruge `toLowerCase()` på både søgeord og beskedtekst, så store/små bogstaver ikke har betydning.
- Brug `.includes()` til at tjekke om søgeordet findes i beskedteksten.
- **Spørgsmål:** Hvorfor er det smart at bruge `toLowerCase()` begge steder?
<details>
<summary>💡 Hint</summary>
Du kan bruge `if (req.query.search) { ... }` til at tjekke om der skal filtreres. Husk at overskrive messages-arrayet med det filtrerede array.
</details>

### Step 4: Returnér resultatet som JSON

- Til sidst skal du returnere det filtrerede array med `res.json(messages)` i din route.
<details>
<summary>💡 Hint</summary>
Du skal altid afslutte din route med at sende et svar til klienten. Her skal du bruge `res.json(...)`.
</details>

### Test

- Prøv `/messages?search=hej` og tjek at du kun får beskeder med “hej” i teksten (du skal selvfølgelig have en `message` med `text` indeholdende "hej").
- Prøv også at søge med store bogstaver og se om det stadig virker.

<details>
<summary>💡 Hint til filtrering</summary>

- Brug `.filter()` på arrayet af beskeder.
- I filter-funktionen skal du sammenligne beskedens tekst (i små bogstaver) med søgeordet (også i små bogstaver) ved hjælp af `.includes()`.
- Husk at returnere det filtrerede array som JSON.

Eksempel på samlet kode:

```js
app.get("/messages", async (req, res) => {
  let messages = await readMessages();
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    messages = messages.filter(message => message.text.toLowerCase().includes(search));
  }
  res.json(messages);
});
```

</details>

---

## 2. Sortering af beskeder

**Mål:** Udvid nu din GET /messages-route, så du kan sortere beskeder efter dato.

### Step 1: Forstå og brug `req.query.sort`

- Tjek om `req.query.sort` er sat til `-date` eller `date`.
- Tilføj `console.log(req.query.sort)` i din route og prøv forskellige URLs, fx `/messages?sort=-date` og `/messages?sort=date`.
- **Spørgsmål:** Hvad sker der hvis du ikke angiver sort?
<details>
<summary>💡 Hint</summary>
`req.query.sort` er en string med værdien fra URL'en. Hvis du ikke angiver sort, er den undefined.
</details>

### Step 2: Forstå `.sort()` og arrow function

- `.sort()` bruges til at sortere et array. Den tager en funktion som argument, der bestemmer rækkefølgen.
- Prøv i Node REPL eller en separat fil:
  - `[3,1,2].sort((a,b) => a-b)`
  - Hvad får du tilbage?
- Forestil dig at du har et array af besked-objekter. Hvordan kan du bruge `.sort()` til at sortere efter dato?
<details>
<summary>💡 Hint</summary>
Sammenligningsfunktionen skal returnere et negativt tal, 0 eller et positivt tal. Prøv at sammenligne to datoer med `new Date(a.date) - new Date(b.date)`.
</details>

### Step 3: Implementér sortering i din route

- Hvis `req.query.sort` er `-date`, skal de nyeste beskeder vises først. Ellers vises de ældste først.
- Brug `.sort()` og sammenligningsfunktionen fra før.
- **Spørgsmål:** Hvorfor bruger vi `new Date()`?
<details>
<summary>💡 Hint</summary>
Datoer i JSON er strings. For at sammenligne dem som datoer, skal de laves om til Date-objekter.
</details>

### Test

- Prøv `/messages?sort=-date` og `/messages?sort=date` og se om rækkefølgen ændrer sig.

<details>
<summary>💡 Hint til samlet løsning</summary>

```js
if (req.query.sort === "-date") {
  messages.sort((a, b) => new Date(b.date) - new Date(a.date));
} else {
  messages.sort((a, b) => new Date(a.date) - new Date(b.date));
}
```

</details>

**Ekstraopgave:** Udvid sortering så man kan sortere på andre properties (fx `sender`).

---

## 3. Paginering af beskeder

**Mål:** Udvid nu din GET /messages-route, så du kan paginere beskeder (vise et udsnit ad gangen).

### Step 1: Forstå paginering

- Hvad betyder det at paginere data? Hvorfor er det nyttigt, når man har mange beskeder?
<details>
<summary>💡 Hint</summary>
Paginering betyder at vise et udsnit (en "side") af alle beskeder, så man ikke får alt på én gang. Det gør det hurtigere og mere overskueligt for brugeren.
</details>

### Step 2: Brug `req.query.page` og `req.query.limit`

- Disse to query parametre bestemmer hvilken side og hvor mange beskeder der vises pr. side.
- Prøv at logge `req.query.page` og `req.query.limit` i din route, og besøg fx `/messages?page=2&limit=3`.
- **Spørgsmål:** Hvad sker der hvis du ikke angiver dem?
<details>
<summary>💡 Hint</summary>
Hvis du ikke angiver dem, vil værdierne være `undefined`. Du kan sætte en standardværdi senere.
</details>

### Step 3: Brug `parseInt()` og default-værdier

- Query parametre er altid strings! Brug `parseInt()` for at lave dem om til tal.
- Brug `||` til at sætte en standardværdi, fx 1 for page og fx messages.length for limit.
- Prøv i Node REPL: `parseInt("2")`, `parseInt(undefined)`, `parseInt("hej")`.
- **Spørgsmål:** Hvorfor er det vigtigt at bruge `parseInt()` og default-værdier?
<details>
<summary>💡 Hint</summary>
Hvis du ikke laver dem om til tal, kan du få mærkelige resultater når du regner med dem. Default-værdier sikrer at din kode virker selvom brugeren ikke angiver page/limit.
</details>

### Step 4: Udregn start og end, brug `.slice()`

- Udregn hvilket index i arrayet der er start og slut for den side du vil vise.
- Formlen er: `start = (page - 1) * limit`, `end = start + limit`.
- Brug `.slice(start, end)` på arrayet af beskeder for at få det rigtige udsnit.
- Prøv i Node REPL: `[1,2,3,4,5,6].slice(2,5)`
- **Spørgsmål:** Hvad returnerer `.slice()`?
<details>
<summary>💡 Hint</summary>
`.slice(start, end)` returnerer et nyt array med elementerne fra start til (men ikke med) end.
</details>

### Step 5: Implementér paginering i din route

- Brug nu alle ovenstående trin til at vise kun de beskeder der hører til den ønskede side.
- Husk at returnere det paginerede array med `res.json(...)`.
<details>
<summary>💡 Hint</summary>
Du kan lave et nyt array med de paginerede beskeder og sende det som svar.
</details>

### Test

- Prøv `/messages?page=2&limit=3` og se om du får side 2 med 3 beskeder.

<details>
<summary>💡 Hint til samlet løsning</summary>

```js
const page = parseInt(req.query.page) || 1;
const limit = parseInt(req.query.limit) || messages.length;
const start = (page - 1) * limit;
const end = start + limit;
const paginatedMessages = messages.slice(start, end);
res.json(paginatedMessages);
```

</details>

---

## 4. Kombiner det hele

Når du har løst alle tre opgaver, kan du kombinere filtrering, sortering og paginering i én route – præcis som i den færdige løsning!

**Mål:** Kombinér filtrering, sortering og paginering i én samlet route, så du kan håndtere alle query parametre på én gang.

### Step 1: Forstå rækkefølgen

- Hvilken rækkefølge giver mening: filtrering, sortering eller paginering først? Hvorfor?
<details>
<summary>💡 Hint</summary>
Det er mest logisk at filtrere først (så du kun arbejder med relevante beskeder), derefter sortere, og til sidst paginere det sorterede resultat.
</details>

### Step 2: Kombinér logikken

- Skriv koden så alle tre trin udføres i samme route. Brug evt. dine tidligere løsninger som inspiration.
- **Spørgsmål:** Hvordan kan du sikre at du ikke overskriver det oprindelige array, men arbejder med kopier?
<details>
<summary>💡 Hint</summary>
Du kan opdatere din `messages`-variabel for hvert trin, så du hele tiden arbejder videre med det aktuelle array.
</details>

### Step 3: Returnér et samlet objekt

- I stedet for kun at returnere et array, skal du returnere et objekt med:
  - total: antal beskeder efter filtrering (før paginering)
  - page: det aktuelle sidetal
  - limit: antal beskeder pr. side
  - data: det paginerede array
- **Spørgsmål:** Hvorfor er det nyttigt at returnere total, page og limit sammen med data?
<details>
<summary>💡 Hint</summary>
Klienten kan vise hvor mange sider der er, og lave navigation. Det gør API'et mere brugervenligt.
</details>

### Step 4: Test din samlede løsning

- Prøv at kombinere flere query params: `/messages?search=hej&sort=-date&page=2&limit=3`
- Tjek at du får et objekt med total, page, limit og data.

<details>
<summary>💡 Hint til samlet løsning</summary>

```js
res.json({
  total: messages.length,
  page,
  limit,
  data: paginatedMessages
});
```

</details>

---

**Refleksion:**

- Hvilke fordele giver det for brugeren/klienten?
- Hvilke udfordringer kan der opstå, hvis man ikke bruger paginering?

---
