# API Dashboard

A single-page dashboard of eight small widgets, each calling a different public REST API, written in plain HTML, CSS and JavaScript with `fetch` and `async/await`. It is a compact demo of browser-side API work: loading and error states, chained requests, user input, and a user-supplied API key.

**Live demo:** https://api-dashboard-fawn.vercel.app (also on GitHub Pages: https://aldonvacriates.github.io/api-dashboard/)

Context: JavaScript final project, Coding Temple 2025.

## Features

Eight cards on one responsive grid (`index.html`, logic in `app.js`):

| Card | API | Input |
| --- | --- | --- |
| Random Dog | [dog.ceo](https://dog.ceo/dog-api/) | Refresh button |
| Random Cat | [TheCatAPI](https://thecatapi.com/) | Refresh button |
| Weather by city | [Open-Meteo](https://open-meteo.com/) geocoding + forecast | City name (Enter or button), defaults to Denver |
| USD to EUR rate | [Frankfurter](https://frankfurter.dev/) (daily rates blended from central banks and official sources) | Refresh button |
| Trending movies | [TMDB](https://developer.themoviedb.org/docs/getting-started) | Your own TMDB API key |
| GitHub user lookup | GitHub REST API (`/users/{username}`) | Username (Enter or button), defaults to `octocat` |
| Random joke | [JokeAPI](https://jokeapi.dev/) (safe mode, single-line jokes) | "Another" button |
| Featured public API | [Free Public APIs](https://www.freepublicapis.com/api) (`/api/random`) | Randomize button |

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
- **Chained requests for weather.** `geocodeCity()` turns a city name into coordinates with the Open-Meteo geocoding API, then `loadWeather()` uses them to request current temperature (°C), wind speed (km/h, requested explicitly with `wind_speed_unit=kmh`) and humidity. User input is passed through `encodeURIComponent` (weather and GitHub cards).
- **Keyless APIs the browser can call directly.** Apart from TMDB, every card uses an API that needs no key and sends `Access-Control-Allow-Origin: *`, so the page calls it straight from the browser with no backend. The exchange-rate card calls `api.frankfurter.dev/v2/rate/USD/EUR` directly, because the older `api.frankfurter.app` address answers with a redirect that has no CORS header. The public-API card uses the `/api/random` endpoint of freepublicapis.com, which has a free limit of 1,000 requests a day.
- **User-supplied TMDB key.** The repo contains no API keys. The Movies card has an input for the user's own TMDB key; "Save Key" stores it in the browser's `localStorage` under `tmdb_api_key`, and the trending list loads automatically on later visits if a key is saved. The key stays in that browser and is sent only to `api.themoviedb.org` as the `api_key` query parameter.

## Getting started

Prerequisites: a modern browser. Optionally Python 3 (or any static file server).

```bash
git clone https://github.com/Aldonvacriates/api-dashboard.git
cd api-dashboard
python -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly also works, but a local server is closer to how the deployed site runs.

There are no environment variables and no `.env` file. To use the Movies card, get a free API key from TMDB ([getting started guide](https://developer.themoviedb.org/docs/getting-started)), paste it into the card, click **Save Key**, then **Refresh**.

There is no automated test suite.

## Project structure

```
api-dashboard/
├── index.html   # page markup and the eight card containers
├── style.css    # dark theme and responsive grid
├── app.js       # helpers and one loader function per card
└── favicon.ico
```

## What I'd improve next

- Factor the eight near-identical card loaders into one reusable card component.
- Add a few unit tests for the helpers and response parsing.
- Remember the last city and GitHub username in `localStorage`.

## Credits

Data from Dog CEO, TheCatAPI, Open-Meteo, Frankfurter, TMDB, the GitHub REST API, JokeAPI and Free Public APIs (freepublicapis.com). This product uses the TMDB API but is not endorsed or certified by TMDB.
