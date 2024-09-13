const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");


const API_KEY = "3b51867a66a388ce6132bbac7ec4d8a2";

const creatWeatherCard = (cityName, weatherItem, index) => {
    if(index === 0){
        return `<div class="details">
                    <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                    <h4> Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                    <h4>Wind: ${weatherItem.wind.speed} M/s</h4>
                    <h4>Humidity: ${weatherItem.main.humidity}% </h4>

                </div>
                <div class="icon">
                    <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="">
                    <h4>${weatherItem.weather[0].description}</h4>
                </div>`;
    } else {
        return `<li class="card">
        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="">
        <h4> Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4>Wind: ${weatherItem.wind.speed} M/s</h4>
        <h4>Humidity: ${weatherItem.main.humidity}% </h4>
               </li>`;
    }
   
}

const getWeatherdetails = (cityName, lat, lon) => {
    const WEATHER_API_URL=`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(WEATHER_API_URL).then(res => res.json()).then(data => {

            const uniqueForecastDays = [];
            const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";

        console.log(fiveDaysForecast);
        fiveDaysForecast.forEach((weatherItem, index) =>{
            if(index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend",  creatWeatherCard(cityName, weatherItem, index));

            } else {
                 weatherCardsDiv.insertAdjacentHTML("beforeend",  creatWeatherCard(cityName, weatherItem, index));

            }

        });
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    }); 
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;

    const GEOCODING_API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data =>{
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const{ name, lat, lon }= data[0];
        getWeatherdetails(name, lat, lon );
    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });
}

const getUserCoordinates = () => {
   navigator.geolocation.getCurrentPosition(
    position => {
        const { latitude, longitude } = position.coords;
        const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;

        fetch(REVERSE_GEOCODING_URL).then(res => res.json()).then(data =>{
            const{ name }= data[0];
            getWeatherdetails(name, latitude, longitude );
        }).catch(() => {
            alert("An error occurred while fetching the city!");
        });
    },
    error => {
        if( error.code === errpr.PERMISSION_DENIED) {
            alert("Location permition is required. ");
        }
    }
 );
}

locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());