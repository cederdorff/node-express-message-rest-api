# Eksempler på CORS i Express

CORS (Cross-Origin Resource Sharing) bruges til at styre, hvilke domæner der må tilgå din API fra browseren. Her er en progression fra de simpleste til de mere avancerede måder at konfigurere CORS i Express på:

---

## 1. Åben for alle domæner (default)

Dette er standardopsætningen, hvor alle domæner må tilgå din API. Brug kun til udvikling eller åbne, offentlige API'er.

```js
import cors from "cors";
app.use(cors()); // Tillad alle origins
```

**Effekt:**

- Alle domæner kan lave requests til din API.
- Simpelt, men ikke sikkert til produktion.

---

## 2. Kun bestemte domæner (whitelist)

Vil du kun tillade bestemte domæner (fx dit eget site og localhost), kan du bruge en whitelist. Det øger sikkerheden og forhindrer uønskede domæner i at tilgå din API.

### Simpel whitelist med array

Brug denne løsning hvis listen af tilladte domæner er fast og ikke ændrer sig dynamisk.

```js
import cors from "cors";
app.use(
  cors({
    origin: ["https://mit-domæne.dk", "http://localhost:5173"]
  })
);
```

**Effekt:**

- Kun requests fra de angivne domæner tillades.
- Simpelt hvis listen er statisk.

---

### Whitelist med funktion (avanceret)

Brug denne løsning hvis du har brug for dynamisk kontrol, fx hvis listen af domæner hentes fra database eller miljøvariabel.

```js
import cors from "cors";
const allowedOrigins = ["https://mit-domæne.dk", "http://localhost:5173"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Ikke tilladt af CORS"));
      }
    }
  })
);
```

**Effekt:**

- Kun requests fra de angivne domæner tillades.
- Giver fejl hvis et andet domæne prøver.

---

## 3. CORS kun på enkelte endpoints

Nogle gange vil du kun åbne enkelte endpoints for CORS – fx hvis kun nogle data må være offentlige. Her kan du tilføje CORS-middleware direkte på de relevante routes.

```js
import cors from "cors";

// Kun GET /messages endpoint tillader alle origins
app.get("/messages", cors(), (req, res) => {
  // ...
});

// Andre endpoints har ikke CORS
```

**Effekt:**

- Du kan styre CORS pr. route.
- Bruges hvis kun nogle endpoints skal være offentlige.

---

## 4. CORS med credentials (cookies, auth)

Hvis din frontend skal sende cookies eller authentication headers til din API, skal du både tillade credentials og angive et specifikt origin (ikke '*').

Vil du tillade cookies eller authentication headers, skal du sætte både `credentials: true` og `origin` til en specifik værdi (ikke `*`).

```js
import cors from "cors";
app.use(
  cors({
    origin: "https://mit-domæne.dk", // eller en whitelist-funktion
    credentials: true
  })
);
```

**Effekt:**

- Tillader cookies, authorization headers mv. fra det angivne domæne.
- Husk at din frontend også skal sætte `credentials: 'include'` i fetch/AJAX.

---

## 5. CORS med custom headers og metoder

Hvis du kun vil tillade bestemte HTTP-metoder eller headers fra klienten, kan du specificere det her. Det giver ekstra kontrol over, hvad der er tilladt.

Vil du tillade bestemte headers/metoder:

```js
import cors from "cors";
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
```

**Effekt:**

- Kun de angivne metoder og headers tillades fra det angivne origin.

---

## 6. Dynamisk origin (fx fra env eller database)

Hvis listen over tilladte domæner ændrer sig ofte, eller du vil slå op i en database, kan du bruge en funktion til at bestemme om et origin er tilladt.

Du kan dynamisk bestemme, om et origin er tilladt:

```js
import cors from "cors";
app.use(
  cors({
    origin: function (origin, callback) {
      // Fx slå op i database eller brug env-variabel
      if (process.env.ALLOW_ALL === "true") return callback(null, true);
      if (["https://a.dk", "https://b.dk"].includes(origin)) return callback(null, true);
      return callback(new Error("Origin ikke tilladt"));
    }
  })
);
```

---

## 7. Fejlhåndtering af CORS

Hvis du bruger en custom origin-funktion, kan du fange og håndtere CORS-fejl, så klienten får en pæn fejlbesked.

Hvis du bruger custom origin-funktion, kan du fange CORS-fejl i Express error handler:

```js
app.use((err, req, res, next) => {
  if (err instanceof Error && err.message.includes("CORS")) {
    return res.status(403).json({ error: "CORS-fejl: " + err.message });
  }
  next(err);
});
```

---

## 8. Preflight requests (OPTIONS)

Browsere sender automatisk en preflight (OPTIONS) request før visse CORS-requests. Express/cors håndterer det automatisk, men du kan også selv svare på OPTIONS hvis du har brug for det.

Browseren sender automatisk en preflight (OPTIONS) request før visse CORS-requests. Express/cors håndterer det automatisk, men du kan også selv svare:

```js
app.options("/messages", cors()); // Svar på preflight for /messages
```

---

## Yderligere muligheder

- Du kan også tillade credentials, sætte headers, metoder osv. Se [npmjs.com/package/cors](https://www.npmjs.com/package/cors) for flere muligheder.

---

**Tip:**

- Brug altid restriktiv CORS i produktion.
- Test CORS med frontend i browseren – fejl vises i konsollen.
