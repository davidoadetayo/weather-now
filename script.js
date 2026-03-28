const form = document.querySelector(".form");
const searchInput = document.querySelector(".search-area");

const locationName = document.querySelector(".location-date h3");
const currentDate = document.querySelector(".location-date p");
const currentTemp = document.querySelector(".temp");
const currentIcon = document.querySelector(".current-weather-icon");

const feelsLike = document.querySelector(".feels-like p");
const humidity = document.querySelector(".humidity p");
const wind = document.querySelector(".wind p");
const precipitation = document.querySelector(".precipitation p");

const dates = document.querySelectorAll(".currentDay");
const maxTemps = document.querySelectorAll(".max-temp");
const minTemps = document.querySelectorAll(".min-temp");
const icons = document.querySelectorAll(".day-icon");

const hourTime = document.querySelectorAll(".hour-time");
const hourTemp = document.querySelectorAll(".hour-temp");
const hourIcon = document.querySelectorAll(".hour-icon");
const hourIconImg = document.querySelectorAll(".hour-icon img");

// Unit switching
let isMetric = true;
let weatherData = null;
const switchToImperialBtn = document.querySelector('[data-unit="imperial"]');

async function fetchWeatherData(currentCity) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${currentCity}&days=3&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const currentDay = data.current;

    locationName.textContent = `${data.location.name}, ${data.location.country}`;
    currentTemp.textContent = `${Math.round(currentDay.temp_c)}°`;
    currentIcon.src = `https:${currentDay.condition.icon}`;
    currentIcon.alt = currentDay.condition.text;
    feelsLike.textContent = `${Math.round(currentDay.feelslike_c)}°`;
    humidity.textContent = `${Math.round(currentDay.humidity)}%`;
    wind.textContent = `${Math.round(currentDay.wind_kph)} km/h`;
    precipitation.textContent = `${currentDay.precip_mm} mm`;

    const dateObj = new Date(currentDay.last_updated);
    const formattedDate = dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    currentDate.textContent = formattedDate;

    const days = data.forecast.forecastday;
    for (let i = 0; i < days.length; i++) {
      const day = days[i];

      const dayName = new Date(days[i].date).toLocaleDateString("en-US", {
        weekday: "short",
      });

      dates[i].textContent = dayName;
      maxTemps[i].textContent = `${Math.round(day.day.maxtemp_c)}°`;
      minTemps[i].textContent = `${Math.round(day.day.mintemp_c)}°`;
      icons[i].src = `https:${day.day.condition.icon}`;
      icons[i].alt = day.day.condition.text;
    }

    const hours = data.forecast.forecastday[0].hour;
    const currentHour = new Date().getHours();

    for (let i = 0; i < 8; i++) {
      if (currentHour + i >= hours.length) {
        hourIconImg[i].src = "";
        hourTemp[i].textContent = "--";
        hourTime[i].textContent = "--";
        continue;
      }

      const hourData = hours[currentHour + i];

      const timeObj = new Date(hourData.time);
      hourTime[i].textContent = timeObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true,
      });

      hourTemp[i].textContent = `${Math.round(hourData.temp_c)}°`;
      hourIconImg[i].src = `https:${hourData.condition.icon}`;
      hourIcon[i].style.width = `35%`;
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    alert("City not found. Try again!");
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const currentCity = searchInput.value.trim();

  if (currentCity) await fetchWeatherData(currentCity);
  else console.error(`Error: ${currentCity} is missing!`);
});

window.addEventListener("DOMContentLoaded", () => {
  fetchWeatherData("Lagos");
});
