 
const weatherApi = "https://api.weather.gov/alerts/active?area=";

async function fetchWeatherData(state) {
  const alertsDisplay = document.getElementById("alerts-display");
  const errorMessage = document.getElementById("error-message");

  alertsDisplay.innerHTML = "";
  errorMessage.textContent = "";
  errorMessage.classList.add("hidden");

  const stateCode = state.trim().toUpperCase();

  if (!stateCode) {
  displayError("Please enter a state abbreviation.");
  return;
}

  try {
    const response = await fetch(weatherApi + stateCode);

    if (!response.ok) {
      throw new Error("Unable to fetch weather alerts.");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    displayError(error.message);
  }
}

function displayWeather(data) {
  const alertsDisplay = document.getElementById("alerts-display");
  alertsDisplay.innerHTML = "";

  const alerts = data.features || [];
  const heading = document.createElement("h2");

  heading.textContent = `${data.title || "Weather Alerts"}: ${alerts.length}`;
  alertsDisplay.appendChild(heading);

  if (alerts.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No active weather alerts.";
    alertsDisplay.appendChild(message);
    return;
  }

  alerts.forEach((feature) => {
    const properties = feature.properties || {};
    const alertHeading = document.createElement("h3");

    alertHeading.textContent = properties.headline || "Weather alert";
    alertsDisplay.appendChild(alertHeading);
  });
}

function displayError(message) {
  const errorMessage = document.getElementById("error-message");

  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

function setupWeatherApp() {
  const button = document.getElementById("fetch-alerts");
  const input = document.getElementById("state-input");

  if (!button || !input) return;

  button.addEventListener("click", () => {
    const state = input.value;
    input.value = "";
    fetchWeatherData(state);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupWeatherApp);
} else {
  setupWeatherApp();
}
