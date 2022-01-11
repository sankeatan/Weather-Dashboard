
var geocodeUrl ='';
var weatherUrl ='';
var lat = 0;
var long = 0;
var cityName = $("#city-name");
var temperature = $('#current-temp');
var windSpeed = $('#current-wind');
var humidity = $('#current-humidity');
var uvIndex = $('#current-uvIndex');
var forecastEl = $('#forecast');
var cityInput = $("#citySearch")
var geocodeData = [];
var weatherData = [];
var apiKey='4c94f4694462733770c73418781b71f1';

$( document ).ready(function() {
  if(localStorage.getItem('city')==null){
  }
});

function getAPI (e) {
  e.preventDefault();
  var searchCity = cityInput.val();
  geocodeUrl = 'https://api.openweathermap.org/geo/1.0/direct?q='+searchCity+'&limit=1&appid='+apiKey;
  fetch(geocodeUrl, {
      method: 'GET', //GET is the default.
      credentials: 'same-origin', // include, *same-origin, omit
      redirect: 'follow', // manual, *follow, error
  })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        geocodeData = data[0];
        lat = geocodeData.lat;
        long = geocodeData.lon;
        cityName.text(geocodeData.name+' ' + moment().format("MMM Do h:mm a"));
      });
  
      weatherUrl = 'https://api.openweathermap.org/data/2.5/onecall?lat='+lat+'&lon='+long+'&units=imperial&appid='+apiKey;
  fetch(weatherUrl, {
        method: 'GET', //GET is the default.
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        weatherData = data;
       })
      .then(setCurrentWeatherStats);
        
}

function setCurrentWeatherStats(){
  temperature.text("Temp: " +weatherData.current.temp+"*F");
  windSpeed.text("Wind: "+ weatherData.current.wind_speed+" MPH");
  humidity.text("Humidity: "+ weatherData.current.humidity+"%");
  uvIndex.text("UV Index: "+ weatherData.current.uvi);
}

function generateFutureForecast(){
  for (var i=0; i<5; i++){ 
    console.log(i);
    var card = $('<div>').addClass('card');
    var cardBody = $('<div>').addClass('card-body');
    var forecastDay = $('<h3>').addClass('card-title').text('test');
    var temp = $('<p>').text('Temp: ');
    var wind = $('<p>').text('Wind: ');
    var humidity = $('<p>').attr('id', 'forecast-humidity').text('Humidity: ');
    cardBody.append(forecastDay, temp, wind, humidity);
    card.append(cardBody);
    forecastEl.append(card);
  }
}

function saveRecentSearchData (city) { 
  city = localStorage.setItem('city', cityName.val());
}

generateFutureForecast();
$('#searchBtn').on('click', getAPI);