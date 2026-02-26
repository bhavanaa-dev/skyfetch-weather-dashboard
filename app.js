// Your OpenWeatherMap API Key
const API_KEY = '43f9a1f7de75798dd6da8340511b9657';  // Replace with your actual API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Function to fetch weather data
async function getWeather(city) {
  const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;

  // Show loading
  document.getElementById("weather-display").innerHTML =
    `<p class="loading">Loading weather data...</p>`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    displayWeather(data);
  } catch (error) {
    document.getElementById("weather-display").innerHTML =
      `<p class="loading">City not found 😢</p>`;
  }
}

// Function to display weather data
function displayWeather(data) {
    // Extract the data we need
    const cityName = data.name;
    const temperature = Math.round(data.main.temp);
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    // Create HTML to display
    const weatherHTML = `
        <div class="weather-info">
            <h2 class="city-name">${cityName}</h2>
            <img src="${iconUrl}" alt="${description}" class="weather-icon">
            <div class="temperature">${temperature}°C</div>
            <p class="description">${description}</p>
        </div>
    `;
    
    // Put it on the page
    document.getElementById('weather-display').innerHTML = weatherHTML;
}

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city === "") {
    document.getElementById("weather-display").innerHTML =
      `<p class="loading">Please enter a city name ⚠️</p>`;
    return;
  }

  getWeather(city);
});
cityInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Call the function when page loads
getWeather('London');