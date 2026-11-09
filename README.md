# API Dashboard

A single-page dashboard of eight small widgets, each calling a different public REST API, written in plain HTML, CSS and JavaScript with `fetch` and `async/await`. It is a compact demo of browser-side API work: loading and error states, chained requests, user input, and a user-supplied API key.

**Live demo:** https://api-dashboard-fawn.vercel.app (also on GitHub Pages: https://aldonvacriates.github.io/API-Dashboard/)

Context: JavaScript final project, Coding Temple 2025.

## Features

Eight cards on one responsive grid (`index.html`, logic in `app.js`):

| Card | API | Input |
| --- | --- | --- |
| Random Dog | [dog.ceo](https://dog.ceo/dog-api/) | Refresh button |
| Random Cat | [TheCatAPI](https://thecatapi.com/) | Refresh button |
| Weather by city | [Open-Meteo](https://open-meteo.com/) geocoding + forecast | City name (Enter or button), defaults to Denver |
| USD to EUR rate | exchangerate.host | Refresh button (currently broken, see Known issues) |
| Trending movies | [TMDB](https://developer.themoviedb.org/docs/getting-started) | Your own TMDB API key |
| GitHub user lookup | GitHub REST API (`/users/{username}`) | Username (Enter or button), defaults to `octocat` |
| Random joke | [JokeAPI](https://jokeapi.dev/) (safe mode, single-line jokes) | "Another" button |
| Featured public API | publicapis.org | Randomize button (currently broken, see Known issues) |

- Every card shows its own loading spinner and its own error message, so one failing API does not affect the others.
- No API keys are needed except for TMDB, which the user enters at runtime (see below).
- The layout adapts to small screens: a viewport meta tag, a CSS grid of `repeat(auto-fill, minmax(280px, 1fr))` columns that collapses to one column on phones, wrapping control rows, and a `clamp()`-sized heading (`style.css`).

## Tech stack

- HTML, CSS (custom properties, CSS grid, flexbox), vanilla JavaScript (ES2020+)
- Browser `fetch` API, `localStorage`
- No framework, no build step, no dependencies
- Hosted as static files on Vercel and GitHub Pages

## How it works

- **One small rendering helper with escaping.** `app.js` defines an `html` tagged template that HTML-escapes every interpolated value, so text from third-party APIs (jokes, GitHub names and bios, movie titles) and the user's own input is displayed as text rather than parsed as markup. Prebuilt markup, such as the movie list, is passed through explicitly with `raw()`, and links taken from API data are limited to `http(s)` URLs by `safeUrl()`.
- **Shared loading and error states.** `setLoading(el, msg)` and `setError(el, err)` in `app.js` are reused by every card. Each loader wraps its requests in `try/catch` and checks the response (status or expected fields) before rendering.
- **Chained requests for weather.** `geocodeCity()` turns a city name into coordinates with the Open-Meteo geocoding API, then `loadWeather()` uses them to request current temperature, wind speed and humidity. User input is passed through `encodeURIComponent` (weather and GitHub cards).
- **User-supplied TMDB key.** The repo contains no API keys. The Movies card has an input for the user's own TMDB key; "Save Key" stores it in the browser's `localStorage` under `tmdb_api_key`, and the trending list loads automatically on later visits if a key is saved. The key stays in that browser and is sent only to `api.themoviedb.org` as the `api_key` query parameter.

## Getting started

Prerequisites: a modern browser. Optionally Python 3 (or any static file server).

```bash
git clone https://github.com/Aldonvacriates/API-Dashboard.git
cd API-Dashboard
python -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly also works, but a local server is closer to how the deployed site runs.

There are no environment variables and no `.env` file. To use the Movies card, get a free API key from TMDB ([getting started guide](https://developer.themoviedb.org/docs/getting-started)), paste it into the card, click **Save Key**, then **Refresh**.

There is no automated test suite.

## Project structure

```
API-Dashboard/
├── index.html   # page markup and the eight card containers
├── style.css    # dark theme and responsive grid
├── app.js       # helpers and one loader function per card
└── favicon.ico
```

## Known issues

- **USD to EUR card:** `api.exchangerate.host/latest` now requires an access key and returns HTTP 401, so the card shows an error.
- **Featured public API card:** `api.publicapis.org` is no longer online, so the card shows an error.

## What I'd improve next

- Replace the two broken cards with keyless alternatives (for example a different free exchange-rate API).
- Factor the eight near-identical card loaders into one reusable card component.
- Add a few unit tests for the helpers and response parsing.
- Remember the last city and GitHub username in `localStorage`.

## Credits

Data from Dog CEO, TheCatAPI, Open-Meteo, exchangerate.host, TMDB, the GitHub REST API, JokeAPI and publicapis.org. This product uses the TMDB API but is not endorsed or certified by TMDB.
