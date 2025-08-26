// ------------------------------
// Helpers
// ------------------------------
const html = (strings, ...vals) =>
  strings.map((s, i) => s + (vals[i] ?? "")).join("");
const setLoading = (el, msg = "Loading…") => {
  el.innerHTML = html`<div class="row muted">
    <span class="spinner"></span>&nbsp; ${msg}
  </div>`;
};
const setError = (el, err) => {
  console.error(err);
  el.innerHTML = html`<p class="error">
    ⚠️ ${err?.message || err || "Something went wrong."}
  </p>`;
};

// ------------------------------
// DOG — dog.ceo
// ------------------------------
const dogContent = document.getElementById("dog-content");
async function loadDog() {
  setLoading(dogContent, "Fetching a random doggo…");
  try {
    const res = await fetch("https://dog.ceo/api/breeds/image/random");
    const data = await res.json();
    if (data.status !== "success") throw new Error("Dog API error.");
    dogContent.innerHTML = html`
      <img class="media" src="${data.message}" alt="Random dog" />
      <p class="tiny">Source: dog.ceo</p>
    `;
  } catch (e) {
    setError(dogContent, e);
  }
}
document.getElementById("refresh-dog").addEventListener("click", loadDog);

// ------------------------------
// CAT — TheCatAPI (no key needed for simple demo)
// ------------------------------
const catContent = document.getElementById("cat-content");
async function loadCat() {
  setLoading(catContent, "Fetching a random cat…");
  try {
    const res = await fetch("https://api.thecatapi.com/v1/images/search");
    const data = await res.json();
    const url = data?.[0]?.url;
    if (!url) throw new Error("Cat API returned no image.");
    catContent.innerHTML = html`
      <img class="media" src="${url}" alt="Random cat" />
      <p class="tiny">Source: thecatapi.com</p>
    `;
  } catch (e) {
    setError(catContent, e);
  }
}
document.getElementById("refresh-cat").addEventListener("click", loadCat);

// ------------------------------
// WEATHER — Open-Meteo + geocoding
// ------------------------------
const weatherContent = document.getElementById("weather-content");
const weatherCityInput = document.getElementById("weather-city");
async function geocodeCity(name) {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      name
    )}&count=1`
  );
  const data = await res.json();
  const first = data?.results?.[0];
  if (!first) throw new Error("City not found.");
  return {
    lat: first.latitude,
    lon: first.longitude,
    label: `${first.name}${first.country ? ", " + first.country : ""}`,
  };
}
async function loadWeather(city) {
  if (!city) city = "Denver";
  setLoading(weatherContent, `Fetching weather for "${city}"…`);
  try {
    const { lat, lon, label } = await geocodeCity(city);
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,relative_humidity_2m`
    );
    const data = await res.json();
    const cur = data?.current;
    if (!cur) throw new Error("No current weather data.");
    weatherContent.innerHTML = html`
      <div class="row">
        <div style="font-size:32px; font-weight:700">
          ${Math.round(cur.temperature_2m)}°C
        </div>
        <div class="muted">at ${label}</div>
      </div>
      <p class="tiny">
        Wind: ${Math.round(cur.wind_speed_10m)} m/s · Humidity:
        ${cur.relative_humidity_2m}%
      </p>
      <p class="tiny">Source: open-meteo.com</p>
    `;
  } catch (e) {
    setError(weatherContent, e);
  }
}
document.getElementById("go-weather").addEventListener("click", () => {
  loadWeather(weatherCityInput.value.trim());
});
weatherCityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("go-weather").click();
});

// ------------------------------
// CURRENCY — exchangerate.host (free)
// ------------------------------
const currencyContent = document.getElementById("currency-content");
async function loadCurrency() {
  setLoading(currencyContent, "Fetching USD→EUR rate…");
  try {
    const res = await fetch(
      "https://api.exchangerate.host/latest?base=USD&symbols=EUR"
    );
    const data = await res.json();
    const rate = data?.rates?.EUR;
    if (!rate) throw new Error("Rate not found.");
    currencyContent.innerHTML = html`
      <p><strong>1 USD</strong> = <strong>${rate.toFixed(4)} EUR</strong></p>
      <p class="tiny">Date: ${data.date} · Source: exchangerate.host</p>
    `;
  } catch (e) {
    setError(currencyContent, e);
  }
}
document
  .getElementById("refresh-currency")
  .addEventListener("click", loadCurrency);

// ------------------------------
// MOVIES — TMDB Trending (needs API key)
// ------------------------------
const moviesContent = document.getElementById("movies-content");
const keyInput = document.getElementById("tmdb-key");
const savedKey = localStorage.getItem("tmdb_api_key");
if (savedKey) keyInput.value = savedKey;

document.getElementById("save-tmdb").addEventListener("click", () => {
  const k = keyInput.value.trim();
  if (!k) return alert("Enter your TMDB API key first.");
  localStorage.setItem("tmdb_api_key", k);
  alert("TMDB key saved! Click Refresh to load trending.");
});

async function loadMovies() {
  const apiKey = (
    keyInput.value ||
    localStorage.getItem("tmdb_api_key") ||
    ""
  ).trim();
  if (!apiKey) {
    moviesContent.innerHTML = `<p class="warn">Please enter your TMDB API key, click “Save Key”, then “Refresh”.</p>`;
    return;
  }
  setLoading(moviesContent, "Fetching trending movies…");
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${encodeURIComponent(
        apiKey
      )}`
    );
    if (!res.ok) throw new Error("TMDB request failed (check your key).");
    const data = await res.json();
    const list = data?.results?.slice(0, 8) || [];
    if (!list.length) throw new Error("No results.");
    const items = list
      .map((m) => {
        const poster = m.poster_path
          ? `https://image.tmdb.org/t/p/w200${m.poster_path}`
          : "";
        return html`
          <div class="movie">
            <img src="${poster}" alt="${m.title}" />
            <div>
              <div><strong>${m.title}</strong></div>
              <div class="tiny">
                ⭐ ${m.vote_average?.toFixed?.(1) ?? "N/A"} ·
                ${m.release_date || "—"}
              </div>
            </div>
          </div>
        `;
      })
      .join("");
    moviesContent.innerHTML = html`
      <div class="list">${items}</div>
      <p class="tiny">Source: themoviedb.org</p>
    `;
  } catch (e) {
    setError(moviesContent, e);
  }
}
document.getElementById("refresh-movies").addEventListener("click", loadMovies);

// ------------------------------
// GITHUB USER — api.github.com
// ------------------------------
const ghContent = document.getElementById("github-content");
const ghInput = document.getElementById("gh-user");
async function loadGitHubUser(user = "octocat") {
  setLoading(ghContent, `Loading ${user}…`);
  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(user)}`
    );
    if (!res.ok) throw new Error(`GitHub user "${user}" not found.`);
    const d = await res.json();
    ghContent.innerHTML = html`
      <div class="row" style="gap:12px; align-items:center">
        <img
          src="${d.avatar_url}"
          alt="${d.login}"
          width="72"
          height="72"
          style="border-radius:50%; background:#0a0d1c"
        />
        <div>
          <div>
            <strong>${d.name || d.login}</strong>
            <span class="muted">@${d.login}</span>
          </div>
          <div class="tiny">${d.bio ?? ""}</div>
          <div class="tiny">
            Repos: ${d.public_repos} · Followers: ${d.followers}
          </div>
          <div class="tiny">
            <a href="${d.html_url}" target="_blank" rel="noreferrer"
              >Open Profile</a
            >
          </div>
        </div>
      </div>
    `;
  } catch (e) {
    setError(ghContent, e);
  }
}
document.getElementById("go-gh").addEventListener("click", () => {
  const u = ghInput.value.trim() || "octocat";
  loadGitHubUser(u);
});
ghInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") document.getElementById("go-gh").click();
});

// ------------------------------
// JOKE — JokeAPI
// ------------------------------
const jokeContent = document.getElementById("joke-content");
async function loadJoke() {
  setLoading(jokeContent, "Fetching a joke…");
  try {
    const res = await fetch(
      "https://v2.jokeapi.dev/joke/Any?type=single&safe-mode"
    );
    const data = await res.json();
    if (!data?.joke) throw new Error("No joke found.");
    jokeContent.innerHTML = html`
      <p>${data.joke}</p>
      <p class="tiny">Source: jokeapi.dev</p>
    `;
  } catch (e) {
    setError(jokeContent, e);
  }
}
document.getElementById("refresh-joke").addEventListener("click", loadJoke);

// ------------------------------
// PUBLIC APIs — api.publicapis.org
// ------------------------------
const apisContent = document.getElementById("publicapis-content");
async function loadPublicAPI() {
  setLoading(apisContent, "Finding a cool public API…");
  try {
    const res = await fetch("https://api.publicapis.org/entries");
    const data = await res.json();
    const entries = data?.entries || [];
    if (!entries.length) throw new Error("No entries.");
    const pick = entries[Math.floor(Math.random() * entries.length)];
    apisContent.innerHTML = html`
      <p><strong>${pick.API}</strong> — ${pick.Description}</p>
      <p class="tiny">
        Auth: ${pick.Auth || "None"} · HTTPS: ${pick.HTTPS} · CORS: ${pick.Cors}
      </p>
      <p>
        <a href="${pick.Link}" target="_blank" rel="noreferrer">Open docs</a>
      </p>
      <p class="tiny">Source: publicapis.org</p>
    `;
  } catch (e) {
    setError(apisContent, e);
  }
}
document
  .getElementById("refresh-apis")
  .addEventListener("click", loadPublicAPI);

// ------------------------------
// Initial load
// ------------------------------
loadDog();
loadCat();
loadCurrency();
loadJoke();
loadPublicAPI();
loadGitHubUser("octocat");
loadWeather("Denver");
if (savedKey) {
  loadMovies();
}

// QoL: button titles
for (const btn of document.querySelectorAll("button")) {
  btn.setAttribute("title", "Click or press Enter/Space");
}
