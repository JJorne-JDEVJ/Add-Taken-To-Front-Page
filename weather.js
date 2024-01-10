// Replace 'YOUR_API_KEY' with your actual OpenWeather API key
const apiKey = '2b6f9b6dbe5064dd770f29d4b229a22c';

async function getWeatherByCity(city) {
  try {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Error fetching data:', error);
  }
}
// ... (previous code remains unchanged)

async function updateWeatherDiv(weatherData) {
  if (!weatherData) {
    return;
  }
  const rightContainer = document.getElementById('rightcontainer');

  if (!rightContainer) {
    return;
  }

  rightContainer.innerHTML = '';
  weatherdiv = document.createElement("div");
  console.log(weatherData);
  const { name, main, weather, rain, wind } = weatherData; // Include rain data
  const temperature = Math.round(main.temp);
  const feelslike = Math.round(main.feels_like);
  const description = weather[0].description;
  const humidity = main.humidity;
  let windSpeed = Number(wind.speed);
  const mainWeather = weather[0].main;
  windSpeedkmh = Math.round(windSpeed * 3.6); // Convert to km/h

  let lastupdate_date = new Date(window.localStorage.getItem("lastupdate"));
  const currentdate = new Date();
  let difference = Math.abs(lastupdate_date - currentdate) / 1000 / 60

  difference = Math.round(difference)
  // Update the content of the div with unique classes
  try {
    weatherdiv.innerHTML = `<div class="weatherdiv">
            <h2 class="weather-location"></h2>

            <h2 class="weather-main"></h2>
            <div class="weather">
              <img src="https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/chanceflurries.svg" class="weather-icon">
            </div>
            <p class="weather-temperature"></p>
            <p class="weather-feelslike"></p>
            <div class="weather-humwind">
            <div class="col"> <img src='https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/humidity.png'><div>
            <p class="weather-humidity"></p>
            <p class="weather-humidity"></p>
            <p class="weather-humidity">Humidity</p></div>
            </div>
            <div class="weather-humwind">
            <div class="col"> <img src='https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/wind.png'><div>
            <p class="weather-wind"></p>
            <p class="weather-wind"></p>
            <p class="weather-wind">Wind Speed</p></div>
            </div>
            </div>

            </div>
            <p class="weather-lastupdate"></p>
            </div>
        `;
    weatherdiv.querySelector(".weather-location").innerText = name;

    weatherdiv.querySelector(".weather-main").innerText = mainWeather;
    weatherdiv.querySelector(".weather-temperature").innerText = temperature + "°C";
    weatherdiv.querySelector(".weather-feelslike").innerText = "Feels like " + feelslike + "°C";
    weatherdiv.querySelector(".weather-humidity").innerText = humidity + "%";
    weatherdiv.querySelector(".weather-wind").innerText = windSpeedkmh + "km/h";
    if (difference==0){
      weatherdiv.querySelector(".weather-lastupdate").innerText = "Now";
    }else{
      weatherdiv.querySelector(".weather-lastupdate").innerText = difference + " min ago";
    }
    const weatherIcon = weatherdiv.querySelector('.weather-icon');
    set_snow_multiplier(mainWeather == "Snow");

    if (description == "broken clouds") {
      weatherIcon.src = 'https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/mostlycloudy.svg'
    }
    else if (description == "few clouds" || description == "scattered clouds") {
      weatherIcon.src = 'https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/mostlysunny.svg'
    }
    else if (description == "overcast clouds") {
      weatherIcon.src = 'https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/cloudy.svg'
    }
    else if (mainWeather == "Clouds") {
      weatherIcon.src = 'https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/cloudy.svg'
    }
    else if (mainWeather == "Clear") {
      weatherIcon.src = 'https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/clear.svg'
    }
    else if (mainWeather == "Rain") {
      weatherIcon.src = 'https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/rain.svg'
    }
    else if (mainWeather == "Drizzle") {
      weatherIcon.src = 'https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/chancerain.svg'
    }
    else if (mainWeather == "Mist" || mainWeather == "Fog" || mainWeather == "Squall" || mainWeather == "Smoke" || mainWeather == "Haze") {
      weatherIcon.src = 'https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/fog.svg'
    }
    else if (mainWeather == "Snow") {
      weatherIcon.src = 'https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/snow.svg'
    }
    else if (mainWeather == "Thunderstorm") {
      weatherIcon.src = 'https://raw.githubusercontent.com/frickingbird8002/smpp-images/main/tstorms.svg'
    }
  }
  catch (e) {
    console.log(e);
  }
  rightContainer.appendChild(weatherdiv);
  console.log('Weather information updated.');
}

async function loadOldData() {
  console.log("Loading old data from localstorage")
  //FIXME: when undefined is in local storage this like errors
  let weatherData = JSON.parse(window.localStorage.getItem("weatherdata"));
  updateWeatherDiv(weatherData);
}


async function set_weather_loc(loc) {
  const currentdate = new Date();


  if (!document.getElementById('rightcontainer')) {
    console.log("Not on home page, no weather needed")
    return;
  }
  else if (loc==""){
    document.getElementById('rightcontainer').innerHTML = "";
    console.log("No location provided, no weather needed")
    return;
  }
  console.log('Fetching weather information for location: ' + loc);
  if (window.localStorage.getItem("lastupdate")==undefined){
    window.localStorage.setItem("lastupdate", currentdate)
    window.localStorage.setItem("lastlocation", loc)
  }

let lastupdate_date = new Date(window.localStorage.getItem("lastupdate"));

let difference = Math.abs(lastupdate_date - currentdate) / 1000; // Difference in seconds

if (difference>600 || loc != (window.localStorage.getItem("lastlocation")) || !(window.localStorage.getItem("weatherdata"))){
  window.localStorage.setItem("lastupdate", currentdate)
  window.localStorage.setItem("lastlocation", loc)
  let weatherData = await getWeatherByCity(loc);
  if (weatherData == undefined) {
    return;
  }

  console.log('Weather data:', weatherData);
  updateWeatherDiv(weatherData);
  console.log("storing new weather data")
  window.localStorage.setItem("weatherdata", JSON.stringify(weatherData))
}else(
  loadOldData()
)
console.log("seconds since last update: ",difference)
}
