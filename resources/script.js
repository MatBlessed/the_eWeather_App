const API_KEY = '0887f9782c044255b5c180307232709';
const disp = document.getElementById('weatherDisplay');
let temperatureCelsius;
let temperatureFahrenheit;

function getWeather() {
    const location = document.getElementById('locationInput').value;

    // Check if Text Box is Empty
    if (location === '') {
        disp.innerHTML = "<div class='error'><h2>Location field is empty. Please enter a location.</h2></div>";
    } else {
        fetchWeather(location);
    }
}

function fetchWeather(location) {
    const url = 'https://api.weatherapi.com/v1/current.json?key=' + API_KEY + '&q=' + location + '&aqi=no';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })

        .then(data => {
            // Extract weather data
            const locationName = data.location.name;
            const timeZone = data.location.tz_id;
            const country = data.location.country;
            temperatureCelsius = data.current.temp_c;
            temperatureFahrenheit = data.current.temp_f;
            const weatherCondition = data.current.condition.text;
            const windSpeed = data.current.wind_kph;
            const windDirection = data.current.wind_dir;
            const humidity = data.current.humidity;
            const cloudCover = data.current.cloud;
            const weatherIconUrl = `https:${data.current.condition.icon}`;
            const localDateTime = data.location.localtime;

            // Display weather data
            displayWeatherInfo(locationName, country, weatherCondition, cloudCover, localDateTime, timeZone, temperatureCelsius, temperatureFahrenheit, windDirection, windSpeed, humidity, weatherIconUrl);

        })
        .catch(error => {
            if (error.message.includes('disabled')) {
                displayErrorMessage('Error: Technical issue. Please try again.');
            } else {
                displayErrorMessage('Location not found.<br>Please input a valid location.');
            }
            console.error(error);
        });
}

function fetchWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, handleGeolocationError);
    } else {
        displayErrorMessage("Geolocation is not supported by this browser!");
    }
}

function handleGeolocationError(error) {
    console.error("Error getting geolocation:", error);
    displayErrorMessage("Error getting geolocation. Please try again.");
}

function showPosition(position) {
    const location = position.coords.latitude + ',' + position.coords.longitude;
    fetchWeather(location);
}

function displayWeatherInfo(locationName, country, weatherCondition, cloudCover, localDateTime, timeZone, temperatureCelsius, temperatureFahrenheit, windDirection, windSpeed, humidity, weatherIconUrl) {
    disp.innerHTML = `
        <div class="main_div">
            <div class="div_start">
                <h2>${locationName}, </h2><h3>${country}</h3>
            </div>
            <div class="div_parts">
                <div class="div_part1">
                    <img src="${weatherIconUrl}" alt="Weather icon">
                    <p class="condition">${weatherCondition}</p>
                </div>
                <div class="div_part2">
                    <div id=celFah>
                        <p id='temp'>${temperatureCelsius}&deg;C</p>
                    </div>
                    <button onclick="changeTemp()">Toggle (&deg;C/&deg;F)</button>
                </div>
                <div class="div_part3">
                    <p><img src="../images/time-zone.png"> Time Zone: ${timeZone}</p>
                    <p><img src="../images/clouds.png"> Cloud cover: ${cloudCover}%</p>
                    <p><img src="../images/humidity.png"> Humidity: ${humidity}%</p>
                    <p><img src="../images/speed.png"> Wind Speed: ${windSpeed}kph</p>
                    <p><img src="../images/compass.png"> Wind Direction: ${windDirection}</p>
                </div>
                <div class="small_div">
                    <p>*Local Date and Time: </p>
                    <p>${localDateTime}</p>
                </div>
            </div>    
        </div>
    `;
}

function displayErrorMessage(message) {
    disp.innerHTML = "<div class='error'><h2>" + message + "</h2></div>";
}

let isCelsius = true; // Store the current temperature unit state

function changeTemp() {
    const convert = document.getElementById('celFah');
    
    if (isCelsius) {
        // Display in Fahrenheit if currently in Celsius
        convert.innerHTML = `<p id='isFahrenheit'>${temperatureFahrenheit}&deg;F</p>`;
        isCelsius = false; // Toggle the temperature unit state
    } else {
        // Display in Celsius if currently in Fahrenheit
        convert.innerHTML = `<p id='isCelsius'>${temperatureCelsius}&deg;C</p>`;
        isCelsius = true; // Toggle the temperature unit state
    }
}