# Eksempler på CORS i Express

CORS (Cross-Origin Resource Sharing) bruges til at styre, hvilke domæner der må tilgå din API fra browseren. Her er en progression fra de simpleste til de mere avancerede måder at konfigurere CORS i Express på:

---

## 1. Åben for alle domæner (default)

```js
import cors from "cors";
app.use(cors()); // Tillad alle origins
```

**Effekt:**

- Alle domæner kan lave requests til din API.
- Simpelt, men ikke sikkert til produktion.

---

## 2. Kun bestemte domæner (whitelist)

### Simpel whitelist med array

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
