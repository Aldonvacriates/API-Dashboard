# 🧪 Final JavaScript Project: API Dashboard

A single-page dashboard of mini apps, each powered by a different public API. Built with vanilla HTML/CSS/JS and `fetch` + `async/await`. Optimized to look good even on small screens (e.g., iPhone SE).

## 🎯 What You’ll Build
Eight independent widgets living on one grid page:

- 🐶 Random Dog (dog.ceo)
- 🐱 Random Cat (TheCatAPI)
- 🌤️ Weather by City (Open-Meteo + Geocoding)
- 💱 USD → EUR Rate (exchangerate.host)
- 🎬 Trending Movies (TMDB) **requires API key**
- 🧑‍💻 GitHub User Lookup
- 😂 Random Joke (JokeAPI)
- 📚 Featured Public API (publicapis.org)

Each card has its own loading state, error handling, and basic UI controls.

---

## 🗂 Project Structure
api-dashboard/
├── index.html
├── style.css
└── app.js

markdown
Copy
Edit

- `index.html` — markup and card containers
- `style.css` — responsive grid + dark UI styling
- `app.js` — all logic and `fetch` calls

---

## 🚀 Getting Started

### Option A: Open Locally
1. Download/clone the folder.
2. Double-click `index.html` to open in your browser.

### Option B: Use a Local Server (recommended for devtools/paths)
- VS Code → “Live Server” extension → Open `index.html`.
- Or run any simple static server (e.g., `python -m http.server`).

### Option C: CodePen
- Create a new Pen.
- Paste **HTML** from `index.html` (inside the HTML panel’s `<body>`).
- Paste **CSS** from `style.css`.
- Paste **JS** from `app.js` (as external JS).

---

## 🔑 API Keys (TMDB only)

The Movies card needs a TMDB API key.

1. Get a key: https://www.themoviedb.org/settings/api
2. Paste it into the **TMDB API Key** input on the Movies card.
3. Click **Save Key** (stored in `localStorage`), then **Refresh**.

> Everything else works without keys.

---

## 🔌 APIs & Endpoints

- **Dog**: `https://dog.ceo/api/breeds/image/random`
- **Cat**: `https://api.thecatapi.com/v1/images/search`
- **Weather (Geocode)**:  
  `https://geocoding-api.open-meteo.com/v1/search?name={CITY}&count=1`  
  **Weather (Current):**  
  `https://api.open-meteo.com/v1/forecast?latitude={LAT}&longitude={LON}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`
- **Currency**: `https://api.exchangerate.host/latest?base=USD&symbols=EUR`
- **TMDB Trending**: `https://api.themoviedb.org/3/trending/movie/day?api_key=YOUR_KEY`
- **GitHub User**: `https://api.github.com/users/{USERNAME}`
- **Joke**: `https://v2.jokeapi.dev/joke/Any?type=single&safe-mode`
- **Public APIs**: `https://api.publicapis.org/entries`

---

## 🧠 Learning Objectives (Covered)
- `fetch()` + `async/await`
- DOM updates with `innerHTML`, `createElement`, event listeners
- Handling different response shapes (arrays/objects/nested)
- Loading states, try/catch error handling
- ES6+ syntax (arrow functions, template literals, destructuring)

---

## ♿ Accessibility & Alt Text
- Images include concise, purpose-driven `alt` text (no “image of …”).  
- Focus styles preserved; buttons are keyboard-friendly.
- Color choices maintain contrast against the dark theme.

---

## 🧩 Tips & Debugging

Use DevTools → **Network** to inspect calls and responses.

Common messages you might see (and what to check):
- **“City not found.”** → Try a different spelling; the geocoder returns no results.
- **“TMDB request failed (check your key).”** → Paste a valid TMDB key and click **Save Key**.
- **“GitHub user "xyz" not found.”** → Username typo or non-existent account.
- **“Rate not found.” / “No joke found.”** → Temporary API hiccup — click refresh again.

If an API ever blocks HTTP from `file://` pages, run a local server (see “Getting Started”).

---

## 🌟 Stretch Ideas
- “Refresh All” button with throttling
- Auto-refresh intervals per card
- Theme toggle (dark/light)
- Weather: unit toggle °C/°F
- GitHub: show recent repos
- TMDB: search by title, show details modal
- Save user preferences in `localStorage` (city, GitHub handle, etc.)

---

## 📄 License
MIT — use freely in portfolios and coursework.

---

## 🙏 Credits
- Public data from: Dog CEO, TheCatAPI, Open-Meteo, exchangerate.host, TMDB, GitHub API, JokeAPI, publicapis.org.
- Designed and coded by **Aldo Herrera** as part of the JavaScript portfolio project.
