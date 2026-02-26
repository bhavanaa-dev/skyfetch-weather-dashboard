// Weather App Constructor
function WeatherApp() {
  this.API_KEY = "43f9a1f7de75798dd6da8340511b9657"; // put your key here
  this.BASE_URL = "https://api.openweathermap.org/data/2.5";

  this.cityInput = document.getElementById("city-input");
  this.searchBtn = document.getElementById("search-btn");
  this.display = document.getElementById("weather-display");

  this.init();
}

// Initialize app
WeatherApp.prototype.init = function () {
  this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

  this.cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") this.handleSearch();
  });

  this.getWeather("London"); // default
};

// Handle search
WeatherApp.prototype.handleSearch = function () {
  const city = this.cityInput.value.trim();

  if (!city) {
    this.display.innerHTML = `<p class="loading">Please enter a city ⚠️</p>`;
    return;
  }

  this.getWeather(city);
};

// Fetch current + forecast using Promise.all
WeatherApp.prototype.getWeather = async function (city) {
  this.display.innerHTML = `<p class="loading">Loading weather data...</p>`;

  try {
    const currentURL = `${this.BASE_URL}/weather?q=${city}&appid=${this.API_KEY}&units=metric`;
    const forecastURL = `${this.BASE_URL}/forecast?q=${city}&appid=${this.API_KEY}&units=metric`;

    const [currentRes, forecastRes] = await Promise.all([
      axios.get(currentURL),
      axios.get(forecastURL),
    ]);

    this.renderAll(currentRes.data, forecastRes.data);
  } catch (error) {
    this.display.innerHTML = `<p class="loading">City not found 😢</p>`;
  }
};

// Render both current + forecast
WeatherApp.prototype.renderAll = function (currentData, forecastData) {
  this.display.innerHTML = ""; // clear previous

  this.display.appendChild(this.createCurrentWeather(currentData));
  this.display.appendChild(this.createForecast(forecastData));
};

// Create current weather UI
WeatherApp.prototype.createCurrentWeather = function (data) {
  const container = document.createElement("div");
  container.className = "weather-info";

  const cityName = data.name;
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const icon = data.weather[0].icon;

  container.innerHTML = `
    <h2 class="city-name">${cityName}</h2>
    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="weather-icon"/>
    <div class="temperature">${temp}°C</div>
    <p class="description">${description}</p>
  `;

  return container;
};

// Create forecast UI
WeatherApp.prototype.createForecast = function (data) {
  const container = document.createElement("div");
  container.className = "forecast-container";

  // pick 1 data per day (every 8 items)
  const daily = data.list.filter((_, index) => index % 8 === 0);

  daily.forEach((item) => {
    const day = new Date(item.dt_txt).toLocaleDateString("en-US", {
      weekday: "short",
    });

    const temp = Math.round(item.main.temp);
    const icon = item.weather[0].icon;

    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML = `
      <p>${day}</p>
      <img src="https://openweathermap.org/img/wn/${icon}.png"/>
      <p>${temp}°C</p>
    `;

    container.appendChild(card);
  });

  return container;
};

// Start app
new WeatherApp();